import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  Users,
  UserX,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Merge,
  Search,
  Sparkles,
  RefreshCw,
  Bot,
  Target,
  Clock,
  Briefcase,
  Flame,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAgent } from '@/hooks/useAgent';
import { useSalesOpsAgent } from '@/hooks/useSalesOpsAgent';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Progress } from '@/components/ui/progress';
import {
  PriorityActions,
  ClosedLostRecycler,
  ChampionTracker,
  GhostingAlerts,
  ICPQualification
} from '@/components/app/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { state: agentState, startScan } = useAgent();
  const { stats: salesOpsStats } = useSalesOpsAgent();
  const { data: realStats } = useDashboardStats();

  const healthScore = realStats?.healthScore ?? 0;
  const healthStatus = healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor';

  const total = realStats?.totalContacts ?? 0;
  const active = realStats?.activeContacts ?? 0;
  const inactive = realStats?.inactiveContacts ?? 0;
  const duplicates = realStats?.duplicatesDetected ?? 0;

  const quickActions = [
    {
      icon: UserX,
      label: 'Fusionner doublons',
      description: `${duplicates} détectés`,
      link: '/app/duplicates',
      variant: 'destructive' as const
    },
    {
      icon: RefreshCw,
      label: 'Réactiver contacts',
      description: `${realStats?.contactsToReactivate ?? 0} dormants`,
      link: '/app/reactivation',
      variant: 'success' as const
    },
  ];

  const alerts = realStats ? [
    duplicates > 0 && { id: 'dup', type: 'error', title: `${duplicates} doublons détectés`, link: '/app/duplicates', action: 'Fusionner' },
    (realStats.contactsToReactivate ?? 0) > 0 && { id: 'react', type: 'success', title: `${realStats.contactsToReactivate} contacts dormants`, link: '/app/reactivation', action: 'Réactiver' },
  ].filter(Boolean) as { id: string; type: string; title: string; link: string; action: string }[] : [];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return UserX;
      case 'warning': return Sparkles;
      case 'success': return RefreshCw;
      default: return Activity;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'merge': return Merge;
      case 'enrich': return Sparkles;
      case 'scan': return Search;
      case 'score': return TrendingUp;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title + Agent Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{t('dashboard.overview')}</h1>
          <p className="text-muted-foreground">Bienvenue ! Voici l'état de votre CRM.</p>
        </div>

        {/* Agent Control */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
          <div className={`w-2.5 h-2.5 rounded-full ${
            agentState.status === 'active' ? 'bg-success animate-pulse' :
            agentState.status === 'scanning' ? 'bg-primary animate-pulse' :
            'bg-muted-foreground'
          }`} />
          <div className="text-sm">
            <span className="font-medium">Agent IA </span>
            <span className="text-muted-foreground">
              {agentState.status === 'scanning' ? 'Scan en cours...' :
               agentState.status === 'active' ? 'Actif' : 'En pause'}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={startScan}
            disabled={agentState.status === 'scanning'}
            className="gap-2"
          >
            {agentState.status === 'scanning' ? (
              <Bot className="w-4 h-4 animate-spin-slow" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Lancer scan
          </Button>
        </div>
      </motion.div>

      {/* Scan Progress */}
      {agentState.status === 'scanning' && agentState.progress !== undefined && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Scan en cours...</span>
            <span className="text-sm text-muted-foreground">{agentState.progress}%</span>
          </div>
          <Progress value={agentState.progress} className="h-2" />
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover-lift cursor-pointer group border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  action.variant === 'destructive' ? 'bg-destructive/10 text-destructive' :
                  action.variant === 'warning' ? 'bg-warning/10 text-warning' :
                  'bg-success/10 text-success'
                }`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`health-bg-${healthStatus} border-2`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('dashboard.healthScore')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className={`health-${healthStatus}`}
                      strokeDasharray="176"
                      strokeDashoffset={176 - (176 * healthScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold health-${healthStatus}`}>{healthScore}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {healthStatus === 'excellent' ? t('dashboard.healthGood') :
                     healthStatus === 'good' ? t('dashboard.healthMedium') : t('dashboard.healthPoor')}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Score CRM
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('dashboard.totalContacts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Contacts synchronisés</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('dashboard.activeContacts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {active.toLocaleString()}
                {total > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({Math.round(active / total * 100)}%)
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">Actifs ces 6 derniers mois</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Duplicates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className={duplicates > 0 ? 'health-bg-poor border-2' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX className="w-4 h-4" />
                {t('dashboard.duplicates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {duplicates}
                {total > 0 && duplicates > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({(duplicates / total * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <div className={`text-xs ${duplicates > 0 ? 'text-destructive' : 'text-success'}`}>
                {duplicates > 0 ? t('dashboard.critical') : 'Aucun doublon'}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sales Ops Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Sales Ops Intelligence
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-destructive" />
              {salesOpsStats.hotLeadsCount} hot leads
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-warning" />
              {salesOpsStats.ghostingDeals} à bumper
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-primary" />
              {salesOpsStats.championsDetected} champions
            </span>
          </div>
        </div>

        <Tabs defaultValue="priority" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="priority" className="gap-1.5 text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Priorités</span>
            </TabsTrigger>
            <TabsTrigger value="ghosting" className="gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ghosting</span>
            </TabsTrigger>
            <TabsTrigger value="closed-lost" className="gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recycler</span>
            </TabsTrigger>
            <TabsTrigger value="champions" className="gap-1.5 text-xs">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Champions</span>
            </TabsTrigger>
            <TabsTrigger value="hvt" className="gap-1.5 text-xs">
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HVT</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="priority">
            <PriorityActions />
          </TabsContent>

          <TabsContent value="ghosting">
            <GhostingAlerts />
          </TabsContent>

          <TabsContent value="closed-lost">
            <ClosedLostRecycler />
          </TabsContent>

          <TabsContent value="champions">
            <ChampionTracker />
          </TabsContent>

          <TabsContent value="hvt">
            <ICPQualification />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Alerts & Activity Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.alerts')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune alerte — votre CRM est en bonne santé.</p>
              ) : alerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      alert.type === 'error' ? 'health-bg-poor' :
                      alert.type === 'warning' ? 'health-bg-good' : 'health-bg-excellent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertIcon className={`w-5 h-5 ${
                        alert.type === 'error' ? 'text-destructive' :
                        alert.type === 'warning' ? 'text-warning' : 'text-success'
                      }`} />
                      <span className="text-sm font-medium">{alert.title}</span>
                    </div>
                    <Link to={alert.link}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {alert.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!realStats?.recentActivity?.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente.</p>
              ) : realStats.recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-2">
                    <ActivityIcon className={`w-5 h-5 mt-0.5 ${
                      activity.status === 'success' ? 'text-success' :
                      activity.status === 'pending' ? 'text-warning' : 'text-destructive'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CRM Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition des contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around mb-6">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Users className="w-5 h-5 text-success" />
                  <span className="text-2xl font-bold">{active.toLocaleString()}</span>
                </div>
                <span className="text-xs text-muted-foreground">Actifs ({total > 0 ? Math.round(active / total * 100) : 0}%)</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <RefreshCw className="w-5 h-5 text-warning" />
                  <span className="text-2xl font-bold">{inactive.toLocaleString()}</span>
                </div>
                <span className="text-xs text-muted-foreground">Dormants ({total > 0 ? Math.round(inactive / total * 100) : 0}%)</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <UserX className="w-5 h-5 text-destructive" />
                  <span className="text-2xl font-bold">{duplicates}</span>
                </div>
                <span className="text-xs text-muted-foreground">Doublons ({total > 0 ? (duplicates / total * 100).toFixed(1) : 0}%)</span>
              </div>
            </div>
            {total > 0 && (
              <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                <div className="bg-success" style={{ width: `${Math.round(active / total * 100)}%` }} />
                <div className="bg-warning" style={{ width: `${Math.round(inactive / total * 100)}%` }} />
                <div className="bg-destructive" style={{ width: `${Math.min((duplicates / total * 100), 100 - Math.round(active / total * 100) - Math.round(inactive / total * 100))}%` }} />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
