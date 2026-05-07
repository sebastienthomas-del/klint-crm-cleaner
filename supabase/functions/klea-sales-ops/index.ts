// klea-sales-ops — computes Sales Ops intelligence from crm_contacts
// Returns: hotLeads, ghosting, hvt (High Value Targets)
// Champions and Closed Lost require deal sync — empty for now.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

// ICP criteria
const ICP_POSITIONS = ['ceo', 'cto', 'cro', 'vp', 'head of', 'chief', 'director', 'directeur', 'responsable', 'co-founder', 'fondateur', 'president']
const ICP_SECTORS = ['tech', 'saas', 'fintech', 'e-commerce', 'software', 'logiciel', 'digital', 'ia', 'ai', 'data', 'cloud']

type Contact = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  position: string | null
  phone: string | null
  sector: string | null
  company_size: string | null
  last_activity_at: string | null
}

function computeICPScore(c: Contact): { score: number; fit: 'perfect' | 'good' | 'partial' | 'low' } {
  const pos = (c.position ?? '').toLowerCase()
  const sec = (c.sector ?? '').toLowerCase()
  const sizeRaw = c.company_size ?? ''
  const sizeNum = parseInt(sizeRaw.replace(/[^0-9]/g, '')) || 0

  const posMatch = ICP_POSITIONS.some(p => pos.includes(p))
  const secMatch = ICP_SECTORS.some(s => sec.includes(s))
  const sizeMatch = sizeNum >= 50
    || sizeRaw.includes('200') || sizeRaw.includes('500') || sizeRaw.includes('+')
    || sizeRaw.includes('201') || sizeRaw.includes('1000')

  let score = 0
  if (posMatch) score += 40
  if (secMatch) score += 30
  if (sizeMatch) score += 30

  const matchCount = [posMatch, secMatch, sizeMatch].filter(Boolean).length
  const fit: 'perfect' | 'good' | 'partial' | 'low' =
    matchCount === 3 ? 'perfect' :
    matchCount === 2 ? 'good' :
    matchCount === 1 ? 'partial' : 'low'

  return { score, fit }
}

function estimateARR(companySize: string | null): number {
  if (!companySize) return 12000
  const n = parseInt(companySize.replace(/[^0-9]/g, '')) || 0
  if (n >= 1000 || companySize.includes('1000')) return 96000
  if (n >= 500 || companySize.includes('500')) return 48000
  if (n >= 200 || companySize.includes('200')) return 24000
  if (n >= 50) return 12000
  return 6000
}

function buildWhyHVT(c: Contact): string {
  const parts: string[] = []
  const pos = (c.position ?? '').toLowerCase()
  if (ICP_POSITIONS.some(p => pos.includes(p))) parts.push(`poste décisionnaire (${c.position})`)
  if (c.sector && ICP_SECTORS.some(s => (c.sector ?? '').toLowerCase().includes(s))) parts.push(`secteur cible (${c.sector})`)
  if (c.company_size) parts.push(`taille entreprise (${c.company_size})`)
  return parts.length > 0 ? parts.join(', ') : 'Profil correspondant aux critères ICP'
}

function daysAgo(date: string | null): number {
  if (!date) return 9999
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
}

