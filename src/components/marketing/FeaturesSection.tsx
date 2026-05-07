import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Activity, Users, Target, RefreshCw, Award, RotateCcw } from 'lucide-react';

export const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Activity,   key: 'health' },
    { icon: Users,      key: 'duplicates' },
    { icon: Target,     key: 'scoring' },
    { icon: RefreshCw,  key: 'reactivation' },
    { icon: Award,      key: 'champion' },
    { icon: RotateCcw,  key: 'recycler' },
  ].map(({ icon, key }) => ({
    icon,
    title: t(`features.${key}.title`),
    description: t(`features.${key}.description`),
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
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-border rounded-xl p-6 hover-lift"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
