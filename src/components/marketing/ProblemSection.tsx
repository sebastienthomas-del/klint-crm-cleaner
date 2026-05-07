import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trash2, UserX, Clock } from 'lucide-react';

const problems = [
  { icon: Trash2, key: 'card1', stat: '1/5',  accent: 'border-l-destructive', statColor: 'text-destructive', iconColor: 'text-destructive' },
  { icon: UserX,  key: 'card2', stat: '∞',    accent: 'border-l-warning',     statColor: 'text-warning',     iconColor: 'text-warning' },
  { icon: Clock,  key: 'card3', stat: '−15h', accent: 'border-l-secondary',   statColor: 'text-secondary',   iconColor: 'text-secondary' },
];

export const ProblemSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 lg:py-32 bg-muted/40">
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
              className={`relative bg-card border border-border border-l-4 ${problem.accent} rounded-xl p-6 lg:p-8 hover-lift`}
            >
              <div className={`font-display text-5xl font-bold mb-3 ${problem.statColor}`}>
                {problem.stat}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <problem.icon className={`w-5 h-5 ${problem.iconColor}`} />
                <h3 className="font-display text-xl font-semibold">
                  {t(`problem.${problem.key}.title`)}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {t(`problem.${problem.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
