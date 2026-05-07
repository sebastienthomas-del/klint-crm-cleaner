import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, GitMerge, Sparkles, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { demoStats } from '@/data/demoTourData';

const kpis = [
  { icon: TrendingUp, label: 'Score qualité', value: `${demoStats.finalScore}/100`, delta: `+${demoStats.finalScore - demoStats.initialScore} pts`, color: 'text-success' },
  { icon: GitMerge, label: 'Doublons fusionnés', value: demoStats.duplicatesMerged.toLocaleString('fr-FR'), delta: 'auto-merge', color: 'text-primary' },
  { icon: Sparkles, label: 'Contacts enrichis', value: demoStats.contactsEnriched.toLocaleString('fr-FR'), delta: '+5 champs/contact', color: 'text-primary' },
  { icon: Activity, label: 'Pipeline débloqué', value: `+€${(demoStats.pipelineUnlocked / 1000).toFixed(0)}k`, delta: 'leads réactivés', color: 'text-success' },
];

export const StepResults = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">Mission accomplie</span>
        </motion.div>
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">7. Résultats après 7 jours</h2>
        <p className="text-muted-foreground">
          Voici ce que l'agent Kléa a accompli sur votre base, en autonomie.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <k.icon className={`w-5 h-5 mb-3 ${k.color}`} />
            <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
            <div className="font-display text-2xl font-bold tabular-nums">{k.value}</div>
            <div className={`text-xs mt-1 ${k.color}`}>{k.delta}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card border border-border rounded-2xl p-8 text-center"
      >
        <h3 className="font-display text-2xl font-bold mb-3">Prêt à activer Kléa sur votre base ?</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Essai gratuit 14 jours, sans carte bancaire. Premier audit flash offert.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/demo">
            <Button size="lg" className="gradient-primary shadow-glow gap-2">
              Activer mon essai gratuit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
