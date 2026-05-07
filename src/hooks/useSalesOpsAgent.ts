import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  defaultICPConfig,
  type HotLead,
  type ClosedLostDeal,
  type ChampionMove,
  type GhostingOpportunity,
  type HighValueTarget,
  type ICPConfig,
} from '@/data/salesOpsData';

export interface SalesOpsState {
  hotLeads: HotLead[];
  closedLostDeals: ClosedLostDeal[];
  championMoves: ChampionMove[];
  ghostingOpportunities: GhostingOpportunity[];
  highValueTargets: HighValueTarget[];
  icpConfig: ICPConfig;
  stats: {
    hotLeadsCount: number;
    closedLostWithTriggers: number;
    championsDetected: number;
    ghostingDeals: number;
    highValueTargets: number;
    totalPipelineAtRisk: number;
    avgIntentScore: number;
  };
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
  metadata?: Record<string, unknown>;
}

type SalesOpsResult = {
  hotLeads: HotLead[];
  ghosting: GhostingOpportunity[];
  hvt: HighValueTarget[];
  championMoves: ChampionMove[];
  closedLostDeals: ClosedLostDeal[];
  stats: SalesOpsState['stats'];
};

export function useSalesOpsAgent() {
  const [icpConfig, setICPConfig] = useState<ICPConfig>(defaultICPConfig);

  const salesOpsQuery = useQuery<SalesOpsResult>({
    queryKey: ['sales_ops'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<SalesOpsResult>('klea-sales-ops');
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Réponse vide');
      return data;
    },
    staleTime: 5 * 60_000,
  });

  const result = salesOpsQuery.data;

  const priorityActions = useMemo((): PriorityAction[] => {
    const actions: PriorityAction[] = [];

    (result?.hotLeads ?? [])
      .filter(lead => lead.intentScore >= icpConfig.hotThreshold)
      .forEach((lead, i) => {
        actions.push({
          id: `hot-${lead.id}`,
          type: 'hot_lead',
          priority: 100 - i,
          contact: `${lead.firstName} ${lead.lastName}`,
          company: lead.company,
          score: lead.intentScore,
          action: lead.suggestedAction === 'call' ? 'Appeler maintenant'
            : lead.suggestedAction === 'email' ? 'Envoyer email'
            : 'Message LinkedIn',
          hook: lead.suggestedHook,
          metadata: { position: lead.position, signals: lead.signals },
        });
      });

    (result?.championMoves ?? []).forEach((champion, i) => {
      actions.push({
        id: `champ-${champion.id}`,
        type: 'champion',
        priority: 90 - i,
        contact: `${champion.firstName} ${champion.lastName}`,
        company: champion.newCompany,
        score: 85,
        action: 'Féliciter + proposer démo',
        hook: champion.suggestedHook,
        metadata: { previousCompany: champion.previousCompany, newPosition: champion.newPosition },
      });
    });

    (result?.ghosting ?? [])
      .filter(opp => opp.daysSilent >= icpConfig.ghostingDays)
      .forEach((opp, i) => {
        actions.push({
          id: `ghost-${opp.id}`,
          type: 'ghosting',
          priority: 80 - i,
          contact: opp.contactName,
          company: opp.company,
          score: Math.max(0, 100 - opp.daysSilent * 2),
          action: `Bump: ${opp.suggestedBump}`,
          hook: opp.suggestedHook,
          amount: opp.amount || undefined,
          metadata: { daysSilent: opp.daysSilent, stage: opp.stage, dealName: opp.dealName },
        });
      });

    (result?.closedLostDeals ?? [])
      .filter(deal => deal.triggers.length > 0)
      .forEach((deal, i) => {
        actions.push({
          id: `cl-${deal.id}`,
          type: 'closed_lost',
          priority: 70 - i,
          contact: deal.contactName,
          company: deal.company,
          score: 75,
          action: 'Recycler - Trigger détecté',
          hook: deal.suggestedHook,
          amount: deal.amount,
          metadata: { trigger: deal.triggers[0], lostReason: deal.lostReason, dealName: deal.dealName },
        });
      });

    (result?.hvt ?? []).forEach((hvt, i) => {
      actions.push({
        id: `hvt-${hvt.id}`,
        type: 'hvt',
        priority: 60 - i,
        contact: `${hvt.firstName} ${hvt.lastName}`,
        company: hvt.company,
        score: hvt.icpScore,
        action: 'Réactiver - HVT inactif',
        hook: hvt.suggestedHook,
        amount: hvt.potentialARR,
        metadata: { whyHVT: hvt.whyHVT, inactiveSince: hvt.inactiveSince },
      });
    });

    return actions.sort((a, b) => b.priority - a.priority);
  }, [result, icpConfig.hotThreshold, icpConfig.ghostingDays]);

  const stats = result?.stats ?? {
    hotLeadsCount: 0,
    closedLostWithTriggers: 0,
    championsDetected: 0,
    ghostingDeals: 0,
    highValueTargets: 0,
    totalPipelineAtRisk: 0,
    avgIntentScore: 0,
  };

  const updateICPConfig = useCallback((updates: Partial<ICPConfig>) => {
    setICPConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    hotLeads: result?.hotLeads ?? [],
    closedLostDeals: result?.closedLostDeals ?? [],
    championMoves: result?.championMoves ?? [],
    ghostingOpportunities: result?.ghosting ?? [],
    highValueTargets: result?.hvt ?? [],
    priorityActions,
    stats,
    icpConfig,
    updateICPConfig,
    isLoading: salesOpsQuery.isLoading,
    calculateIntentScore: () => 0,
    evaluateICPFit: (): 'perfect' | 'good' | 'partial' | 'low' => 'low',
  };
}
