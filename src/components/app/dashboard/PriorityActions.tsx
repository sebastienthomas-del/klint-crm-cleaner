import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Phone,
  Mail,
  Linkedin,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Clock,
  DollarSign,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSalesOpsAgent, type PriorityAction } from '@/hooks/useSalesOpsAgent';

const PriorityActions = () => {
  const { priorityActions, stats, isLoading } = useSalesOpsAgent();
  const [aiHooks, setAiHooks] = useState<Record<string, string>>({});
  const [loadingHook, setLoadingHook] = useState<string | null>(null);

  const topActions = priorityActions.slice(0, 8);

  const generateHook = async (action: PriorityAction) => {
    if (loadingHook) return;
    setLoadingHook(action.id);
    try {
      const { data, error } = await supabase.functions.invoke<{ hook: string }>('klea-ai-hook', {
        body: {
          contact: { name: action.contact, company: action.company },
          type: action.type === 'ghosting' ? 'ghosting' : action.type === 'hvt' ? 'hvt' : 'hot_lead',
          context: action.metadata?.daysSilent ? { daysSilent: String(action.metadata.daysSilent) } : undefined,
        },
      });
      if (error) throw new Error(error.message);
      if (data?.hook) setAiHooks(prev => ({ ...prev, [action.id]: data.hook }));
    } catch {
      // silent — keep original hook
    } finally {
      setLoadingHook(null);
    }
  };

  const getTypeIcon = (type: PriorityAction['type']) => {
    switch (type) {
      case 'hot_lead': return Flame;
      case 'champion': return Briefcase;
      case 'ghosting': return Clock;
      case 'closed_lost': return DollarSign;
      case 'hvt': return TrendingUp;
    }
  };

  const getTypeColor = (type: PriorityAction['type']) => {
    switch (type) {
      case 'hot_lead': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'champion': return 'bg-primary/10 text-primary border-primary/20';
      case 'ghosting': return 'bg-warning/10 text-warning border-warning/20';
      case 'closed_lost': return 'bg-success/10 text-success border-success/20';
      case 'hvt': return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  const getTypeLabel = (type: PriorityAction['type']) => {
    switch (type) {
      case 'hot_lead': return 'Hot Lead';
      case 'champion': return 'Champion';
      case 'ghosting': return 'Ghosting';
      case 'closed_lost': return 'Closed Lost';
      case 'hvt': return 'HVT';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('appeler')) return Phone;
    if (action.toLowerCase().includes('email')) return Mail;
    if (action.toLowerCase().includes('linkedin')) return Linkedin;
    return ArrowRight;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-destructive" />
            Actions prioritaires du jour
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {stats.hotLeadsCount + stats.championsDetected + stats.ghostingDeals}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyse en cours…
          </div>
        ) : topActions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune action prioritaire pour le moment</p>
            <p className="text-xs mt-1">Lancez un scan pour analyser vos contacts</p>
          </div>
        ) : (
          topActions.map((action, index) => {
            const TypeIcon = getTypeIcon(action.type);
            const ActionIcon = getActionIcon(action.action);
            const displayHook = aiHooks[action.id] ?? action.hook;
            const isGenerating = loadingHook === action.id;

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getTypeColor(action.type)}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">
                        {action.contact}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getTypeColor(action.type)}`}>
                        {getTypeLabel(action.type)}
                      </Badge>
                      <span className={`text-sm font-bold ${getScoreColor(action.score)}`}>
                        {action.score}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{action.company}</span>
                      {action.amount && action.amount > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{action.amount.toLocaleString()}€</span>
                        </>
                      )}
                      {action.metadata?.daysSilent && (
                        <>
                          <span>•</span>
                          <span className="text-warning">{String(action.metadata.daysSilent)}j sans activité</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <p className={`text-xs line-clamp-2 italic flex-1 ${aiHooks[action.id] ? 'text-primary' : 'text-muted-foreground'}`}>
                        "{displayHook}"
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 shrink-0 h-7 px-2 text-xs opacity-60 hover:opacity-100"
                        onClick={() => generateHook(action)}
                        disabled={isGenerating}
                        title="Générer un hook IA personnalisé"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {aiHooks[action.id] ? 'Regénérer' : 'Hook IA'}
                      </Button>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ActionIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{action.action.split(' ')[0]}</span>
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default PriorityActions;
