import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Sparkles, 
  Building2, 
  Users, 
  Linkedin, 
  Mail, 
  Phone, 
  Briefcase,
  Play,
  Pause,
  CheckCircle,
  Clock,
  ArrowRight,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { enrichmentCategories, contactsToEnrich, dashboardStats } from '@/data/mockData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Users,
  Linkedin,
  Mail,
  Phone,
  Briefcase,
};

const Enrichment = () => {
  const { t } = useTranslation();
  const [autoEnrichEnabled, setAutoEnrichEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const totalMissing = enrichmentCategories.reduce((sum, cat) => sum + cat.count, 0);

  const filteredContacts = contactsToEnrich.filter(contact => 
    contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Enrichissement des données
          </h1>
          <p className="text-muted-foreground mt-1">
            {dashboardStats.contactsToEnrich.toLocaleString()} contacts avec des données manquantes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <div className={`w-2.5 h-2.5 rounded-full ${autoEnrichEnabled ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-sm font-medium">Enrichissement auto</span>
            <Switch 
              checked={autoEnrichEnabled} 
              onCheckedChange={setAutoEnrichEnabled}
            />
          </div>
          <Button className="gap-2">
            {autoEnrichEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            Enrichir maintenant
          </Button>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-lg font-semibold mb-4">Données manquantes par catégorie</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {enrichmentCategories.map((category, index) => {
            const Icon = iconMap[category.icon] || Sparkles;
            const percentage = Math.round((category.count / dashboardStats.totalContacts) * 100);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="hover-lift cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {percentage}%
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-2xl font-bold">{category.count}</p>
                    <p className="text-xs text-muted-foreground">contacts à enrichir</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Enrichments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Derniers enrichissements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { contact: 'Jean Dupont', field: 'Secteur', value: 'Tech', time: 'Il y a 2 min' },
              { contact: 'Marie Martin', field: 'LinkedIn', value: 'Ajouté', time: 'Il y a 15 min' },
              { contact: 'Pierre Bernard', field: 'Taille entreprise', value: '50-200', time: 'Il y a 1h' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.contact}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.field}: <span className="text-foreground">{item.value}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full gap-2">
              Voir l'historique complet
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Contacts à enrichir</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Données manquantes</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => {
                  const missingFields = [];
                  if (!contact.company) missingFields.push('Entreprise');
                  if (!contact.position) missingFields.push('Poste');
                  if (!contact.sector) missingFields.push('Secteur');
                  if (!contact.linkedIn) missingFields.push('LinkedIn');
                  
                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {missingFields.slice(0, 2).map((field) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {missingFields.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{missingFields.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Enrichir
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Enrichment;
