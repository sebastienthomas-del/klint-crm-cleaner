import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Users2, 
  Check, 
  X, 
  ChevronDown, 
  ChevronRight,
  Merge,
  AlertCircle,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { duplicateGroups, dashboardStats } from '@/data/mockData';

const Duplicates = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { label: 'Haute', color: 'bg-destructive text-destructive-foreground' };
    if (confidence >= 70) return { label: 'Moyenne', color: 'bg-warning text-warning-foreground' };
    return { label: 'Basse', color: 'bg-secondary text-secondary-foreground' };
  };

  const filteredGroups = duplicateGroups.filter(group => {
    if (filter === 'all') return true;
    if (filter === 'high') return group.confidence >= 90;
    if (filter === 'medium') return group.confidence >= 70 && group.confidence < 90;
    return group.confidence < 70;
  });

  const stats = {
    total: duplicateGroups.length,
    high: duplicateGroups.filter(g => g.confidence >= 90).length,
    medium: duplicateGroups.filter(g => g.confidence >= 70 && g.confidence < 90).length,
    low: duplicateGroups.filter(g => g.confidence < 70).length,
  };

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
            <Users2 className="w-8 h-8 text-primary" />
            Gestion des doublons
          </h1>
          <p className="text-muted-foreground mt-1">
            {dashboardStats.duplicatesDetected} groupes de doublons détectés dans votre CRM
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Merge className="w-4 h-4" />
            Fusionner tout (haute confiance)
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter('all')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total groupes</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-destructive/50 transition-colors border-destructive/20" onClick={() => setFilter('high')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.high}</div>
            <div className="text-sm text-muted-foreground">Confiance haute</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-warning/50 transition-colors border-warning/20" onClick={() => setFilter('medium')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.medium}</div>
            <div className="text-sm text-muted-foreground">Confiance moyenne</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-secondary/50 transition-colors" onClick={() => setFilter('low')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{stats.low}</div>
            <div className="text-sm text-muted-foreground">Confiance basse</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrer :</span>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les groupes</SelectItem>
            <SelectItem value="high">Confiance haute (≥90%)</SelectItem>
            <SelectItem value="medium">Confiance moyenne (70-89%)</SelectItem>
            <SelectItem value="low">Confiance basse (&lt;70%)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Trier par confiance
        </Button>
      </motion.div>

      {/* Duplicate Groups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredGroups.map((group, index) => {
          const confidenceInfo = getConfidenceLevel(group.confidence);
          const isExpanded = expandedGroups.includes(group.id);

          return (
            <Card key={group.id} className="overflow-hidden">
              <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-base font-medium flex items-center gap-3">
                            {group.contacts.length} contacts similaires
                            <Badge className={confidenceInfo.color}>
                              {group.confidence}% - {confidenceInfo.label}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                            {group.reason} • Détecté le {new Date(group.detectedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Merge className="w-4 h-4" />
                          Fusionner
                        </Button>
                        <Button size="sm" variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      {group.contacts.map((contact, idx) => (
                        <div 
                          key={contact.id} 
                          className={`p-4 rounded-lg bg-card border ${idx === 0 ? 'border-primary/50' : 'border-border'}`}
                        >
                          {idx === 0 && (
                            <Badge variant="outline" className="mb-2 text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Contact principal suggéré
                            </Badge>
                          )}
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-muted-foreground">Nom</span>
                              <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Email</span>
                              <p className="text-sm">{contact.email}</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Entreprise</span>
                              <p className="text-sm">{contact.company || '-'}</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Poste</span>
                              <p className="text-sm">{contact.position || '-'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}

        {filteredGroups.length === 0 && (
          <Card className="p-8 text-center">
            <Check className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Aucun doublon trouvé</h3>
            <p className="text-muted-foreground">
              Aucun groupe de doublons ne correspond à ce filtre.
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Duplicates;
