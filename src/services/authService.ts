import { supabase } from '../config/supabase';
import type { User, Session } from '@supabase/supabase-js';

export class AuthService {
  static onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null, session);
    });

    return () => subscription.unsubscribe();
  }

  static async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`,
        },
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);

      if (error.message?.includes('already registered')) {
        throw new Error('Bu e-posta adresi zaten kullanımda.');
      } else if (error.message?.includes('invalid email')) {
        throw new Error('Geçersiz e-posta adresi.');
      } else if (error.message?.includes('password')) {
        throw new Error('Şifre en az 6 karakter olmalıdır.');
      }
      throw new Error(error.message || 'Kayıt sırasında bir hata oluştu.');
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);

      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('E-posta veya şifre hatalı.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('E-posta adresinizi doğrulamanız gerekiyor.');
      }
      throw new Error(error.message || 'Giriş sırasında bir hata oluştu.');
    }
  }

  static async resendVerificationEmail() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Kullanıcı oturum açmamış.');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error('Resend verification email error:', error);
      throw new Error(error.message || 'Doğrulama e-postası gönderilemedi.');
    }
  }

  static async sendPasswordReset(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Şifre sıfırlama e-postası gönderilemedi.');
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async checkEmailVerified() {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email_confirmed_at != null;
  }

  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  static async getAccessToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No active session');
    }
    return session.access_token;
  }
}
