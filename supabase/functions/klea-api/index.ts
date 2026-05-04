import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })

const err = (status: number, message: string) =>
  json({ error: message }, status)

async function hashKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function authenticate(req: Request) {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer klea_')) return null

  const key = auth.replace('Bearer ', '')
  const hash = await hashKey(key)

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data } = await admin
    .from('api_keys')
    .select('user_id, permissions, is_active')
    .eq('key_hash', hash)
    .eq('is_active', true)
    .single()

  if (!data) return null

  await admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', hash)

  return { userId: data.user_id as string, permissions: data.permissions as string[] }
}

function adminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  const url = new URL(req.url)
  const rawPath = url.pathname.replace(/^\/klea-api\/?/, '')
  const segments = rawPath.split('/').filter(Boolean)
  const method = req.method

  // ─── Public endpoints ───────────────────────────────────────────────────────

  if (method === 'GET' && segments.length === 0) {
    return json({
      api: 'Kléa API',
      version: '1.0.0',
      description: 'Connectez votre CRM à Kléa pour détecter les doublons, enrichir et scorer vos contacts.',
      authentication: 'Authorization: Bearer klea_<votre_clé>',
      endpoints: {
        'GET  /health':                   'Statut de l\'API',
        'POST /contacts':                 'Importer des contacts (batch)',
        'GET  /contacts':                 'Lister les contacts (limit, offset, search, provider)',
        'GET  /contacts/:id':             'Obtenir un contact',
        'PATCH /contacts/:id':            'Mettre à jour un contact',
        'DELETE /contacts/:id':           'Supprimer un contact',
        'POST /analyze':                  'Lancer la détection de doublons + scoring',
        'GET  /duplicates':               'Lister les groupes de doublons (status=pending|merged|dismissed)',
        'PATCH /duplicates/:id':          'Ignorer / changer le statut d\'un groupe',
        'POST /duplicates/:id/merge':     'Fusionner un groupe (body: { master_contact_id })',
        'GET  /quality':                  'Résumé de la santé CRM',
      },
    })
  }

  if (method === 'GET' && segments[0] === 'health') {
    return json({ status: 'ok', api: 'Kléa API', version: '1.0.0', ts: new Date().toISOString() })
  }

  // ─── Auth required ───────────────────────────────────────────────────────────

  const session = await authenticate(req)
  if (!session) return err(401, 'Clé API invalide ou manquante. Utilisez : Authorization: Bearer klea_...')

  const db = adminClient()
  const userId = session.userId
  const params = url.searchParams

  // ─── POST /contacts ──────────────────────────────────────────────────────────
  // Body: { contacts: [{ external_id, email, first_name, last_name, company, ... }], provider?: string }

  if (method === 'POST' && segments[0] === 'contacts' && !segments[1]) {
    const body = await req.json().catch(() => null)
    if (!body?.contacts || !Array.isArray(body.contacts)) {
      return err(400, 'Corps invalide. Attendu : { contacts: [...] }')
    }

    const provider = body.provider ?? 'api'
    const allowed = ['external_id', 'email', 'first_name', 'last_name', 'company', 'position', 'phone', 'sector', 'linkedin_url', 'company_size']

    const records = body.contacts.map((c: Record<string, unknown>) => {
      const record: Record<string, unknown> = { user_id: userId, provider }
      for (const field of allowed) {
        if (c[field] !== undefined) record[field] = c[field]
      }
      return record
    })

    const { data, error: dbErr } = await db
      .from('crm_contacts')
      .upsert(records, { onConflict: 'user_id,provider,external_id', ignoreDuplicates: false })
      .select('id, email, first_name, last_name, company')

    if (dbErr) return err(500, dbErr.message)
    return json({ imported: data?.length ?? 0, contacts: data }, 201)
  }

  // ─── GET /contacts ───────────────────────────────────────────────────────────

  if (method === 'GET' && segments[0] === 'contacts' && !segments[1]) {
    const limit = Math.min(parseInt(params.get('limit') ?? '50'), 200)
    const offset = parseInt(params.get('offset') ?? '0')
    const search = params.get('search')
    const provider = params.get('provider')

    let query = db
      .from('crm_contacts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,company.ilike.%${search}%`
      )
    }
    if (provider) query = query.eq('provider', provider)

    const { data, error: dbErr, count } = await query
    if (dbErr) return err(500, dbErr.message)

    return json({ contacts: data, total: count, limit, offset })
  }

  // ─── GET /contacts/:id ───────────────────────────────────────────────────────

  if (method === 'GET' && segments[0] === 'contacts' && segments[1]) {
    const { data, error: dbErr } = await db
      .from('crm_contacts')
      .select('*')
      .eq('id', segments[1])
      .eq('user_id', userId)
      .single()

    if (dbErr || !data) return err(404, 'Contact introuvable')
    return json(data)
  }

  // ─── PATCH /contacts/:id ─────────────────────────────────────────────────────

  if (method === 'PATCH' && segments[0] === 'contacts' && segments[1]) {
    const body = await req.json().catch(() => null)
    if (!body?.properties) return err(400, 'Corps invalide. Attendu : { properties: { ... } }')

    const allowed = ['email', 'first_name', 'last_name', 'company', 'position', 'phone', 'sector', 'linkedin_url', 'company_size']
    const updates: Record<string, string> = {}
    for (const [k, v] of Object.entries(body.properties as Record<string, unknown>)) {
      if (allowed.includes(k)) updates[k] = v as string
    }

    if (Object.keys(updates).length === 0) {
      return err(400, `Aucun champ valide. Champs autorisés : ${allowed.join(', ')}`)
    }

    const { data, error: dbErr } = await db
      .from('crm_contacts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', segments[1])
      .eq('user_id', userId)
      .select()
      .single()

    if (dbErr || !data) return err(404, 'Contact introuvable ou mise à jour échouée')
    return json(data)
  }

  // ─── DELETE /contacts/:id ────────────────────────────────────────────────────

  if (method === 'DELETE' && segments[0] === 'contacts' && segments[1]) {
    const { error: dbErr } = await db
      .from('crm_contacts')
      .delete()
      .eq('id', segments[1])
      .eq('user_id', userId)

    if (dbErr) return err(500, dbErr.message)
    return json({ deleted: true, id: segments[1] })
  }

  // ─── POST /analyze ───────────────────────────────────────────────────────────
  // Détecte les doublons parmi les contacts de l'utilisateur

  if (method === 'POST' && segments[0] === 'analyze') {
    const { data: contacts, error: fetchErr } = await db
      .from('crm_contacts')
      .select('id, email, phone, first_name, last_name, company')
      .eq('user_id', userId)
      .limit(5000)

    if (fetchErr) return err(500, fetchErr.message)
    if (!contacts || contacts.length === 0) {
      return json({ groups_detected: 0, message: 'Aucun contact à analyser' })
    }

    type Contact = { id: string; email?: string; phone?: string; first_name?: string; last_name?: string; company?: string }
    const buckets: Record<string, { contacts: string[]; confidence: number; reason: string }> = {}

    const normalize = (s?: string) => (s ?? '').toLowerCase().trim()
    const phoneDigits = (p?: string) => (p ?? '').replace(/\D/g, '').slice(-9)

    for (const c of contacts as Contact[]) {
      const email = normalize(c.email)
      if (email) {
        const k = `email:${email}`
        if (!buckets[k]) buckets[k] = { contacts: [], confidence: 100, reason: 'email_identique' }
        buckets[k].contacts.push(c.id)
      }

      const phone = phoneDigits(c.phone)
      if (phone.length >= 9) {
        const k = `phone:${phone}`
        if (!buckets[k]) buckets[k] = { contacts: [], confidence: 92, reason: 'telephone_identique' }
        buckets[k].contacts.push(c.id)
      }

      const lastName = normalize(c.last_name)
      const company = normalize(c.company)
      if (lastName && company) {
        const k = `name:${lastName}|${company}`
        if (!buckets[k]) buckets[k] = { contacts: [], confidence: 78, reason: 'nom_entreprise_identiques' }
        buckets[k].contacts.push(c.id)
      }
    }

    let groupsCreated = 0
    for (const bucket of Object.values(buckets)) {
      if (bucket.contacts.length < 2) continue

      const { data: group, error: gErr } = await db
        .from('duplicate_groups')
        .insert({
          user_id: userId,
          confidence: bucket.confidence,
          reason: bucket.reason,
          status: 'pending',
        })
        .select('id')
        .single()

      if (gErr || !group) continue

      await db.from('duplicate_group_contacts').insert(
        bucket.contacts.map((cid) => ({ group_id: group.id, contact_id: cid }))
      )

      groupsCreated++
    }

    await db.from('activity_log').insert({
      user_id: userId,
      type: 'scan',
      description: `Analyse API : ${groupsCreated} groupes de doublons détectés`,
      contacts_affected: contacts.length,
      status: 'completed',
    })

    return json({ groups_detected: groupsCreated, contacts_analyzed: contacts.length })
  }

  // ─── GET /duplicates ─────────────────────────────────────────────────────────

  if (method === 'GET' && segments[0] === 'duplicates' && !segments[1]) {
    const status = params.get('status') ?? 'pending'
    const limit = Math.min(parseInt(params.get('limit') ?? '50'), 200)
    const offset = parseInt(params.get('offset') ?? '0')

    const { data, error: dbErr, count } = await db
      .from('duplicate_groups')
      .select(
        `id, confidence, reason, status, detected_at, resolved_at, master_contact_id,
         duplicate_group_contacts ( contact_id, crm_contacts ( id, email, first_name, last_name, company ) )`,
        { count: 'exact' }
      )
      .eq('user_id', userId)
      .eq('status', status)
      .order('detected_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (dbErr) return err(500, dbErr.message)
    return json({ groups: data, total: count, limit, offset })
  }

  // ─── PATCH /duplicates/:id ───────────────────────────────────────────────────

  if (method === 'PATCH' && segments[0] === 'duplicates' && segments[1] && !segments[2]) {
    const body = await req.json().catch(() => null)
    const allowed = ['status', 'master_contact_id']
    const updates: Record<string, unknown> = {}
    for (const field of allowed) {
      if (body?.[field] !== undefined) updates[field] = body[field]
    }
    if (updates.status === 'dismissed') updates.resolved_at = new Date().toISOString()

    const { data, error: dbErr } = await db
      .from('duplicate_groups')
      .update(updates)
      .eq('id', segments[1])
      .eq('user_id', userId)
      .select()
      .single()

    if (dbErr || !data) return err(404, 'Groupe introuvable')
    return json(data)
  }

  // ─── POST /duplicates/:id/merge ──────────────────────────────────────────────

  if (method === 'POST' && segments[0] === 'duplicates' && segments[2] === 'merge') {
    const body = await req.json().catch(() => null)
    if (!body?.master_contact_id) return err(400, 'Champ requis : master_contact_id')

    const groupId = segments[1]
    const masterId = body.master_contact_id

    const { data: group } = await db
      .from('duplicate_groups')
      .select('id, status')
      .eq('id', groupId)
      .eq('user_id', userId)
      .single()

    if (!group) return err(404, 'Groupe introuvable')
    if (group.status !== 'pending') return err(409, `Ce groupe est déjà "${group.status}"`)

    const { data: links } = await db
      .from('duplicate_group_contacts')
      .select('contact_id')
      .eq('group_id', groupId)

    const toDelete = (links ?? [])
      .map((l: { contact_id: string }) => l.contact_id)
      .filter((id: string) => id !== masterId)

    if (toDelete.length > 0) {
      await db.from('crm_contacts').delete().in('id', toDelete).eq('user_id', userId)
    }

    await db
      .from('duplicate_groups')
      .update({ status: 'merged', master_contact_id: masterId, resolved_at: new Date().toISOString() })
      .eq('id', groupId)
      .eq('user_id', userId)

    await db.from('activity_log').insert({
      user_id: userId,
      type: 'merge',
      description: `Fusion API : groupe ${groupId}, ${toDelete.length} contact(s) supprimé(s)`,
      contacts_affected: toDelete.length + 1,
      status: 'completed',
    })

    return json({ merged: true, master_contact_id: masterId, deleted_contacts: toDelete.length })
  }

  // ─── GET /quality ────────────────────────────────────────────────────────────

  if (method === 'GET' && segments[0] === 'quality') {
    const { count: total } = await db
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const { count: withEmail } = await db
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('email', 'is', null)

    const { count: withPhone } = await db
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('phone', 'is', null)

    const { count: duplicates } = await db
      .from('duplicate_groups')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending')

    const { count: inactive } = await db
      .from('crm_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_inactive', true)

    const t = total ?? 0
    const emailRate = t > 0 ? Math.round(((withEmail ?? 0) / t) * 100) : 0
    const phoneRate = t > 0 ? Math.round(((withPhone ?? 0) / t) * 100) : 0
    const score = Math.round(
      emailRate * 0.4 + phoneRate * 0.2 + (100 - Math.min((duplicates ?? 0) / Math.max(t, 1) * 100, 100)) * 0.4
    )

    return json({
      score,
      total_contacts: t,
      with_email: withEmail ?? 0,
      email_rate: emailRate,
      with_phone: withPhone ?? 0,
      phone_rate: phoneRate,
      pending_duplicates: duplicates ?? 0,
      inactive_contacts: inactive ?? 0,
    })
  }

  return err(404, `Endpoint introuvable : ${method} /${segments.join('/')}`)
})
