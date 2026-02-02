import { motion } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle,
  Mail,
  Phone,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSalesOpsAgent } from '@/hooks/useSalesOpsAgent';

const GhostingAlerts = () => {
  const { ghostingOpportunities, stats, icpConfig } = useSalesOpsAgent();
  
  const activeGhosting = ghostingOpportunities.filter(
    opp => opp.daysSilent >= icpConfig.ghostingDays
  );
  
  const getUrgencyLevel = (days: number) => {
    if (days >= 30) return { color: 'text-destructive', bg: 'bg-destructive/10', label: 'Critique' };
    if (days >= 21) return { color: 'text-warning', bg: 'bg-warning/10', label: 'Urgent' };
    return { color: 'text-primary', bg: 'bg-primary/10', label: 'Attention' };
  };
  
  const totalAtRisk = activeGhosting.reduce((sum, opp) => sum + opp.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Deals à bumper
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {stats.ghostingDeals}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{totalAtRisk.toLocaleString()}€</span> de pipeline à risque
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeGhosting.map((opp, index) => {
          const urgency = getUrgencyLevel(opp.daysSilent);
          const decayPercent = Math.min(100, (opp.daysSilent / 45) * 100);
          
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-lg border border-border bg-card hover:border-warning/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{opp.contactName}</span>
                    <Badge variant="outline" className={`text-xs ${urgency.bg} ${urgency.color}`}>
                      {urgency.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <span>{opp.company}</span>
                    <span>•</span>
                    <span>{opp.stage}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    {opp.amount.toLocaleString()}€
                  </div>
                  <div className={`text-xs ${urgency.color}`}>
                    {opp.daysSilent}j sans activité
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Risque de perte</span>
                  <span>{Math.round(decayPercent)}%</span>
                </div>
                <Progress 
                  value={decayPercent} 
                  className="h-1.5"
                />
              </div>
              
              <div className="p-2 rounded bg-muted/50 mb-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Bump suggéré:</span> {opp.suggestedBump}
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground italic line-clamp-1 mb-2">
                "{opp.suggestedHook}"
              </p>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 flex-1">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 flex-1">
                  <Phone className="w-3.5 h-3.5" />
                  Appeler
                </Button>
                <Button size="sm" variant="ghost">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
        
        {activeGhosting.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucun deal en ghosting</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GhostingAlerts;
