import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-hero-pattern">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-background" />
      
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8"
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
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/auth?tab=signup">
              <Button size="lg" className="gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300 gap-2 text-base px-8">
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 text-base px-8">
              <Play className="w-4 h-4" />
              {t('hero.ctaSecondary')}
            </Button>
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
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Health Score Card */}
                  <div className="col-span-4 lg:col-span-1 bg-card border border-border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-2">Score de santé</div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-warning" strokeDasharray="176" strokeDashoffset="39" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-warning">78%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Bonne santé</div>
                        <div className="text-xs text-success">+3% vs semaine</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* KPI Cards */}
                  {[
                    { label: 'Total contacts', value: '12,847', change: '+234' },
                    { label: 'Contacts actifs', value: '8,234', change: '+12%' },
                    { label: 'Doublons', value: '234', status: 'Critique' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">{kpi.label}</div>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                      <div className={`text-xs ${kpi.status ? 'text-destructive' : 'text-success'}`}>
                        {kpi.change || kpi.status}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Activity Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Alertes récentes</div>
                    <div className="space-y-2">
                      {[
                        { type: 'error', text: '234 doublons détectés' },
                        { type: 'warning', text: '456 contacts sans secteur' },
                        { type: 'success', text: '89 contacts réactivables' },
                      ].map((alert, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.type === 'error' ? 'bg-destructive' :
                            alert.type === 'warning' ? 'bg-warning' : 'bg-success'
                          }`} />
                          <span className="text-muted-foreground">{alert.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Activité IA</div>
                    <div className="space-y-2">
                      {[
                        { time: '2 min', text: 'Contact enrichi' },
                        { time: '15 min', text: '3 doublons fusionnés' },
                        { time: '1h', text: 'Scoring mis à jour' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground w-12">{activity.time}</span>
                          <span className="text-foreground">{activity.text}</span>
                        </div>
                      ))}
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
