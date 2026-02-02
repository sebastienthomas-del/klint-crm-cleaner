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
  Download,
  Flame,
  Thermometer,
  Snowflake,
  Play,
  Sparkles,
  RefreshCw,
  Bot,
  Target,
  Clock,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  dashboardStats, 
  healthData, 
  scoreDistribution, 
  alerts, 
  recentActivity, 
  suggestedLists 
} from '@/data/mockData';
import { useAgent } from '@/hooks/useAgent';
import { useSalesOpsAgent } from '@/hooks/useSalesOpsAgent';
import { Progress } from '@/components/ui/progress';
import { 
  PriorityActions, 
  ClosedLostRecycler, 
  ChampionTracker, 
  GhostingAlerts, 
  ICPQualification 
} from '@/components/app/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { t } = useTranslation();
  const { state: agentState, startScan } = useAgent();
  const { stats: salesOpsStats } = useSalesOpsAgent();
  
  const healthScore = dashboardStats.healthScore;
  const healthStatus = healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor';

  const quickActions = [
    { 
      icon: UserX, 
      label: 'Fusionner doublons', 
      description: `${dashboardStats.duplicatesDetected} détectés`, 
      link: '/app/duplicates',
      variant: 'destructive' as const
    },
    { 
      icon: Sparkles, 
      label: 'Enrichir contacts', 
      description: `${dashboardStats.contactsToEnrich} à enrichir`, 
      link: '/app/enrichment',
      variant: 'warning' as const
    },
    { 
      icon: RefreshCw, 
      label: 'Réactiver contacts', 
      description: `${dashboardStats.contactsToReactivate} dormants`, 
      link: '/app/reactivation',
      variant: 'success' as const
    },
  ];

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
                  <div className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +3% {t('dashboard.vsLastWeek')}
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
              <div className="text-2xl font-bold text-foreground">{dashboardStats.totalContacts.toLocaleString()}</div>
              <div className="text-xs text-success">+{dashboardStats.weeklyNewContacts} {t('dashboard.thisWeek')}</div>
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
                {dashboardStats.activeContacts.toLocaleString()} 
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({Math.round(dashboardStats.activeContacts / dashboardStats.totalContacts * 100)}%)
                </span>
              </div>
              <div className="text-xs text-success">+{dashboardStats.monthlyGrowth}% {t('dashboard.vsLastMonth')}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Duplicates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="health-bg-poor border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX className="w-4 h-4" />
                {t('dashboard.duplicates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardStats.duplicatesDetected} 
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({(dashboardStats.duplicatesDetected / dashboardStats.totalContacts * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="text-xs text-destructive">{t('dashboard.critical')}</div>
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
              {alerts.map((alert) => {
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
              {recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-2">
                    <ActivityIcon className={`w-5 h-5 mt-0.5 ${
                      activity.status === 'success' ? 'text-success' :
                      activity.status === 'pending' ? 'text-warning' : 'text-destructive'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Health Evolution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.qualityEvolution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('dashboard.contactsByScore')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around mb-6">
                {scoreDistribution.map((item, index) => {
                  const icons = [Flame, Thermometer, Snowflake];
                  const colors = ['text-destructive', 'text-warning', 'text-secondary'];
                  const Icon = icons[index];
                  return (
                    <div key={item.name} className="text-center">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <Icon className={`w-5 h-5 ${colors[index]}`} />
                        <span className="text-2xl font-bold">{item.value.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.name} ({item.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                <div className="bg-destructive" style={{ width: `${scoreDistribution[0].percentage}%` }} />
                <div className="bg-warning" style={{ width: `${scoreDistribution[1].percentage}%` }} />
                <div className="bg-secondary" style={{ width: `${scoreDistribution[2].percentage}%` }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Suggested Lists */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-display text-lg font-semibold mb-4">{t('dashboard.listsOfMoment')}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {suggestedLists.map((list) => (
            <Card key={list.id} className="hover-lift">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{list.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{list.description}</p>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  {list.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
