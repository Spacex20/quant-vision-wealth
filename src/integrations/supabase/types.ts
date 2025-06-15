export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          condition_operator: string | null
          condition_value: number | null
          created_at: string
          id: string
          is_active: boolean
          message: string | null
          symbol: string
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          condition_operator?: string | null
          condition_value?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string | null
          symbol: string
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          condition_operator?: string | null
          condition_value?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string | null
          symbol?: string
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_private: boolean
          name: string
          position: number
          type: Database["public"]["Enums"]["channel_type"]
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean
          name: string
          position?: number
          type?: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_private?: boolean
          name?: string
          position?: number
          type?: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Relationships: []
      }
      market_data_cache: {
        Row: {
          data: Json
          last_updated: string
          symbol: string
        }
        Insert: {
          data: Json
          last_updated?: string
          symbol: string
        }
        Update: {
          data?: Json
          last_updated?: string
          symbol?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          channel_id: string
          content: string
          created_at: string
          id: string
          is_deleted: boolean
          is_pinned: boolean
          thread_id: string | null
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          channel_id: string
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_pinned?: boolean
          thread_id?: string | null
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_pinned?: boolean
          thread_id?: string | null
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_accounts: {
        Row: {
          created_at: string
          current_balance: number
          id: string
          initial_balance: number
          name: string
          total_pnl: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance?: number
          id?: string
          initial_balance?: number
          name: string
          total_pnl?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          id?: string
          initial_balance?: number
          name?: string
          total_pnl?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_orders: {
        Row: {
          account_id: string
          created_at: string
          filled_at: string | null
          filled_price: number | null
          id: string
          order_type: Database["public"]["Enums"]["order_type"]
          price: number | null
          quantity: number
          side: string
          status: Database["public"]["Enums"]["order_status"]
          stop_price: number | null
          symbol: string
        }
        Insert: {
          account_id: string
          created_at?: string
          filled_at?: string | null
          filled_price?: number | null
          id?: string
          order_type: Database["public"]["Enums"]["order_type"]
          price?: number | null
          quantity: number
          side: string
          status?: Database["public"]["Enums"]["order_status"]
          stop_price?: number | null
          symbol: string
        }
        Update: {
          account_id?: string
          created_at?: string
          filled_at?: string | null
          filled_price?: number | null
          id?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          price?: number | null
          quantity?: number
          side?: string
          status?: Database["public"]["Enums"]["order_status"]
          stop_price?: number | null
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "paper_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_positions: {
        Row: {
          account_id: string
          avg_price: number
          current_price: number
          id: string
          quantity: number
          realized_pnl: number
          symbol: string
          unrealized_pnl: number
          updated_at: string
        }
        Insert: {
          account_id: string
          avg_price: number
          current_price?: number
          id?: string
          quantity: number
          realized_pnl?: number
          symbol: string
          unrealized_pnl?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          avg_price?: number
          current_price?: number
          id?: string
          quantity?: number
          realized_pnl?: number
          symbol?: string
          unrealized_pnl?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_positions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "paper_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          id: string
          is_verified: boolean | null
          phone_number: string
          verification_code: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          id?: string
          is_verified?: boolean | null
          phone_number: string
          verification_code: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          is_verified?: boolean | null
          phone_number?: string
          verification_code?: string
        }
        Relationships: []
      }
      portfolio_analytics: {
        Row: {
          analytics_data: Json
          created_at: string
          cumulative_return: number
          daily_return: number
          date: string
          id: string
          max_drawdown: number
          portfolio_id: string
          sharpe_ratio: number
          total_value: number
          volatility: number
        }
        Insert: {
          analytics_data?: Json
          created_at?: string
          cumulative_return?: number
          daily_return?: number
          date: string
          id?: string
          max_drawdown?: number
          portfolio_id: string
          sharpe_ratio?: number
          total_value: number
          volatility?: number
        }
        Update: {
          analytics_data?: Json
          created_at?: string
          cumulative_return?: number
          daily_return?: number
          date?: string
          id?: string
          max_drawdown?: number
          portfolio_id?: string
          sharpe_ratio?: number
          total_value?: number
          volatility?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_analytics_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "user_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          annual_income_range: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          investment_experience: string | null
          investment_goals: string[] | null
          is_phone_verified: boolean | null
          net_worth_range: string | null
          onboarding_completed: boolean | null
          phone_number: string | null
          preferences: Json | null
          preferred_sectors: string[] | null
          provider: string | null
          provider_id: string | null
          risk_tolerance: string | null
          time_horizon: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          annual_income_range?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          investment_experience?: string | null
          investment_goals?: string[] | null
          is_phone_verified?: boolean | null
          net_worth_range?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          preferences?: Json | null
          preferred_sectors?: string[] | null
          provider?: string | null
          provider_id?: string | null
          risk_tolerance?: string | null
          time_horizon?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          annual_income_range?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          investment_goals?: string[] | null
          is_phone_verified?: boolean | null
          net_worth_range?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          preferences?: Json | null
          preferred_sectors?: string[] | null
          provider?: string | null
          provider_id?: string | null
          risk_tolerance?: string | null
          time_horizon?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      research_notebooks: {
        Row: {
          cells: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          language: string
          name: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cells?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          language?: string
          name: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cells?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          language?: string
          name?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_notebooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      research_reports: {
        Row: {
          analysis_type: string
          content: string
          created_at: string
          id: string
          recommendation: string | null
          risk_rating: number | null
          symbol: string
          target_price: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_type: string
          content: string
          created_at?: string
          id?: string
          recommendation?: string | null
          risk_rating?: number | null
          symbol: string
          target_price?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          content?: string
          created_at?: string
          id?: string
          recommendation?: string | null
          risk_rating?: number | null
          symbol?: string
          target_price?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screener_results: {
        Row: {
          created_at: string
          filters: Json
          id: string
          name: string
          results: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          name: string
          results?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          name?: string
          results?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "screener_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_strategies: {
        Row: {
          backtest_results: Json | null
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          language: string
          name: string
          parameters: Json
          user_id: string
        }
        Insert: {
          backtest_results?: Json | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          language?: string
          name: string
          parameters?: Json
          user_id: string
        }
        Update: {
          backtest_results?: Json | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          language?: string
          name?: string
          parameters?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_strategies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolios: {
        Row: {
          assets: Json
          created_at: string
          description: string | null
          id: string
          name: string
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assets?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          total_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assets?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          symbols: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          symbols?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          symbols?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_old_market_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      alert_type: "price" | "volume" | "news" | "technical"
      asset_type: "stock" | "etf" | "bond" | "commodity" | "crypto" | "reit"
      channel_type: "text" | "voice" | "announcement"
      investment_experience: "beginner" | "intermediate" | "advanced" | "expert"
      order_status: "pending" | "filled" | "cancelled" | "rejected"
      order_type: "market" | "limit" | "stop" | "stop_limit"
      risk_tolerance: "conservative" | "moderate" | "aggressive"
      user_role: "admin" | "moderator" | "member" | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_type: ["price", "volume", "news", "technical"],
      asset_type: ["stock", "etf", "bond", "commodity", "crypto", "reit"],
      channel_type: ["text", "voice", "announcement"],
      investment_experience: ["beginner", "intermediate", "advanced", "expert"],
      order_status: ["pending", "filled", "cancelled", "rejected"],
      order_type: ["market", "limit", "stop", "stop_limit"],
      risk_tolerance: ["conservative", "moderate", "aggressive"],
      user_role: ["admin", "moderator", "member", "guest"],
    },
  },
} as const
