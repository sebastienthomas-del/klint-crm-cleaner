import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Loader2, CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription, isActive } from '@/hooks/useSubscription';

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    monthlyPrice: 89,
    yearlyPrice: 71,
    description: 'Pour les équipes qui démarrent.',
    color: 'border-border',
    features: [
      'Jusqu\'à 5 000 contacts',
      'Détection des doublons',
      'Enrichissement basique',
      'API REST incluse',
      'Support email',
    ],
  },
  {
    key: 'professional',
    name: 'Professional',
    monthlyPrice: 229,
    yearlyPrice: 183,
    description: 'Pour les équipes commerciales actives.',
    color: 'border-primary',
    popular: true,
    features: [
      'Jusqu\'à 50 000 contacts',
      'Détection + fusion automatique',
      'Enrichissement avancé',
      'Réactivation IA',
      'Connexion HubSpot',
      'API REST + webhooks',
      'Support prioritaire',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 579,
    yearlyPrice: 463,
    description: 'Pour les grandes organisations.',
    color: 'border-border',
    features: [
      'Contacts illimités',
      'Tout Professional inclus',
      'Multi-CRM (HubSpot, Salesforce…)',
      'SLA garanti 99,9%',
      'Onboarding dédié',
      'Gestionnaire de compte',
      'Facturation sur devis',
    ],
  },
];

export default function Subscription() {
  const { toast } = useToast();
  const { data: sub, isLoading: subLoading } = useSubscription();
  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlan = sub?.plan ?? null;
  const currentActive = isActive(sub);

  async function handleCheckout(planKey: string) {
    if (planKey === 'enterprise') {
      window.open('mailto:contact@klea.app?subject=Enterprise', '_blank');
      return;
    }

    setLoadingPlan(planKey);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            plan: planKey,
            billing_cycle: isYearly ? 'yearly' : 'monthly',
            success_url: `${window.location.origin}/app/subscription?subscribed=true`,
            cancel_url: `${window.location.origin}/app/subscription`,
          }),
        }
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: data.error ?? 'Erreur Stripe', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur réseau', variant: 'destructive' });
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <CreditCard className="w-7 h-7 text-primary" />
          <h1 className="font-display text-2xl font-bold">Abonnement</h1>
        </div>
        <p className="text-muted-foreground">Gérez votre plan Kléa.</p>
      </motion.div>

      {/* Current plan status */}
      {!subLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl border p-5 flex items-center gap-4 ${
            currentActive ? 'border-success/40 bg-success/5' : 'border-border bg-muted/30'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentActive ? 'bg-success/15' : 'bg-muted'}`}>
            <Zap className={`w-5 h-5 ${currentActive ? 'text-success' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="font-semibold">
              {currentActive
                ? `Plan ${sub?.plan?.charAt(0).toUpperCase() + (sub?.plan?.slice(1) ?? '')} actif`
                : 'Aucun abonnement actif'}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentActive && sub?.current_period_end
                ? `Renouvellement le ${new Date(sub.current_period_end).toLocaleDateString('fr-FR')}`
                : 'Choisissez un plan pour accéder à toutes les fonctionnalités'}
            </p>
          </div>
          {currentActive && (
            <Badge className="ml-auto bg-success/15 text-success border-success/30">Actif</Badge>
          )}
        </motion.div>
      )}

      {/* Billing toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-4"
      >
        <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Mensuel</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`relative w-12 h-6 rounded-full transition-colors ${isYearly ? 'bg-primary' : 'bg-muted'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
        <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
          Annuel
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-success/15 text-success font-semibold">-20%</span>
        </span>
      </motion.div>

      {/* Plans grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan === plan.key && currentActive;
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`relative bg-card rounded-2xl border p-6 flex flex-col ${
                plan.popular ? 'border-primary shadow-glow' : plan.color
              } ${isCurrent ? 'ring-2 ring-success ring-offset-2 ring-offset-background' : ''}`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full gradient-primary text-primary-foreground">
                    <Star className="w-3 h-3" />
                    Populaire
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-success text-white">
                    Plan actuel
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-display text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{price}€</span>
                  <span className="text-muted-foreground text-sm">/mois</span>
                </div>
                {isYearly && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Soit {price * 12}€ facturés annuellement
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular && !isCurrent ? 'gradient-primary shadow-glow' : ''}`}
                variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                disabled={isCurrent || loadingPlan === plan.key}
                onClick={() => handleCheckout(plan.key)}
              >
                {loadingPlan === plan.key ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCurrent ? (
                  'Plan actuel'
                ) : plan.key === 'enterprise' ? (
                  'Nous contacter'
                ) : (
                  'Choisir ce plan'
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Paiement sécurisé par Stripe · Résiliable à tout moment · Sans engagement
      </p>
    </div>
  );
}
