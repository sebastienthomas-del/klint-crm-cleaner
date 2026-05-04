import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Shield, Webhook, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
};

async function hashKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return 'klea_' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function ApiKeys() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const { data: keys = [], isLoading } = useQuery<ApiKey[]>({
    queryKey: ['api_keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, key_prefix, permissions, is_active, created_at, last_used_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const createKey = useMutation({
    mutationFn: async (name: string) => {
      const rawKey = generateKey();
      const hash = await hashKey(rawKey);
      const prefix = rawKey.slice(0, 12);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase.from('api_keys').insert({
        user_id: user.id,
        name,
        key_prefix: prefix,
        key_hash: hash,
        permissions: ['read', 'write'],
      });

      if (error) throw error;
      return rawKey;
    },
    onSuccess: (rawKey) => {
      setCreatedKey(rawKey);
      setShowKey(true);
      setNewKeyName('');
      setShowCreate(false);
      qc.invalidateQueries({ queryKey: ['api_keys'] });
    },
    onError: () => toast({ title: 'Erreur lors de la création', variant: 'destructive' }),
  });

  const revokeKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('api_keys').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Clé révoquée' });
      qc.invalidateQueries({ queryKey: ['api_keys'] });
    },
    onError: () => toast({ title: 'Erreur lors de la révocation', variant: 'destructive' }),
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copié dans le presse-papier' });
  };

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/klea-api`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">API Kléa</h1>
          <p className="text-muted-foreground mt-1">
            Connectez votre CRM à Kléa via notre API REST sécurisée.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gradient-primary shadow-glow gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle clé
        </Button>
      </div>

      {/* API Base URL */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Webhook className="w-4 h-4 text-primary" />
          URL de base
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-lg font-mono text-foreground break-all">
            {baseUrl}
          </code>
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(baseUrl)}>
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Endpoints reference */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Shield className="w-4 h-4 text-primary" />
          Endpoints disponibles
        </div>
        <div className="space-y-2 text-sm font-mono">
          {[
            { method: 'POST',   path: '/contacts',              desc: 'Importer des contacts (batch)' },
            { method: 'GET',    path: '/contacts',              desc: 'Lister les contacts' },
            { method: 'GET',    path: '/contacts/:id',          desc: 'Obtenir un contact' },
            { method: 'PATCH',  path: '/contacts/:id',          desc: 'Mettre à jour un contact' },
            { method: 'DELETE', path: '/contacts/:id',          desc: 'Supprimer un contact' },
            { method: 'POST',   path: '/analyze',               desc: 'Détecter les doublons + scorer' },
            { method: 'GET',    path: '/duplicates',            desc: 'Lister les groupes de doublons' },
            { method: 'POST',   path: '/duplicates/:id/merge',  desc: 'Fusionner un groupe' },
            { method: 'PATCH',  path: '/duplicates/:id',        desc: 'Ignorer un groupe' },
            { method: 'GET',    path: '/quality',               desc: 'Score de santé CRM' },
          ].map(({ method, path, desc }) => (
            <div key={path + method} className="flex items-center gap-3">
              <span className={`w-14 text-xs font-bold px-1.5 py-0.5 rounded text-center
                ${method === 'GET' ? 'bg-blue-500/15 text-blue-500' :
                  method === 'POST' ? 'bg-green-500/15 text-green-500' :
                  method === 'PATCH' ? 'bg-yellow-500/15 text-yellow-500' :
                  'bg-red-500/15 text-red-500'}`}>
                {method}
              </span>
              <span className="text-foreground w-52">{path}</span>
              <span className="text-muted-foreground text-xs">{desc}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          Authentification : <code className="bg-muted px-1.5 py-0.5 rounded">Authorization: Bearer klea_...</code>
        </div>
      </div>

      {/* Keys list */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Clés API ({keys.filter(k => k.is_active).length} active{keys.filter(k => k.is_active).length > 1 ? 's' : ''})
        </h2>

        {isLoading && (
          <div className="text-sm text-muted-foreground py-4">Chargement…</div>
        )}

        {!isLoading && keys.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            <Key className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>Aucune clé API. Créez-en une pour commencer.</p>
          </div>
        )}

        {keys.map((k) => (
          <div
            key={k.id}
            className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${
              k.is_active ? 'border-border' : 'border-border/40 opacity-50'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{k.name}</span>
                {!k.is_active && <Badge variant="secondary">Révoquée</Badge>}
              </div>
              <code className="text-xs text-muted-foreground">{k.key_prefix}••••••••••••••••••••••••••••</code>
              <p className="text-xs text-muted-foreground mt-0.5">
                Créée le {new Date(k.created_at).toLocaleDateString('fr-FR')}
                {k.last_used_at && ` · Dernière utilisation : ${new Date(k.last_used_at).toLocaleDateString('fr-FR')}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {k.permissions.map((p) => (
                <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
              ))}
              {k.is_active && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => revokeKey.mutate(k.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create key dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une clé API</DialogTitle>
            <DialogDescription>
              Donnez un nom à cette clé pour identifier son usage (ex: HubSpot, Salesforce, Webhook CI).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Nom de la clé (ex: Intégration HubSpot)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newKeyName.trim() && createKey.mutate(newKeyName.trim())}
            />
            <Button
              className="w-full gradient-primary"
              disabled={!newKeyName.trim() || createKey.isPending}
              onClick={() => createKey.mutate(newKeyName.trim())}
            >
              {createKey.isPending ? 'Création…' : 'Créer la clé'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Show key once dialog */}
      <Dialog open={!!createdKey} onOpenChange={() => { setCreatedKey(null); setShowKey(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Clé créée avec succès
            </DialogTitle>
            <DialogDescription>
              Copiez cette clé maintenant — elle ne sera plus affichée après fermeture.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-3 py-2.5 rounded-lg text-sm font-mono break-all">
                {showKey ? createdKey : '•'.repeat(48)}
              </code>
              <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(createdKey!)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground bg-warning/10 border border-warning/20 rounded-lg px-3 py-2">
              Ajoutez cette clé dans votre CRM sous le header HTTP :<br />
              <code className="font-mono">Authorization: Bearer {createdKey?.slice(0, 16)}…</code>
            </p>
            <Button className="w-full" onClick={() => { setCreatedKey(null); setShowKey(false); }}>
              J'ai copié ma clé
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
