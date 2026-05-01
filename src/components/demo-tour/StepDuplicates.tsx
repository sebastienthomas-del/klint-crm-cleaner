import { motion } from 'framer-motion';
import { Copy, Mail, Phone, Building2 } from 'lucide-react';
import { duplicateGroups } from '@/data/demoTourData';

const iconFor = (matchType: string) => {
  if (matchType.toLowerCase().includes('email')) return Mail;
  if (matchType.toLowerCase().includes('télé')) return Phone;
  return Building2;
};

export const StepDuplicates = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">3. Détection des doublons</h2>
        <p className="text-muted-foreground">
          Matching multi-critères : email exact, téléphone normalisé, similarité nom + société.
        </p>
      </div>

      <div className="space-y-4">
        {duplicateGroups.map((g, i) => {
          const Icon = iconFor(g.matchType);
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Match : {g.matchType}</div>
                    <div className="text-xs text-muted-foreground">{g.contacts.length} contacts identifiés</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">Confiance</div>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    g.confidence >= 95 ? 'bg-success/15 text-success' :
                    g.confidence >= 85 ? 'bg-primary/15 text-primary' :
                    'bg-warning/15 text-warning'
                  }`}>
                    {g.confidence}%
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {g.contacts.map((c, ci) => (
                  <div key={ci} className="bg-background border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                    <div className="text-xs text-muted-foreground">{c.company}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1">{c.source}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
