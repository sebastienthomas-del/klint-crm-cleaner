import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const ROISection = () => {
  const { t } = useTranslation();

  const stats = [
    { value: t('roi.stat1.value'), label: t('roi.stat1.label') },
    { value: t('roi.stat2.value'), label: t('roi.stat2.label') },
    { value: t('roi.stat3.value'), label: t('roi.stat3.label') },
    { value: t('roi.stat4.value'), label: t('roi.stat4.label') },
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            {t('roi.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('roi.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-card border border-border rounded-xl p-6 lg:p-8 text-center group hover-lift"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="font-display text-4xl lg:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
