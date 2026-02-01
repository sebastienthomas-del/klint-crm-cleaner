import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 animated-gradient opacity-90" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg lg:text-xl text-primary-foreground/80 mb-10">
            {t('cta.subtitle')}
          </p>
          <Link to="/auth?tab=signup">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 gap-2 text-base px-8 shadow-xl"
            >
              {t('cta.button')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
