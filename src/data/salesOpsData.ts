// Sales Ops Agent data - Hot leads, Closed Lost, Champions, Ghosting

export interface EngagementSignal {
  type: 'pricing_page' | 'email_open' | 'download' | 'linkedin' | 'website';
  timestamp: string;
  value: number;
}

export interface HotLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  intentScore: number;
  icpFit: 'perfect' | 'good' | 'partial' | 'low';
  signals: EngagementSignal[];
  suggestedAction: 'call' | 'email' | 'linkedin';
  suggestedHook: string;
  status: 'active' | 'inactive' | 'dormant';
}

export interface ReopenTrigger {
  type: 'funding' | 'quarter_change' | 'new_project' | 'growth';
  detectedAt: string;
  description: string;
}

export interface ClosedLostDeal {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  position: string;
  email: string;
  dealName: string;
  amount: number;
  lostReason: 'budget' | 'timing' | 'competitor' | 'no_decision';
  lostDate: string;
  triggers: ReopenTrigger[];
  suggestedHook: string;
}

export interface ChampionMove {
  id: string;
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  previousCompany: string;
  previousPosition: string;
  newCompany: string;
  newPosition: string;
  detectedAt: string;
  linkedInUrl?: string;
  suggestedHook: string;
}

export interface GhostingOpportunity {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  position: string;
  email: string;
  dealName: string;
  amount: number;
  lastActivity: string;
  daysSilent: number;
  stage: string;
  suggestedBump: string;
  suggestedHook: string;
}

export interface HighValueTarget {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  companySize: string;
  sector: string;
  icpFit: 'perfect' | 'good';
  icpScore: number;
  inactiveSince: string;
  potentialARR: number;
  whyHVT: string;
  suggestedHook: string;
}

export interface ICPConfig {
  companySizes: string[];
  sectors: string[];
  positions: string[];
  scoringWeights: {
    pricingPage: number;
    emailOpen: number;
    download: number;
    linkedin: number;
    websiteVisit: number;
    inactivityPenalty: number;
  };
  hotThreshold: number;
  ghostingDays: number;
}

// Hot Leads (score intention > 80)
export const hotLeads: HotLead[] = [
  {
    id: 'hot-1',
    firstName: 'Marc',
    lastName: 'Dubois',
    email: 'marc.dubois@bigcorp.com',
    company: 'BigCorp',
    position: 'VP Sales',
    intentScore: 92,
    icpFit: 'perfect',
    signals: [
      { type: 'pricing_page', timestamp: '2025-02-01T14:30:00', value: 20 },
      { type: 'email_open', timestamp: '2025-02-01T10:15:00', value: 5 },
      { type: 'linkedin', timestamp: '2025-01-31T16:45:00', value: 10 },
      { type: 'download', timestamp: '2025-01-30T09:00:00', value: 15 }
    ],
    suggestedAction: 'call',
    suggestedHook: 'Suite à votre visite sur notre page tarifs hier, je pense que notre solution Pro correspondrait parfaitement à votre équipe de 45 commerciaux...',
    status: 'active'
  },
  {
    id: 'hot-2',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@techstart.io',
    company: 'TechStart',
    position: 'Head of Growth',
    intentScore: 88,
    icpFit: 'perfect',
    signals: [
      { type: 'download', timestamp: '2025-02-01T11:00:00', value: 15 },
      { type: 'pricing_page', timestamp: '2025-01-31T15:30:00', value: 20 },
      { type: 'website', timestamp: '2025-01-31T15:25:00', value: 3 }
    ],
    suggestedAction: 'email',
    suggestedHook: 'Vous avez téléchargé notre guide "10 métriques CRM" - voici comment TechStart pourrait réactiver 30% de leads dormants...',
    status: 'active'
  },
  {
    id: 'hot-3',
    firstName: 'Pierre',
    lastName: 'Lambert',
    email: 'p.lambert@innovcorp.fr',
    company: 'InnovCorp',
    position: 'CEO',
    intentScore: 85,
    icpFit: 'perfect',
    signals: [
      { type: 'linkedin', timestamp: '2025-02-01T09:00:00', value: 10 },
      { type: 'pricing_page', timestamp: '2025-01-30T14:00:00', value: 20 },
      { type: 'email_open', timestamp: '2025-01-30T08:30:00', value: 5 }
    ],
    suggestedAction: 'linkedin',
    suggestedHook: 'Je vois que vous avez consulté nos tarifs Enterprise - avec 200+ commerciaux, votre ROI serait significatif...',
    status: 'active'
  },
  {
    id: 'hot-4',
    firstName: 'Julie',
    lastName: 'Renard',
    email: 'julie.r@scaleup.com',
    company: 'ScaleUp',
    position: 'Sales Director',
    intentScore: 83,
    icpFit: 'good',
    signals: [
      { type: 'download', timestamp: '2025-01-31T16:00:00', value: 15 },
      { type: 'website', timestamp: '2025-01-31T15:55:00', value: 3 },
      { type: 'email_open', timestamp: '2025-01-30T11:00:00', value: 5 }
    ],
    suggestedAction: 'call',
    suggestedHook: 'Votre lecture de notre case study "ScaleUp SaaS" montre que vous cherchez à optimiser - parlons-en 15 min ?',
    status: 'active'
  },
  {
    id: 'hot-5',
    firstName: 'Thomas',
    lastName: 'Bernard',
    email: 'thomas.b@enterprise.fr',
    company: 'Enterprise SA',
    position: 'CTO',
    intentScore: 81,
    icpFit: 'good',
    signals: [
      { type: 'pricing_page', timestamp: '2025-01-30T10:00:00', value: 20 },
      { type: 'linkedin', timestamp: '2025-01-29T14:30:00', value: 10 }
    ],
    suggestedAction: 'email',
    suggestedHook: 'En tant que CTO, vous apprécierez notre API REST et nos webhooks - intégration en 2h avec votre stack...',
    status: 'active'
  }
];

