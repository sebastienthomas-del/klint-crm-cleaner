import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MarketingLayout } from '@/components/layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PLAN_KEYS = ['starter', 'professional', 'enterprise'] as const;

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      key: 'starter',
      name: t('pricing.starter.name'),
      price: isYearly ? t('pricing.starter.priceYearly') : t('pricing.starter.price'),
      description: t('pricing.starter.description'),
      features: t('pricing.starter.features', { returnObjects: true }) as string[],
      cta: t('pricing.cta'),
      popular: false,
    },
    {
      key: 'professional',
      name: t('pricing.professional.name'),
      price: isYearly ? t('pricing.professional.priceYearly') : t('pricing.professional.price'),
      description: t('pricing.professional.description'),
      features: t('pricing.professional.features', { returnObjects: true }) as string[],
      cta: t('pricing.ctaTrial'),
      popular: true,
    },
    {
      key: 'enterprise',
      name: t('pricing.enterprise.name'),
      price: isYearly ? t('pricing.enterprise.priceYearly') : t('pricing.enterprise.price'),
      description: t('pricing.enterprise.description'),
      features: t('pricing.enterprise.features', { returnObjects: true }) as string[],
      cta: t('pricing.ctaContact'),
      popular: false,
    },
  ];

  const faqItems = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez passer à un plan supérieur à tout moment. La différence sera calculée au prorata. Pour rétrograder, le changement prendra effet à la prochaine période de facturation."
    },
    {
      question: "Qu'est-ce qu'un contact actif ?",
      answer: "Un contact actif est un contact dans votre CRM qui a eu au moins une interaction (email ouvert, visite web, appel) dans les 12 derniers mois. Les contacts archivés ou supprimés ne sont pas comptabilisés."
    },
    {
      question: "Y a-t-il des frais d'installation ?",
      answer: "Non, il n'y a aucun frais d'installation. La connexion à votre CRM se fait en quelques clics et l'analyse commence immédiatement."
    },
    {
      question: "Comment fonctionne l'essai gratuit ?",
      answer: "L'essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités du plan Professional. Aucune carte bancaire n'est requise pour commencer."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout, et vos données ne quittent jamais les serveurs sécurisés. Nous sommes conformes RGPD et SOC 2."
    },
  ];

  async function handleCheckout(planKey: string) {
    if (planKey === 'enterprise') {
      navigate('/contact');
      return;
    }

    if (!user) {
      navigate('/auth?tab=signup');
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
            success_url: `${window.location.origin}/app/dashboard?subscribed=true`,
            cancel_url: `${window.location.origin}/pricing`,
          }),
        }
      );

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: data.error ?? 'Erreur lors de la création de la session', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur réseau', variant: 'destructive' });
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <MarketingLayout>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
              {t('pricing.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('pricing.subtitle')}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-muted">
              <span className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${!isYearly ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                {t('pricing.monthly')}
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${isYearly ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                {t('pricing.yearly')}
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-success text-success-foreground">
                  {t('pricing.yearlyBadge')}
                </span>
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-card border rounded-2xl p-6 lg:p-8 ${
                  plan.popular
                    ? 'border-primary shadow-glow'
                    : 'border-border hover-lift'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 text-xs font-semibold rounded-full gradient-primary text-primary-foreground">
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? 'gradient-primary shadow-glow hover:shadow-glow-lg' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={loadingPlan === plan.key}
                  onClick={() => handleCheckout(plan.key)}
                >
                  {loadingPlan === plan.key ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    plan.cta
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-4">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">FAQ</span>
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold">
                Questions fréquentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-accent/50 border border-primary/20">
              <h3 className="font-display text-xl font-semibold">
                Prêt à essayer Klea ?
              </h3>
              <p className="text-muted-foreground">
                14 jours d'essai gratuit • Aucune carte bancaire requise
              </p>
              <Button
                className="gradient-primary shadow-glow hover:shadow-glow-lg gap-2"
                onClick={() => handleCheckout('professional')}
                disabled={loadingPlan === 'professional'}
              >
                {loadingPlan === 'professional' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Commencer gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Pricing;
