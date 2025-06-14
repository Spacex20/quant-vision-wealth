
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  signInWithLinkedIn: () => Promise<any>;
  signInWithTwitter: () => Promise<any>;
  signInWithDiscord: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Track session if user is signed in
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            authService.trackSession({
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            });
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await authService.signUp({
      email,
      password,
      fullName
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = () => authService.signInWithGoogle();
  const signInWithApple = () => authService.signInWithApple();
  const signInWithLinkedIn = () => authService.signInWithLinkedIn();
  const signInWithTwitter = () => authService.signInWithTwitter();
  const signInWithDiscord = () => authService.signInWithDiscord();

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    signInWithLinkedIn,
    signInWithTwitter,
    signInWithDiscord
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
