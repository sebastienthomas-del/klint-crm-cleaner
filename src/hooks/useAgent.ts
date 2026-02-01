import { useState, useCallback } from 'react';
import { agentConfig as initialConfig, recentActivity } from '@/data/mockData';

export type AgentStatus = 'active' | 'paused' | 'scanning' | 'error';

export interface AgentState {
  status: AgentStatus;
  isActive: boolean;
  lastScan: string;
  nextScan: string;
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
  type: 'merge' | 'enrich' | 'validate' | 'scan' | 'score';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
  contactsAffected?: number;
}

export function useAgent() {
  const [state, setState] = useState<AgentState>({
    status: initialConfig.isActive ? 'active' : 'paused',
    isActive: initialConfig.isActive,
    lastScan: initialConfig.lastScan,
    nextScan: initialConfig.nextScan,
    scanFrequency: initialConfig.scanFrequency as 'hourly' | 'daily' | 'weekly',
    autoMergeThreshold: initialConfig.autoMergeThreshold,
    autoEnrichEnabled: initialConfig.autoEnrichEnabled,
    alertsEnabled: initialConfig.alertsEnabled,
    weeklyReportEnabled: initialConfig.weeklyReportEnabled,
  });

  const [logs, setLogs] = useState<AgentLog[]>(recentActivity);

  const toggleAgent = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active',
      isActive: prev.status !== 'active',
    }));
  }, []);

  const startScan = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'scanning',
      currentAction: 'Analyse en cours...',
      progress: 0,
    }));

    // Simulate scan progress
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.progress && prev.progress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            status: 'active',
            currentAction: undefined,
            progress: undefined,
            lastScan: new Date().toISOString(),
          };
        }
        return {
          ...prev,
          progress: (prev.progress || 0) + 10,
        };
      });
    }, 500);
  }, []);

  const updateConfig = useCallback((updates: Partial<AgentState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addLog = useCallback((log: Omit<AgentLog, 'id'>) => {
    const newLog: AgentLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  return {
    state,
    logs,
    toggleAgent,
    startScan,
    updateConfig,
    addLog,
  };
}
