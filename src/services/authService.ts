
import { supabase } from "@/integrations/supabase/client";
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface PhoneVerification {
  phoneNumber: string;
  verificationCode: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

class AuthService {
  // Social Login Methods
  async signInWithGoogle() {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    return { data, error };
  }

  async signInWithApple() {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    return { data, error };
  }

  async signInWithLinkedIn() {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    return { data, error };
  }

  async signInWithTwitter() {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    return { data, error };
  }

  async signInWithDiscord() {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    return { data, error };
  }

  // Traditional Authentication
  async signUp(signUpData: SignUpData) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: signUpData.fullName,
          phone_number: signUpData.phone
        }
      }
    });
    
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async resetPassword(email: string) {
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    return { data, error };
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    return { data, error };
  }

  // Phone Verification
  async sendPhoneVerification(phoneNumber: string) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const { data, error } = await supabase
      .from('phone_verifications')
      .insert({
        phone_number: phoneNumber,
        verification_code: verificationCode,
        expires_at: expiresAt
      })
      .select()
      .single();

    // In a real app, you'd send SMS here using Twilio or similar
    console.log(`SMS Verification Code for ${phoneNumber}: ${verificationCode}`);
    
    return { data, error };
  }

  async verifyPhone(phoneNumber: string, code: string) {
    const { data, error } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('verification_code', code)
      .gt('expires_at', new Date().toISOString())
      .eq('is_verified', false)
      .single();

    if (error || !data) {
      return { data: null, error: error || new Error('Invalid verification code') };
    }

    // Mark as verified
    await supabase
      .from('phone_verifications')
      .update({ is_verified: true })
      .eq('id', data.id);

    // Update user profile
    await supabase
      .from('profiles')
      .update({ 
        phone_number: phoneNumber,
        is_phone_verified: true 
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    return { data: true, error: null };
  }

  // Two-Factor Authentication
  async enableTwoFactor() {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });
    
    if (error) return { data: null, error };

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    return {
      data: {
        secret: data.totp.secret,
        qrCode: data.totp.qr_code,
        backupCodes
      },
      error: null
    };
  }

  async verifyTwoFactor(code: string, challengeId: string) {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId: challengeId,
      challengeId,
      code
    });
    
    return { data, error };
  }

  async disableTwoFactor(factorId: string) {
    const { data, error } = await supabase.auth.mfa.unenroll({
      factorId
    });
    
    return { data, error };
  }

  // Session Management
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  }

  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();
    return { data, error };
  }

  // User Profile Management
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  }

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  }

  // Session Tracking
  async trackSession(deviceInfo: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: session.user.id,
        session_token: session.access_token,
        device_info: deviceInfo,
        expires_at: new Date(session.expires_at! * 1000).toISOString()
      });
    
    return { data, error };
  }

  async getUserSessions(userId: string) {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_activity', { ascending: false });
    
    return { data, error };
  }

  async revokeSession(sessionId: string) {
    const { data, error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
    
    return { data, error };
  }
}

export const authService = new AuthService();
