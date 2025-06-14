
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/authService';

export interface Profile {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  risk_tolerance?: string;
  investment_experience?: string;
  investment_goals?: string[];
  annual_income_range?: string;
  net_worth_range?: string;
  time_horizon?: string;
  preferred_sectors?: string[];
  onboarding_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  signUp: (
    email: string, password: string, fullName?: string, username?: string, phone?: string
  ) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from Supabase
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      setProfile(null);
      return null;
    }
    setProfile(data);
    return data;
  };

  const refreshProfile = async () => {
    if (user) {
      return await fetchProfile(user.id);
    }
    setProfile(null);
  };

  useEffect(() => {
    // Set up auth state listener (non-async to avoid deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Get initial session and user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string, rememberMe = false) => {
    const { data, error } = await authService.signIn(email, password);
    if (!error && data?.user) {
      await fetchProfile(data.user.id);
      if (rememberMe) {
        // Already persisted by Supabase, but can add a cookie or localStorage marker if needed
        localStorage.setItem('remember-me', '1');
      } else {
        localStorage.removeItem('remember-me');
      }
    }
    return { data, error };
  };

  const signUp = async (
    email: string, password: string, fullName?: string, username?: string, phone?: string
  ) => {
    // Check username uniqueness before registration
    if (username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
      if (existing) {
        return { error: { message: 'Username is already taken' } };
      }
    }
    // Extra payload for Supabase signup
    const { data, error } = await authService.signUp({
      email,
      password,
      fullName,
      username,
      phone,
    });
    return { data, error };
  };

  const signOut = async () => {
    await authService.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
    window.location.href = '/';
  };

  const value: AuthContextType = {
    user, session, profile, loading, signIn, signUp, signOut, refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
