// Mock data for the Klint CRM maintenance application

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  sector?: string;
  linkedIn?: string;
  lastActivity?: string;
  score?: number;
  status: 'active' | 'inactive' | 'dormant';
}

export interface DuplicateGroup {
  id: string;
  confidence: number;
  contacts: Contact[];
  detectedAt: string;
  reason: string;
}

export interface AgentAction {
  id: string;
  type: 'merge' | 'enrich' | 'validate' | 'scan' | 'score';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
  contactsAffected?: number;
}

export interface Integration {
  id: string;
  name: string;
  type: 'crm' | 'notification' | 'productivity';
  connected: boolean;
  lastSync?: string;
  contactsCount?: number;
}

// Dashboard KPIs
export const dashboardStats = {
  healthScore: 78,
  totalContacts: 12847,
  activeContacts: 8234,
  duplicatesDetected: 234,
  contactsToEnrich: 1456,
  contactsToReactivate: 523,
  weeklyNewContacts: 234,
  monthlyGrowth: 12,
};

// Health evolution data
export const healthData = [
  { day: 'Lun', score: 72 },
  { day: 'Mar', score: 74 },
  { day: 'Mer', score: 75 },
  { day: 'Jeu', score: 76 },
  { day: 'Ven', score: 77 },
  { day: 'Sam', score: 78 },
  { day: 'Dim', score: 78 },
];

// Score distribution
export const scoreDistribution = [
  { name: 'Hot', value: 2345, percentage: 18 },
  { name: 'Warm', value: 6789, percentage: 53 },
  { name: 'Cold', value: 3713, percentage: 29 },
];

// Alerts
export const alerts = [
  { 
    id: '1',
    type: 'error' as const, 
    title: '234 doublons détectés', 
    action: 'Fusionner maintenant', 
    link: '/app/duplicates',
    priority: 1
  },
  { 
    id: '2',
    type: 'warning' as const, 
    title: '456 contacts sans secteur', 
    action: 'Enrichir', 
    link: '/app/enrichment',
    priority: 2
  },
  { 
    id: '3',
    type: 'success' as const, 
    title: '89 contacts réactivables', 
    action: 'Voir la liste', 
    link: '/app/reactivation',
    priority: 3
  },
];

// Recent agent activity
export const recentActivity: AgentAction[] = [
  { 
    id: '1',
    type: 'enrich', 
    description: 'Contact "Jean Dupont" enrichi (secteur: Tech)', 
    timestamp: 'Il y a 2 min',
    status: 'success',
    contactsAffected: 1
  },
  { 
    id: '2',
    type: 'merge', 
    description: '3 contacts fusionnés (doublons)', 
    timestamp: 'Il y a 15 min',
    status: 'success',
    contactsAffected: 3
  },
  { 
    id: '3',
    type: 'score', 
    description: 'Scoring mis à jour (234 contacts)', 
    timestamp: 'Il y a 1h',
    status: 'success',
    contactsAffected: 234
  },
  { 
    id: '4',
    type: 'scan', 
    description: 'Scan quotidien terminé', 
    timestamp: 'Il y a 3h',
    status: 'success'
  },
];

// Suggested lists
export const suggestedLists = [
  { 
    id: '1',
    title: 'Top 50 leads à appeler', 
    description: 'Hot leads, score >80', 
    count: 50, 
    cta: 'Exporter CSV' 
  },
  { 
    id: '2',
    title: 'Contacts à réactiver - Tech', 
    description: '147 contacts', 
    count: 147, 
    cta: 'Voir détails' 
  },
  { 
    id: '3',
    title: 'Opportunités perdues à relancer', 
    description: '23 deals', 
    count: 23, 
    cta: 'Analyser' 
  },
];

