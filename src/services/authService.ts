
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  username?: string;
  phone?: string;
}

class AuthService {
  async signUp(signUpData: SignUpData) {
    const redirectUrl = `${window.location.origin}/`;
    const { email, password, fullName, username, phone } = signUpData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || "",
          username: username || "",
          phone_number: phone || "",
        }
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
}

export const authService = new AuthService();
