import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ScanSearch, ListChecks, ArrowRight } from 'lucide-react';

const HubSpotIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
    <path d="M18.164 7.93V5.958a1.97 1.97 0 0 0 1.136-1.778V4.14a1.97 1.97 0 0 0-1.969-1.969h-.04a1.97 1.97 0 0 0-1.969 1.969v.04c0 .8.476 1.49 1.137 1.778V7.93a5.578 5.578 0 0 0-2.656 1.169L6.513 4.297a2.312 2.312 0 1 0-.964.862l7.081 4.74a5.578 5.578 0 0 0-.822 2.913 5.578 5.578 0 0 0 .862 3.006L10.516 17c-.19-.06-.39-.095-.601-.095a1.97 1.97 0 0 0-1.969 1.969v.04a1.97 1.97 0 0 0 1.969 1.969h.04a1.97 1.97 0 0 0 1.969-1.969v-.04a1.969 1.969 0 0 0-.242-.944l2.15-1.168a5.623 5.623 0 0 0 3.336 1.093 5.634 5.634 0 0 0 5.634-5.634 5.634 5.634 0 0 0-4.638-5.291zm-.978 8.483a3.183 3.183 0 1 1 0-6.366 3.183 3.183 0 0 1 0 6.366z" />
  </svg>
);

const steps = [
  { customIcon: HubSpotIcon, lucideIcon: null },
  { customIcon: null, lucideIcon: ScanSearch },
  { customIcon: null, lucideIcon: ListChecks },
];

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  const stepsWithText = steps.map((s, i) => ({
    ...s,
    title: t(`howItWorks.step${i + 1}.title`),
    description: t(`howItWorks.step${i + 1}.description`),
  }));


  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-accent/40 to-primary/10 border border-primary/15 text-xs font-semibold uppercase tracking-wider text-primary">
            {t('howItWorks.eyebrow')}
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4 mt-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-0">
          {stepsWithText.map((step, index) => (
            <>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex-1 text-center px-4 lg:px-8"
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute w-24 h-24 rounded-full bg-primary/10 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                    {step.customIcon ? <step.customIcon /> : step.lucideIcon && <step.lucideIcon className="w-8 h-8 text-primary-foreground" />}
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>

              {index < stepsWithText.length - 1 && (
                <div className="hidden lg:flex items-start justify-center pt-10 shrink-0">
                  <ArrowRight className="w-6 h-6 text-primary/40" />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
};
