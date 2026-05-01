import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Users, TrendingUp, GitMerge, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Données illustratives Hero (indépendantes de la démo guidée)
const heroData = {
  totalContacts: 24560,
  initialScore: 52,
  finalScore: 92,
  duplicatesMerged: 487,
  contactsEnriched: 3120,
  pipelineUnlocked: 86,
};

const heroKpis = [
  { icon: TrendingUp, label: 'Score qualité base', value: `${heroData.finalScore}/100`, delta: `+${heroData.finalScore - heroData.initialScore} pts en 30 j`, color: 'text-success' },
  { icon: GitMerge, label: 'Doublons nettoyés', value: heroData.duplicatesMerged.toLocaleString('fr-FR'), delta: 'fusion automatique', color: 'text-primary' },
  { icon: Sparkles, label: 'Fiches enrichies', value: heroData.contactsEnriched.toLocaleString('fr-FR'), delta: 'secteur · taille · poste', color: 'text-primary' },
  { icon: Activity, label: 'Pipeline réveillé', value: `+€${heroData.pipelineUnlocked}k`, delta: 'leads dormants relancés', color: 'text-success' },
];

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/40 to-primary/10 border border-primary/15 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('hero.badge')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
          >
            {t('hero.title')}{' '}
            <span className="gradient-text">{t('hero.titleHighlight')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            <span dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }} />
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/demo">
              <Button size="lg" className="gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300 gap-2 text-base px-8">
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/demo-tour">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                <Play className="w-4 h-4" />
                Voir une démo guidée
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
              ))}
            </div>
            <span>{t('hero.trustedBy')}</span>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 lg:mt-24 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-2xl" />
            
            {/* Dashboard Mockup */}
            <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
                    app.kleant.io/dashboard
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8 bg-gradient-to-br from-background to-accent/20">
                {/* Mission accomplie badge */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                    <Sparkles className="w-3.5 h-3.5 text-success" />
                    <span className="text-xs font-medium text-success">Agent actif · 30 derniers jours</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Base CRM : <span className="font-medium text-foreground">{heroData.totalContacts.toLocaleString('fr-FR')}</span> contacts
                  </div>
                </div>

                {/* KPI grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {heroKpis.map((k) => (
                    <div key={k.label} className="bg-card border border-border rounded-xl p-4 lg:p-5">
                      <k.icon className={`w-5 h-5 mb-3 ${k.color}`} />
                      <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
                      <div className="font-display text-xl lg:text-2xl font-bold tabular-nums">{k.value}</div>
                      <div className={`text-xs mt-1 ${k.color}`}>{k.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Activity preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-sm font-medium mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Ce que l'agent a fait aujourd'hui
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { time: 'à l\'instant', text: '5 doublons fusionnés sur Lumen Studio', color: 'text-primary' },
                        { time: 'il y a 12 min', text: '38 fiches enrichies · secteur & effectif', color: 'text-primary' },
                        { time: 'il y a 1 h', text: '12 contacts dormants relancés', color: 'text-success' },
                        { time: 'ce matin', text: 'Score qualité : 90 → 92', color: 'text-success' },
                      ].map((a, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs">
                          <span className="text-muted-foreground w-20 shrink-0 tabular-nums">{a.time}</span>
                          <span className={a.color}>{a.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-sm font-medium mb-3">Santé de votre CRM</div>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="none" className="text-muted" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="none" className="text-success" strokeDasharray="176" strokeDashoffset="14" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-base font-bold text-success">{heroData.finalScore}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Base saine et actionnable</div>
                        <div className="text-xs text-success mt-0.5">+{heroData.finalScore - heroData.initialScore} pts depuis l'activation</div>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full gradient-primary" style={{ width: `${heroData.finalScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
