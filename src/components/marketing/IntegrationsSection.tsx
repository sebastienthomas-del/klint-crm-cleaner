import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const IntegrationsSection = () => {
  const { t } = useTranslation();

  const integrations = [
    {
      name: 'HubSpot',
      logo: 'H',
      color: 'from-orange-500 to-orange-600',
    },
    {
      name: 'Pipedrive',
      logo: 'P',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Salesforce',
      logo: 'S',
      color: 'from-blue-500 to-blue-600',
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
            {t('integrations.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('integrations.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-card border border-border rounded-2xl p-8 lg:p-10 hover-lift text-center">
                {/* Logo */}
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${integration.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <span className="text-3xl font-bold text-white">{integration.logo}</span>
                </div>
                
                {/* Name */}
                <h3 className="font-display text-xl font-semibold mb-3">
                  {integration.name}
                </h3>
                
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-sm">
                  <Check className="w-3.5 h-3.5" />
                  {t('integrations.badge')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
