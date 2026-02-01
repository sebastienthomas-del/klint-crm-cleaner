import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketingLayout } from '@/components/layout';
import { 
  Activity, 
  Users, 
  Sparkles, 
  Target, 
  RefreshCw, 
  History,
  Bot,
  AlertCircle,
  BarChart3,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();

  const featureCategories = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      features: [
        {
          icon: Activity,
          title: 'Dashboard santé CRM',
          description: 'Visualisez l\'état de votre base en un coup d\'œil avec un score de santé global. Identifiez immédiatement les problèmes critiques et les opportunités d\'amélioration.',
          benefit: '+40% de visibilité sur la qualité des données',
        },
        {
          icon: Bot,
          title: 'Agent IA autonome',
          description: 'Notre IA travaille 24/7 pour maintenir votre CRM propre. Elle scanne, détecte et corrige automatiquement les problèmes de données.',
          benefit: '15h économisées par semaine',
        },
        {
          icon: AlertCircle,
          title: 'Alertes intelligentes',
          description: 'Recevez des notifications en temps réel pour les problèmes critiques : emails bounced, leads chauds, opportunités dormantes.',
          benefit: 'Temps de réaction divisé par 3',
        },
      ],
    },
    {
      id: 'cleaning',
      label: 'Nettoyage',
      features: [
        {
          icon: Users,
          title: 'Détection de doublons',
          description: 'L\'IA identifie les contacts en double avec une précision de 98%. Elle propose des fusions intelligentes en préservant les données les plus récentes.',
          benefit: '98% de précision dans la détection',
        },
        {
          icon: Clock,
          title: 'Contacts obsolètes',
          description: 'Détectez automatiquement les contacts qui ont changé de poste, quitté leur entreprise, ou dont les informations sont périmées.',
          benefit: '-30% de contacts obsolètes',
        },
        {
          icon: Shield,
          title: 'Validation temps réel',
          description: 'Vérifiez la validité des emails, téléphones et adresses en temps réel. Évitez les bounces et les données invalides.',
          benefit: '99% d\'emails valides',
        },
      ],
    },
    {
      id: 'enrichment',
      label: 'Enrichissement',
      features: [
        {
          icon: Sparkles,
          title: 'Enrichissement automatique',
          description: 'Complétez automatiquement les données manquantes : secteur d\'activité, taille d\'entreprise, LinkedIn, fonction exacte.',
          benefit: '+60% de complétude des données',
        },
        {
          icon: BarChart3,
          title: 'Données firmographiques',
          description: 'Enrichissez vos comptes avec des données entreprise : CA, effectif, croissance, technos utilisées, actualités.',
          benefit: 'Accès à 100+ champs entreprise',
        },
        {
          icon: Zap,
          title: 'APIs intégrées',
          description: 'Connexion native avec Clearbit, Hunter.io, LinkedIn et autres sources de données pour un enrichissement de qualité.',
          benefit: 'Sources de données premium',
        },
      ],
    },
    {
      id: 'scoring',
      label: 'Scoring',
      features: [
        {
          icon: Target,
          title: 'Lead scoring intelligent',
          description: 'Chaque contact reçoit un score 0-100 basé sur son fit avec votre ICP et son niveau d\'engagement. Priorisez les leads les plus prometteurs.',
          benefit: '+2x taux de conversion',
        },
        {
          icon: RefreshCw,
          title: 'Scoring de réactivation',
          description: 'Identifiez les contacts dormants avec le meilleur potentiel de réengagement. Optimisez vos campagnes de réactivation.',
          benefit: '30% de leads réactivés',
        },
        {
          icon: Activity,
          title: 'Scoring dynamique',
          description: 'Les scores se mettent à jour en temps réel selon les interactions : ouvertures email, visites site, activité LinkedIn.',
          benefit: 'Scores toujours à jour',
        },
      ],
    },
    {
      id: 'automations',
      label: 'Automatisations',
      features: [
        {
          icon: Bot,
          title: 'Règles personnalisées',
          description: 'Créez vos propres règles d\'automatisation : nettoyage quotidien, enrichissement à l\'import, alertes sur conditions.',
          benefit: 'Automatisations illimitées',
        },
        {
          icon: RefreshCw,
          title: 'Workflows intelligents',
          description: 'Déclenchez des actions automatiques selon les événements : nouveau lead, deal stagnant, contact inactif.',
          benefit: 'Zéro tâche manuelle',
        },
        {
          icon: History,
          title: 'Traçabilité complète',
          description: 'Historique complet de toutes les modifications avec possibilité de rollback. Conformité RGPD garantie.',
          benefit: 'Audit trail complet',
        },
      ],
    },
  ];

  return (
    <MarketingLayout>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
              {t('features.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full flex-wrap justify-center mb-12 bg-muted/50 p-1 rounded-xl">
              {featureCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-2"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {featureCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {category.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-card border border-border rounded-xl p-6 lg:p-8 hover-lift"
                    >
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 shadow-glow">
                        <feature.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                        {feature.benefit}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Features;
