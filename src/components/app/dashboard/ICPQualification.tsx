import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Building2,
  User,
  DollarSign,
  Calendar,
  ArrowRight,
  Star,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSalesOpsAgent, type HighValueTarget } from '@/hooks/useSalesOpsAgent';

const ICPQualification = () => {
  const { highValueTargets, icpConfig, stats, isLoading } = useSalesOpsAgent();
  const [aiHooks, setAiHooks] = useState<Record<string, string>>({});
  const [loadingHook, setLoadingHook] = useState<string | null>(null);

  const generateHook = async (hvt: HighValueTarget) => {
    if (loadingHook) return;
    setLoadingHook(hvt.id);
    try {
      const { data, error } = await supabase.functions.invoke<{ hook: string }>('klea-ai-hook', {
        body: {
          contact: {
            name: `${hvt.firstName} ${hvt.lastName}`,
            position: hvt.position,
            company: hvt.company,
          },
          type: 'hvt',
        },
      });
      if (error) throw new Error(error.message);
      if (data?.hook) setAiHooks(prev => ({ ...prev, [hvt.id]: data.hook }));
    } catch {
      // silent
    } finally {
      setLoadingHook(null);
    }
  };

  const formatInactivePeriod = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const months = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${months} mois`;
  };

  const getICPScoreColor = (score: number) => {
    if (score >= 95) return 'text-success';
    if (score >= 80) return 'text-primary';
    return 'text-warning';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            High Value Targets
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {stats.highValueTargets}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant="secondary" className="text-xs">
            {icpConfig.sectors.slice(0, 3).join(', ')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {icpConfig.companySizes[0]}+ emp
          </Badge>
          <Badge variant="secondary" className="text-xs">
            C-Level / VP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyse en cours…
          </div>
        ) : highValueTargets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucun High Value Target identifié</p>
            <p className="text-xs mt-1">Les contacts ICP inactifs depuis +90j apparaîtront ici</p>
          </div>
        ) : (
          highValueTargets.map((hvt, index) => {
            const displayHook = aiHooks[hvt.id] ?? hvt.suggestedHook;
            const isGenerating = loadingHook === hvt.id;

            return (
              <motion.div
                key={hvt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {hvt.firstName} {hvt.lastName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                          <span className={`text-sm font-bold ${getICPScoreColor(hvt.icpScore)}`}>
                            {hvt.icpScore}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{hvt.position}</span>
                        {hvt.company && <><span>@</span><span>{hvt.company}</span></>}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={hvt.icpFit === 'perfect'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-primary/10 text-primary border-primary/20'}
                  >
                    {hvt.icpFit === 'perfect' ? 'Match parfait' : 'Bon match'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {hvt.sector && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <Building2 className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">{hvt.sector}</p>
                      <p className="text-xs font-medium">{hvt.companySize || '—'}</p>
                    </div>
                  )}
                  <div className="p-2 rounded bg-muted/50 text-center">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Inactif depuis</p>
                    <p className="text-xs font-medium">{formatInactivePeriod(hvt.inactiveSince)}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50 text-center">
                    <DollarSign className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Potentiel ARR</p>
                    <p className="text-xs font-medium text-success">{(hvt.potentialARR / 1000).toFixed(0)}K€</p>
                  </div>
                </div>

                <div className="p-2 rounded bg-primary/5 border border-primary/20 mb-3">
                  <p className="text-xs text-primary">
                    <span className="font-medium">Pourquoi HVT :</span> {hvt.whyHVT}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <p className={`text-xs line-clamp-2 italic flex-1 ${aiHooks[hvt.id] ? 'text-primary' : 'text-muted-foreground'}`}>
                    "{displayHook}"
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 shrink-0 h-7 px-2 text-xs opacity-60 hover:opacity-100"
                    onClick={() => generateHook(hvt)}
                    disabled={isGenerating}
                    title="Générer un hook IA personnalisé"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {aiHooks[hvt.id] ? 'Regénérer' : 'Hook IA'}
                  </Button>
                </div>

                <Button size="sm" className="w-full gap-1.5" asChild>
                  {hvt.email ? (
                    <a href={`mailto:${hvt.email}`}>
                      <TrendingUp className="w-4 h-4" />
                      Réactiver ce contact
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span>
                      <TrendingUp className="w-4 h-4" />
                      Réactiver ce contact
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ICPQualification;
