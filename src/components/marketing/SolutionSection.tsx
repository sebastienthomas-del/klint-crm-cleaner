import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bot, Target, ListChecks } from 'lucide-react';

export const SolutionSection = () => {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: Bot,
      title: t('solution.card1.title'),
      description: t('solution.card1.description'),
    },
    {
      icon: Target,
      title: t('solution.card2.title'),
      description: t('solution.card2.description'),
    },
    {
      icon: ListChecks,
      title: t('solution.card3.title'),
      description: t('solution.card3.description'),
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
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            {t('solution.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('solution.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-accent to-background border border-border rounded-xl p-6 lg:p-8 hover-lift"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <solution.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {solution.title}
              </h3>
              <p className="text-muted-foreground">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
