// Kléa API — REST gateway for external CRM integration
// Uses Supabase REST API directly (no SDK import needed)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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

async function dbGet(table: string, query: string): Promise<{ data: unknown[]; count: number }> {
  const res = await fetch(`${supaUrl(table)}?${query}`, {
    headers: { ...supaHeaders(), 'Prefer': 'count=exact' },
  })
  const countHeader = res.headers.get('content-range')
  const count = countHeader ? parseInt(countHeader.split('/')[1] ?? '0') : 0
  const data = await res.json()
  return { data: Array.isArray(data) ? data : [], count }
}

async function dbPost(table: string, body: unknown): Promise<unknown[]> {
  const res = await fetch(supaUrl(table), {
    method: 'POST',
    headers: { ...supaHeaders(), 'Prefer': 'return=representation,resolution=merge-duplicates' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return Array.isArray(data) ? data : [data]
}

async function dbPatch(table: string, query: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${supaUrl(table)}?${query}`, {
    method: 'PATCH',
    headers: supaHeaders(),
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}

async function dbDelete(table: string, query: string): Promise<void> {
  await fetch(`${supaUrl(table)}?${query}`, { method: 'DELETE', headers: supaHeaders() })
}

// ── API key auth ──────────────────────────────────────────────────────────────

async function hashKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function authenticate(req: Request): Promise<{ userId: string } | null> {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer klea_')) return null

  const hash = await hashKey(auth.replace('Bearer ', ''))
  const { data } = await dbGet('api_keys', `key_hash=eq.${hash}&is_active=eq.true&select=user_id`)

  if (!data.length) return null

  await dbPatch('api_keys', `key_hash=eq.${hash}`, { last_used_at: new Date().toISOString() })

  return { userId: (data[0] as { user_id: string }).user_id }
}

// ── Router ────────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/klea-api\/?/, '')
  const seg = path.split('/').filter(Boolean)
  const p = url.searchParams

  // Public
  if (req.method === 'GET' && seg.length === 0) {
    return json({
      api: 'Kléa API', version: '1.0.0',
      authentication: 'Authorization: Bearer klea_<clé>',
      endpoints: {
        'GET  /health':                  'Statut',
        'POST /contacts':                'Importer des contacts',
        'GET  /contacts':                'Lister les contacts',
        'GET  /contacts/:id':            'Obtenir un contact',
        'PATCH /contacts/:id':           'Mettre à jour un contact',
        'DELETE /contacts/:id':          'Supprimer un contact',
        'POST /analyze':                 'Détecter les doublons + scorer',
        'GET  /duplicates':              'Lister les doublons',
        'POST /duplicates/:id/merge':    'Fusionner un groupe',
        'PATCH /duplicates/:id':         'Ignorer un groupe',
        'GET  /quality':                 'Score santé CRM',
      },
    })
  }

  if (req.method === 'GET' && seg[0] === 'health') {
    return json({ status: 'ok', api: 'Kléa API', version: '1.0.0', ts: new Date().toISOString() })
  }

  // Auth required
  const session = await authenticate(req)
  if (!session) return err(401, 'Clé API invalide. Utilisez : Authorization: Bearer klea_...')
  const uid = session.userId

  // ── POST /contacts ──────────────────────────────────────────────────────────
  if (req.method === 'POST' && seg[0] === 'contacts' && !seg[1]) {
    const body = await req.json().catch(() => null)
    if (!body?.contacts || !Array.isArray(body.contacts)) {
      return err(400, 'Corps invalide. Attendu : { contacts: [...] }')
    }
    const provider = body.provider ?? 'api'
    const allowed = ['external_id','email','first_name','last_name','company','position','phone','sector','linkedin_url','company_size']
    const records = body.contacts.map((c: Record<string, unknown>) => {
      const r: Record<string, unknown> = { user_id: uid, provider }
      for (const f of allowed) if (c[f] !== undefined) r[f] = c[f]
      return r
    })
    const data = await dbPost('crm_contacts', records)
    return json({ imported: data.length, contacts: data }, 201)
  }

  // ── GET /contacts ───────────────────────────────────────────────────────────
  if (req.method === 'GET' && seg[0] === 'contacts' && !seg[1]) {
    const limit = Math.min(parseInt(p.get('limit') ?? '50'), 200)
    const offset = parseInt(p.get('offset') ?? '0')
    const search = p.get('search')
    const provider = p.get('provider')

    let q = `user_id=eq.${uid}&order=created_at.desc&limit=${limit}&offset=${offset}`
    if (provider) q += `&provider=eq.${provider}`
    if (search) q += `&or=(email.ilike.*${search}*,first_name.ilike.*${search}*,last_name.ilike.*${search}*,company.ilike.*${search}*)`

    const { data, count } = await dbGet('crm_contacts', q)
    return json({ contacts: data, total: count, limit, offset })
  }

  // ── GET /contacts/:id ───────────────────────────────────────────────────────
  if (req.method === 'GET' && seg[0] === 'contacts' && seg[1]) {
    const { data } = await dbGet('crm_contacts', `id=eq.${seg[1]}&user_id=eq.${uid}`)
    if (!data.length) return err(404, 'Contact introuvable')
    return json(data[0])
  }

  // ── PATCH /contacts/:id ─────────────────────────────────────────────────────
  if (req.method === 'PATCH' && seg[0] === 'contacts' && seg[1]) {
    const body = await req.json().catch(() => null)
    if (!body?.properties) return err(400, 'Corps invalide. Attendu : { properties: {...} }')
    const allowed = ['email','first_name','last_name','company','position','phone','sector','linkedin_url','company_size']
    const updates: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(body.properties)) {
      if (allowed.includes(k)) updates[k] = v
    }
    if (!Object.keys(updates).length) return err(400, `Champs autorisés : ${allowed.join(', ')}`)
    const data = await dbPatch('crm_contacts', `id=eq.${seg[1]}&user_id=eq.${uid}`, updates)
    if (!data) return err(404, 'Contact introuvable')
    return json(data)
  }

  // ── DELETE /contacts/:id ────────────────────────────────────────────────────
  if (req.method === 'DELETE' && seg[0] === 'contacts' && seg[1]) {
    await dbDelete('crm_contacts', `id=eq.${seg[1]}&user_id=eq.${uid}`)
    return json({ deleted: true, id: seg[1] })
  }

  // ── POST /analyze ───────────────────────────────────────────────────────────
  if (req.method === 'POST' && seg[0] === 'analyze') {
    const { data: contacts } = await dbGet('crm_contacts', `user_id=eq.${uid}&select=id,email,phone,first_name,last_name,company&limit=5000`)
    if (!contacts.length) return json({ groups_detected: 0, message: 'Aucun contact à analyser' })

    type C = { id: string; email?: string; phone?: string; first_name?: string; last_name?: string; company?: string }
    const norm = (s?: string) => (s ?? '').toLowerCase().trim()
    const digits = (s?: string) => (s ?? '').replace(/\D/g, '').slice(-9)
    const buckets: Record<string, { ids: string[]; confidence: number; reason: string }> = {}

    for (const c of contacts as C[]) {
      const email = norm(c.email)
      if (email) {
        const k = `email:${email}`
        if (!buckets[k]) buckets[k] = { ids: [], confidence: 100, reason: 'email_identique' }
        buckets[k].ids.push(c.id)
      }
      const phone = digits(c.phone)
      if (phone.length >= 9) {
        const k = `phone:${phone}`
        if (!buckets[k]) buckets[k] = { ids: [], confidence: 92, reason: 'telephone_identique' }
        buckets[k].ids.push(c.id)
      }
      const last = norm(c.last_name), company = norm(c.company)
      if (last && company) {
        const k = `name:${last}|${company}`
        if (!buckets[k]) buckets[k] = { ids: [], confidence: 78, reason: 'nom_entreprise_identiques' }
        buckets[k].ids.push(c.id)
      }
    }

    let groupsCreated = 0
    for (const b of Object.values(buckets)) {
      if (b.ids.length < 2) continue
      const [group] = await dbPost('duplicate_groups', {
        user_id: uid, confidence: b.confidence, reason: b.reason, status: 'pending'
      }) as [{ id: string }]
      if (!group?.id) continue
      await dbPost('duplicate_group_contacts', b.ids.map(cid => ({ group_id: group.id, contact_id: cid })))
      groupsCreated++
    }
    await dbPost('activity_log', { user_id: uid, type: 'scan', description: `Analyse API : ${groupsCreated} groupes détectés`, contacts_affected: contacts.length, status: 'completed' })
    return json({ groups_detected: groupsCreated, contacts_analyzed: contacts.length })
  }

  // ── GET /duplicates ─────────────────────────────────────────────────────────
  if (req.method === 'GET' && seg[0] === 'duplicates' && !seg[1]) {
    const status = p.get('status') ?? 'pending'
    const limit = Math.min(parseInt(p.get('limit') ?? '50'), 200)
    const offset = parseInt(p.get('offset') ?? '0')
    const q = `user_id=eq.${uid}&status=eq.${status}&order=detected_at.desc&limit=${limit}&offset=${offset}&select=id,confidence,reason,status,detected_at,resolved_at,master_contact_id,duplicate_group_contacts(contact_id,crm_contacts(id,email,first_name,last_name,company))`
    const { data, count } = await dbGet('duplicate_groups', q)
    return json({ groups: data, total: count, limit, offset })
  }

  // ── PATCH /duplicates/:id ───────────────────────────────────────────────────
  if (req.method === 'PATCH' && seg[0] === 'duplicates' && seg[1] && !seg[2]) {
    const body = await req.json().catch(() => null)
    const updates: Record<string, unknown> = {}
    if (body?.status) updates.status = body.status
    if (body?.master_contact_id) updates.master_contact_id = body.master_contact_id
    if (updates.status === 'dismissed') updates.resolved_at = new Date().toISOString()
    const data = await dbPatch('duplicate_groups', `id=eq.${seg[1]}&user_id=eq.${uid}`, updates)
    if (!data) return err(404, 'Groupe introuvable')
    return json(data)
  }

  // ── POST /duplicates/:id/merge ──────────────────────────────────────────────
  if (req.method === 'POST' && seg[0] === 'duplicates' && seg[2] === 'merge') {
    const body = await req.json().catch(() => null)
    if (!body?.master_contact_id) return err(400, 'Champ requis : master_contact_id')

    const { data: groups } = await dbGet('duplicate_groups', `id=eq.${seg[1]}&user_id=eq.${uid}`)
    if (!groups.length) return err(404, 'Groupe introuvable')
    const group = groups[0] as { status: string }
    if (group.status !== 'pending') return err(409, `Groupe déjà "${group.status}"`)

    const { data: links } = await dbGet('duplicate_group_contacts', `group_id=eq.${seg[1]}&select=contact_id`)
    const toDelete = (links as { contact_id: string }[]).map(l => l.contact_id).filter(id => id !== body.master_contact_id)
    if (toDelete.length) await dbDelete('crm_contacts', `id=in.(${toDelete.join(',')})&user_id=eq.${uid}`)

    await dbPatch('duplicate_groups', `id=eq.${seg[1]}&user_id=eq.${uid}`, {
      status: 'merged', master_contact_id: body.master_contact_id, resolved_at: new Date().toISOString()
    })
    await dbPost('activity_log', { user_id: uid, type: 'merge', description: `Fusion API : ${toDelete.length} contact(s) supprimé(s)`, contacts_affected: toDelete.length + 1, status: 'completed' })
    return json({ merged: true, master_contact_id: body.master_contact_id, deleted_contacts: toDelete.length })
  }

  // ── GET /quality ────────────────────────────────────────────────────────────
  if (req.method === 'GET' && seg[0] === 'quality') {
    const [total, withEmail, withPhone, duplicates, inactive] = await Promise.all([
      dbGet('crm_contacts', `user_id=eq.${uid}&select=id`),
      dbGet('crm_contacts', `user_id=eq.${uid}&email=not.is.null&select=id`),
      dbGet('crm_contacts', `user_id=eq.${uid}&phone=not.is.null&select=id`),
      dbGet('duplicate_groups', `user_id=eq.${uid}&status=eq.pending&select=id`),
      dbGet('crm_contacts', `user_id=eq.${uid}&is_inactive=eq.true&select=id`),
    ])
    const t = total.count, e = withEmail.count, ph = withPhone.count
    const emailRate = t > 0 ? Math.round(e / t * 100) : 0
    const phoneRate = t > 0 ? Math.round(ph / t * 100) : 0
    const dupPenalty = Math.min(duplicates.count / Math.max(t, 1) * 100, 100)
    const score = Math.round(emailRate * 0.4 + phoneRate * 0.2 + (100 - dupPenalty) * 0.4)
    return json({ score, total_contacts: t, with_email: e, email_rate: emailRate, with_phone: ph, phone_rate: phoneRate, pending_duplicates: duplicates.count, inactive_contacts: inactive.count })
  }

  return err(404, `Endpoint introuvable : ${req.method} /${seg.join('/')}`)
})