// Closed Lost Deals avec triggers de réouverture
export const closedLostDeals: ClosedLostDeal[] = [
  {
    id: 'cl-1',
    contactId: 'c1',
    contactName: 'Antoine Mercier',
    company: 'Acme Corp',
    position: 'VP Sales',
    email: 'a.mercier@acme.com',
    dealName: 'Licence Enterprise',
    amount: 45000,
    lostReason: 'budget',
    lostDate: '2024-10-15',
    triggers: [
      { type: 'funding', detectedAt: '2025-01-28', description: 'Levée Série B - 20M€ annoncée' }
    ],
    suggestedHook: 'Suite à votre récente levée de 20M€, le timing semble idéal pour reprendre notre discussion sur l\'optimisation CRM...'
  },
  {
    id: 'cl-2',
    contactId: 'c2',
    contactName: 'Émilie Durand',
    company: 'Tech Solutions',
    position: 'Head of Sales',
    email: 'e.durand@techsolutions.fr',
    dealName: 'Pack Professional',
    amount: 24000,
    lostReason: 'timing',
    lostDate: '2024-11-20',
    triggers: [
      { type: 'quarter_change', detectedAt: '2025-01-02', description: 'Q1 2025 - Nouveaux budgets disponibles' }
    ],
    suggestedHook: 'Nouveau trimestre, nouveaux objectifs ! En Q4 le timing n\'était pas bon, mais votre équipe est-elle prête pour 2025 ?'
  },
  {
    id: 'cl-3',
    contactId: 'c3',
    contactName: 'Lucas Martin',
    company: 'GrowthLab',
    position: 'CEO',
    email: 'lucas@growthlab.io',
    dealName: 'Onboarding Premium',
    amount: 35000,
    lostReason: 'budget',
    lostDate: '2024-09-01',
    triggers: [
      { type: 'growth', detectedAt: '2025-01-15', description: 'Recrutement de 12 commerciaux détecté sur LinkedIn' }
    ],
    suggestedHook: 'Félicitations pour l\'expansion de votre équipe ! Avec 12 nouveaux commerciaux, la qualité CRM devient critique...'
  },
  {
    id: 'cl-4',
    contactId: 'c4',
    contactName: 'Marie Leroy',
    company: 'DataFlow',
    position: 'Sales Director',
    email: 'm.leroy@dataflow.com',
    dealName: 'Licence Team',
    amount: 18000,
    lostReason: 'competitor',
    lostDate: '2024-08-10',
    triggers: [
      { type: 'new_project', detectedAt: '2025-01-20', description: 'Post LinkedIn : "Recherche solution CRM cleaning"' }
    ],
    suggestedHook: 'J\'ai vu votre post sur LinkedIn - votre expérience avec [concurrent] n\'a pas été concluante ? Discutons de ce qui a changé chez nous...'
  },
  {
    id: 'cl-5',
    contactId: 'c5',
    contactName: 'Nicolas Petit',
    company: 'StartupX',
    position: 'Founder',
    email: 'nicolas@startupx.fr',
    dealName: 'Starter Annual',
    amount: 9500,
    lostReason: 'timing',
    lostDate: '2024-12-01',
    triggers: [
      { type: 'funding', detectedAt: '2025-01-25', description: 'Seed round de 2M€ clôturée' }
    ],
    suggestedHook: 'Bravo pour votre seed ! Maintenant que vous avez les moyens de scaler, structurez votre CRM dès le départ...'
  }
];

