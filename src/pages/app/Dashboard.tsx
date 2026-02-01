import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  UserX, 
  FileX,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Merge,
  BarChart3,
  Search,
  Download,
  Flame,
  Thermometer,
  Snowflake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const healthData = [
  { day: 'Lun', score: 72 },
  { day: 'Mar', score: 74 },
  { day: 'Mer', score: 75 },
  { day: 'Jeu', score: 76 },
  { day: 'Ven', score: 77 },
  { day: 'Sam', score: 78 },
  { day: 'Dim', score: 78 },
];

const scoreDistribution = [
  { name: 'Hot', value: 2345, color: '#EF4444' },
  { name: 'Warm', value: 6789, color: '#F59E0B' },
  { name: 'Cold', value: 3713, color: '#6366F1' },
];

const alerts = [
  { type: 'error', icon: Users, title: '234 doublons détectés', action: 'Fusionner maintenant', link: '/app/duplicates' },
  { type: 'warning', icon: FileX, title: '456 contacts sans secteur', action: 'Enrichir', link: '/app/enrichment' },
  { type: 'success', icon: TrendingUp, title: '89 contacts réactivables', action: 'Voir la liste', link: '/app/reactivation' },
  { type: 'warning', icon: AlertCircle, title: '12 emails bounced', action: 'Nettoyer', link: '/app/data-quality' },
];

const recentActivity = [
  { time: 'Il y a 2 min', icon: CheckCircle, text: 'Contact "Jean Dupont" enrichi (secteur: Tech)', color: 'text-success' },
  { time: 'Il y a 15 min', icon: Merge, text: '3 contacts fusionnés (doublons)', color: 'text-primary' },
  { time: 'Il y a 1h', icon: BarChart3, text: 'Scoring mis à jour (234 contacts)', color: 'text-secondary' },
  { time: 'Il y a 3h', icon: Search, text: 'Scan quotidien terminé', color: 'text-muted-foreground' },
];

const lists = [
  { title: 'Top 50 leads à appeler', description: 'Hot leads, score >80', count: 50, cta: 'Exporter CSV' },
  { title: 'Contacts à réactiver - Tech', description: '147 contacts', count: 147, cta: 'Voir détails' },
  { title: 'Opportunités perdues à relancer', description: '23 deals', count: 23, cta: 'Analyser' },
];

const Dashboard = () => {
  const { t } = useTranslation();
  const healthScore = 78;
  const healthStatus = healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : 'poor';

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold gradient-text">Kleant</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { label: 'Dashboard', path: '/app/dashboard', active: true },
              { label: 'Doublons', path: '/app/duplicates' },
              { label: 'Enrichissement', path: '/app/enrichment' },
              { label: 'Scoring', path: '/app/scoring' },
              { label: 'Réactivation', path: '/app/reactivation' },
              { label: 'Historique', path: '/app/history' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  item.active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Link to="/app/settings">Paramètres</Link>
            </Button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">JD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl lg:text-3xl font-bold">{t('dashboard.overview')}</h1>
          <p className="text-muted-foreground">Bienvenue ! Voici l'état de votre CRM.</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {t('dashboard.totalContacts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <div className="text-xs text-success">+234 {t('dashboard.thisWeek')}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t('dashboard.activeContacts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,234 <span className="text-sm font-normal text-muted-foreground">(64%)</span></div>
                <div className="text-xs text-success">+12% {t('dashboard.vsLastMonth')}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Duplicates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="health-bg-poor border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserX className="w-4 h-4" />
                  {t('dashboard.duplicates')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234 <span className="text-sm font-normal text-muted-foreground">(1.8%)</span></div>
                <div className="text-xs text-destructive">{t('dashboard.critical')}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Alerts & Activity Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{t('dashboard.alerts')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      alert.type === 'error' ? 'health-bg-poor' :
                      alert.type === 'warning' ? 'health-bg-good' : 'health-bg-excellent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <alert.icon className={`w-5 h-5 ${
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
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{t('dashboard.recentActivity')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2">
                    <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Health Evolution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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

          {/* Score Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{t('dashboard.contactsByScore')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around mb-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <Flame className="w-5 h-5 text-destructive" />
                      <span className="text-2xl font-bold">2,345</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Hot (18%)</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <Thermometer className="w-5 h-5 text-warning" />
                      <span className="text-2xl font-bold">6,789</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Warm (53%)</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <Snowflake className="w-5 h-5 text-secondary" />
                      <span className="text-2xl font-bold">3,713</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Cold (29%)</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={scoreDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {scoreDistribution.map((entry, index) => (
                        <rect key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Lists of the Moment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="font-display text-lg font-semibold mb-4">{t('dashboard.listsOfMoment')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {lists.map((list, index) => (
              <Card key={index} className="hover-lift">
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
      </main>
    </div>
  );
};

export default Dashboard;
