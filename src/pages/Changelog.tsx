import { motion } from 'framer-motion';
import { MarketingLayout } from '@/components/layout';

const entries = [
  {
    version: '1.2.0',
    date: 'Mai 2026',
    tag: 'Nouveau',
    tagColor: 'bg-success/10 text-success',
    changes: [
      'Dashboard santé CRM connecté aux données réelles HubSpot',
      'Scoring des leads 0-100 basé sur l\'ICP et l\'engagement',
      'Page Réactivation avec listes priorisées',
      'Extension HubSpot — carte Kléa sur les fiches contacts',
    ],
  },
  {
    version: '1.1.0',
    date: 'Avril 2026',
    tag: 'Amélioration',
    tagColor: 'bg-primary/10 text-primary',
    changes: [
      'Détection de doublons améliorée — précision 98%',
      'Alertes intelligentes en temps réel',
      'Support multi-langues (FR, EN, ES, IT, PT)',
      'Connexion sécurisée HubSpot OAuth2',
    ],
  },
  {
    version: '1.0.0',
    date: 'Mars 2026',
    tag: 'Lancement',
    tagColor: 'bg-accent text-accent-foreground',
    changes: [
      'Lancement de Kléa en accès anticipé',
      'Intégration native HubSpot',
      'Dashboard de santé CRM',
      'Plans Starter, Professional et Enterprise',
    ],
  },
];

const Changelog = () => (
  <MarketingLayout>
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Changelog</h1>
          <p className="text-lg text-muted-foreground">
            Toutes les nouveautés et améliorations de Kléa.
          </p>
        </motion.div>

        <div className="space-y-12">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0" />
                {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-12 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display font-bold text-lg">v{entry.version}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.tagColor}`}>
                    {entry.tag}
                  </span>
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="space-y-2">
                  {entry.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">→</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default Changelog;
