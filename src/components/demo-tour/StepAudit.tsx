import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, Activity } from 'lucide-react';
import { auditFindings, demoStats } from '@/data/demoTourData';

export const StepAudit = () => {
  const [scanned, setScanned] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const target = demoStats.totalContacts;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1800, 1);
      setScanned(Math.floor(t * target));
      setScore(Math.floor(t * demoStats.initialScore));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">2. Audit Flash de la base</h2>
        <p className="text-muted-foreground">
          L'agent IA scanne silencieusement votre CRM et établit un diagnostic en moins de 60 secondes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Activity className="w-4 h-4" /> Contacts scannés
          </div>
          <div className="font-display text-4xl font-bold tabular-nums">
            {scanned.toLocaleString('fr-FR')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            sur {demoStats.totalContacts.toLocaleString('fr-FR')} contacts
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            Score qualité initial
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-warning tabular-nums">{score}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              className="h-full bg-warning rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 text-sm font-medium mb-4">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Anomalies détectées
        </div>
        <div className="space-y-3">
          {auditFindings.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{f.label}</span>
              <span className={`font-semibold tabular-nums ${f.severity === 'error' ? 'text-destructive' : 'text-warning'}`}>
                {f.value.toLocaleString('fr-FR')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
