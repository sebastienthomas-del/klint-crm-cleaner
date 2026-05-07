export const demoStats = {
  totalContacts: 8_420,
  initialScore: 43,
  finalScore: 88,
  duplicatesMerged: 312,
  contactsEnriched: 1_124,
  pipelineUnlocked: 62_000,
};

export const duplicateGroups = [
  {
    id: 'd1',
    matchType: 'Email exact',
    confidence: 100,
    contacts: [
      { name: 'Sophie Leclerc', email: 'sophie.leclerc@brightflow.io', company: 'BrightFlow', source: 'Import Salesforce — Nov. 2023' },
      { name: 'S. Leclerc', email: 'sophie.leclerc@brightflow.io', company: 'Bright Flow SAS', source: 'HubSpot Form — Fév. 2024' },
    ],
  },
  {
    id: 'd2',
    matchType: 'Téléphone normalisé',
    confidence: 94,
    contacts: [
      { name: 'Nicolas Bertrand', email: 'n.bertrand@scalepro.fr', company: 'ScalePro', source: 'LinkedIn Sales Nav' },
      { name: 'Nico Bertrand', email: 'nicolas@scalepro.fr', company: 'Scale Pro', source: 'Webinar — Janv. 2024' },
    ],
  },
  {
    id: 'd3',
    matchType: 'Nom + Société (fuzzy)',
    confidence: 79,
    contacts: [
      { name: 'Camille Morin', email: 'c.morin@zenith-rh.com', company: 'Zénith RH', source: 'Inbound' },
      { name: 'Camille Morin', email: 'cmorin@zenith.fr', company: 'Zenith RH', source: 'Cold outreach' },
    ],
  },
];

export const enrichmentTarget = {
  name: 'Alexandre Nguyen',
  email: 'a.nguyen@arkea-solutions.com',
  company: 'Arkeà Solutions',
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
    'Poste': 'Head of Revenue',
    'LinkedIn': 'linkedin.com/in/alexnguyen-rev',
    'Téléphone': '+33 6 48 21 73 90',
    'Secteur': 'FinTech B2B',
    'Taille équipe': '51-200',
    'Pays': 'France',
    'Source': 'Inbound',
  },
};

export const auditFindings = [
  { label: 'Emails invalides ou manquants', value: 187, severity: 'error' as const },
  { label: 'Doublons détectés', value: 312, severity: 'error' as const },
  { label: 'Leads dormants > 6 mois', value: 2_104, severity: 'warning' as const },
  { label: 'Fiches incomplètes (< 5 champs)', value: 3_891, severity: 'warning' as const },
];

export const salesOpsData = {
  champion: {
    name: 'Charlotte Favre',
    initials: 'CF',
    from: { role: 'VP Sales', company: 'Decathlon Pro' },
    to: { role: 'Head of Revenue', company: 'Sephora Digital' },
    icpScore: 94,
    trigger: 'Prise de poste détectée il y a 12 jours',
    suggestedHook: '"Charlotte, on a accompagné votre ancienne équipe chez Decathlon Pro. Votre nouveau contexte chez Sephora Digital est exactement notre terrain de jeu."',
    urgency: 'Fenêtre idéale : 0 – 30 jours après prise de poste',
  },
  closedLost: {
    company: 'Nexia Digital',
    contact: 'Romain Perez — Head of Ops',
    lostReason: 'Timing — pas de budget',
    lostMonthsAgo: 9,
    triggers: [
      'Nouveau trimestre fiscal démarré',
      'Recrutement SDR × 3 détecté sur LinkedIn',
      'Levée de fonds Série A annoncée',
    ],
    potentialARR: 28_000,
    icpFit: 'Parfait',
  },
};
