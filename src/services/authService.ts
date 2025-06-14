
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

  async enableTwoFactor() {
    // Mock implementation for two-factor setup
    // In a real implementation, this would integrate with Supabase's MFA features
    const mockData = {
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      secret: "MOCK2FA3SECRET4CODE5",
      backupCodes: ["123456", "234567", "345678", "456789", "567890", "678901", "789012", "890123"]
    };
    
    return { data: mockData, error: null };
  }

  async verifyTwoFactor(code: string, challengeId: string) {
    // Mock implementation for two-factor verification
    // In a real implementation, this would verify the TOTP code with Supabase
    if (code === "123456") {
      return { error: null };
    } else {
      return { error: { message: "Invalid verification code" } };
    }
  }
}

export const authService = new AuthService();
