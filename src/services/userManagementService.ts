// User Management Service - User profiles, preferences, and account management
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationPreferences;
  trading: TradingPreferences;
  privacy: PrivacyPreferences;
  display: DisplayPreferences;
  updatedAt: string;
}

export interface NotificationPreferences {
  email: {
    portfolioUpdates: boolean;
    marketAlerts: boolean;
    newsDigest: boolean;
    performanceReports: boolean;
    systemUpdates: boolean;
  };
  push: {
    priceAlerts: boolean;
    portfolioMilestones: boolean;
    marketNews: boolean;
    rebalanceReminders: boolean;
  };
  sms: {
    urgentAlerts: boolean;
    securityAlerts: boolean;
  };
}

export interface TradingPreferences {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long';
  autoRebalancing: boolean;
  rebalanceThreshold: number; // percentage
  preferredAssetTypes: string[];
  excludedSectors: string[];
  maxPositions: number;
  defaultOrderType: 'market' | 'limit';
  confirmTrades: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'friends';
  sharePerformance: boolean;
  shareHoldings: boolean;
  allowAnalytics: boolean;
  marketingEmails: boolean;
  dataRetention: number; // days
}

export interface DisplayPreferences {
  dashboardLayout: 'compact' | 'detailed' | 'custom';
  defaultTimeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  chartType: 'line' | 'candlestick' | 'area';
  showAdvancedMetrics: boolean;
  customDashboard: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: 'portfolio_overview' | 'market_summary' | 'watchlist' | 'news' | 'performance_chart' | 'sector_allocation';
  position: { x: number; y: number; width: number; height: number };
  config: any;
  isVisible: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  startTime: string;
  lastActivity: string;
  isActive: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
}

class UserManagementService {
  private profileCache: Map<string, { profile: UserProfile; timestamp: number }> = new Map();
  private preferencesCache: Map<string, { preferences: UserPreferences; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  // User Profile Management
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const cached = this.getProfileFromCache(user.id);
    if (cached) return cached;

    // In production, fetch from profiles table
    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      firstName: user.user_metadata?.firstName,
      lastName: user.user_metadata?.lastName,
      displayName: user.user_metadata?.displayName || user.email?.split('@')[0],
      avatar: user.user_metadata?.avatar,
      phoneNumber: user.user_metadata?.phoneNumber,
      dateOfBirth: user.user_metadata?.dateOfBirth,
      country: user.user_metadata?.country,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: 'USD',
      createdAt: user.created_at,
      updatedAt: new Date().toISOString(),
      lastLoginAt: user.last_sign_in_at,
      isActive: true,
      emailVerified: !!user.email_confirmed_at
    };

