import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export const StepConnect = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="font-display text-3xl lg:text-4xl font-bold mb-3">1. Connexion à HubSpot</h2>
      <p className="text-muted-foreground mb-10">
        OAuth sécurisé en un clic. Aucun mot de passe stocké, scopes minimaux.
      </p>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-display text-2xl font-bold text-primary">
            K
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: phase >= 1 ? 80 : 0 }}
            transition={{ duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-primary to-[#FF7A59] rounded-full"
          />
          <div className="w-20 h-20 rounded-2xl bg-[#FF7A59]/10 border border-[#FF7A59]/20 flex items-center justify-center font-display text-2xl font-bold text-[#FF7A59]">
            HS
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          {phase < 2 ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-muted-foreground">
                {phase === 0 ? 'Initialisation OAuth…' : 'Échange du token…'}
              </span>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="font-medium text-success">Connexion établie — 12 847 contacts détectés</span>
            </motion.div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5" />
          Chiffrement AES-256 · Conforme RGPD · Révocable à tout moment
        </div>
      </div>
    </div>
  );
};
