import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const PricingPreviewSection = () => {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: t('pricing.starter.name'),
      price: isYearly ? t('pricing.starter.priceYearly') : t('pricing.starter.price'),
      description: t('pricing.starter.description'),
      features: (t('pricing.starter.features', { returnObjects: true }) as string[]).slice(0, 4),
      cta: t('pricing.cta'),
      popular: false,
      pricePrefix: '',
      priceNote: '',
    },
    {
      name: t('pricing.professional.name'),
      price: isYearly ? t('pricing.professional.priceYearly') : t('pricing.professional.price'),
      description: t('pricing.professional.description'),
      features: (t('pricing.professional.features', { returnObjects: true }) as string[]).slice(0, 5),
      cta: t('pricing.ctaTrial'),
      popular: true,
      pricePrefix: '',
      priceNote: '',
    },
    {
      name: t('pricing.enterprise.name'),
      price: t('pricing.enterprise.priceYearly'),
      description: t('pricing.enterprise.description'),
      features: (t('pricing.enterprise.features', { returnObjects: true }) as string[]).slice(0, 4),
      cta: t('pricing.ctaContact'),
      popular: false,
      pricePrefix: 'À partir de',
      priceNote: '· sur devis',
    },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
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

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-card border rounded-2xl p-6 lg:p-8 ${
                plan.popular 
                  ? 'border-primary shadow-glow' 
                  : 'border-border hover-lift'
              }`}
            >
              {/* Popular Badge */}
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
                <div className="flex flex-col items-center gap-1">
                  {plan.pricePrefix && (
                    <span className="text-xs text-muted-foreground">{plan.pricePrefix}</span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                  </div>
                  {plan.priceNote && (
                    <span className="text-xs text-muted-foreground">{plan.priceNote}</span>
                  )}
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

              <Link to={index === 2 ? '/contact' : '/auth?tab=signup'}>
                <Button 
                  className={`w-full ${plan.popular ? 'gradient-primary shadow-glow hover:shadow-glow-lg' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/pricing" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {t('pricing.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
