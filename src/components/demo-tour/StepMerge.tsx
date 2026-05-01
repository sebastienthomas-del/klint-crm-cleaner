import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, GitMerge, Sparkles } from 'lucide-react';

export const StepMerge = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">4. Auto-merge intelligent</h2>
        <p className="text-muted-foreground">
          Les doublons à confiance &gt; 95% sont fusionnés automatiquement, en conservant la donnée la plus fraîche.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <AnimatePresence mode="wait">
          {phase < 2 ? (
            <motion.div
              key="before"
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 gap-4 relative"
            >
              {[
                { name: 'Marie Dubois', email: 'marie.dubois@acme.com', company: 'Acme Corp', updated: 'Il y a 2 mois' },
                { name: 'M. Dubois', email: 'marie.dubois@acme.com', company: 'Acme', updated: 'Il y a 1 semaine' },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  animate={phase === 1 ? { x: i === 0 ? 40 : -40, opacity: 0.6 } : {}}
                  className="bg-background border border-border rounded-lg p-4"
                >
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                  <div className="text-xs text-muted-foreground">{c.company}</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-2">MAJ : {c.updated}</div>
                </motion.div>
              ))}
              {phase === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    <GitMerge className="w-6 h-6" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-success/5 border border-success/30 rounded-lg p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-semibold text-success">Fusion réussie</span>
                <Sparkles className="w-4 h-4 text-success ml-auto" />
              </div>
              <div className="text-base font-medium">Marie Dubois</div>
              <div className="text-sm text-muted-foreground">marie.dubois@acme.com · Acme Corp</div>
              <div className="text-xs text-muted-foreground mt-2">Données les plus récentes conservées · Historique préservé</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Timeline agent</div>
        <div className="space-y-2 text-sm">
          <TimelineItem text="Doublons détectés (3 groupes)" visible={true} />
          <TimelineItem text="Match Marie Dubois → confiance 100%" visible={phase >= 1} />
          <TimelineItem text="Fusion HubSpot exécutée (PATCH /contacts/merge)" visible={phase >= 2} success />
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ text, visible, success }: { text: string; visible: boolean; success?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: visible ? 1 : 0.3, x: 0 }}
    className="flex items-center gap-2"
  >
    <div className={`w-1.5 h-1.5 rounded-full ${success ? 'bg-success' : 'bg-primary'}`} />
    <span className={success ? 'text-success font-medium' : 'text-muted-foreground'}>{text}</span>
  </motion.div>
);
