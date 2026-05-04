import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Pickaxe, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STEPS = [
  { id: 'welcome', title: 'Bienvenue sur Kléa', subtitle: 'Votre CRM va enfin respirer.' },
  { id: 'plan', title: 'Votre abonnement', subtitle: 'Choisissez le plan qui vous correspond.' },
  { id: 'hubspot', title: 'Connectez HubSpot', subtitle: "L'IA commence à travailler dès la connexion." },
  { id: 'done', title: 'Tout est prêt !', subtitle: 'Votre premier scan démarre automatiquement.' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  async function connectHubspot() {
    setConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hubspot-oauth-start`,
        { headers: { 'Authorization': `Bearer ${session?.access_token}` } }
      );
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast({ title: data.error ?? 'Erreur', variant: 'destructive' });
    } catch {
      toast({ title: 'Erreur réseau', variant: 'destructive' });
    } finally {
      setConnecting(false);
    }
  }

  function next() {
    if (isLast) {
      navigate('/app/dashboard');
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Pickaxe className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">Kléa</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i < step ? 'bg-success text-white' :
                i === step ? 'gradient-primary text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 transition-all ${i < step ? 'bg-success' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-lg"
          >
            <h1 className="font-display text-2xl font-bold mb-1">{current.title}</h1>
            <p className="text-muted-foreground mb-8">{current.subtitle}</p>

            {/* Step content */}
            {step === 0 && (
              <div className="space-y-4">
                {[
                  'Détection automatique des doublons dans votre CRM',
                  'Enrichissement des contacts manquants',
                  'Réactivation des contacts dormants',
                  "Score de santé CRM mis à jour en temps réel",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span className="text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous pouvez choisir votre abonnement maintenant ou le faire plus tard depuis la page Tarifs.
                </p>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate('/pricing')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir les tarifs
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Essai gratuit 14 jours inclus — aucune carte requise
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connectez votre compte HubSpot en un clic. Kléa importera vos contacts et lancera le premier scan de doublons automatiquement.
                </p>
                <Button
                  className="w-full gradient-primary shadow-glow gap-2"
                  onClick={connectHubspot}
                  disabled={connecting}
                >
                  {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                  Connecter HubSpot
                </Button>
                <Button variant="ghost" className="w-full text-muted-foreground" onClick={next}>
                  Passer cette étape
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
                    <Check className="w-10 h-10 text-success" />
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Kléa analyse votre CRM en arrière-plan. Les premiers résultats apparaîtront dans votre tableau de bord dans quelques minutes.
                </p>
              </div>
            )}

            {/* Navigation */}
            {step !== 2 && (
              <Button className="w-full mt-8 gradient-primary gap-2" onClick={next}>
                {isLast ? 'Accéder au tableau de bord' : 'Continuer'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
