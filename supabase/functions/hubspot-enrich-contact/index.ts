// hubspot-enrich-contact — pushes property updates to HubSpot + updates local DB
// No static imports (Cloudflare WAF)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

const ALLOWED_HS_PROPS = new Set([
  'email', 'firstname', 'lastname', 'company', 'jobtitle',
  'phone', 'industry', 'hs_linkedin_url', 'num_employees',
])

const HS_TO_LOCAL: Record<string, string> = {
  firstname: 'first_name',
  lastname: 'last_name',
  company: 'company',
  jobtitle: 'position',
  phone: 'phone',
  industry: 'sector',
  hs_linkedin_url: 'linkedin_url',
  num_employees: 'company_size',
  email: 'email',
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

function supaHeaders() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }
}

function supaUrl(path: string) {
  return `${Deno.env.get('SUPABASE_URL')}/rest/v1/${path}`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization') ?? ''
  const user = await getUser(authHeader)
  if (!user) return json({ error: 'Non authentifié' }, 401)

  const body = await req.json().catch(() => null) as { contact_id?: string; properties?: Record<string, string> } | null
  if (!body?.contact_id || !body?.properties) return json({ error: 'contact_id et properties requis' }, 400)

  // Filter to allowed HubSpot props only
  const hsProps: Record<string, string> = {}
  for (const [k, v] of Object.entries(body.properties)) {
    if (ALLOWED_HS_PROPS.has(k) && v?.trim()) hsProps[k] = v.trim()
  }
  if (!Object.keys(hsProps).length) return json({ error: 'Aucune propriété valide' }, 400)

  // Get HubSpot token + contact external_id
  const [connRes, contactRes] = await Promise.all([
    fetch(`${supaUrl('crm_connections')}?user_id=eq.${user.id}&provider=eq.hubspot&select=metadata&limit=1`, { headers: supaHeaders() }),
    fetch(`${supaUrl('crm_contacts')}?id=eq.${body.contact_id}&user_id=eq.${user.id}&select=external_id&limit=1`, { headers: supaHeaders() }),
  ])

  const conns = await connRes.json() as Array<{ metadata: { access_token?: string } }>
  const contacts = await contactRes.json() as Array<{ external_id: string }>

  const accessToken = conns?.[0]?.metadata?.access_token
  const externalId = contacts?.[0]?.external_id

  if (!accessToken) return json({ error: 'HubSpot non connecté' }, 400)
  if (!externalId) return json({ error: 'Contact introuvable' }, 404)

  // Push to HubSpot
  const hsRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${externalId}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: hsProps }),
  })

  if (!hsRes.ok) {
    const err = await hsRes.text()
    return json({ error: `HubSpot PATCH échoué: ${err}` }, 500)
  }

  // Update local crm_contacts
  const localUpdate: Record<string, string> = {}
  for (const [hs, val] of Object.entries(hsProps)) {
    const local = HS_TO_LOCAL[hs]
    if (local) localUpdate[local] = val
  }

  if (Object.keys(localUpdate).length) {
    await fetch(`${supaUrl('crm_contacts')}?id=eq.${body.contact_id}`, {
      method: 'PATCH',
      headers: { ...supaHeaders(), 'Prefer': 'return=minimal' },
      body: JSON.stringify(localUpdate),
    })
  }

  // Log
  await fetch(supaUrl('activity_log'), {
    method: 'POST',
    headers: { ...supaHeaders(), 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      user_id: user.id,
      type: 'enrich',
      description: `Contact enrichi : ${Object.keys(hsProps).join(', ')}`,
      contacts_affected: 1,
      metadata: { contact_id: body.contact_id, properties: hsProps },
    }),
  })

  return json({ success: true, updated: hsProps })
})
