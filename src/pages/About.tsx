import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Shield, Zap, Users } from 'lucide-react';
import { MarketingLayout } from '@/components/layout';

const About = () => {
  const { t } = useTranslation();

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
      description: 'Votre CRM est critique. C\'est pourquoi nous garantissons une disponibilité de 99.9% et une traçabilité complète de toutes les actions.',
    },
  ];

  const milestones = [
    { year: '2023', title: 'L\'idée', description: 'Naissance de Klint suite à notre frustration de Sales Ops face aux CRM mal entretenus.' },
    { year: '2023', title: 'MVP', description: 'Lancement de la première version avec détection de doublons et scoring basique.' },
    { year: '2024', title: '100 clients', description: 'Franchissement du cap des 100 clients actifs et levée de fonds seed.' },
    { year: '2024', title: 'V2.0', description: 'Lancement de l\'agent IA autonome avec enrichissement et réactivation automatique.' },
    { year: '2025', title: 'Expansion', description: 'Ouverture des bureaux en Europe et partenariats avec HubSpot, Pipedrive, Salesforce.' },
  ];

  const team = [
    { name: 'Marie Laurent', role: 'CEO & Co-founder', bio: 'Ex-Head of Sales Ops chez Doctolib. 10 ans d\'expérience en RevOps.', initials: 'ML' },
    { name: 'Thomas Mercier', role: 'CTO & Co-founder', bio: 'Ex-Engineering Lead chez Algolia. Spécialiste IA et data engineering.', initials: 'TM' },
    { name: 'Sophie Chen', role: 'Head of Product', bio: 'Ex-Product Manager chez Segment. Experte en outils SaaS B2B.', initials: 'SC' },
  ];

  return (
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
              À propos de <span className="gradient-text">Klint</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Nous avons créé Klint parce que nous avons vécu la frustration d'un CRM pollué. 
              En tant que Sales Ops, nous passions 15h par semaine à nettoyer des données au lieu 
              de nous concentrer sur ce qui compte : aider les équipes à vendre plus.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Notre mission
            </h2>
            <p className="text-lg text-muted-foreground">
              Libérer les équipes commerciales du travail manuel sur le CRM pour qu'elles puissent 
              se concentrer sur ce qu'elles font de mieux : créer des relations et conclure des deals.
            </p>
          </motion.div>

          {/* Values */}
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
                <h3 className="font-display text-xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
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
              L'équipe fondatrice
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une équipe passionnée par les données et l'automatisation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center hover-lift"
              >
                <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{member.initials}</span>
                </div>
                <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
              Notre histoire
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 pb-8 last:pb-0"
              >
                {/* Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-border" />
                )}
                {/* Dot */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
                {/* Content */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <span className="text-sm font-medium text-primary">{milestone.year}</span>
                  <h3 className="font-display font-semibold mt-1">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default About;
