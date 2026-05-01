// Detect duplicates in crm_contacts and create duplicate_groups.
// Rules:
//  - identical normalized email => 100
//  - identical phone (last 9 digits) => 92
//  - same lastname + same company (case-insensitive) => 78
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Contact {
  id: string;
  email: string | null;
  phone: string | null;
  last_name: string | null;
  company: string | null;
}

const norm = (s: string | null) => (s ?? "").trim().toLowerCase();
const phoneKey = (p: string | null) =>
  (p ?? "").replace(/\D/g, "").slice(-9);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;

    const { data: contacts, error: cErr } = await supabase
      .from("crm_contacts")
      .select("id, email, phone, last_name, company")
      .eq("user_id", userId)
      .limit(5000);

    if (cErr) throw new Error(cErr.message);
    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, groups: 0, message: "Aucun contact à analyser" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    type Bucket = { key: string; reason: string; confidence: number; ids: string[] };
    const buckets = new Map<string, Bucket>();

    const add = (key: string, reason: string, confidence: number, id: string) => {
      const existing = buckets.get(key);
      if (existing) {
        if (!existing.ids.includes(id)) existing.ids.push(id);
      } else {
        buckets.set(key, { key, reason, confidence, ids: [id] });
      }
    };

    for (const c of contacts as Contact[]) {
      const e = norm(c.email);
      if (e) add(`email:${e}`, "Email identique", 100, c.id);

      const p = phoneKey(c.phone);
      if (p && p.length >= 9) add(`phone:${p}`, "Téléphone identique", 92, c.id);

      const ln = norm(c.last_name);
      const co = norm(c.company);
      if (ln && co) add(`name_co:${ln}|${co}`, "Nom + entreprise similaires", 78, c.id);
    }

    let createdGroups = 0;

    for (const b of buckets.values()) {
      if (b.ids.length < 2) continue;

      const { data: group, error: gErr } = await supabase
        .from("duplicate_groups")
        .insert({
          user_id: userId,
          confidence: b.confidence,
          reason: b.reason,
          status: "pending",
          metadata: { key: b.key },
        })
        .select("id")
        .single();

      if (gErr || !group) {
        console.error("group insert failed:", gErr?.message);
        continue;
      }

      const links = b.ids.map((cid) => ({ group_id: group.id, contact_id: cid }));
      const { error: linkErr } = await supabase
        .from("duplicate_group_contacts")
        .insert(links);
      if (linkErr) {
        console.error("link insert failed:", linkErr.message);
        continue;
      }
      createdGroups++;
    }

    await supabase.from("activity_log").insert({
      user_id: userId,
      type: "scan",
      description: `Détection doublons : ${createdGroups} groupes créés`,
      contacts_affected: createdGroups,
    });

    return new Response(
      JSON.stringify({ success: true, groups: createdGroups }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("hubspot-detect-duplicates error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
