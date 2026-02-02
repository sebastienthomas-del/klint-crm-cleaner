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
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSalesOpsAgent, type PriorityAction } from '@/hooks/useSalesOpsAgent';

const PriorityActions = () => {
  const { priorityActions, stats } = useSalesOpsAgent();
  
  const topActions = priorityActions.slice(0, 8);
  
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
        {topActions.map((action, index) => {
          const TypeIcon = getTypeIcon(action.type);
          const ActionIcon = getActionIcon(action.action);
          
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
                    {action.amount && (
                      <>
                        <span>•</span>
                        <span className="font-medium">{action.amount.toLocaleString()}€</span>
                      </>
                    )}
                    {action.metadata?.daysSilent && (
                      <>
                        <span>•</span>
                        <span className="text-warning">{action.metadata.daysSilent}j sans activité</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 italic">
                    "{action.hook}"
                  </p>
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
        })}
        
        {topActions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune action prioritaire pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriorityActions;
