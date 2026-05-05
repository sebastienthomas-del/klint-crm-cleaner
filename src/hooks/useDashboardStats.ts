import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DashboardStats = {
  totalContacts: number;
  activeContacts: number;
  inactiveContacts: number;
  duplicatesDetected: number;
  contactsToEnrich: number;
  contactsToReactivate: number;
  healthScore: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    status: string;
    contacts_affected: number | null;
    created_at: string;
  }>;
};

function computeHealthScore(total: number, duplicates: number, inactive: number): number {
  if (total === 0) return 100;
  const dupRatio = duplicates / total;
  const inactiveRatio = inactive / total;
  const score = 100 - dupRatio * 40 - inactiveRatio * 30;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const [contactsRes, duplicatesRes, activityRes] = await Promise.all([
        supabase
          .from('crm_contacts')
          .select('id, last_activity_at', { count: 'exact' })
          .eq('user_id', user.id)
          .limit(5000),
        supabase
          .from('duplicate_groups')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'pending'),
        supabase
          .from('activity_log')
          .select('id, type, description, status, contacts_affected, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const contacts = contactsRes.data ?? [];
      const total = contactsRes.count ?? contacts.length;
      const duplicates = duplicatesRes.count ?? 0;

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const inactive = contacts.filter(
        (c) => !c.last_activity_at || new Date(c.last_activity_at) < sixMonthsAgo
      ).length;

      const active = total - inactive;

      const toEnrich = contacts.filter((c) => {
        const raw = c as Record<string, unknown>;
        return !raw.company && !raw.position && !raw.phone;
      }).length;

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const toReactivate = contacts.filter(
        (c) => !c.last_activity_at || new Date(c.last_activity_at) < threeMonthsAgo
      ).length;

      return {
        totalContacts: total,
        activeContacts: active,
        inactiveContacts: inactive,
        duplicatesDetected: duplicates,
        contactsToEnrich: toEnrich,
        contactsToReactivate: toReactivate,
        healthScore: computeHealthScore(total, duplicates, inactive),
        recentActivity: (activityRes.data ?? []) as DashboardStats['recentActivity'],
      };
    },
    staleTime: 60_000,
  });
}
