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
export const hotLeads: HotLead[] = [];

// Closed Lost Deals avec triggers de réouverture
export const closedLostDeals: ClosedLostDeal[] = [];

// Champions qui ont changé d'entreprise
export const championMoves: ChampionMove[] = [];

// Opportunités en ghosting
export const ghostingOpportunities: GhostingOpportunity[] = [];

// High Value Targets (ICP parfait mais inactifs)
export const highValueTargets: HighValueTarget[] = [];

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
  hotLeadsCount: 0,
  closedLostWithTriggers: 0,
  championsDetected: 0,
  ghostingDeals: 0,
  highValueTargets: 0,
  totalPipelineAtRisk: 0,
  avgIntentScore: 0
};
