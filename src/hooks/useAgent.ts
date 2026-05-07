import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type AgentStatus = 'active' | 'paused' | 'scanning' | 'error';

export interface AgentState {
  status: AgentStatus;
  isActive: boolean;
  lastScan: string | null;
  nextScan: string | null;
  scanFrequency: 'hourly' | 'daily' | 'weekly';
  autoMergeThreshold: number;
  autoEnrichEnabled: boolean;
  alertsEnabled: boolean;
  weeklyReportEnabled: boolean;
  currentAction?: string;
  progress?: number;
}

export interface AgentLog {
  id: string;
  type: string;
  description: string;
  created_at: string;
  status: string;
  contacts_affected?: number | null;
}

type AutomationRulesUpdate = Partial<{
  is_active: boolean;
  scan_frequency: string;
  auto_merge_threshold: number;
  auto_enrich_enabled: boolean;
  alerts_enabled: boolean;
  weekly_report_enabled: boolean;
}>;

export function useAgent() {
  const qc = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<number | undefined>(undefined);

  const configQuery = useQuery({
    queryKey: ['automation_rules'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  const logsQuery = useQuery({
    queryKey: ['agent_logs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');
      const { data, error } = await supabase
        .from('activity_log')
        .select('id, type, description, status, contacts_affected, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as AgentLog[];
    },
    staleTime: 30_000,
  });

  const configMutation = useMutation({
    mutationFn: async (updates: AutomationRulesUpdate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');
      const { error } = await supabase
        .from('automation_rules')
        .update(updates)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automation_rules'] }),
    onError: (e: Error) =>
      toast({ title: 'Erreur configuration', description: e.message, variant: 'destructive' }),
  });

  const startScan = useCallback(async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(5);

    try {
      setScanProgress(20);
      const syncResult = await supabase.functions.invoke('hubspot-sync-contacts');
      if (syncResult.error) throw new Error(syncResult.error.message);

      setScanProgress(60);
      const detectResult = await supabase.functions.invoke('hubspot-detect-duplicates');
      if (detectResult.error) throw new Error(detectResult.error.message);

      setScanProgress(95);
      qc.invalidateQueries({ queryKey: ['dashboard_stats'] });
      qc.invalidateQueries({ queryKey: ['duplicate_groups'] });
      qc.invalidateQueries({ queryKey: ['agent_logs'] });
      qc.invalidateQueries({ queryKey: ['sales_ops'] });
      qc.invalidateQueries({ queryKey: ['crm_connections'] });

      setScanProgress(100);
      toast({ title: 'Scan terminé', description: 'Contacts synchronisés et doublons détectés.' });
    } catch (e: unknown) {
      toast({
        title: 'Erreur scan',
        description: e instanceof Error ? e.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanProgress(undefined), 1500);
    }
  }, [isScanning, qc]);

  const toggleAgent = useCallback(() => {
    const current = configQuery.data?.is_active ?? false;
    configMutation.mutate({ is_active: !current });
  }, [configQuery.data, configMutation]);

  const updateConfig = useCallback((updates: Partial<AgentState>) => {
    const mapped: AutomationRulesUpdate = {};
    if (updates.isActive !== undefined) mapped.is_active = updates.isActive;
    if (updates.scanFrequency !== undefined) mapped.scan_frequency = updates.scanFrequency;
    if (updates.autoMergeThreshold !== undefined) mapped.auto_merge_threshold = updates.autoMergeThreshold;
    if (updates.autoEnrichEnabled !== undefined) mapped.auto_enrich_enabled = updates.autoEnrichEnabled;
    if (updates.alertsEnabled !== undefined) mapped.alerts_enabled = updates.alertsEnabled;
    if (updates.weeklyReportEnabled !== undefined) mapped.weekly_report_enabled = updates.weeklyReportEnabled;
    configMutation.mutate(mapped);
  }, [configMutation]);

  const cfg = configQuery.data;
  const state: AgentState = {
    status: isScanning ? 'scanning' : (cfg?.is_active ? 'active' : 'paused'),
    isActive: cfg?.is_active ?? false,
    lastScan: null,
    nextScan: null,
    scanFrequency: (cfg?.scan_frequency as 'hourly' | 'daily' | 'weekly') ?? 'daily',
    autoMergeThreshold: cfg?.auto_merge_threshold ?? 95,
    autoEnrichEnabled: cfg?.auto_enrich_enabled ?? true,
    alertsEnabled: cfg?.alerts_enabled ?? true,
    weeklyReportEnabled: cfg?.weekly_report_enabled ?? true,
    progress: scanProgress,
  };

  return {
    state,
    logs: logsQuery.data ?? [],
    toggleAgent,
    startScan,
    updateConfig,
    addLog: () => {},
  };
}
