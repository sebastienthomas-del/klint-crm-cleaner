export const demoStats = {
  totalContacts: 12847,
  initialScore: 47,
  finalScore: 89,
  duplicatesMerged: 312,
  contactsEnriched: 1840,
  pipelineUnlocked: 48000,
};

export const duplicateGroups = [
  {
    id: 'd1',
    matchType: 'Email exact',
    confidence: 100,
    contacts: [
      { name: 'Marie Dubois', email: 'marie.dubois@acme.com', company: 'Acme Corp', source: 'Import CSV — Janv. 2024' },
      { name: 'M. Dubois', email: 'marie.dubois@acme.com', company: 'Acme', source: 'HubSpot Form — Mars 2024' },
    ],
  },
  {
    id: 'd2',
    matchType: 'Téléphone',
    confidence: 92,
    contacts: [
      { name: 'Thomas Martin', email: 't.martin@nova.fr', company: 'Nova SAS', source: 'Sales Nav' },
      { name: 'Tom Martin', email: 'tom@nova.fr', company: 'Nova', source: 'Webinar' },
    ],
  },
  {
    id: 'd3',
    matchType: 'Nom + Société',
    confidence: 78,
    contacts: [
      { name: 'Léa Bernard', email: 'lea.b@kepler.io', company: 'Kepler', source: 'LinkedIn Ads' },
      { name: 'Léa Bernard', email: 'l.bernard@kepler.io', company: 'Kepler Tech', source: 'Demo request' },
    ],
  },
];

export const enrichmentTarget = {
  name: 'Julien Rousseau',
  email: 'j.rousseau@horizon-tech.com',
  company: 'Horizon Tech',
  before: {
    'Poste': null,
    'LinkedIn': null,
    'Téléphone': null,
    'Secteur': null,
    'Taille équipe': null,
    'Pays': 'France',
    'Source': 'Inbound',
  },
  after: {
    'Poste': 'VP Sales',
    'LinkedIn': 'linkedin.com/in/jrousseau',
    'Téléphone': '+33 6 12 34 56 78',
    'Secteur': 'SaaS B2B',
    'Taille équipe': '51-200',
    'Pays': 'France',
    'Source': 'Inbound',
  },
};

export const auditFindings = [
  { label: 'Contacts sans secteur', value: 4231, severity: 'warning' as const },
  { label: 'Doublons détectés', value: 312, severity: 'error' as const },
  { label: 'Emails invalides', value: 187, severity: 'error' as const },
  { label: 'Leads dormants > 6 mois', value: 2104, severity: 'warning' as const },
];