// Champions qui ont changé d'entreprise
export const championMoves: ChampionMove[] = [
  {
    id: 'ch-1',
    contactId: 'ch-c1',
    firstName: 'Julie',
    lastName: 'Lambert',
    email: 'julie.l@techstart.io',
    previousCompany: 'Startup.io',
    previousPosition: 'Sales Manager',
    newCompany: 'TechStart',
    newPosition: 'Head of Growth',
    detectedAt: '2025-01-29',
    linkedInUrl: 'https://linkedin.com/in/julielambert',
    suggestedHook: 'Félicitations pour votre nouveau poste chez TechStart ! Chez Startup.io, vous aviez adoré notre solution - prêts à équiper votre nouvelle équipe ?'
  },
  {
    id: 'ch-2',
    contactId: 'ch-c2',
    firstName: 'Alexandre',
    lastName: 'Moreau',
    email: 'alex.moreau@innovtech.com',
    previousCompany: 'OldCorp',
    previousPosition: 'VP Sales',
    newCompany: 'InnovTech',
    newPosition: 'Chief Revenue Officer',
    detectedAt: '2025-01-25',
    linkedInUrl: 'https://linkedin.com/in/alexmoreau',
    suggestedHook: 'Alexandre, CRO chez InnovTech - quelle évolution ! Chez OldCorp vous aviez doublé votre taux de réactivation avec Kleant...'
  },
  {
    id: 'ch-3',
    contactId: 'ch-c3',
    firstName: 'Camille',
    lastName: 'Rousseau',
    email: 'c.rousseau@fastgrowth.io',
    previousCompany: 'SlowGrowth',
    previousPosition: 'Sales Ops Manager',
    newCompany: 'FastGrowth',
    newPosition: 'Director of Revenue Operations',
    detectedAt: '2025-01-22',
    suggestedHook: 'Félicitations Camille ! Chez SlowGrowth vous aviez économisé 20h/semaine sur le cleaning CRM - imaginons les gains chez FastGrowth...'
  }
];

// Opportunités en ghosting
export const ghostingOpportunities: GhostingOpportunity[] = [
  {
    id: 'ghost-1',
    contactId: 'g-c1',
    contactName: 'Philippe Durand',
    company: 'Enterprise SA',
    position: 'Sales Director',
    email: 'p.durand@enterprise.fr',
    dealName: 'Pack Premium',
    amount: 50000,
    lastActivity: '2025-01-09',
    daysSilent: 23,
    stage: 'Négociation',
    suggestedBump: 'Case study secteur similaire',
    suggestedHook: 'Je pensais à vous en lisant cette étude de cas chez [concurrent de Enterprise SA] - leurs résultats en 3 mois pourraient vous intéresser...'
  },
  {
    id: 'ghost-2',
    contactId: 'g-c2',
    contactName: 'Stéphanie Blanc',
    company: 'MidCorp',
    position: 'Head of Sales',
    email: 's.blanc@midcorp.com',
    dealName: 'Professional Annual',
    amount: 24000,
    lastActivity: '2025-01-12',
    daysSilent: 20,
    stage: 'Démo effectuée',
    suggestedBump: 'ROI calculator personnalisé',
    suggestedHook: 'J\'ai calculé votre ROI potentiel avec vos 8000 contacts : 15h/semaine économisées. Voici le détail...'
  },
  {
    id: 'ghost-3',
    contactId: 'g-c3',
    contactName: 'Romain Garcia',
    company: 'StartupGrow',
    position: 'CEO',
    email: 'romain@startupgrow.io',
    dealName: 'Starter',
    amount: 9500,
    lastActivity: '2025-01-15',
    daysSilent: 17,
    stage: 'Proposition envoyée',
    suggestedBump: 'Offre limitée fin de mois',
    suggestedHook: 'Avant la fin du mois, je peux encore vous proposer 2 mois offerts - après, retour aux conditions standard...'
  },
  {
    id: 'ghost-4',
    contactId: 'g-c4',
    contactName: 'Caroline Petit',
    company: 'TechVenture',
    position: 'VP Operations',
    email: 'c.petit@techventure.com',
    dealName: 'Enterprise',
    amount: 60000,
    lastActivity: '2025-01-05',
    daysSilent: 27,
    stage: 'POC en cours',
    suggestedBump: 'Check-in POC + extension',
    suggestedHook: 'Comment se passe le POC ? Si vous avez besoin de plus de temps pour évaluer, je peux l\'étendre de 2 semaines...'
  }
];

