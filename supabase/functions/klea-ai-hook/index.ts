// klea-ai-hook — generates a personalized French outreach hook using Claude Haiku
// POST { contact: { name, position?, company? }, type: 'hot_lead' | 'ghosting' | 'hvt', context?: { daysSilent?: string } }
// Returns { hook: string }

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

function buildPrompt(
  type: 'hot_lead' | 'ghosting' | 'hvt',
  name: string,
  position: string,
  company: string,
  daysSilent: string,
): string {
  const who = [name, position && `(${position})`, company && `@ ${company}`].filter(Boolean).join(' ')

  switch (type) {
    case 'hot_lead':
      return `Tu es un commercial B2B expert. Rédige UN message d'accroche percutant (1 phrase, 15-25 mots) en français pour relancer ${who}. Ce contact est très actif en ce moment. Sois direct, crée de la curiosité. Output : uniquement le message, sans guillemets.`
    case 'ghosting':
      return `Tu es un commercial B2B expert. Rédige UN message de relance court (1 phrase, 15-25 mots) en français pour recontacter ${who}, silencieux depuis ${daysSilent} jours. Montre que tu comprends son contexte, crée de l'urgence sans pression. Output : uniquement le message, sans guillemets.`
    case 'hvt':
      return `Tu es un commercial B2B expert. Rédige UN message de réactivation (1 phrase, 15-25 mots) en français pour ${who}, inactif depuis plusieurs mois. Mets en avant la valeur de Kléa (gain de temps CRM, nettoyage automatique). Output : uniquement le message, sans guillemets.`
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const authHeader = req.headers.get('Authorization') ?? ''
  const user = await getUser(authHeader)
  if (!user) return json({ error: 'Non authentifié' }, 401)

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return json({ error: 'Clé API Anthropic non configurée — ajoutez ANTHROPIC_API_KEY dans les secrets Supabase.' }, 500)

  const body = await req.json().catch(() => null) as {
    contact: { name: string; position?: string; company?: string }
    type: 'hot_lead' | 'ghosting' | 'hvt'
    context?: { daysSilent?: string }
  } | null

  if (!body?.contact?.name || !body.type) {
    return json({ error: 'Corps invalide. Attendu : { contact: { name }, type: "hot_lead"|"ghosting"|"hvt" }' }, 400)
  }

  const { name, position = '', company = '' } = body.contact
  const daysSilent = body.context?.daysSilent ?? '21'
  const prompt = buildPrompt(body.type, name, position, company, daysSilent)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    return json({ error: `Anthropic API [${response.status}]: ${errText}` }, 500)
  }

  const data = await response.json() as { content?: Array<{ type: string; text: string }> }
  const hook = data.content?.find(b => b.type === 'text')?.text?.trim() ?? 'Pas de suggestion disponible.'

  return json({ hook })
})
