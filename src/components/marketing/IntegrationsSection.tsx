import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const IntegrationsSection = () => {
  const { t } = useTranslation();

  const integrations = [
    {
      name: 'HubSpot',
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
                <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: '#FF7A59' }}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-11 h-11">
                    <path d="M18.164 7.93V5.958a1.97 1.97 0 0 0 1.136-1.778V4.14a1.97 1.97 0 0 0-1.969-1.969h-.04a1.97 1.97 0 0 0-1.969 1.969v.04c0 .8.476 1.49 1.137 1.778V7.93a5.578 5.578 0 0 0-2.656 1.169L6.513 4.297a2.312 2.312 0 1 0-.964.862l7.081 4.74a5.578 5.578 0 0 0-.822 2.913 5.578 5.578 0 0 0 .862 3.006L10.516 17c-.19-.06-.39-.095-.601-.095a1.97 1.97 0 0 0-1.969 1.969v.04a1.97 1.97 0 0 0 1.969 1.969h.04a1.97 1.97 0 0 0 1.969-1.969v-.04a1.969 1.969 0 0 0-.242-.944l2.15-1.168a5.623 5.623 0 0 0 3.336 1.093 5.634 5.634 0 0 0 5.634-5.634 5.634 5.634 0 0 0-4.638-5.291zm-.978 8.483a3.183 3.183 0 1 1 0-6.366 3.183 3.183 0 0 1 0 6.366z" />
                  </svg>
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
