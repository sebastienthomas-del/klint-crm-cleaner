// Patch a HubSpot contact with new property values.
// Body: { contact_id: uuid, properties: Record<string, string> }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/hubspot";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_PROPS = new Set([
  "email",
  "firstname",
  "lastname",
  "company",
  "jobtitle",
  "phone",
  "industry",
  "hs_linkedin_url",
  "num_employees",
]);

const LOCAL_FIELD_MAP: Record<string, string> = {
  email: "email",
  firstname: "first_name",
  lastname: "last_name",
  company: "company",
  jobtitle: "position",
  phone: "phone",
  industry: "sector",
  hs_linkedin_url: "linkedin_url",
  num_employees: "company_size",
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

    const { data: claims } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (!claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const contactId = body.contact_id as string | undefined;
    const properties = body.properties as Record<string, string> | undefined;

    if (!contactId || !properties || typeof properties !== "object") {
      return new Response(
        JSON.stringify({ error: "contact_id and properties required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const filtered: Record<string, string> = {};
    for (const [k, v] of Object.entries(properties)) {
      if (ALLOWED_PROPS.has(k) && typeof v === "string" && v.length > 0 && v.length < 500) {
        filtered[k] = v;
      }
    }
    if (Object.keys(filtered).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid properties to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: contact, error: cErr } = await supabase
      .from("crm_contacts")
      .select("id, user_id, external_id, provider")
      .eq("id", contactId)
      .single();
    if (cErr || !contact) throw new Error("Contact not found");
    if (contact.user_id !== userId) throw new Error("Forbidden");
    if (contact.provider !== "hubspot") throw new Error("Contact is not from HubSpot");

    const res = await fetch(
      `${GATEWAY_URL}/crm/v3/objects/contacts/${contact.external_id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": HUBSPOT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties: filtered }),
      },
    );

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`HubSpot patch failed [${res.status}]: ${t}`);
    }

    // Mirror update locally.
    const localUpdate: Record<string, string> = {};
    for (const [hsKey, val] of Object.entries(filtered)) {
      const localKey = LOCAL_FIELD_MAP[hsKey];
      if (localKey) localUpdate[localKey] = val;
    }
    if (Object.keys(localUpdate).length > 0) {
      await supabase.from("crm_contacts").update(localUpdate).eq("id", contactId);
    }

    await supabase.from("activity_log").insert({
      user_id: userId,
      type: "enrich",
      description: `Contact enrichi sur HubSpot (${Object.keys(filtered).join(", ")})`,
      contacts_affected: 1,
      metadata: { contact_id: contactId, properties: filtered },
    });

    return new Response(
      JSON.stringify({ success: true, updated: filtered }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("hubspot-enrich-contact error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
