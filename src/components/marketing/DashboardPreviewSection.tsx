import { motion } from 'framer-motion';
import { DashboardMockup } from './DashboardMockup';

export const DashboardPreviewSection = () => (
  <section className="py-16 lg:py-24 overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">Résultat</p>
        <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
          Votre dashboard, en temps réel
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Une vue complète de la santé de votre CRM, les actions prioritaires et les opportunités à saisir — tout au même endroit.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <DashboardMockup />
      </motion.div>
    </div>
  </section>
);
