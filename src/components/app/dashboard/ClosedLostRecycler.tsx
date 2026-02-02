import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  TrendingUp, 
  Calendar, 
  Rocket,
  Building2,
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSalesOpsAgent } from '@/hooks/useSalesOpsAgent';

const ClosedLostRecycler = () => {
  const { closedLostDeals, stats } = useSalesOpsAgent();
  
  const dealsWithTriggers = closedLostDeals.filter(deal => deal.triggers.length > 0);
  
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'funding': return Rocket;
      case 'quarter_change': return Calendar;
      case 'growth': return TrendingUp;
      case 'new_project': return Building2;
      default: return RefreshCw;
    }
  };
  
  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'funding': return 'bg-success/10 text-success border-success/20';
      case 'quarter_change': return 'bg-primary/10 text-primary border-primary/20';
      case 'growth': return 'bg-warning/10 text-warning border-warning/20';
      case 'new_project': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'funding': return 'Levée de fonds';
      case 'quarter_change': return 'Nouveau trimestre';
      case 'growth': return 'Croissance';
      case 'new_project': return 'Nouveau projet';
      default: return 'Trigger';
    }
  };
  
  const getLostReasonLabel = (reason: string) => {
    switch (reason) {
      case 'budget': return 'Budget insuffisant';
      case 'timing': return 'Mauvais timing';
      case 'competitor': return 'Concurrent choisi';
      case 'no_decision': return 'Pas de décision';
      default: return reason;
    }
  };
  
  const getMonthsSinceLost = (lostDate: string) => {
    const lost = new Date(lostDate);
    const now = new Date();
    return Math.floor((now.getTime() - lost.getTime()) / (1000 * 60 * 60 * 24 * 30));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-success" />
            Opportunités à recycler
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {stats.closedLostWithTriggers}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {dealsWithTriggers.map((deal, index) => {
          const trigger = deal.triggers[0];
          const TriggerIcon = getTriggerIcon(trigger.type);
          const monthsAgo = getMonthsSinceLost(deal.lostDate);
          
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg border border-border bg-card hover:border-success/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{deal.contactName}</span>
                    <span className="text-muted-foreground">@</span>
                    <span className="text-muted-foreground">{deal.company}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="text-muted-foreground">{deal.dealName}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      {deal.amount.toLocaleString()}€
                    </span>
                  </div>
                </div>
                <Badge className={getTriggerColor(trigger.type)}>
                  <TriggerIcon className="w-3.5 h-3.5 mr-1" />
                  {getTriggerLabel(trigger.type)}
                </Badge>
              </div>
              
              <div className="p-2 rounded bg-success/5 border border-success/20 mb-3">
                <p className="text-sm text-success font-medium">
                  🎯 {trigger.description}
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Perdu il y a {monthsAgo} mois
                </span>
                <span>•</span>
                <span>{getLostReasonLabel(deal.lostReason)}</span>
              </div>
              
              <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
                "{deal.suggestedHook}"
              </p>
              
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5 flex-1">
                  Contacter
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="outline">
                  Ignorer
                </Button>
              </div>
            </motion.div>
          );
        })}
        
        {dealsWithTriggers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune opportunité à recycler</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosedLostRecycler;
