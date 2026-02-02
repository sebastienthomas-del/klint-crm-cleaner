import { useState, useCallback, useMemo } from 'react';
import { 
  hotLeads, 
  closedLostDeals, 
  championMoves, 
  ghostingOpportunities,
  highValueTargets,
  defaultICPConfig,
  salesOpsStats,
  type HotLead,
  type ClosedLostDeal,
  type ChampionMove,
  type GhostingOpportunity,
  type HighValueTarget,
  type ICPConfig,
  type EngagementSignal
} from '@/data/salesOpsData';

export interface SalesOpsState {
  hotLeads: HotLead[];
  closedLostDeals: ClosedLostDeal[];
  championMoves: ChampionMove[];
  ghostingOpportunities: GhostingOpportunity[];
  highValueTargets: HighValueTarget[];
  icpConfig: ICPConfig;
  stats: typeof salesOpsStats;
}

export interface PriorityAction {
  id: string;
  type: 'hot_lead' | 'champion' | 'ghosting' | 'closed_lost' | 'hvt';
  priority: number;
  contact: string;
  company: string;
  score: number;
  action: string;
  hook: string;
  amount?: number;
  metadata?: Record<string, any>;
}

export function useSalesOpsAgent() {
  const [icpConfig, setICPConfig] = useState<ICPConfig>(defaultICPConfig);
  
  // Calculate intent score from signals
  const calculateIntentScore = useCallback((signals: EngagementSignal[], lastActivityDate?: string): number => {
    let score = 0;
    
    // Add points from signals
    signals.forEach(signal => {
      score += signal.value;
    });
    
    // Apply inactivity penalty
    if (lastActivityDate) {
      const lastActivity = new Date(lastActivityDate);
      const now = new Date();
      const monthsInactive = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24 * 30));
      score -= monthsInactive * icpConfig.scoringWeights.inactivityPenalty;
    }
    
    return Math.max(0, Math.min(100, score));
  }, [icpConfig.scoringWeights.inactivityPenalty]);
  
  // Evaluate ICP fit
  const evaluateICPFit = useCallback((contact: {
    position?: string;
    companySize?: string;
    sector?: string;
  }): 'perfect' | 'good' | 'partial' | 'low' => {
    let matchCount = 0;
    const totalCriteria = 3;
    
    if (contact.position && icpConfig.positions.some(p => 
      contact.position?.toLowerCase().includes(p.toLowerCase())
    )) {
      matchCount++;
    }
    
    if (contact.companySize && icpConfig.companySizes.includes(contact.companySize)) {
      matchCount++;
    }
    
    if (contact.sector && icpConfig.sectors.includes(contact.sector)) {
      matchCount++;
    }
    
    if (matchCount === totalCriteria) return 'perfect';
    if (matchCount >= 2) return 'good';
    if (matchCount >= 1) return 'partial';
    return 'low';
  }, [icpConfig]);
  
  // Get priority actions for today
  const priorityActions = useMemo((): PriorityAction[] => {
    const actions: PriorityAction[] = [];
    
    // Hot leads (highest priority)
    hotLeads
      .filter(lead => lead.intentScore >= icpConfig.hotThreshold)
      .forEach((lead, index) => {
        actions.push({
          id: `hot-${lead.id}`,
          type: 'hot_lead',
          priority: 100 - index,
          contact: `${lead.firstName} ${lead.lastName}`,
          company: lead.company,
          score: lead.intentScore,
          action: lead.suggestedAction === 'call' ? 'Appeler maintenant' : 
                  lead.suggestedAction === 'email' ? 'Envoyer email' : 'Message LinkedIn',
          hook: lead.suggestedHook,
          metadata: { position: lead.position, signals: lead.signals }
        });
      });
    
    // Champions (high priority)
    championMoves.forEach((champion, index) => {
      actions.push({
        id: `champ-${champion.id}`,
        type: 'champion',
        priority: 90 - index,
        contact: `${champion.firstName} ${champion.lastName}`,
        company: champion.newCompany,
        score: 85,
        action: 'Féliciter + proposer démo',
        hook: champion.suggestedHook,
        metadata: { 
          previousCompany: champion.previousCompany,
          newPosition: champion.newPosition 
        }
      });
    });
    
    // Ghosting (medium-high priority)
    ghostingOpportunities
      .filter(opp => opp.daysSilent >= icpConfig.ghostingDays)
      .forEach((opp, index) => {
        actions.push({
          id: `ghost-${opp.id}`,
          type: 'ghosting',
          priority: 80 - index,
          contact: opp.contactName,
          company: opp.company,
          score: Math.max(0, 100 - opp.daysSilent * 2),
          action: `Bump: ${opp.suggestedBump}`,
          hook: opp.suggestedHook,
          amount: opp.amount,
          metadata: { 
            daysSilent: opp.daysSilent,
            stage: opp.stage,
            dealName: opp.dealName
          }
        });
      });
    
    // Closed Lost with triggers (medium priority)
    closedLostDeals
      .filter(deal => deal.triggers.length > 0)
      .forEach((deal, index) => {
        actions.push({
          id: `cl-${deal.id}`,
          type: 'closed_lost',
          priority: 70 - index,
          contact: deal.contactName,
          company: deal.company,
          score: 75,
          action: 'Recycler - Trigger détecté',
          hook: deal.suggestedHook,
          amount: deal.amount,
          metadata: { 
            trigger: deal.triggers[0],
            lostReason: deal.lostReason,
            dealName: deal.dealName
          }
        });
      });
    
    // High Value Targets (lower priority but high value)
    highValueTargets.forEach((hvt, index) => {
      actions.push({
        id: `hvt-${hvt.id}`,
        type: 'hvt',
        priority: 60 - index,
        contact: `${hvt.firstName} ${hvt.lastName}`,
        company: hvt.company,
        score: hvt.icpScore,
        action: 'Réactiver - HVT inactif',
        hook: hvt.suggestedHook,
        amount: hvt.potentialARR,
        metadata: { 
          whyHVT: hvt.whyHVT,
          inactiveSince: hvt.inactiveSince 
        }
      });
    });
    
    return actions.sort((a, b) => b.priority - a.priority);
  }, [icpConfig.hotThreshold, icpConfig.ghostingDays]);
  
  // Update ICP config
  const updateICPConfig = useCallback((updates: Partial<ICPConfig>) => {
    setICPConfig(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Get stats
  const stats = useMemo(() => ({
    ...salesOpsStats,
    hotLeadsCount: hotLeads.filter(l => l.intentScore >= icpConfig.hotThreshold).length,
    ghostingDeals: ghostingOpportunities.filter(o => o.daysSilent >= icpConfig.ghostingDays).length
  }), [icpConfig.hotThreshold, icpConfig.ghostingDays]);

  return {
    // Data
    hotLeads,
    closedLostDeals,
    championMoves,
    ghostingOpportunities,
    highValueTargets,
    
    // Computed
    priorityActions,
    stats,
    
    // Config
    icpConfig,
    updateICPConfig,
    
    // Functions
    calculateIntentScore,
    evaluateICPFit
  };
}