// Duplicate groups
export const duplicateGroups: DuplicateGroup[] = [
  {
    id: 'dup-1',
    confidence: 95,
    detectedAt: '2025-01-30',
    reason: 'Email identique',
    contacts: [
      { id: 'c1', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@techcorp.fr', company: 'TechCorp', position: 'CEO', status: 'active' },
      { id: 'c2', firstName: 'J.', lastName: 'Dupont', email: 'jean.dupont@techcorp.fr', company: 'Tech Corp SAS', position: 'Directeur', status: 'active' },
    ]
  },
  {
    id: 'dup-2',
    confidence: 87,
    detectedAt: '2025-01-29',
    reason: 'Nom + entreprise similaires',
    contacts: [
      { id: 'c3', firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@startup.io', company: 'Startup.io', status: 'active' },
      { id: 'c4', firstName: 'Marie', lastName: 'Martin-Duval', email: 'm.martin@startup.io', company: 'Startup IO', status: 'inactive' },
    ]
  },
  {
    id: 'dup-3',
    confidence: 72,
    detectedAt: '2025-01-28',
    reason: 'Téléphone identique',
    contacts: [
      { id: 'c5', firstName: 'Pierre', lastName: 'Bernard', email: 'p.bernard@acme.com', phone: '+33612345678', company: 'ACME', status: 'active' },
      { id: 'c6', firstName: 'P.', lastName: 'Bernard', email: 'pierre.b@acme.fr', phone: '+33612345678', company: 'ACME Corp', status: 'dormant' },
    ]
  },
];

// Contacts to enrich
export const contactsToEnrich: Contact[] = [
  { id: 'e1', firstName: 'Sophie', lastName: 'Leroy', email: 'sophie.leroy@example.com', status: 'active' },
  { id: 'e2', firstName: 'Thomas', lastName: 'Moreau', email: 'thomas.moreau@company.fr', company: 'Company SAS', status: 'active' },
  { id: 'e3', firstName: 'Emma', lastName: 'Petit', email: 'emma.p@tech.io', position: 'Manager', status: 'active' },
  { id: 'e4', firstName: 'Lucas', lastName: 'Garcia', email: 'l.garcia@startup.com', company: 'Startup', status: 'inactive' },
  { id: 'e5', firstName: 'Léa', lastName: 'Roux', email: 'lea.roux@innovation.fr', status: 'active' },
];

// Enrichment categories
export const enrichmentCategories = [
  { id: 'sector', label: 'Secteur d\'activité', count: 456, icon: 'Building2' },
  { id: 'company-size', label: 'Taille entreprise', count: 234, icon: 'Users' },
  { id: 'linkedin', label: 'Profil LinkedIn', count: 178, icon: 'Linkedin' },
  { id: 'email-validation', label: 'Emails à valider', count: 89, icon: 'Mail' },
  { id: 'phone-format', label: 'Téléphones à formater', count: 123, icon: 'Phone' },
  { id: 'position', label: 'Postes à standardiser', count: 376, icon: 'Briefcase' },
];

// Contacts to reactivate
export const contactsToReactivate: Contact[] = [
  { 
    id: 'r1', 
    firstName: 'Marc', 
    lastName: 'Dubois', 
    email: 'marc.dubois@bigcorp.com', 
    company: 'BigCorp', 
    position: 'VP Sales',
    lastActivity: '2024-06-15',
    score: 85,
    status: 'dormant' 
  },
  { 
    id: 'r2', 
    firstName: 'Julie', 
    lastName: 'Lambert', 
    email: 'julie.l@techstart.io', 
    company: 'TechStart', 
    position: 'Head of Growth',
    lastActivity: '2024-07-22',
    score: 78,
    status: 'dormant' 
  },
  { 
    id: 'r3', 
    firstName: 'Antoine', 
    lastName: 'Mercier', 
    email: 'a.mercier@enterprise.fr', 
    company: 'Enterprise SA', 
    position: 'CEO',
    lastActivity: '2024-05-10',
    score: 92,
    status: 'dormant' 
  },
];

// Reactivation lists
export const reactivationLists = [
  { id: 'top50', title: 'Top 50 cette semaine', description: 'Contacts prioritaires à fort potentiel', count: 50, priority: 'high' },
  { id: 'clients', title: 'Anciens clients', description: 'Clients inactifs depuis 6+ mois', count: 89, priority: 'high' },
  { id: 'engaged', title: 'Leads engagés puis disparus', description: 'Contacts avec historique d\'engagement', count: 147, priority: 'medium' },
  { id: 'vip', title: 'Contacts VIP dormants', description: 'Décideurs clés à réactiver', count: 23, priority: 'high' },
];

// Integrations
export const integrations: Integration[] = [
  { id: 'hubspot', name: 'HubSpot', type: 'crm', connected: true, lastSync: '2025-01-31 10:30', contactsCount: 12847 },
  { id: 'pipedrive', name: 'Pipedrive', type: 'crm', connected: false },
  { id: 'salesforce', name: 'Salesforce', type: 'crm', connected: false },
  { id: 'slack', name: 'Slack', type: 'notification', connected: true, lastSync: '2025-01-31 11:00' },
  { id: 'google', name: 'Google Workspace', type: 'productivity', connected: false },
  { id: 'notion', name: 'Notion', type: 'productivity', connected: false },
  { id: 'teams', name: 'Microsoft Teams', type: 'notification', connected: false },
];

// Agent configuration
export const agentConfig = {
  isActive: true,
  lastScan: '2025-01-31 08:00',
  nextScan: '2025-02-01 08:00',
  scanFrequency: 'daily',
  autoMergeThreshold: 95,
  autoEnrichEnabled: true,
  alertsEnabled: true,
  weeklyReportEnabled: true,
};
