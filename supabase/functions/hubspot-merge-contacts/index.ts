// Merge a duplicate group on HubSpot (and mark it merged in Supabase).
// Body: { group_id: uuid, master_contact_id: uuid }
//
// HubSpot merge endpoint: POST /crm/v3/objects/contacts/merge
//   { primaryObjectId, objectIdToMerge }
//
// We loop: keep master, merge each other contact into it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/hubspot";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const HUBSPOT_API_KEY = Deno.env.get("HUBSPOT_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!HUBSPOT_API_KEY) {
      return new Response(
        JSON.stringify({ error: "HubSpot non connecté." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const body = await req.json().catch(() => ({}));
    const groupId = body.group_id as string | undefined;
    const masterContactId = body.master_contact_id as string | undefined;

    if (!groupId || !masterContactId) {
      return new Response(
        JSON.stringify({ error: "group_id and master_contact_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch group + contacts (RLS scopes to current user).
    const { data: group, error: gErr } = await supabase
      .from("duplicate_groups")
      .select("id, user_id, confidence, reason")
      .eq("id", groupId)
      .single();
    if (gErr || !group) throw new Error("Group not found");
    if (group.user_id !== userId) throw new Error("Forbidden");

    const { data: links, error: lErr } = await supabase
      .from("duplicate_group_contacts")
      .select("contact_id, crm_contacts!inner(id, external_id, provider)")
      .eq("group_id", groupId);
    if (lErr) throw new Error(lErr.message);

    const all = (links ?? []).map((l: any) => l.crm_contacts) as Array<{
      id: string;
      external_id: string;
      provider: string;
    }>;
    const master = all.find((c) => c.id === masterContactId);
    if (!master) throw new Error("Master contact not in group");
    const others = all.filter((c) => c.id !== masterContactId && c.provider === "hubspot");

    let merged = 0;
    const errors: string[] = [];

    for (const other of others) {
      const res = await fetch(`${GATEWAY_URL}/crm/v3/objects/contacts/merge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": HUBSPOT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primaryObjectId: master.external_id,
          objectIdToMerge: other.external_id,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        errors.push(`merge ${other.external_id} → ${master.external_id} [${res.status}]: ${t}`);
        continue;
      }
      // Remove the merged contact from local table.
      await supabase.from("crm_contacts").delete().eq("id", other.id);
      merged++;
    }

    await supabase
      .from("duplicate_groups")
      .update({
        status: merged === others.length ? "merged" : "pending",
        master_contact_id: masterContactId,
        resolved_at: merged === others.length ? new Date().toISOString() : null,
      })
      .eq("id", groupId);

    await supabase.from("activity_log").insert({
      user_id: userId,
      type: "merge",
      description: `Fusion HubSpot : ${merged}/${others.length} contacts (confiance ${group.confidence}%)`,
      contacts_affected: merged,
      status: errors.length ? "error" : "success",
      metadata: { group_id: groupId, errors },
    });

    return new Response(
      JSON.stringify({ success: true, merged, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("hubspot-merge-contacts error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
