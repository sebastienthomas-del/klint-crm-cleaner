import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t('testimonials.testimonial1.quote'),
      name: t('testimonials.testimonial1.name'),
      role: t('testimonials.testimonial1.role'),
      company: t('testimonials.testimonial1.company'),
      avatar: 'SM',
    },
    {
      quote: t('testimonials.testimonial2.quote'),
      name: t('testimonials.testimonial2.name'),
      role: t('testimonials.testimonial2.role'),
      company: t('testimonials.testimonial2.company'),
      avatar: 'MD',
    },
    {
      quote: t('testimonials.testimonial3.quote'),
      name: t('testimonials.testimonial3.name'),
      role: t('testimonials.testimonial3.role'),
      company: t('testimonials.testimonial3.company'),
      avatar: 'JB',
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
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-card border border-border rounded-xl p-6 lg:p-8 hover-lift"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              
              {/* Quote Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
