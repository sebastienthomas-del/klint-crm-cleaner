export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contactId } = req.query;

  if (!contactId) {
    return res.status(400).json({ error: 'contactId manquant' });
  }

  const apiKey = process.env.KLEA_API_KEY;
  const apiUrl = process.env.KLEA_API_URL;

  if (!apiKey || !apiUrl) {
    return res.status(500).json({ error: 'Variables KLEA_API_KEY / KLEA_API_URL non configurées' });
  }

  try {
    const url = `${apiUrl}/hubspot/contact/${encodeURIComponent(String(contactId))}`;
    const upstream = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: `Erreur réseau : ${e.message}` });
  }
}
