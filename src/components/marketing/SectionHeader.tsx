import { motion } from 'framer-motion';

interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export const SectionHeader = ({ id, eyebrow, title, description }: SectionHeaderProps) => {
  return (
    <section id={id} className="pt-20 lg:pt-28 -mb-8 lg:-mb-12 scroll-mt-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-accent/40 to-primary/10 border border-primary/15 text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold mt-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground mt-4">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
