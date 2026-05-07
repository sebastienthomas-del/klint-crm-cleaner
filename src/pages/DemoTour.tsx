import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { Broom } from '@phosphor-icons/react';
import { TourProgress } from '@/components/demo-tour/TourProgress';
import { StepConnect } from '@/components/demo-tour/StepConnect';
import { StepAudit } from '@/components/demo-tour/StepAudit';
import { StepDuplicates } from '@/components/demo-tour/StepDuplicates';
import { StepMerge } from '@/components/demo-tour/StepMerge';
import { StepEnrich } from '@/components/demo-tour/StepEnrich';
import { StepSalesOps } from '@/components/demo-tour/StepSalesOps';
import { StepResults } from '@/components/demo-tour/StepResults';

const STEPS = [
  { label: 'Connexion HubSpot', component: StepConnect, duration: 4000 },
  { label: 'Audit Flash', component: StepAudit, duration: 5000 },
  { label: 'Détection doublons', component: StepDuplicates, duration: 5500 },
  { label: 'Auto-merge', component: StepMerge, duration: 4500 },
  { label: 'Enrichissement', component: StepEnrich, duration: 5500 },
  { label: 'Sales Ops Intelligence', component: StepSalesOps, duration: 7000 },
  { label: 'Résultats', component: StepResults, duration: 99999 },
];

const DemoTour = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEPS[step].duration);
    return () => clearTimeout(t);
  }, [step, playing, runId]);

  const Current = STEPS[step].component;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
              <Broom weight="bold" className="w-4 h-4" />
            </div>
            <span className="font-display font-semibold">Kléa</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">— Démo produit guidée</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/demo" className="hidden sm:block">
              <Button size="sm" className="gradient-primary gap-1">
                Activer mon essai <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link to="/" aria-label="Quitter la démo">
              <Button size="sm" variant="ghost"><X className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Stage */}
      <main className="flex-1 container mx-auto px-4 py-10 lg:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${runId}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom controls */}
      <footer className="sticky bottom-0 z-30 backdrop-blur-md bg-background/80 border-t border-border py-4 px-4">
        <TourProgress
          step={step}
          total={STEPS.length}
          playing={playing}
          labels={STEPS.map((s) => s.label)}
          onPrev={() => setStep((s) => Math.max(0, s - 1))}
          onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          onTogglePlay={() => setPlaying((p) => !p)}
          onReplay={() => { setStep(0); setPlaying(true); setRunId((r) => r + 1); }}
        />
      </footer>
    </div>
  );
};

export default DemoTour;
