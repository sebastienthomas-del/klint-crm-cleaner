// stripe-webhook — handles Stripe subscription lifecycle events
// No static imports (Cloudflare WAF strips the `import` keyword)
// Verifies HMAC-SHA256 Stripe signature without stripe-node SDK

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

const err = (status: number, message: string) => json({ error: message }, status)

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

async function dbGet(table: string, query: string): Promise<unknown[]> {
  const res = await fetch(`${supaUrl(table)}?${query}`, { headers: supaHeaders() })
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

async function dbUpsert(table: string, body: unknown, conflictCol: string): Promise<void> {
  await fetch(`${supaUrl(table)}?on_conflict=${conflictCol}`, {
    method: 'POST',
    headers: { ...supaHeaders(), 'Prefer': 'return=minimal,resolution=merge-duplicates' },
    body: JSON.stringify(body),
  })
}

async function dbPatch(table: string, query: string, body: unknown): Promise<void> {
  await fetch(`${supaUrl(table)}?${query}`, {
    method: 'PATCH',
    headers: { ...supaHeaders(), 'Prefer': 'return=minimal' },
    body: JSON.stringify(body),
  })
}

// ── Stripe signature verification ─────────────────────────────────────────────

async function verifyStripeSignature(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts = sigHeader.split(',').reduce((acc: Record<string, string>, p) => {
    const [k, v] = p.split('=')
    acc[k] = v
    return acc
  }, {})

  const timestamp = parts['t']
  const signatures = sigHeader.split(',').filter(p => p.startsWith('v1=')).map(p => p.replace('v1=', ''))

  if (!timestamp || !signatures.length) return false

  const signed = `${timestamp}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed))
  const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')

  return signatures.some(s => s === computed)
}

// ── Subscription update logic ─────────────────────────────────────────────────

async function upsertSubscription(sub: Record<string, unknown>): Promise<void> {
  const metadata = (sub.metadata ?? {}) as Record<string, string>

  // Always look up by stripe_customer_id (guaranteed unique, always present)
  const existing = await dbGet('subscriptions', `stripe_customer_id=eq.${sub.customer}&select=user_id`)
  if (existing.length) {
    const row = existing[0] as { user_id: string }
    await dbPatch('subscriptions', `stripe_customer_id=eq.${sub.customer}`, {
      stripe_subscription_id: sub.id,
      plan: metadata.plan ?? 'starter',
      billing_cycle: metadata.billing_cycle ?? 'monthly',
      status: mapStatus(sub.status as string),
      current_period_end: sub.current_period_end
        ? new Date((sub.current_period_end as number) * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      updated_at: new Date().toISOString(),
    })
    return
  }

  // No existing row — insert fresh (new customer created outside of our flow)
  const userId = metadata.supabase_user_id
  if (!userId) return
  await dbUpsert('subscriptions', {
    user_id: userId,
    stripe_customer_id: sub.customer,
    stripe_subscription_id: sub.id,
    plan: metadata.plan ?? 'starter',
    billing_cycle: metadata.billing_cycle ?? 'monthly',
    status: mapStatus(sub.status as string),
    current_period_end: sub.current_period_end
      ? new Date((sub.current_period_end as number) * 1000).toISOString()
      : null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    updated_at: new Date().toISOString(),
  }, 'stripe_customer_id')
}

function buildSubRow(sub: Record<string, unknown>, userId: string, metadata: Record<string, string>) {
  const item = ((sub.items as Record<string, unknown>)?.data as unknown[])?.[0] as Record<string, unknown> | undefined
  const periodEnd = sub.current_period_end
    ? new Date((sub.current_period_end as number) * 1000).toISOString()
    : null

  return {
    user_id: userId,
    stripe_customer_id: sub.customer,
    stripe_subscription_id: sub.id,
    plan: metadata.plan ?? 'starter',
    billing_cycle: metadata.billing_cycle ?? 'monthly',
    status: mapStatus(sub.status as string),
    current_period_end: periodEnd,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    updated_at: new Date().toISOString(),
  }
}

function mapStatus(stripeStatus: string): string {
  const map: Record<string, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'cancelled',
    cancelled: 'cancelled',
    unpaid: 'past_due',
    incomplete: 'inactive',
    incomplete_expired: 'inactive',
    paused: 'inactive',
  }
  return map[stripeStatus] ?? 'inactive'
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return err(405, 'Méthode non autorisée')

  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  if (!secret) return err(500, 'STRIPE_WEBHOOK_SECRET non configuré')

  const sigHeader = req.headers.get('stripe-signature') ?? ''
  const payload = await req.text()

  const valid = await verifyStripeSignature(payload, sigHeader, secret)
  if (!valid) return err(400, 'Signature invalide')

  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    event = JSON.parse(payload)
  } catch {
    return err(400, 'Payload JSON invalide')
  }

  const obj = event.data.object

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await upsertSubscription(obj)
      break

    case 'checkout.session.completed': {
      // Session completed — subscription object is under subscription field (string ID)
      // The subscription.created event will fire separately and handle the upsert
      break
    }

    default:
      break
  }

  return json({ received: true })
})