function contactName(c: Contact): string {
  return [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email || 'Contact'
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization') ?? ''
  const user = await getUser(authHeader)
  if (!user) return json({ error: 'Non authentifié' }, 401)

  const supaUrl = Deno.env.get('SUPABASE_URL')!
  const supaKey = Deno.env.get('SUPABASE_ANON_KEY')!

  const res = await fetch(
    `${supaUrl}/rest/v1/crm_contacts?user_id=eq.${user.id}&select=id,first_name,last_name,email,company,position,phone,sector,company_size,last_activity_at&limit=3000`,
    { headers: { 'apikey': supaKey, 'Authorization': authHeader } }
  )

  if (!res.ok) return json({ error: 'Erreur lecture contacts' }, 500)
  const contacts = await res.json() as Contact[]
  if (!Array.isArray(contacts)) return json({ error: 'Données invalides' }, 500)

  const hotLeads: unknown[] = []
  const ghosting: unknown[] = []
  const hvt: unknown[] = []

  for (const c of contacts) {
    const days = daysAgo(c.last_activity_at)
    const { score, fit } = computeICPScore(c)
    const name = contactName(c)

    // Freshness bonus (0–40 pts)
    const freshness = days <= 7 ? 40 : days <= 14 ? 30 : days <= 30 ? 20 : days <= 60 ? 10 : 0
    const intentScore = Math.min(100, score + freshness)

    if (days <= 30 && intentScore >= 50) {
      // Hot lead: recently active + decent ICP
      hotLeads.push({
        id: c.id,
        firstName: c.first_name ?? '',
        lastName: c.last_name ?? '',
        email: c.email ?? '',
        company: c.company ?? '',
        position: c.position ?? '',
        intentScore,
        icpFit: fit,
        signals: [],
        suggestedAction: c.email ? 'email' : 'linkedin',
        suggestedHook: `Bonjour ${c.first_name ?? name}, vous semblez actif en ce moment — seriez-vous disponible pour un échange rapide ?`,
        status: 'active',
      })
    } else if (days >= 15 && days <= 90) {
      // Ghosting: went silent 15–90 days ago
      ghosting.push({
        id: `ghost-${c.id}`,
        contactId: c.id,
        contactName: name,
        company: c.company ?? '',
        position: c.position ?? '',
        email: c.email ?? '',
        dealName: name,
        amount: 0,
        lastActivity: c.last_activity_at ?? '',
        daysSilent: days,
        stage: 'Contact silencieux',
        suggestedBump: days >= 45 ? 'Dernier essai avant clôture' : days >= 30 ? 'Relance directe avec valeur ajoutée' : 'Suivi court et friendly',
        suggestedHook: `${c.first_name ?? 'Bonjour'}, cela fait ${days} jours sans nouvelles — avez-vous eu l'occasion d'avancer sur votre projet ?`,
      })
    } else if (days > 90 && (fit === 'perfect' || fit === 'good')) {
      // HVT: inactive 90+ days but strong ICP
      hvt.push({
        id: `hvt-${c.id}`,
        firstName: c.first_name ?? '',
        lastName: c.last_name ?? '',
        email: c.email ?? '',
        company: c.company ?? '',
        position: c.position ?? '',
        companySize: c.company_size ?? '',
        sector: c.sector ?? '',
        icpFit: fit,
        icpScore: score,
        inactiveSince: c.last_activity_at ?? new Date(Date.now() - days * 86_400_000).toISOString(),
        potentialARR: estimateARR(c.company_size),
        whyHVT: buildWhyHVT(c),
        suggestedHook: `${c.first_name ?? 'Bonjour'}, des équipes comme la vôtre gagnent 2h/semaine sur leur CRM grâce à Kléa — cela vous intéresse ?`,
      })
    }
  }

  // Sort by relevance
  ;(hotLeads as Array<{ intentScore: number }>).sort((a, b) => b.intentScore - a.intentScore)
  ;(ghosting as Array<{ daysSilent: number }>).sort((a, b) => b.daysSilent - a.daysSilent)
  ;(hvt as Array<{ icpScore: number }>).sort((a, b) => b.icpScore - a.icpScore)

  return json({
    hotLeads: hotLeads.slice(0, 20),
    ghosting: ghosting.slice(0, 20),
    hvt: hvt.slice(0, 20),
    championMoves: [],
    closedLostDeals: [],
    stats: {
      hotLeadsCount: hotLeads.length,
      ghostingDeals: ghosting.length,
      championsDetected: 0,
      closedLostWithTriggers: 0,
      highValueTargets: hvt.length,
      totalPipelineAtRisk: 0,
      avgIntentScore: hotLeads.length > 0
        ? Math.round((hotLeads as Array<{ intentScore: number }>).reduce((s, l) => s + l.intentScore, 0) / hotLeads.length)
        : 0,
    },
  })
})
