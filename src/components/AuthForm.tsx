import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, UserPlus, LogIn, Shield } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onBack?: () => void;
  isSignUp?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSignIn,
  onSignUp,
  onBack,
  isSignUp: initialIsSignUp = false
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Şifre sıfırlama e-postası gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google login error:', error);
      setError('Google ile giriş başarısız: ' + error.message);
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 flex items-center justify-center px-4">
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                  setError(null);
                }}
                className="inline-flex items-center space-x-2 text-gray hover:text-dark transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Geri</span>
              </button>

              <button
                onClick={onBack}
                className="text-2xl font-light text-dark hover:text-primary transition-colors"
              >
                AdGusto
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mt-20">
          {resetEmailSent ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-dark">E-posta Gönderildi!</h2>
              <p className="text-gray">
                <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
                E-postanızı kontrol edin.
              </p>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                }}
                className="w-full bg-primary text-dark py-3 px-4 rounded-xl hover:bg-secondary focus:ring-2 focus:ring-primary transition-all font-bold"
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Şifrenizi mi Unuttunuz?</h2>
                <p className="text-gray">
                  E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-dark mb-2">
                    E-posta
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="E-posta adresinizi girin"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-dark py-4 px-4 rounded-xl hover:bg-secondary focus:ring-2 focus:ring-primary transition-all font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Şifre Sıfırlama Bağlantısı Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center space-x-2 text-gray hover:text-dark transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Geri</span>
              </button>
            )}

            <button
              onClick={onBack}
              className="text-2xl font-light text-dark hover:text-primary transition-colors"
            >
              AdGusto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mt-20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSignUp ? (
              <UserPlus className="w-8 h-8 text-primary" />
            ) : (
              <LogIn className="w-8 h-8 text-primary" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">
            {isSignUp ? 'Hesap Oluşturun' : 'Hoş Geldiniz'}
          </h2>
          <p className="text-gray">
            {isSignUp ? 'Hemen başlamak için ücretsiz hesap oluşturun' : 'Hesabınıza giriş yapın ve devam edin'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {isSignUp && (
              <p className="mt-2 text-xs text-gray">En az 6 karakter olmalıdır</p>
            )}
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-dark hover:text-primary transition-colors font-medium"
              >
                Şifremi unuttum
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-dark py-4 px-4 rounded-xl hover:bg-secondary focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray font-medium">veya</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-primary transition-all font-bold text-dark hover:bg-primary/10 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Google ile Devam Et
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray">
            {isSignUp ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-dark hover:text-primary font-bold transition-colors"
            >
              {isSignUp ? 'Giriş Yap' : 'Ücretsiz Hesap Oluştur'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
