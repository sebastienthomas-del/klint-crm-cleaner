import {
  ArrowRight, Users, TrendingUp, Activity,
  UserX, RefreshCw, Flame, Clock, Briefcase, Target,
  Sparkles, Bot, Merge,
} from 'lucide-react';

const MOCK = {
  healthScore: 92,
  total: 24560,
  active: 18200,
  inactive: 5873,
  duplicates: 487,
  toReactivate: 5873,
  hotLeads: 12,
  ghosting: 8,
  champions: 5,
};

const activePercent = Math.round(MOCK.active / MOCK.total * 100);
const inactivePercent = Math.round(MOCK.inactive / MOCK.total * 100);
const dupPercent = parseFloat((MOCK.duplicates / MOCK.total * 100).toFixed(1));

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
            { icon: UserX, label: 'Fusionner doublons', desc: `${MOCK.duplicates} détectés`, color: 'text-destructive', bg: 'bg-destructive/10' },
            { icon: RefreshCw, label: 'Réactiver contacts', desc: `${MOCK.toReactivate.toLocaleString('fr-FR')} dormants`, color: 'text-success', bg: 'bg-success/10' },
          ].map((a) => (
            <div key={a.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.bg} ${a.color}`}>
                <a.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.desc}</div>
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
                  <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" fill="none" className="text-success"
                    strokeDasharray="163" strokeDashoffset={163 - (163 * MOCK.healthScore / 100)} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-success">{MOCK.healthScore}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium">Excellent</div>
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
            <div className="text-xl font-bold">{MOCK.total.toLocaleString('fr-FR')}</div>
            <div className="text-xs text-muted-foreground">Contacts synchronisés</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <Users className="w-3 h-3" /> Contacts actifs
            </div>
            <div className="text-xl font-bold">{MOCK.active.toLocaleString('fr-FR')} <span className="text-sm font-normal text-muted-foreground">({activePercent}%)</span></div>
            <div className="text-xs text-muted-foreground">Actifs ces 6 derniers mois</div>
          </div>

          <div className="bg-card border-2 border-destructive/30 rounded-xl p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <UserX className="w-3 h-3" /> Doublons
            </div>
            <div className="text-xl font-bold">{MOCK.duplicates} <span className="text-sm font-normal text-muted-foreground">({dupPercent}%)</span></div>
            <div className="text-xs text-destructive">Critique</div>
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
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-destructive" />{MOCK.hotLeads} hot leads</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-warning" />{MOCK.ghosting} à bumper</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-primary" />{MOCK.champions} champions</span>
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
          <div className="bg-card border border-border rounded-xl p-3 space-y-2">
            {[
              { name: 'Lumen Studio', score: 94, action: '5 fusions à valider', color: 'text-destructive' },
              { name: 'Artek Solutions', score: 87, action: '38 fiches enrichies', color: 'text-primary' },
              { name: 'Nova Consulting', score: 81, action: '12 contacts à relancer', color: 'text-success' },
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between text-xs py-1 border-b border-border last:border-0">
                <span className="font-medium text-foreground">{row.name}</span>
                <span className="text-muted-foreground">Score {row.score}</span>
                <span className={row.color}>{row.action}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
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
                  <span className="font-medium">{MOCK.duplicates} doublons détectés</span>
                </div>
                <span className="text-muted-foreground flex items-center gap-0.5">Fusionner <ArrowRight className="w-3 h-3" /></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-success/10 border border-success/20 text-xs">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-success" />
                  <span className="font-medium">{MOCK.toReactivate.toLocaleString('fr-FR')} contacts dormants</span>
                </div>
                <span className="text-muted-foreground flex items-center gap-0.5">Réactiver <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-sm font-semibold mb-2">Activité récente</div>
            <div className="space-y-2">
              {[
                { icon: Merge, label: '5 fusions proposées — Lumen Studio', time: 'à l\'instant', color: 'text-primary' },
                { icon: Sparkles, label: '38 fiches enrichies · secteur & effectif', time: 'il y a 12 min', color: 'text-primary' },
                { icon: RefreshCw, label: '12 contacts dormants relancés', time: 'il y a 1h', color: 'text-success' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <a.icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${a.color}`} />
                  <span className="flex-1 text-foreground">{a.label}</span>
                  <span className="text-muted-foreground shrink-0">{a.time}</span>
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
              { icon: Users, label: 'Actifs', value: MOCK.active, pct: activePercent, color: 'text-success' },
              { icon: RefreshCw, label: 'Dormants', value: MOCK.inactive, pct: inactivePercent, color: 'text-warning' },
              { icon: UserX, label: 'Doublons', value: MOCK.duplicates, pct: dupPercent, color: 'text-destructive' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`flex items-center gap-1 justify-center text-sm font-bold ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                  {s.value.toLocaleString('fr-FR')}
                </div>
                <div className="text-xs text-muted-foreground">{s.label} ({s.pct}%)</div>
              </div>
            ))}
          </div>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted">
            <div className="bg-success" style={{ width: `${activePercent}%` }} />
            <div className="bg-warning" style={{ width: `${inactivePercent}%` }} />
            <div className="bg-destructive" style={{ width: `${dupPercent}%` }} />
          </div>
        </div>

      </div>
    </div>
  </div>
);
