import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trash2, UserX, Clock } from 'lucide-react';

export const ProblemSection = () => {
  const { t } = useTranslation();

  const problems = [
    {
      icon: Trash2,
      title: t('problem.card1.title'),
      description: t('problem.card1.description'),
      color: 'destructive',
    },
    {
      icon: UserX,
      title: t('problem.card2.title'),
      description: t('problem.card2.description'),
      color: 'warning',
    },
    {
      icon: Clock,
      title: t('problem.card3.title'),
      description: t('problem.card3.description'),
      color: 'secondary',
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
            {t('problem.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('problem.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card border border-border rounded-xl p-6 lg:p-8 hover-lift"
            >
              <div className={`w-14 h-14 rounded-xl bg-${problem.color}/10 flex items-center justify-center mb-6`}>
                <problem.icon className={`w-7 h-7 text-${problem.color}`} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
                {problem.description}
              </p>
              
              {/* Decorative gradient */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-${problem.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
