import { motion } from 'framer-motion';
import { Target, Shield, Zap } from 'lucide-react';
import { MarketingLayout } from '@/components/layout';

const values = [
  {
    icon: Zap,
    title: 'Efficacité',
    description: 'Nous croyons que la technologie doit simplifier la vie, pas la compliquer. Chaque fonctionnalité est conçue pour maximiser votre productivité.',
  },
  {
    icon: Shield,
    title: 'Transparence',
    description: 'Pas de boîte noire. Vous savez exactement ce que fait l\'IA, pourquoi elle le fait, et vous gardez le contrôle à tout moment.',
  },
  {
    icon: Target,
    title: 'Fiabilité',
    description: 'Votre CRM est critique. C\'est pourquoi nous garantissons une disponibilité de 99.9 % et une traçabilité complète de toutes les actions.',
  },
];

const About = () => (
  <MarketingLayout>
    {/* Hero */}
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
            À propos de <span className="gradient-text">Kléa</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Kléa existe pour une bonne raison : transformer la qualité des données en levier de croissance.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Origin Story */}
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-10 text-center">Notre histoire</h2>
            <div className="bg-card border border-border rounded-xl p-8 lg:p-10">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Mai 2026
              </span>
              <p className="text-muted-foreground leading-relaxed mt-5">
                Kléa est née début 2026, d'une conversation qui a pointé du doigt un problème trop souvent
                ignoré : la qualité des données. Je suis convaincue que des données propres ne sont pas un
                détail technique, ce sont le moteur réel de la croissance des entreprises.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                C'est cette conviction qui m'a poussée à créer Kléa, un programme dédié au data cleaning
                qui s'appuie sur l'IA pour maintenir votre CRM propre, complet et exploitable, automatiquement
                et continuellement.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Mission & Values */}
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">Notre mission</h2>
          <p className="text-lg text-muted-foreground">
            Avec Klea, nous voulons libérer les équipes sales du travail manuel sur le CRM pour qu'elles
            puissent se concentrer sur ce qu'elles font de mieux : créer des relations et conclure des deals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 lg:p-8 text-center hover-lift"
            >
              <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-glow">
                <value.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">L'équipe</h2>
        </motion.div>

        <div className="max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-8 text-center hover-lift"
          >
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-foreground">NG</span>
            </div>
            <h3 className="font-display text-lg font-semibold">Nolwenn Grivet</h3>
            <p className="text-sm text-primary mb-3">CEO & Fondatrice</p>
            <p className="text-sm text-muted-foreground">
              Convaincue que la donnée propre est le vrai levier de croissance, j'ai fondé Kléa en mai
              2026 pour optimiser la qualité des données. Car personne ne veut le faire, mais le nettoyage
              de données est essentiel et reste un angle mort pour beaucoup d'entreprises.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default About;
