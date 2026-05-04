// Sync HubSpot contacts into Supabase via Lovable connector gateway.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/hubspot";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const HUBSPOT_PROPS = [
  "email",
  "firstname",
  "lastname",
  "company",
  "jobtitle",
  "phone",
  "industry",
  "lastmodifieddate",
  "hs_linkedin_url",
  "num_employees",
];

interface HubSpotContact {
  id: string;
  properties: Record<string, string | null>;
}

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
        JSON.stringify({
          error:
            "HubSpot non connecté. Connecte HubSpot dans Paramètres > Intégrations.",
        }),
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

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    // Paginate through HubSpot contacts (cap at 1000 per call).
    let after: string | undefined;
    let totalSynced = 0;
    const maxPages = 10;

    for (let page = 0; page < maxPages; page++) {
      const params = new URLSearchParams({
        limit: "100",
        properties: HUBSPOT_PROPS.join(","),
      });
      if (after) params.set("after", after);

      const res = await fetch(
        `${GATEWAY_URL}/crm/v3/objects/contacts?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": HUBSPOT_API_KEY,
          },
        },
      );

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HubSpot list failed [${res.status}]: ${body}`);
      }

      const json = await res.json() as {
        results: HubSpotContact[];
        paging?: { next?: { after: string } };
      };

      const rows = json.results.map((c) => ({
        user_id: userId,
        provider: "hubspot",
        external_id: c.id,
        email: c.properties.email,
        first_name: c.properties.firstname,
        last_name: c.properties.lastname,
        company: c.properties.company,
        position: c.properties.jobtitle,
        phone: c.properties.phone,
        sector: c.properties.industry,
        company_size: c.properties.num_employees,
        linkedin_url: c.properties.hs_linkedin_url,
        last_activity_at: c.properties.lastmodifieddate ?? null,
        raw: c.properties,
      }));

      if (rows.length > 0) {
        const { error: upsertErr } = await supabase
          .from("crm_contacts")
          .upsert(rows, { onConflict: "user_id,provider,external_id" });
        if (upsertErr) throw new Error(`Upsert failed: ${upsertErr.message}`);
        totalSynced += rows.length;
      }

      after = json.paging?.next?.after;
      if (!after) break;
    }

    await supabase.from("activity_log").insert({
      user_id: userId,
      type: "scan",
      description: `Sync HubSpot terminée — ${totalSynced} contacts`,
      contacts_affected: totalSynced,
    });

    await supabase
      .from("crm_connections")
      .upsert(
        {
          user_id: userId,
          provider: "hubspot",
          status: "connected",
          last_sync_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider" },
      );

    return new Response(
      JSON.stringify({ success: true, synced: totalSynced }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("hubspot-sync-contacts error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
