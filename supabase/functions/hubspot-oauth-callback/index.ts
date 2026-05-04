// hubspot-oauth-callback — exchanges HubSpot auth code for tokens, stores in DB
// No static imports (Cloudflare WAF strips the `import` keyword)

// ── Supabase REST helpers ─────────────────────────────────────────────────────

function supaHeaders() {
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

async function dbUpsert(table: string, body: unknown, conflictCol: string): Promise<void> {
  await fetch(`${supaUrl(table)}?on_conflict=${conflictCol}`, {
    method: 'POST',
    headers: { ...supaHeaders(), 'Prefer': 'return=minimal,resolution=merge-duplicates' },
    body: JSON.stringify(body),
  })
}

// ── State verification ────────────────────────────────────────────────────────

async function verifyAndExtractUserId(state: string): Promise<string | null> {
  try {
    const decoded = atob(state)
    const parts = decoded.split(':')
    if (parts.length < 3) return null

    const sig = parts.pop()!
    const payload = parts.join(':')

    const secret = Deno.env.get('OAUTH_STATE_SECRET') ?? Deno.env.get('SUPABASE_JWT_SECRET') ?? 'fallback'
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
    const computed = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

    if (computed !== sig) return null

    const [userId, tsStr] = payload.split(':')
    const ts = parseInt(tsStr)
    if (Date.now() - ts > 10 * 60 * 1000) return null // 10-minute expiry

    return userId
  } catch {
    return null
  }
}

// ── HubSpot token exchange ────────────────────────────────────────────────────

async function exchangeCode(code: string): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> {
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/hubspot-oauth-callback`

  const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: Deno.env.get('HUBSPOT_CLIENT_ID')!,
      client_secret: Deno.env.get('HUBSPOT_CLIENT_SECRET')!,
      redirect_uri: redirectUri,
      code,
    }).toString(),
  })

  if (!res.ok) return null
  return res.json()
}

async function getHubSpotPortalId(accessToken: string): Promise<string | null> {
  const res = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + accessToken, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  })
  if (!res.ok) return null
  const data = await res.json() as { hub_id?: number }
  return data.hub_id ? String(data.hub_id) : null
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const appUrl = Deno.env.get('APP_URL') ?? 'https://klea.app'
  const errorRedirect = (msg: string) =>
    Response.redirect(`${appUrl}/app/settings?error=${encodeURIComponent(msg)}`, 302)

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const errorParam = url.searchParams.get('error')

  if (errorParam) return errorRedirect(errorParam)
  if (!code || !state) return errorRedirect('Paramètres manquants')

  const userId = await verifyAndExtractUserId(state)
  if (!userId) return errorRedirect('État invalide ou expiré')

  const tokens = await exchangeCode(code)
  if (!tokens) return errorRedirect('Échange de code échoué')

  const portalId = await getHubSpotPortalId(tokens.access_token)

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  await dbUpsert('crm_connections', {
    user_id: userId,
    provider: 'hubspot',
    status: 'connected',
    connected_at: new Date().toISOString(),
    metadata: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      portal_id: portalId,
    },
  }, 'user_id,provider')

  // Trigger initial sync in background (fire-and-forget)
  fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/hubspot-sync-contacts`, {
    method: 'POST',
    headers: {
      'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  }).catch(() => {})

  return Response.redirect(`${appUrl}/app/settings?connected=hubspot`, 302)
})
