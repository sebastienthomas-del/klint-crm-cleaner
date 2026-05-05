// hubspot-sync-contacts — syncs HubSpot contacts using stored OAuth token
// No static imports (Cloudflare WAF)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

function supabaseClient(authHeader: string) {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_ANON_KEY')!
  return { url, key, authHeader }
}

async function supaFetch(client: ReturnType<typeof supabaseClient>, path: string, opts: RequestInit = {}) {
  const res = await fetch(`${client.url}/rest/v1/${path}`, {
    ...opts,
    headers: {
      'apikey': client.key,
      'Authorization': client.authHeader,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(opts.headers ?? {}),
    },
  })
  return res
}

async function getUser(authHeader: string): Promise<{ id: string } | null> {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_ANON_KEY')!
  const res = await fetch(`${url}/auth/v1/user`, {
    headers: { 'apikey': key, 'Authorization': authHeader },
  })
  if (!res.ok) return null
  const u = await res.json() as { id?: string }
  return u.id ? { id: u.id } : null
}

async function getAccessToken(client: ReturnType<typeof supabaseClient>, userId: string): Promise<string | null> {
  const res = await supaFetch(client, `crm_connections?user_id=eq.${userId}&provider=eq.hubspot&select=metadata&limit=1`)
  const data = await res.json() as Array<{ metadata: { access_token?: string } }>
  return data?.[0]?.metadata?.access_token ?? null
}

const HUBSPOT_PROPS = ['email', 'firstname', 'lastname', 'company', 'jobtitle', 'phone', 'industry', 'lastmodifieddate', 'hs_linkedin_url', 'num_employees']

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization') ?? ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Support both user JWT and service role (for background trigger)
  let userId: string | null = null
  let clientAuth = authHeader

  const body = await req.json().catch(() => ({})) as { user_id?: string }

  if (body.user_id && (authHeader === `Bearer ${serviceKey}` || req.headers.get('apikey') === serviceKey)) {
    userId = body.user_id
    clientAuth = `Bearer ${serviceKey}`
  } else {
    const user = await getUser(authHeader)
    userId = user?.id ?? null
  }

  if (!userId) return json({ error: 'Non authentifié' }, 401)

  const client = supabaseClient(clientAuth)
  const accessToken = await getAccessToken(client, userId)
  if (!accessToken) return json({ error: 'HubSpot non connecté. Allez dans Paramètres > Connexions.' }, 400)

  let after: string | undefined
  let totalSynced = 0

  for (let page = 0; page < 10; page++) {
    const params = new URLSearchParams({ limit: '100', properties: HUBSPOT_PROPS.join(',') })
    if (after) params.set('after', after)

    const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts?${params}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const body = await res.text()
      return json({ error: `HubSpot API erreur [${res.status}]: ${body}` }, 500)
    }

    const data = await res.json() as {
      results: Array<{ id: string; properties: Record<string, string | null> }>
      paging?: { next?: { after: string } }
    }

    const rows = data.results.map((c) => ({
      user_id: userId,
      provider: 'hubspot',
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
    }))

    if (rows.length > 0) {
      const upsertRes = await supaFetch(client,
        `crm_contacts?on_conflict=user_id,provider,external_id`,
        {
          method: 'POST',
          headers: { 'Prefer': 'return=minimal,resolution=merge-duplicates' },
          body: JSON.stringify(rows),
        }
      )
      if (!upsertRes.ok) {
        const err = await upsertRes.text()
        return json({ error: `Upsert failed: ${err}` }, 500)
      }
      totalSynced += rows.length
    }

    after = data.paging?.next?.after
    if (!after) break
  }

  // Update last_sync_at
  await supaFetch(client, `crm_connections?user_id=eq.${userId}&provider=eq.hubspot`, {
    method: 'PATCH',
    headers: { 'Prefer': 'return=minimal' },
    body: JSON.stringify({ last_sync_at: new Date().toISOString() }),
  })

  // Log activity
  await supaFetch(client, 'activity_log', {
    method: 'POST',
    headers: { 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      user_id: userId,
      type: 'scan',
      description: `Sync HubSpot terminée — ${totalSynced} contacts`,
      contacts_affected: totalSynced,
    }),
  })

  return json({ success: true, synced: totalSynced })
})
