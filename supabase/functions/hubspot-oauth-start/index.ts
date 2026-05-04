// hubspot-oauth-start — generates a signed state and redirects to HubSpot OAuth
// No static imports (Cloudflare WAF strips the `import` keyword)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

const err = (status: number, message: string) => json({ error: message }, status)

// ── State signing (HMAC-SHA256) ───────────────────────────────────────────────

async function signState(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function buildState(userId: string): Promise<string> {
  const secret = Deno.env.get('OAUTH_STATE_SECRET') ?? Deno.env.get('SUPABASE_JWT_SECRET') ?? 'fallback'
  const payload = `${userId}:${Date.now()}`
  const sig = await signState(payload, secret)
  return btoa(`${payload}:${sig}`)
}

// ── Auth ──────────────────────────────────────────────────────────────────────

async function getUser(req: Request): Promise<{ id: string } | null> {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return null
  const token = auth.replace('Bearer ', '')

  const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
    headers: {
      'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!res.ok) return null
  const u = await res.json() as { id?: string }
  return u.id ? { id: u.id } : null
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  const user = await getUser(req)
  if (!user) return err(401, 'Non authentifié')

  const clientId = Deno.env.get('HUBSPOT_CLIENT_ID')
  if (!clientId) return err(500, 'HUBSPOT_CLIENT_ID non configuré')

  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/hubspot-oauth-callback`
  const scopes = 'crm.objects.contacts.read crm.objects.contacts.write'
  const state = await buildState(user.id)

  const authUrl = new URL('https://app.hubspot.com/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scopes)
  authUrl.searchParams.set('state', state)

  return json({ url: authUrl.toString() })
})
