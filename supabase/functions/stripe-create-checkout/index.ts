// stripe-create-checkout — creates a Stripe Checkout Session
// No static imports (Cloudflare WAF strips the `import` keyword)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

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

async function dbUpsert(table: string, body: unknown): Promise<void> {
  await fetch(supaUrl(table), {
    method: 'POST',
    headers: { ...supaHeaders(), 'Prefer': 'return=minimal,resolution=merge-duplicates' },
    body: JSON.stringify(body),
  })
}

// ── Stripe helpers ────────────────────────────────────────────────────────────

function stripeHeaders() {
  return {
    'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
}

async function stripePost(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const body = new URLSearchParams(params).toString()
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: stripeHeaders(),
    body,
  })
  return res.json()
}

async function stripeGet(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, { headers: stripeHeaders() })
  return res.json()
}

// ── Price ID map ──────────────────────────────────────────────────────────────

function getPriceId(plan: string, cycle: string): string | null {
  const map: Record<string, string> = {
    'starter_monthly':       Deno.env.get('STRIPE_PRICE_STARTER_MONTHLY') ?? '',
    'starter_yearly':        Deno.env.get('STRIPE_PRICE_STARTER_YEARLY') ?? '',
    'professional_monthly':  Deno.env.get('STRIPE_PRICE_PRO_MONTHLY') ?? '',
    'professional_yearly':   Deno.env.get('STRIPE_PRICE_PRO_YEARLY') ?? '',
    'enterprise_monthly':    Deno.env.get('STRIPE_PRICE_ENTERPRISE_MONTHLY') ?? '',
    'enterprise_yearly':     Deno.env.get('STRIPE_PRICE_ENTERPRISE_YEARLY') ?? '',
  }
  return map[`${plan}_${cycle}`] || null
}

// ── Auth helper ───────────────────────────────────────────────────────────────

async function getUser(req: Request): Promise<{ id: string; email: string } | null> {
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
  const u = await res.json() as { id?: string; email?: string }
  if (!u.id) return null
  return { id: u.id, email: u.email ?? '' }
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST') return err(405, 'Méthode non autorisée')

  const user = await getUser(req)
  if (!user) return err(401, 'Non authentifié')

  const body = await req.json().catch(() => null)
  const plan = body?.plan ?? 'starter'
  const cycle = body?.billing_cycle ?? 'monthly'
  const successUrl = body?.success_url ?? `${Deno.env.get('APP_URL') ?? 'https://klea.app'}/app/dashboard?subscribed=true`
  const cancelUrl = body?.cancel_url ?? `${Deno.env.get('APP_URL') ?? 'https://klea.app'}/pricing`

  const priceId = getPriceId(plan, cycle)
  if (!priceId) return err(400, `Plan ou cycle invalide : ${plan}/${cycle}`)

  // Find or create Stripe customer
  const subs = await dbGet('subscriptions', `user_id=eq.${user.id}&select=stripe_customer_id`)
  let customerId = (subs[0] as { stripe_customer_id?: string } | undefined)?.stripe_customer_id ?? null

  if (!customerId) {
    const customer = await stripePost('customers', {
      email: user.email,
      'metadata[supabase_user_id]': user.id,
    })
    if (customer.error) {
      const e = customer.error as { message?: string }
      return err(500, `Stripe customer: ${e.message ?? JSON.stringify(customer.error)}`)
    }
    customerId = customer.id as string

    await dbUpsert('subscriptions', {
      user_id: user.id,
      stripe_customer_id: customerId,
      plan,
      billing_cycle: cycle,
      status: 'inactive',
    })
  }

  // Create Checkout Session
  const session = await stripePost('checkout/sessions', {
    customer: customerId,
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'subscription_data[metadata][supabase_user_id]': user.id,
    'subscription_data[metadata][plan]': plan,
    'subscription_data[metadata][billing_cycle]': cycle,
    allow_promotion_codes: 'true',
  })

  if (session.error) {
    const e = session.error as { message?: string }
    return err(500, `Erreur Stripe : ${e.message ?? 'inconnue'}`)
  }

  return json({ url: session.url })
})
