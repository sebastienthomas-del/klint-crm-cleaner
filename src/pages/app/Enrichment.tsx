import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Building2,
  Linkedin,
  Phone,
  Briefcase,
  Mail,
  Users,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useHubSpot } from '@/hooks/useHubSpot';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

type CrmContact = {
  id: string;
  external_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  position: string | null;
  phone: string | null;
  sector: string | null;
  company_size: string | null;
  linkedin_url: string | null;
  last_activity_at: string | null;
};

type ActivityRow = {
  id: string;
  created_at: string;
  description: string;
  contacts_affected: number | null;
  metadata: Record<string, unknown>;
};

const HS_FIELD_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  industry: { label: 'Secteur', icon: Briefcase },
  hs_linkedin_url: { label: 'LinkedIn', icon: Linkedin },
  num_employees: { label: 'Taille entreprise', icon: Users },
  company: { label: 'Entreprise', icon: Building2 },
  jobtitle: { label: 'Poste', icon: Briefcase },
  phone: { label: 'Téléphone', icon: Phone },
  email: { label: 'Email', icon: Mail },
  firstname: { label: 'Prénom', icon: Users },
  lastname: { label: 'Nom', icon: Users },
};

const LOCAL_TO_HS: Record<string, string> = {
  sector: 'industry',
  linkedin_url: 'hs_linkedin_url',
  company_size: 'num_employees',
  company: 'company',
  position: 'jobtitle',
  phone: 'phone',
};

const Enrichment = () => {
  const { enrich } = useHubSpot();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CrmContact | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const contactsQuery = useQuery({
    queryKey: ['crm_contacts', 'enrichment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select(
          'id, external_id, email, first_name, last_name, company, position, phone, sector, company_size, linkedin_url, last_activity_at',
        )
        .order('updated_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as CrmContact[];
    },
  });

  const historyQuery = useQuery({
    queryKey: ['activity_log', 'enrich'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('id, created_at, description, contacts_affected, metadata')
        .eq('type', 'enrich')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as ActivityRow[];
    },
  });

  const filtered = useMemo(() => {
    const list = contactsQuery.data ?? [];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((c) =>
      [c.first_name, c.last_name, c.email, c.company]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [contactsQuery.data, search]);

  const missingFor = (c: CrmContact) => {
    const missing: { local: string; hs: string; label: string }[] = [];
    Object.entries(LOCAL_TO_HS).forEach(([local, hs]) => {
      if (!c[local as keyof CrmContact]) {
        missing.push({ local, hs, label: HS_FIELD_LABELS[hs]?.label ?? hs });
      }
    });
    return missing;
  };

  const openDialog = (c: CrmContact) => {
    setSelected(c);
    const init: Record<string, string> = {};
    missingFor(c).forEach((m) => (init[m.hs] = ''));
    setFormValues(init);
  };

  const handleEnrich = async () => {
    if (!selected) return;
    const properties = Object.fromEntries(
      Object.entries(formValues).filter(([, v]) => v.trim().length > 0),
    );
    if (Object.keys(properties).length === 0) return;
    await enrich.mutateAsync({ contact_id: selected.id, properties });
    setSelected(null);
    setFormValues({});
    historyQuery.refetch();
    contactsQuery.refetch();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Enrichissement
          </h1>
          <p className="text-muted-foreground mt-1">
            Lancez l'enrichissement d'un contact et suivez l'historique des champs mis à jour.
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contacts list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Contacts</CardTitle>
                <CardDescription>Sélectionnez un contact pour l'enrichir.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {contactsQuery.isLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Aucun contact synchronisé. Connectez HubSpot et lancez la synchro depuis les réglages.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Champs manquants</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const missing = missingFor(c);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">
                          {c.first_name || c.last_name
                            ? `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim()
                            : '—'}
                          {c.company && (
                            <div className="text-xs text-muted-foreground">{c.company}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{c.email ?? '—'}</TableCell>
                        <TableCell>
                          {missing.length === 0 ? (
                            <Badge variant="outline" className="text-xs gap-1">
                              <CheckCircle className="w-3 h-3" /> Complet
                            </Badge>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {missing.slice(0, 3).map((m) => (
                                <Badge key={m.hs} variant="outline" className="text-xs">
                                  {m.label}
                                </Badge>
                              ))}
                              {missing.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{missing.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1"
                            disabled={missing.length === 0}
                            onClick={() => openDialog(c)}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Enrichir
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Historique
            </CardTitle>
            <CardDescription>Derniers enrichissements appliqués à HubSpot.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[480px] pr-3">
              {historyQuery.isLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Chargement…
                </div>
              ) : (historyQuery.data ?? []).length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  Aucun enrichissement encore.
                </div>
              ) : (
                <div className="space-y-3">
                  {historyQuery.data!.map((row) => {
                    const props =
                      (row.metadata as { properties?: Record<string, string> })?.properties ?? {};
                    const fields = Object.entries(props);
                    return (
                      <div
                        key={row.id}
                        className="p-3 rounded-lg border border-border bg-card/50 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium">
                              {fields.length} champ{fields.length > 1 ? 's' : ''} mis à jour
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(row.created_at), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {fields.map(([k, v]) => {
                            const meta = HS_FIELD_LABELS[k];
                            const Icon = meta?.icon ?? Sparkles;
                            return (
                              <Badge
                                key={k}
                                variant="secondary"
                                className="text-xs gap-1 font-normal"
                                title={String(v)}
                              >
                                <Icon className="w-3 h-3" />
                                {meta?.label ?? k}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Enrich dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enrichir {selected?.first_name} {selected?.last_name}</DialogTitle>
            <DialogDescription>
              Renseignez les valeurs à pousser sur HubSpot. Les champs vides sont ignorés.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {selected &&
              missingFor(selected).map((m) => {
                const Icon = HS_FIELD_LABELS[m.hs]?.icon ?? Sparkles;
                return (
                  <div key={m.hs} className="space-y-1.5">
                    <Label className="flex items-center gap-2 text-xs">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {m.label}
                    </Label>
                    <Input
                      value={formValues[m.hs] ?? ''}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, [m.hs]: e.target.value }))
                      }
                      placeholder={`Valeur pour ${m.label.toLowerCase()}`}
                    />
                  </div>
                );
              })}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleEnrich}
              disabled={
                enrich.isPending ||
                Object.values(formValues).every((v) => !v.trim())
              }
              className="gap-2"
            >
              {enrich.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Enrichir sur HubSpot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Enrichment;
