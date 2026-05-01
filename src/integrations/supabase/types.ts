export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          contacts_affected: number | null
          created_at: string
          description: string
          id: string
          metadata: Json
          status: string
          type: string
          user_id: string
        }
        Insert: {
          contacts_affected?: number | null
          created_at?: string
          description: string
          id?: string
          metadata?: Json
          status?: string
          type: string
          user_id: string
        }
        Update: {
          contacts_affected?: number | null
          created_at?: string
          description?: string
          id?: string
          metadata?: Json
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_suggestions: {
        Row: {
          actions: Json
          created_at: string
          id: string
          message: string
          metadata: Json
          priority: number
          related_entity: string | null
          related_id: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          trigger: string
          user_id: string
        }
        Insert: {
          actions?: Json
          created_at?: string
          id?: string
          message: string
          metadata?: Json
          priority?: number
          related_entity?: string | null
          related_id?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          trigger: string
          user_id: string
        }
        Update: {
          actions?: Json
          created_at?: string
          id?: string
          message?: string
          metadata?: Json
          priority?: number
          related_entity?: string | null
          related_id?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          trigger?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_runs: {
        Row: {
          contacts_scanned: number
          created_at: string
          duplicates_found: number
          duration_ms: number
          hidden_opportunities: number
          id: string
          insights: Json
          obsolete_contacts: number
          user_id: string
        }
        Insert: {
          contacts_scanned?: number
          created_at?: string
          duplicates_found?: number
          duration_ms?: number
          hidden_opportunities?: number
          id?: string
          insights?: Json
          obsolete_contacts?: number
          user_id: string
        }
        Update: {
          contacts_scanned?: number
          created_at?: string
          duplicates_found?: number
          duration_ms?: number
          hidden_opportunities?: number
          id?: string
          insights?: Json
          obsolete_contacts?: number
          user_id?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          alerts_enabled: boolean
          auto_enrich_enabled: boolean
          auto_merge_threshold: number
          created_at: string
          id: string
          is_active: boolean
          scan_frequency: string
          updated_at: string
          user_id: string
          weekly_report_enabled: boolean
        }
        Insert: {
          alerts_enabled?: boolean
          auto_enrich_enabled?: boolean
          auto_merge_threshold?: number
          created_at?: string
          id?: string
          is_active?: boolean
          scan_frequency?: string
          updated_at?: string
          user_id: string
          weekly_report_enabled?: boolean
        }
        Update: {
          alerts_enabled?: boolean
          auto_enrich_enabled?: boolean
          auto_merge_threshold?: number
          created_at?: string
          id?: string
          is_active?: boolean
          scan_frequency?: string
          updated_at?: string
          user_id?: string
          weekly_report_enabled?: boolean
        }
        Relationships: []
      }
      company_signals: {
        Row: {
          acknowledged: boolean
          company_name: string
          description: string | null
          detected_at: string
          id: string
          metadata: Json
          signal_type: Database["public"]["Enums"]["company_signal_type"]
          source_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean
          company_name: string
          description?: string | null
          detected_at?: string
          id?: string
          metadata?: Json
          signal_type: Database["public"]["Enums"]["company_signal_type"]
          source_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean
          company_name?: string
          description?: string | null
          detected_at?: string
          id?: string
          metadata?: Json
          signal_type?: Database["public"]["Enums"]["company_signal_type"]
          source_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_changes: {
        Row: {
          acknowledged: boolean
          change_type: Database["public"]["Enums"]["contact_change_type"]
          contact_id: string
          detected_at: string
          id: string
          metadata: Json
          new_value: string | null
          previous_value: string | null
          source: string
          user_id: string
        }
        Insert: {
          acknowledged?: boolean
          change_type: Database["public"]["Enums"]["contact_change_type"]
          contact_id: string
          detected_at?: string
          id?: string
          metadata?: Json
          new_value?: string | null
          previous_value?: string | null
          source?: string
          user_id: string
        }
        Update: {
          acknowledged?: boolean
          change_type?: Database["public"]["Enums"]["contact_change_type"]
          contact_id?: string
          detected_at?: string
          id?: string
          metadata?: Json
          new_value?: string | null
          previous_value?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          action: string | null
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          metadata: Json
          type: Database["public"]["Enums"]["credit_tx_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          action?: string | null
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          type: Database["public"]["Enums"]["credit_tx_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          action?: string | null
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          type?: Database["public"]["Enums"]["credit_tx_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "credit_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          monthly_grant: number
          plan: Database["public"]["Enums"]["plan_tier"]
          renews_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          monthly_grant?: number
          plan?: Database["public"]["Enums"]["plan_tier"]
          renews_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          monthly_grant?: number
          plan?: Database["public"]["Enums"]["plan_tier"]
          renews_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_connections: {
        Row: {
          connected_at: string | null
          created_at: string
          id: string
          last_sync_at: string | null
          metadata: Json
          provider: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string
          id?: string
          last_sync_at?: string | null
          metadata?: Json
          provider: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string
          id?: string
          last_sync_at?: string | null
          metadata?: Json
          provider?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          company: string | null
          company_size: string | null
          created_at: string
          email: string | null
          email_status: string | null
          external_id: string
          first_name: string | null
          id: string
          is_inactive: boolean
          last_activity_at: string | null
          last_name: string | null
          last_verified_at: string | null
          linkedin_url: string | null
          phone: string | null
          position: string | null
          provider: string
          quality_breakdown: Json
          quality_score: number | null
          raw: Json
          sector: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          email_status?: string | null
          external_id: string
          first_name?: string | null
          id?: string
          is_inactive?: boolean
          last_activity_at?: string | null
          last_name?: string | null
          last_verified_at?: string | null
          linkedin_url?: string | null
          phone?: string | null
          position?: string | null
          provider?: string
          quality_breakdown?: Json
          quality_score?: number | null
          raw?: Json
          sector?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          company_size?: string | null
          created_at?: string
          email?: string | null
          email_status?: string | null
          external_id?: string
          first_name?: string | null
          id?: string
          is_inactive?: boolean
          last_activity_at?: string | null
          last_name?: string | null
          last_verified_at?: string | null
          linkedin_url?: string | null
          phone?: string | null
          position?: string | null
          provider?: string
          quality_breakdown?: Json
          quality_score?: number | null
          raw?: Json
          sector?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      duplicate_group_contacts: {
        Row: {
          contact_id: string
          group_id: string
        }
        Insert: {
          contact_id: string
          group_id: string
        }
        Update: {
          contact_id?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duplicate_group_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duplicate_group_contacts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "duplicate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_groups: {
        Row: {
          confidence: number
          created_at: string
          detected_at: string
          id: string
          master_contact_id: string | null
          metadata: Json
          reason: string
          resolved_at: string | null
          status: Database["public"]["Enums"]["duplicate_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence: number
          created_at?: string
          detected_at?: string
          id?: string
          master_contact_id?: string | null
          metadata?: Json
          reason: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["duplicate_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          detected_at?: string
          id?: string
          master_contact_id?: string | null
          metadata?: Json
          reason?: string
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["duplicate_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duplicate_groups_master_contact_id_fkey"
            columns: ["master_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      enrichment_jobs: {
        Row: {
          contact_id: string
          created_at: string
          error: string | null
          fields: string[]
          id: string
          result: Json
          status: Database["public"]["Enums"]["enrichment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          error?: string | null
          fields?: string[]
          id?: string
          result?: Json
          status?: Database["public"]["Enums"]["enrichment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          error?: string | null
          fields?: string[]
          id?: string
          result?: Json
          status?: Database["public"]["Enums"]["enrichment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrichment_jobs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          cleaned_storage_path: string | null
          column_mapping: Json
          created_at: string
          duplicates_found: number
          filename: string
          id: string
          invalid_emails: number
          report: Json
          rows_total: number
          status: Database["public"]["Enums"]["import_status"]
          storage_path: string
          unknown_companies: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cleaned_storage_path?: string | null
          column_mapping?: Json
          created_at?: string
          duplicates_found?: number
          filename: string
          id?: string
          invalid_emails?: number
          report?: Json
          rows_total?: number
          status?: Database["public"]["Enums"]["import_status"]
          storage_path: string
          unknown_companies?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cleaned_storage_path?: string | null
          column_mapping?: Json
          created_at?: string
          duplicates_found?: number
          filename?: string
          id?: string
          invalid_emails?: number
          report?: Json
          rows_total?: number
          status?: Database["public"]["Enums"]["import_status"]
          storage_path?: string
          unknown_companies?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quality_score_history: {
        Row: {
          avg_score: number
          contacts_total: number
          created_at: string
          duplicates_total: number
          id: string
          inactive_total: number
          metadata: Json
          snapshot_date: string
          user_id: string
        }
        Insert: {
          avg_score: number
          contacts_total?: number
          created_at?: string
          duplicates_total?: number
          id?: string
          inactive_total?: number
          metadata?: Json
          snapshot_date?: string
          user_id: string
        }
        Update: {
          avg_score?: number
          contacts_total?: number
          created_at?: string
          duplicates_total?: number
          id?: string
          inactive_total?: number
          metadata?: Json
          snapshot_date?: string
          user_id?: string
        }
        Relationships: []
      }
      reactivation_leads: {
        Row: {
          contact_id: string
          detected_at: string
          id: string
          metadata: Json
          reason: string
          recommended_action: string | null
          resolved_at: string | null
          score: number
          status: string
          trigger: string | null
          user_id: string
        }
        Insert: {
          contact_id: string
          detected_at?: string
          id?: string
          metadata?: Json
          reason: string
          recommended_action?: string | null
          resolved_at?: string | null
          score: number
          status?: string
          trigger?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string
          detected_at?: string
          id?: string
          metadata?: Json
          reason?: string
          recommended_action?: string | null
          resolved_at?: string | null
          score?: number
          status?: string
          trigger?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json
          created_at: string
          id: string
          period: Database["public"]["Enums"]["report_period"]
          period_end: string
          period_start: string
          recipients: string[]
          sent_at: string | null
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          period: Database["public"]["Enums"]["report_period"]
          period_end: string
          period_start: string
          recipients?: string[]
          sent_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          period?: Database["public"]["Enums"]["report_period"]
          period_end?: string
          period_start?: string
          recipients?: string[]
          sent_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_credits: {
        Args: {
          _action: string
          _amount: number
          _description?: string
          _metadata?: Json
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
      company_signal_type:
        | "funding"
        | "ma"
        | "hiring"
        | "expansion"
        | "bankruptcy"
        | "rename"
      contact_change_type:
        | "job_change"
        | "company_change"
        | "email_bounce"
        | "unsubscribed"
        | "left_company"
      credit_tx_type: "debit" | "credit" | "grant" | "rollover" | "refund"
      duplicate_status: "pending" | "merged" | "dismissed"
      enrichment_status: "pending" | "done" | "failed"
      import_status:
        | "uploaded"
        | "analyzing"
        | "cleaned"
        | "imported"
        | "failed"
      plan_tier: "starter" | "growth" | "scale" | "enterprise"
      report_period: "weekly" | "monthly"
      suggestion_status: "pending" | "accepted" | "dismissed" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member"],
      company_signal_type: [
        "funding",
        "ma",
        "hiring",
        "expansion",
        "bankruptcy",
        "rename",
      ],
      contact_change_type: [
        "job_change",
        "company_change",
        "email_bounce",
        "unsubscribed",
        "left_company",
      ],
      credit_tx_type: ["debit", "credit", "grant", "rollover", "refund"],
      duplicate_status: ["pending", "merged", "dismissed"],
      enrichment_status: ["pending", "done", "failed"],
      import_status: ["uploaded", "analyzing", "cleaned", "imported", "failed"],
      plan_tier: ["starter", "growth", "scale", "enterprise"],
      report_period: ["weekly", "monthly"],
      suggestion_status: ["pending", "accepted", "dismissed", "expired"],
    },
  },
} as const
