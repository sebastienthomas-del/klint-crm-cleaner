import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshCw, Download, Mail, Phone, Calendar,
  TrendingUp, Users, Clock, Search, Filter, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

type Contact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company: string | null;
  position: string | null;
  phone: string | null;
  last_activity_at: string | null;
};

function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}

function inactivityScore(lastActivity: string | null): number {
  if (!lastActivity) return 30;
  const months = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (months > 12) return 90;
  if (months > 6) return 70;
  if (months > 3) return 50;
  return 30;
}

function exportCSV(contacts: Contact[]) {
  const header = 'Prénom,Nom,Email,Entreprise,Poste,Téléphone,Dernière activité';
  const rows = contacts.map((c) =>
    [c.first_name, c.last_name, c.email, c.company, c.position, c.phone,
      c.last_activity_at ? new Date(c.last_activity_at).toLocaleDateString('fr-FR') : '']
      .map((v) => `"${(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'reactivation.csv'; a.click();
  URL.revokeObjectURL(url);
}

const Reactivation = () => {
  const [inactivityFilter, setInactivityFilter] = useState('3m');
  const [searchQuery, setSearchQuery] = useState('');

  const cutoff = inactivityFilter === '3m' ? monthsAgo(3)
    : inactivityFilter === '6m' ? monthsAgo(6)
    : inactivityFilter === '12m' ? monthsAgo(12)
    : monthsAgo(1);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['reactivation_contacts', inactivityFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('id, first_name, last_name, email, company, position, phone, last_activity_at')
        .or(`last_activity_at.lt.${cutoff},last_activity_at.is.null`)
        .order('last_activity_at', { ascending: true, nullsFirst: true })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as Contact[];
    },
  });

  const filtered = useMemo(() => {
    if (!searchQuery) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter((c) =>
      [c.first_name, c.last_name, c.email, c.company]
        .filter(Boolean).some((v) => v!.toLowerCase().includes(q))
    );
  }, [contacts, searchQuery]);

  const stats = {
    total: contacts.length,
    plus6m: contacts.filter((c) => !c.last_activity_at || c.last_activity_at < monthsAgo(6)).length,
    plus12m: contacts.filter((c) => !c.last_activity_at || c.last_activity_at < monthsAgo(12)).length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary" />
            Réactivation des contacts
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} contacts dormants avec potentiel de réengagement
          </p>
        </div>
        <Button className="gap-2" onClick={() => exportCSV(filtered)} disabled={filtered.length === 0}>
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Contacts dormants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.plus6m}</p>
              <p className="text-xs text-muted-foreground">Inactifs 6+ mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.plus12m}</p>
              <p className="text-xs text-muted-foreground">Inactifs 12+ mois</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <CardTitle className="text-lg">Contacts à réactiver</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Rechercher..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
                </div>
                <Select value={inactivityFilter} onValueChange={setInactivityFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1+ mois</SelectItem>
                    <SelectItem value="3m">3+ mois</SelectItem>
                    <SelectItem value="6m">6+ mois</SelectItem>
                    <SelectItem value="12m">12+ mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                {contacts.length === 0
                  ? 'Aucun contact synchronisé. Connectez HubSpot dans Paramètres.'
                  : 'Aucun contact correspond à ce filtre.'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const score = inactivityScore(c.last_activity_at);
                    const priority = score >= 80 ? 'haute' : score >= 60 ? 'moyenne' : 'basse';
                    const priorityColor = score >= 80
                      ? 'bg-destructive/10 text-destructive border-destructive/20'
                      : score >= 60
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : 'bg-muted text-muted-foreground';
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {[c.first_name, c.last_name].filter(Boolean).join(' ') || '—'}
                            </p>
                            <p className="text-sm text-muted-foreground">{c.position ?? ''}</p>
                          </div>
                        </TableCell>
                        <TableCell>{c.company ?? '—'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {c.last_activity_at
                              ? new Date(c.last_activity_at).toLocaleDateString('fr-FR')
                              : 'Jamais'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColor}>{priority}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {c.email && (
                              <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                <a href={`mailto:${c.email}`}><Mail className="w-4 h-4" /></a>
                              </Button>
                            )}
                            {c.phone && (
                              <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                <a href={`tel:${c.phone}`}><Phone className="w-4 h-4" /></a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reactivation;
