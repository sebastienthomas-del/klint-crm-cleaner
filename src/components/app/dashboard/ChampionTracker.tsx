import { motion } from 'framer-motion';
import {
  Briefcase,
  ArrowRight,
  Building2,
  ExternalLink,
  Linkedin,
  Mail,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSalesOpsAgent } from '@/hooks/useSalesOpsAgent';

const ChampionTracker = () => {
  const { championMoves, stats, isLoading } = useSalesOpsAgent();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Champions détectés
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {stats.championsDetected}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Anciens utilisateurs qui ont changé d'entreprise
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyse en cours…
          </div>
        ) : championMoves.length > 0 ? (
          championMoves.map((champion, index) => (
            <motion.div
              key={champion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold">
                    {champion.firstName[0]}{champion.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {champion.firstName} {champion.lastName}
                    </span>
                    {champion.linkedInUrl && (
                      <a
                        href={champion.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="line-through opacity-60">{champion.previousCompany}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="font-medium text-primary">{champion.newCompany}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{champion.newPosition}</span>
                    <span>•</span>
                    <span>Détecté le {formatDate(champion.detectedAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic line-clamp-2 mb-3">
                    "{champion.suggestedHook}"
                  </p>
                  <div className="flex items-center gap-2">
                    {champion.linkedInUrl && (
                      <Button size="sm" variant="outline" className="gap-1.5" asChild>
                        <a href={champion.linkedInUrl} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-3.5 h-3.5" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {champion.email && (
                      <Button size="sm" variant="outline" className="gap-1.5" asChild>
                        <a href={`mailto:${champion.email}`}>
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-primary opacity-60" />
            </div>
            <div>
              <p className="font-medium text-foreground">Détection en cours de développement</p>
              <p className="text-sm mt-1 max-w-xs mx-auto">
                La détection de champions nécessite la synchronisation des deals HubSpot — disponible prochainement.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">Bientôt disponible</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChampionTracker;
