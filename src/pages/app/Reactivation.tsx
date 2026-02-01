import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  RefreshCw, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  Users,
  Star,
  Clock,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { reactivationLists, contactsToReactivate, dashboardStats } from '@/data/mockData';

const Reactivation = () => {
  const { t } = useTranslation();
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [inactivityFilter, setInactivityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  const filteredContacts = contactsToReactivate.filter(contact => 
    contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <RefreshCw className="w-8 h-8 text-primary" />
            Réactivation des contacts
          </h1>
          <p className="text-muted-foreground mt-1">
            {dashboardStats.contactsToReactivate} contacts dormants avec potentiel de réengagement
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Exporter toutes les listes
        </Button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardStats.contactsToReactivate}</p>
                <p className="text-xs text-muted-foreground">Contacts dormants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">32%</p>
                <p className="text-xs text-muted-foreground">Taux réactivation moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">6+ mois</p>
                <p className="text-xs text-muted-foreground">Inactivité moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">Contacts prioritaires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pre-built Lists */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-lg font-semibold mb-4">Listes suggérées</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reactivationLists.map((list, index) => (
            <Card 
              key={list.id} 
              className={`hover-lift cursor-pointer transition-all ${
                selectedList === list.id ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => setSelectedList(selectedList === list.id ? null : list.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getPriorityColor(list.priority)}>
                    {list.priority === 'high' ? 'Priorité haute' : 'Priorité moyenne'}
                  </Badge>
                  <span className="text-2xl font-bold">{list.count}</span>
                </div>
                <h3 className="font-medium mb-1">{list.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{list.description}</p>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Exporter CSV
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle className="text-lg">Contacts à réactiver</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <Select value={inactivityFilter} onValueChange={setInactivityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Période d'inactivité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes périodes</SelectItem>
                    <SelectItem value="3m">3+ mois</SelectItem>
                    <SelectItem value="6m">6+ mois</SelectItem>
                    <SelectItem value="12m">12+ mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead>Score potentiel</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        <p className="text-sm text-muted-foreground">{contact.position}</p>
                      </div>
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {contact.lastActivity ? new Date(contact.lastActivity).toLocaleDateString('fr-FR') : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              (contact.score || 0) >= 80 ? 'bg-success' :
                              (contact.score || 0) >= 60 ? 'bg-warning' : 'bg-muted-foreground'
                            }`}
                            style={{ width: `${contact.score || 0}%` }}
                          />
                        </div>
                        <span className={`font-medium ${getScoreColor(contact.score || 0)}`}>
                          {contact.score || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1">
                          Détails
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reactivation;
