// hubspot-merge-contacts — merges a duplicate group on HubSpot + marks merged in DB
// No static imports (Cloudflare WAF)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

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

function supaHeaders(auth: string) {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  }
}

function supaUrl(path: string) {
  return `${Deno.env.get('SUPABASE_URL')}/rest/v1/${path}`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization') ?? ''
  const user = await getUser(authHeader)
  if (!user) return json({ error: 'Non authentifié' }, 401)

  const body = await req.json().catch(() => null) as { group_id?: string; master_contact_id?: string } | null
  if (!body?.group_id || !body?.master_contact_id) return json({ error: 'group_id et master_contact_id requis' }, 400)

  // Get HubSpot token
  const connRes = await fetch(`${supaUrl('crm_connections')}?user_id=eq.${user.id}&provider=eq.hubspot&select=metadata&limit=1`, {
    headers: supaHeaders(authHeader),
  })
  const conns = await connRes.json() as Array<{ metadata: { access_token?: string } }>
  const accessToken = conns?.[0]?.metadata?.access_token
  if (!accessToken) return json({ error: 'HubSpot non connecté' }, 400)

  // Get all contacts in this group
  const grpRes = await fetch(
    `${supaUrl('duplicate_group_contacts')}?group_id=eq.${body.group_id}&select=contact_id,crm_contacts(id,external_id)`,
    { headers: supaHeaders(authHeader) }
  )
  const grpData = await grpRes.json() as Array<{ contact_id: string; crm_contacts: { id: string; external_id: string } }>
  if (!grpData?.length) return json({ error: 'Groupe introuvable' }, 404)

  const master = grpData.find((r) => r.contact_id === body.master_contact_id)
  if (!master) return json({ error: 'Contact principal introuvable dans le groupe' }, 404)

  const others = grpData.filter((r) => r.contact_id !== body.master_contact_id)

  let merged = 0
  const errors: string[] = []

  for (const other of others) {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/merge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        primaryObjectId: master.crm_contacts.external_id,
        objectIdToMerge: other.crm_contacts.external_id,
      }),
    })

    if (res.ok) {
      // Delete merged contact from DB
      await fetch(`${supaUrl('crm_contacts')}?id=eq.${other.contact_id}`, {
        method: 'DELETE',
        headers: supaHeaders(authHeader),
      })
      merged++
    } else {
      const err = await res.text()
      errors.push(`${other.crm_contacts.external_id}: ${err}`)
    }
  }

  // Mark group as merged
  await fetch(`${supaUrl('duplicate_groups')}?id=eq.${body.group_id}`, {
    method: 'PATCH',
    headers: { ...supaHeaders(authHeader), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ status: 'merged', master_contact_id: body.master_contact_id, resolved_at: new Date().toISOString() }),
  })

  // Log
  await fetch(supaUrl('activity_log'), {
    method: 'POST',
    headers: { ...supaHeaders(authHeader), 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      user_id: user.id,
      type: 'merge',
      description: `${merged} contact(s) fusionné(s) sur HubSpot`,
      contacts_affected: merged,
    }),
  })

  return json({ success: true, merged, errors })
})
