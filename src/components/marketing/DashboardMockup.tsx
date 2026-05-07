import {
  ArrowRight, Users, TrendingUp, Activity,
  UserX, RefreshCw, Flame, Clock, Briefcase, Target, Bot,
} from 'lucide-react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted/60 rounded animate-pulse ${className}`} />
);

export const DashboardMockup = () => (
  <div className="relative mx-auto max-w-5xl">
    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-2xl" />

    {/* Browser chrome */}
    <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
        <div className="w-3 h-3 rounded-full bg-destructive/60" />
        <div className="w-3 h-3 rounded-full bg-warning/60" />
        <div className="w-3 h-3 rounded-full bg-success/60" />
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
            app.klea.io/dashboard
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-5 lg:p-6 bg-gradient-to-br from-background to-accent/20 space-y-4 text-left">

        {/* Title + Agent Control */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="font-display text-lg font-bold text-foreground">Vue d'ensemble</div>
            <div className="text-xs text-muted-foreground">Bienvenue ! Voici l'état de votre CRM.</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-xs">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-medium">Agent IA</span>
            <span className="text-muted-foreground">Actif</span>
            <div className="flex items-center gap-1 ml-1 px-2 py-1 rounded border border-border bg-background text-muted-foreground">
              <Bot className="w-3 h-3" />
              Lancer scan
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: UserX, label: 'Fusionner doublons', color: 'text-destructive', bg: 'bg-destructive/10' },
            { icon: RefreshCw, label: 'Réactiver contacts', color: 'text-success', bg: 'bg-success/10' },
          ].map((a) => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.bg} ${a.color}`}>
                <a.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-foreground">{a.label}</div>
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
            </div>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card border-2 border-success/30 rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-2">Score de santé</div>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" fill="none" className="text-muted" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">—</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">—</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Score CRM
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <Activity className="w-3 h-3" /> Total contacts
            </div>
            <div className="text-xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground">Contacts synchronisés</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <Users className="w-3 h-3" /> Contacts actifs
            </div>
            <div className="text-xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground">Actifs ces 6 derniers mois</div>
          </div>

          <div className="bg-card border-2 border-destructive/30 rounded-xl p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <UserX className="w-3 h-3" /> Doublons
            </div>
            <div className="text-xl font-bold text-muted-foreground">—</div>
            <div className="text-xs text-muted-foreground">En attente d'analyse</div>
          </div>
        </div>

        {/* Sales Ops Intelligence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold flex items-center gap-1.5">
              <Target className="w-4 h-4 text-primary" />
              Sales Ops Intelligence
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-destructive" />— hot leads</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-warning" />— à bumper</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-primary" />— champions</span>
            </div>
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-muted mb-3">
            {[
              { icon: Flame, label: 'Priorités', active: true },
              { icon: Clock, label: 'Ghosting', active: false },
              { icon: RefreshCw, label: 'Recycler', active: false },
              { icon: Briefcase, label: 'Champions', active: false },
              { icon: Target, label: 'HVT', active: false },
            ].map((tab) => (
              <div key={tab.label} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium ${tab.active ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <tab.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-3 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 py-1 border-b border-border last:border-0">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-14 ml-auto" />
                <Skeleton className="h-3 w-24" />
                <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-sm font-semibold mb-2">Alertes</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs">
                <div className="flex items-center gap-2">
                  <UserX className="w-3.5 h-3.5 text-destructive" />
                  <span className="font-medium">Doublons détectés</span>
                </div>
                <span className="text-muted-foreground flex items-center gap-0.5">Fusionner <ArrowRight className="w-3 h-3" /></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-success/10 border border-success/20 text-xs">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-success" />
                  <span className="font-medium">Contacts dormants</span>
                </div>
                <span className="text-muted-foreground flex items-center gap-0.5">Réactiver <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-sm font-semibold mb-2">Activité récente</div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-16 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRM Breakdown */}
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-sm font-semibold mb-3">Répartition des contacts</div>
          <div className="flex items-center justify-around mb-3">
            {[
              { icon: Users, label: 'Actifs', color: 'text-success' },
              { icon: RefreshCw, label: 'Dormants', color: 'text-warning' },
              { icon: UserX, label: 'Doublons', color: 'text-destructive' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`flex items-center gap-1 justify-center text-sm font-bold ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                  —
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted" />
        </div>

      </div>
    </div>
  </div>
);