    this.cacheProfile(user.id, profile);
    return profile;
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    console.log('User Management: Updating user profile', updates);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Update auth metadata
    if (updates.firstName || updates.lastName || updates.displayName || updates.avatar) {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: updates.firstName,
          lastName: updates.lastName,
          displayName: updates.displayName,
          avatar: updates.avatar
        }
      });

      if (error) {
        console.error('Error updating auth metadata:', error);
        throw error;
      }
    }

    // Update email if provided
    if (updates.email && updates.email !== user.email) {
      const { error } = await supabase.auth.updateUser({
        email: updates.email
      });

      if (error) {
        console.error('Error updating email:', error);
        throw error;
      }
    }

    // Clear cache and return updated profile
    this.profileCache.delete(user.id);
    return this.getCurrentUser();
  }

  // User Preferences Management
  async getUserPreferences(userId?: string): Promise<UserPreferences> {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) {
      throw new Error('User not authenticated');
    }

    const cached = this.getPreferencesFromCache(targetUserId);
    if (cached) return cached;

    // In production, fetch from preferences table
    const defaultPreferences: UserPreferences = {
      userId: targetUserId,
      theme: 'light',
      language: 'en',
      notifications: {
        email: {
          portfolioUpdates: true,
          marketAlerts: true,
          newsDigest: false,
          performanceReports: true,
          systemUpdates: true
        },
        push: {
          priceAlerts: false,
          portfolioMilestones: true,
          marketNews: false,
          rebalanceReminders: true
        },
        sms: {
          urgentAlerts: false,
          securityAlerts: true
        }
      },
      trading: {
        riskTolerance: 'moderate',
        investmentHorizon: 'long',
        autoRebalancing: false,
        rebalanceThreshold: 5,
        preferredAssetTypes: ['stocks', 'etfs'],
        excludedSectors: [],
        maxPositions: 20,
        defaultOrderType: 'market',
        confirmTrades: true
      },
      privacy: {
        profileVisibility: 'private',
        sharePerformance: false,
        shareHoldings: false,
        allowAnalytics: true,
        marketingEmails: false,
        dataRetention: 365
      },
      display: {
        dashboardLayout: 'detailed',
        defaultTimeframe: '1M',
        chartType: 'line',
        showAdvancedMetrics: false,
        customDashboard: []
      },
      updatedAt: new Date().toISOString()
    };

    this.cachePreferences(targetUserId, defaultPreferences);
    return defaultPreferences;
  }

  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    console.log('User Management: Updating user preferences', updates);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const currentPreferences = await this.getUserPreferences(user.id);
    const updatedPreferences: UserPreferences = {
      ...currentPreferences,
      ...updates,
      userId: user.id,
      updatedAt: new Date().toISOString()
    };

    // In production, save to preferences table
    this.cachePreferences(user.id, updatedPreferences);
    
    return updatedPreferences;
  }

  // Session Management
  async getCurrentSession(): Promise<UserSession | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    // Mock session data (in production, store in database)
    return {
      id: session.access_token.substring(0, 10),
      userId: session.user.id,
      deviceInfo: navigator.userAgent,
      ipAddress: '0.0.0.0', // Would be captured server-side
      location: 'Unknown', // Would be determined from IP
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };
  }

  async getUserSessions(userId: string): Promise<UserSession[]> {
    console.log('User Management: Fetching user sessions for', userId);

    // In production, fetch from sessions table
    // Mock data for demonstration
    return [
      {
        id: 'session_1',
        userId,
        deviceInfo: 'Chrome on Windows',
        ipAddress: '192.168.1.1',
        location: 'New York, NY',
        startTime: new Date(Date.now() - 86400000).toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: true
      },
      {
        id: 'session_2',
        userId,
        deviceInfo: 'Safari on iPhone',
        ipAddress: '192.168.1.2',
        location: 'New York, NY',
        startTime: new Date(Date.now() - 172800000).toISOString(),
        lastActivity: new Date(Date.now() - 3600000).toISOString(),
        isActive: false
      }
    ];
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    console.log('User Management: Terminating session', sessionId);

    // In production, update session status in database
    // For current session, sign out
    if (sessionId === 'current') {
      const { error } = await supabase.auth.signOut();
      return !error;
    }

    return true;
  }

  // Activity Tracking
  async logActivity(action: string, details: any = {}): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log('User Management: Logging activity', action, details);

    const activity: UserActivity = {
      id: `activity_${Date.now()}`,
      userId: user.id,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '0.0.0.0', // Would be captured server-side
      deviceInfo: navigator.userAgent
    };

    // In production, store in activities table
    // For now, store in localStorage for demo
    const stored = localStorage.getItem('user_activities') || '[]';
    const activities = JSON.parse(stored);
    activities.push(activity);
    
    // Keep only last 100 activities
    const recentActivities = activities.slice(-100);
    localStorage.setItem('user_activities', JSON.stringify(recentActivities));
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    console.log('User Management: Fetching user activities for', userId);

    // In production, fetch from activities table
    const stored = localStorage.getItem('user_activities') || '[]';
    const activities = JSON.parse(stored);
    
    return activities
      .filter((activity: UserActivity) => activity.userId === userId)
      .slice(-limit)
      .reverse();
  }

  // Account Management
  async deleteAccount(): Promise<boolean> {
    console.log('User Management: Deleting user account');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      // Log the account deletion activity
      await this.logActivity('account_deleted', { reason: 'user_request' });

      // In production, you would:
      // 1. Delete user data from all tables
      // 2. Anonymize or delete personal information
      // 3. Cancel subscriptions
      // 4. Delete auth user

      // For now, just sign out
      const { error } = await supabase.auth.signOut();
      return !error;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    console.log('User Management: Changing user password');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error changing password:', error);
        return false;
      }

      await this.logActivity('password_changed');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    console.log('User Management: Requesting password reset for', email);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      return !error;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return false;
    }
  }

  // Account Settings
  async exportUserData(): Promise<any> {
    console.log('User Management: Exporting user data');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const [profile, preferences, sessions, activities] = await Promise.all([
      this.getCurrentUser(),
      this.getUserPreferences(),
      this.getUserSessions(user.id),
      this.getUserActivities(user.id)
    ]);

    return {
      profile,
      preferences,
      sessions,
      activities,
      exportedAt: new Date().toISOString()
    };
  }

  // Private helper methods
  private getProfileFromCache(userId: string): UserProfile | null {
    const cached = this.profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.profile;
    }
    this.profileCache.delete(userId);
    return null;
  }

  private cacheProfile(userId: string, profile: UserProfile): void {
    this.profileCache.set(userId, { profile, timestamp: Date.now() });
  }

  private getPreferencesFromCache(userId: string): UserPreferences | null {
    const cached = this.preferencesCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.preferences;
    }
    this.preferencesCache.delete(userId);
    return null;
  }

  private cachePreferences(userId: string, preferences: UserPreferences): void {
    this.preferencesCache.set(userId, { preferences, timestamp: Date.now() });
  }
}

export const userManagementService = new UserManagementService();
