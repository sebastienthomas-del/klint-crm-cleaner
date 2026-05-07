import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, RotateCcw, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { salesOpsData } from '@/data/demoTourData';

const { champion, closedLost } = salesOpsData;

const ChampionCard = () => (
  <div className="space-y-4">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3"
    >
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
      <span className="text-sm font-medium text-primary">{champion.trigger}</span>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
            {champion.initials}
          </div>
          <div>
            <div className="font-semibold">{champion.name}</div>
            <div className="text-xs text-muted-foreground">{champion.to.role} · {champion.to.company}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-0.5">Score ICP</div>
          <div className="font-display text-2xl font-bold text-success">{champion.icpScore}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 mb-4 text-sm">
        <div className="min-w-0">
          <div className="font-medium truncate">{champion.from.company}</div>
          <div className="text-xs text-muted-foreground">{champion.from.role}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-primary shrink-0" />
        <div className="min-w-0">
          <div className="font-medium text-primary truncate">{champion.to.company}</div>
          <div className="text-xs text-primary/70">{champion.to.role}</div>
        </div>
      </div>

      <div className="bg-muted/40 rounded-lg p-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          Hook suggéré par Klea
        </div>
        <p className="text-sm italic text-foreground/80 leading-relaxed">{champion.suggestedHook}</p>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-2 text-xs text-warning bg-warning/5 border border-warning/20 rounded-lg px-3 py-2"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {champion.urgency}
    </motion.div>
  </div>
);

const RecyclerCard = () => (
  <div className="space-y-4">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold">{closedLost.company}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{closedLost.contact}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-0.5">Potentiel ARR</div>
          <div className="font-display text-2xl font-bold text-success">
            €{(closedLost.potentialARR / 1_000).toFixed(0)}k
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="px-2 py-0.5 bg-muted rounded-md text-xs">
          Perdu il y a {closedLost.lostMonthsAgo} mois — {closedLost.lostReason}
        </span>
        <span className="px-2 py-0.5 bg-success/10 text-success rounded-md text-xs font-medium">
          Fit ICP : {closedLost.icpFit}
        </span>
      </div>

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Triggers détectés
      </div>
      <div className="space-y-2">
        {closedLost.triggers.map((trigger, i) => (
          <motion.div
            key={trigger}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="flex items-center gap-2 text-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
            {trigger}
          </motion.div>
        ))}
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="flex items-center justify-between bg-success/5 border border-success/25 rounded-xl p-4"
    >
      <div>
        <div className="text-sm font-semibold text-success">Opportunité à recycler maintenant</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Nouveau trimestre + croissance détectée — timing parfait
        </div>
      </div>
      <TrendingUp className="w-5 h-5 text-success shrink-0 ml-4" />
    </motion.div>
  </div>
);

export const StepSalesOps = () => {
  const [tab, setTab] = useState<'champion' | 'recycler'>('champion');

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">
          6. Sales Ops Intelligence
        </h2>
        <p className="text-muted-foreground">
          Klea détecte les opportunités invisibles dans votre CRM — avant vos concurrents.
        </p>
      </div>

      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl">
        {[
          { key: 'champion' as const, icon: Award, label: 'Champion Tracker' },
          { key: 'recycler' as const, icon: RotateCcw, label: 'Closed-Lost Recycler' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'champion' ? (
          <motion.div
            key="champion"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ChampionCard />
          </motion.div>
        ) : (
          <motion.div
            key="recycler"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RecyclerCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
