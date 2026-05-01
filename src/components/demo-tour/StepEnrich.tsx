import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { enrichmentTarget } from '@/data/demoTourData';

const fieldsToFill = ['Poste', 'LinkedIn', 'Téléphone', 'Secteur', 'Taille équipe'];

export const StepEnrich = () => {
  const [filled, setFilled] = useState<string[]>([]);

  useEffect(() => {
    const timers = fieldsToFill.map((f, i) =>
      setTimeout(() => setFilled((prev) => [...prev, f]), 600 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const allFields = Object.keys(enrichmentTarget.after);
  const filledCount = allFields.filter((f) => enrichmentTarget.before[f as keyof typeof enrichmentTarget.before] || filled.includes(f)).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">5. Enrichissement automatique</h2>
        <p className="text-muted-foreground">
          L'agent complète les champs manquants depuis nos sources de données B2B.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
          <div>
            <div className="font-display text-xl font-semibold">{enrichmentTarget.name}</div>
            <div className="text-sm text-muted-foreground">{enrichmentTarget.email}</div>
            <div className="text-sm text-muted-foreground">{enrichmentTarget.company}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Complétude</div>
            <div className="font-display text-2xl font-bold text-primary tabular-nums">
              {filledCount}/{allFields.length}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {allFields.map((field) => {
            const initialValue = enrichmentTarget.before[field as keyof typeof enrichmentTarget.before];
            const finalValue = enrichmentTarget.after[field as keyof typeof enrichmentTarget.after];
            const isJustFilled = !initialValue && filled.includes(field);
            const isVisible = initialValue || isJustFilled;

            return (
              <div key={field} className="grid grid-cols-3 gap-4 items-center py-2 border-b border-border/50 last:border-0">
                <div className="text-sm text-muted-foreground">{field}</div>
                <div className="col-span-2 flex items-center gap-2">
                  {isVisible ? (
                    <motion.div
                      initial={isJustFilled ? { opacity: 0, x: -8 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="font-medium">{finalValue}</span>
                      {isJustFilled && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1 text-xs text-success"
                        >
                          <Sparkles className="w-3 h-3" /> enrichi
                        </motion.span>
                      )}
                      {initialValue && <Check className="w-3.5 h-3.5 text-muted-foreground" />}
                    </motion.div>
                  ) : (
                    <span className="text-sm text-muted-foreground/50 italic">Non renseigné…</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
