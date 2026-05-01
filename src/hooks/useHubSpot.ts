import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const invokeFn = async <T,>(name: string, body?: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (error) throw new Error(error.message);
  return data as T;
};

export const useHubSpot = () => {
  const qc = useQueryClient();

  const connection = useQuery({
    queryKey: ["crm_connections", "hubspot"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_connections")
        .select("*")
        .eq("provider", "hubspot")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const sync = useMutation({
    mutationFn: () => invokeFn<{ synced: number }>("hubspot-sync-contacts"),
    onSuccess: (d) => {
      toast({ title: "Sync HubSpot", description: `${d?.synced ?? 0} contacts synchronisés` });
      qc.invalidateQueries({ queryKey: ["crm_contacts"] });
      qc.invalidateQueries({ queryKey: ["crm_connections"] });
    },
    onError: (e: Error) =>
      toast({ title: "Sync échouée", description: e.message, variant: "destructive" }),
  });

  const detectDuplicates = useMutation({
    mutationFn: () => invokeFn<{ groups: number }>("hubspot-detect-duplicates"),
    onSuccess: (d) => {
      toast({ title: "Détection terminée", description: `${d?.groups ?? 0} groupes de doublons` });
      qc.invalidateQueries({ queryKey: ["duplicate_groups"] });
    },
    onError: (e: Error) =>
      toast({ title: "Détection échouée", description: e.message, variant: "destructive" }),
  });

  const merge = useMutation({
    mutationFn: (vars: { group_id: string; master_contact_id: string }) =>
      invokeFn<{ merged: number; errors: string[] }>("hubspot-merge-contacts", vars),
    onSuccess: (d) => {
      toast({ title: "Fusion HubSpot", description: `${d?.merged ?? 0} contacts fusionnés` });
      qc.invalidateQueries({ queryKey: ["duplicate_groups"] });
      qc.invalidateQueries({ queryKey: ["crm_contacts"] });
    },
    onError: (e: Error) =>
      toast({ title: "Fusion échouée", description: e.message, variant: "destructive" }),
  });

  const enrich = useMutation({
    mutationFn: (vars: { contact_id: string; properties: Record<string, string> }) =>
      invokeFn<{ updated: Record<string, string> }>("hubspot-enrich-contact", vars),
    onSuccess: () => {
      toast({ title: "Contact enrichi", description: "Mise à jour HubSpot OK" });
      qc.invalidateQueries({ queryKey: ["crm_contacts"] });
    },
    onError: (e: Error) =>
      toast({ title: "Enrichissement échoué", description: e.message, variant: "destructive" }),
  });

  return { connection, sync, detectDuplicates, merge, enrich };
};
