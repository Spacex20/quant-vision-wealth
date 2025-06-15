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
      activity_feed: {
        Row: {
          content: string | null
          created_at: string
          data: Json | null
          id: string
          referenced_user: string | null
          strategy_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          referenced_user?: string | null
          strategy_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          referenced_user?: string | null
          strategy_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_referenced_user_fkey"
            columns: ["referenced_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      channel_invites: {
        Row: {
          channel_id: string
          created_at: string
          id: string
          invitee_id: string
          inviter_id: string
          status: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          status?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_invites_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_memberships: {
        Row: {
          channel_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_memberships_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
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
          is_dm: boolean
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
          is_dm?: boolean
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
          is_dm?: boolean
          is_private?: boolean
          name?: string
          position?: number
          type?: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_announcements: {
        Row: {
          banner_url: string | null
          content: string
          created_at: string
          created_by: string
          id: string
          server_id: string
        }
        Insert: {
          banner_url?: string | null
          content: string
          created_at?: string
          created_by: string
          id?: string
          server_id: string
        }
        Update: {
          banner_url?: string | null
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          server_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_announcements_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string | null
          server_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          server_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          server_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_audit_logs_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_channels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          position: number
          server_id: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          position?: number
          server_id: string
          type?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          position?: number
          server_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_channels_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          id: string
          server_id: string
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          id?: string
          server_id: string
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          id?: string
          server_id?: string
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_events_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_memberships: {
        Row: {
          id: string
          is_banned: boolean
          joined_at: string
          role: string
          server_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_banned?: boolean
          joined_at?: string
          role?: string
          server_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_banned?: boolean
          joined_at?: string
          role?: string
          server_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_memberships_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_message_reactions: {
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
            foreignKeyName: "investment_server_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "investment_server_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_messages: {
        Row: {
          attachments: Json | null
          channel_id: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          mentions_channel: string[] | null
          mentions_user: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          channel_id: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          mentions_channel?: string[] | null
          mentions_user?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          mentions_channel?: string[] | null
          mentions_user?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "investment_server_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_strategy_shares: {
        Row: {
          created_at: string
          description: string | null
          id: string
          performance: Json | null
          server_id: string
          shared_by: string
          strategy_id: string
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          performance?: Json | null
          server_id: string
          shared_by: string
          strategy_id: string
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          performance?: Json | null
          server_id?: string
          shared_by?: string
          strategy_id?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_strategy_shares_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_strategy_shares_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_strategy_shares_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_server_subscriptions: {
        Row: {
          id: string
          notification_types: string[] | null
          server_id: string
          tag_alerts: string[] | null
          user_id: string
        }
        Insert: {
          id?: string
          notification_types?: string[] | null
          server_id: string
          tag_alerts?: string[] | null
          user_id: string
        }
        Update: {
          id?: string
          notification_types?: string[] | null
          server_id?: string
          tag_alerts?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_server_subscriptions_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "investment_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_server_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_servers: {
        Row: {
          category_tags: string[] | null
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          guidelines: string | null
          icon_url: string | null
          id: string
          is_public: boolean
          name: string
          rules: string | null
          updated_at: string
          visibility: string
        }
        Insert: {
          category_tags?: string[] | null
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          guidelines?: string | null
          icon_url?: string | null
          id?: string
          is_public?: boolean
          name: string
          rules?: string | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          category_tags?: string[] | null
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          guidelines?: string | null
          icon_url?: string | null
          id?: string
          is_public?: boolean
          name?: string
          rules?: string | null
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_servers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      message_reads: {
        Row: {
          id: string
          message_id: string
          seen_at: string
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          seen_at?: string
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          seen_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
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
      performance_snapshots: {
        Row: {
          drawdown: number | null
          id: string
          returns: number | null
          sharpe_ratio: number | null
          snapshot_at: string
          strategy_id: string | null
          user_id: string | null
          volatility: number | null
        }
        Insert: {
          drawdown?: number | null
          id?: string
          returns?: number | null
          sharpe_ratio?: number | null
          snapshot_at?: string
          strategy_id?: string | null
          user_id?: string | null
          volatility?: number | null
        }
        Update: {
          drawdown?: number | null
          id?: string
          returns?: number | null
          sharpe_ratio?: number | null
          snapshot_at?: string
          strategy_id?: string | null
          user_id?: string | null
          volatility?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_snapshots_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          investment_experience: string | null
          investment_goals: string[] | null
          is_curated_trader: boolean
          is_phone_verified: boolean | null
          net_worth_range: string | null
          onboarding_completed: boolean | null
          phone_number: string | null
          preferences: Json | null
          preferred_sectors: string[] | null
          provider: string | null
          provider_id: string | null
          risk_tolerance: string | null
          social_links: Json | null
          time_horizon: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          annual_income_range?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          investment_experience?: string | null
          investment_goals?: string[] | null
          is_curated_trader?: boolean
          is_phone_verified?: boolean | null
          net_worth_range?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          preferences?: Json | null
          preferred_sectors?: string[] | null
          provider?: string | null
          provider_id?: string | null
          risk_tolerance?: string | null
          social_links?: Json | null
          time_horizon?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          annual_income_range?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          investment_goals?: string[] | null
          is_curated_trader?: boolean
          is_phone_verified?: boolean | null
          net_worth_range?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          preferences?: Json | null
          preferred_sectors?: string[] | null
          provider?: string | null
          provider_id?: string | null
          risk_tolerance?: string | null
          social_links?: Json | null
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
      strategy_clones: {
        Row: {
          cloned_by: string
          cloned_from_id: string | null
          created_at: string
          id: string
          name: string | null
          note: string | null
          original_owner: string | null
          strategy_id: string
        }
        Insert: {
          cloned_by: string
          cloned_from_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          note?: string | null
          original_owner?: string | null
          strategy_id: string
        }
        Update: {
          cloned_by?: string
          cloned_from_id?: string | null
          created_at?: string
          id?: string
          name?: string | null
          note?: string | null
          original_owner?: string | null
          strategy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_clones_cloned_by_fkey"
            columns: ["cloned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_clones_cloned_from_id_fkey"
            columns: ["cloned_from_id"]
            isOneToOne: false
            referencedRelation: "strategy_clones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_clones_original_owner_fkey"
            columns: ["original_owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_clones_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_comments: {
        Row: {
          content: string
          created_at: string
          feed_id: string | null
          id: string
          strategy_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          feed_id?: string | null
          id?: string
          strategy_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          feed_id?: string | null
          id?: string
          strategy_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_comments_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "activity_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_comments_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_reactions: {
        Row: {
          created_at: string
          feed_id: string | null
          id: string
          strategy_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feed_id?: string | null
          id?: string
          strategy_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          feed_id?: string | null
          id?: string
          strategy_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_reactions_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "activity_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_reactions_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "trading_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_reactions_user_id_fkey"
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
          clones_count: number
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          language: string
          name: string
          parameters: Json
          upvotes_count: number
          user_id: string
          visibility: string
        }
        Insert: {
          backtest_results?: Json | null
          clones_count?: number
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          language?: string
          name: string
          parameters?: Json
          upvotes_count?: number
          user_id: string
          visibility?: string
        }
        Update: {
          backtest_results?: Json | null
          clones_count?: number
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          language?: string
          name?: string
          parameters?: Json
          upvotes_count?: number
          user_id?: string
          visibility?: string
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
