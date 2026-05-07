import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CONTACT_EMAIL = 'monsieurpipeline@transitionseocrm.fr';

export const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Klea vient de naître.
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            Le programme est en phase de lancement — tu es parmi les premiers à le découvrir.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Tu veux en faire partie ?
          </p>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Je veux tester Klea`}>
            <Button className="gradient-primary shadow-glow hover:shadow-glow-lg px-8">
              Nous contacter
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