// High Value Targets (ICP parfait mais inactifs)
export const highValueTargets: HighValueTarget[] = [
  {
    id: 'hvt-1',
    firstName: 'Antoine',
    lastName: 'Mercier',
    email: 'a.mercier@bigtech.com',
    company: 'BigTech',
    position: 'CEO',
    companySize: '150 employés',
    sector: 'Tech',
    icpFit: 'perfect',
    icpScore: 100,
    inactiveSince: '2024-06-01',
    potentialARR: 75000,
    whyHVT: 'Tech, 150 emp, décideur C-Level, potentiel €75K ARR',
    suggestedHook: 'Les CEOs tech qui ont adopté Kleant économisent en moyenne 15h/semaine sur la maintenance CRM - 15 min pour en discuter ?'
  },
  {
    id: 'hvt-2',
    firstName: 'Isabelle',
    lastName: 'Fournier',
    email: 'i.fournier@saasmaster.io',
    company: 'SaaSMaster',
    position: 'VP Sales',
    companySize: '80 employés',
    sector: 'SaaS',
    icpFit: 'perfect',
    icpScore: 95,
    inactiveSince: '2024-07-15',
    potentialARR: 45000,
    whyHVT: 'SaaS B2B, 80 emp, VP Sales, scaling rapide détecté',
    suggestedHook: 'J\'ai vu que SaaSMaster recrute 5 SDRs - avec un CRM propre, leur ramp-up sera 2x plus rapide...'
  },
  {
    id: 'hvt-3',
    firstName: 'David',
    lastName: 'Martin',
    email: 'd.martin@fintechpro.com',
    company: 'FinTechPro',
    position: 'CRO',
    companySize: '200 employés',
    sector: 'FinTech',
    icpFit: 'perfect',
    icpScore: 98,
    inactiveSince: '2024-05-01',
    potentialARR: 90000,
    whyHVT: 'FinTech, 200 emp, CRO, compliance data importante',
    suggestedHook: 'En FinTech, la qualité des données est critique pour la compliance - comment gérez-vous vos 50K contacts ?'
  }
];

// Configuration ICP par défaut
export const defaultICPConfig: ICPConfig = {
  companySizes: ['50-200', '201-500', '500+'],
  sectors: ['Tech', 'SaaS', 'FinTech', 'E-commerce'],
  positions: ['CEO', 'CTO', 'CRO', 'VP Sales', 'Head of Growth', 'Sales Director'],
  scoringWeights: {
    pricingPage: 20,
    emailOpen: 5,
    download: 15,
    linkedin: 10,
    websiteVisit: 3,
    inactivityPenalty: 5
  },
  hotThreshold: 80,
  ghostingDays: 15
};

// Stats Sales Ops
export const salesOpsStats = {
  hotLeadsCount: 12,
  closedLostWithTriggers: 5,
  championsDetected: 3,
  ghostingDeals: 8,
  highValueTargets: 23,
  totalPipelineAtRisk: 184500,
  avgIntentScore: 67
};
