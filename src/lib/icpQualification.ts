// Client-side ICP qualification logic.
// Determines whether a lead can self-serve a 14-day trial (SMB)
// or should be routed to a planned demo (Enterprise).

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
export type CrmName = 'hubspot' | 'pipedrive' | 'salesforce' | 'zoho' | 'other' | 'none';
export type Goal = 'dedupe' | 'enrich' | 'reactivate' | 'scoring' | 'all';

export interface DemoLead {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  companySize: CompanySize;
  crm: CrmName;
  goal: Goal;
  notes?: string;
}

export type QualificationPath = 'instant_trial' | 'planned_demo';

export interface QualificationResult {
  path: QualificationPath;
  score: number; // 0-100
  reasons: string[];
}

/**
 * Hybrid funnel rules:
 *  - 1-200 employees + supported CRM => instant trial
 *  - 201+ employees, Salesforce, or "other/none" CRM => planned demo
 *  - Generic email domains lower the score but still allow trial
 */
export function qualifyLead(lead: DemoLead): QualificationResult {
  const reasons: string[] = [];
  let score = 50;
  let path: QualificationPath = 'instant_trial';

  // Company size
  if (lead.companySize === '201-1000' || lead.companySize === '1000+') {
    path = 'planned_demo';
    score += 30;
    reasons.push('Équipe 200+ : accompagnement dédié recommandé');
  } else if (lead.companySize === '51-200') {
    score += 20;
    reasons.push('Mid-market : essai libre + onboarding guidé');
  } else {
    score += 10;
    reasons.push('SMB : activation en self-service');
  }

  // CRM fit
  if (lead.crm === 'salesforce') {
    path = 'planned_demo';
    score += 15;
    reasons.push('Salesforce : configuration assistée par notre équipe');
  } else if (lead.crm === 'hubspot' || lead.crm === 'pipedrive') {
    score += 10;
    reasons.push('Intégration native disponible');
  } else if (lead.crm === 'none' || lead.crm === 'other') {
    if (path !== 'planned_demo') {
      reasons.push('CRM non standard : un expert vous appelle');
    }
    path = 'planned_demo';
  }

  // Email domain quality
  const domain = lead.email.split('@')[1]?.toLowerCase() ?? '';
  const generic = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  if (generic.includes(domain)) {
    score -= 15;
    reasons.push('Email perso détecté : pensez à utiliser votre email pro');
  }

  // Goal completeness
  if (lead.goal === 'all') {
    score += 5;
    reasons.push('Objectif global : Kleant adresse tout le périmètre');
  }

  score = Math.max(0, Math.min(100, score));
  return { path, score, reasons };
}
