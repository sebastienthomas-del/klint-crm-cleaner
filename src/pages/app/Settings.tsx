import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Link2, 
  Bell, 
  Bot,
  Save,
  Check,
  X,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { integrations, agentConfig } from '@/data/mockData';
import { useAgent } from '@/hooks/useAgent';

// Integration logos (simplified as colored circles for now)
const integrationLogos: Record<string, { color: string; letter: string }> = {
  hubspot: { color: 'bg-orange-500', letter: 'H' },
  pipedrive: { color: 'bg-green-500', letter: 'P' },
  salesforce: { color: 'bg-blue-500', letter: 'S' },
  slack: { color: 'bg-purple-500', letter: 'S' },
  google: { color: 'bg-red-500', letter: 'G' },
  notion: { color: 'bg-gray-800', letter: 'N' },
  teams: { color: 'bg-indigo-500', letter: 'T' },
};

const Settings = () => {
  const { t } = useTranslation();
  const { state: agentState, updateConfig, toggleAgent } = useAgent();
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    fullName: 'Jean Dupont',
    email: 'jean.dupont@company.fr',
    position: 'Sales Director',
    phone: '+33 6 12 34 56 78',
    language: 'fr',
  });

  const [preferences, setPreferences] = useState({
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    emailNotifications: true,
    slackNotifications: true,
    weeklyReport: true,
    alertsEnabled: true,
    reportFrequency: 'weekly',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl lg:text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre profil, vos intégrations et les préférences de l'agent IA
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="gap-2">
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Connexions</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
            <TabsTrigger value="agent" className="gap-2">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Agent IA</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">JD</span>
                  </div>
                  <Button variant="outline">Changer la photo</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input 
                      id="fullName" 
                      value={profile.fullName}
                      onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Poste</Label>
                    <Input 
                      id="position" 
                      value={profile.position}
                      onChange={(e) => setProfile(p => ({ ...p, position: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone}
                      onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select value={profile.language} onValueChange={(v) => setProfile(p => ({ ...p, language: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">CRM</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {integrations.filter(i => i.type === 'crm').map((integration) => {
                  const logo = integrationLogos[integration.id];
                  return (
                    <Card key={integration.id} className={integration.connected ? 'border-success/50' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg ${logo.color} flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">{logo.letter}</span>
                          </div>
                          {integration.connected ? (
                            <Badge className="bg-success/10 text-success border-success/20">
                              <Check className="w-3 h-3 mr-1" />
                              Connecté
                            </Badge>
                          ) : (
                            <Badge variant="outline">Non connecté</Badge>
                          )}
                        </div>
                        <h4 className="font-semibold mb-1">{integration.name}</h4>
                        {integration.connected && (
                          <div className="text-xs text-muted-foreground mb-3">
                            <p>Dernière sync: {integration.lastSync}</p>
                            <p>{integration.contactsCount?.toLocaleString()} contacts</p>
                          </div>
                        )}
                        <Button 
                          variant={integration.connected ? 'outline' : 'default'} 
                          size="sm" 
                          className="w-full gap-2"
                        >
                          {integration.connected ? (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Synchroniser
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              Connecter
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {integrations.filter(i => i.type === 'notification').map((integration) => {
                  const logo = integrationLogos[integration.id];
                  return (
                    <Card key={integration.id} className={integration.connected ? 'border-success/50' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg ${logo.color} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-lg">{logo.letter}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{integration.name}</h4>
                              {integration.connected && (
                                <Badge className="bg-success/10 text-success border-success/20 text-xs">
                                  Connecté
                                </Badge>
                              )}
                            </div>
                            {integration.connected && (
                              <p className="text-xs text-muted-foreground">Dernière sync: {integration.lastSync}</p>
                            )}
                          </div>
                          <Button variant={integration.connected ? 'outline' : 'default'} size="sm">
                            {integration.connected ? 'Configurer' : 'Connecter'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Productivité</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {integrations.filter(i => i.type === 'productivity').map((integration) => {
                  const logo = integrationLogos[integration.id];
                  return (
                    <Card key={integration.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg ${logo.color} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-bold text-lg">{logo.letter}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-xs text-muted-foreground">Non connecté</p>
                          </div>
                          <Button size="sm">Connecter</Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences d'affichage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fuseau horaire</Label>
                    <Select value={preferences.timezone} onValueChange={(v) => setPreferences(p => ({ ...p, timezone: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Format de date</Label>
                    <Select value={preferences.dateFormat} onValueChange={(v) => setPreferences(p => ({ ...p, dateFormat: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Recevez les alertes par email</p>
                  </div>
                  <Switch 
                    checked={preferences.emailNotifications}
                    onCheckedChange={(v) => setPreferences(p => ({ ...p, emailNotifications: v }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Notifications Slack</p>
                    <p className="text-sm text-muted-foreground">Recevez les alertes sur Slack</p>
                  </div>
                  <Switch 
                    checked={preferences.slackNotifications}
                    onCheckedChange={(v) => setPreferences(p => ({ ...p, slackNotifications: v }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Rapport hebdomadaire</p>
                    <p className="text-sm text-muted-foreground">Recevez un résumé chaque semaine</p>
                  </div>
                  <Switch 
                    checked={preferences.weeklyReport}
                    onCheckedChange={(v) => setPreferences(p => ({ ...p, weeklyReport: v }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agent Tab */}
          <TabsContent value="agent" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Agent IA</CardTitle>
                    <CardDescription>Contrôlez le comportement de l'agent autonome</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${agentState.isActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                    <span className="font-medium">{agentState.isActive ? 'Actif' : 'En pause'}</span>
                    <Switch checked={agentState.isActive} onCheckedChange={toggleAgent} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Fréquence des scans</Label>
                      <Select 
                        value={agentState.scanFrequency} 
                        onValueChange={(v) => updateConfig({ scanFrequency: v as 'hourly' | 'daily' | 'weekly' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Toutes les heures</SelectItem>
                          <SelectItem value="daily">Quotidien</SelectItem>
                          <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label>Seuil de fusion automatique: {agentState.autoMergeThreshold}%</Label>
                      <Slider 
                        value={[agentState.autoMergeThreshold]}
                        onValueChange={([v]) => updateConfig({ autoMergeThreshold: v })}
                        min={70}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Les doublons avec une confiance supérieure à ce seuil seront fusionnés automatiquement
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Enrichissement automatique</p>
                        <p className="text-sm text-muted-foreground">Enrichir les nouveaux contacts</p>
                      </div>
                      <Switch 
                        checked={agentState.autoEnrichEnabled}
                        onCheckedChange={(v) => updateConfig({ autoEnrichEnabled: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Alertes intelligentes</p>
                        <p className="text-sm text-muted-foreground">Notifications pour actions requises</p>
                      </div>
                      <Switch 
                        checked={agentState.alertsEnabled}
                        onCheckedChange={(v) => updateConfig({ alertsEnabled: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Rapport hebdomadaire</p>
                        <p className="text-sm text-muted-foreground">Résumé des actions de l'agent</p>
                      </div>
                      <Switch 
                        checked={agentState.weeklyReportEnabled}
                        onCheckedChange={(v) => updateConfig({ weeklyReportEnabled: v })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques de l'agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">1,234</p>
                    <p className="text-sm text-muted-foreground">Actions ce mois</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-success">98.5%</p>
                    <p className="text-sm text-muted-foreground">Taux de succès</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">456</p>
                    <p className="text-sm text-muted-foreground">Doublons fusionnés</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">789</p>
                    <p className="text-sm text-muted-foreground">Contacts enrichis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
