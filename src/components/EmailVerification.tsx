import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';

interface EmailVerificationProps {
  userEmail: string;
  onVerified: () => void;
  onLogout: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  userEmail,
  onVerified,
  onLogout
}) => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          onVerified();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [onVerified]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setMessage(null);

    try {
      if (auth.currentUser) {
        const actionCodeSettings = {
          url: window.location.origin + '/?verified=true',
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        setMessage({ type: 'success', text: 'Doğrulama e-postası tekrar gönderildi! Lütfen gelen kutunuzu kontrol edin.' });
        setCountdown(60);
      } else {
        throw new Error('Kullanıcı oturum açmamış.');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'E-posta gönderilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setMessage(null);

    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          onVerified();
        } else {
          setMessage({ type: 'error', text: 'E-posta henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.' });
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Doğrulama kontrol edilemedi.' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">AdGusto</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-dark text-center mb-3">
            E-postanızı Doğrulayın
          </h2>

          {/* Description */}
          <p className="text-gray text-center mb-6">
            <strong>{userEmail}</strong> adresine bir doğrulama e-postası gönderdik.
            Devam etmek için lütfen e-postanızdaki bağlantıya tıklayın.
          </p>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border-l-4 ${
              message.type === 'success'
                ? 'bg-primary/10 border-primary'
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-dark' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={checking}
              className="w-full bg-primary text-dark font-bold py-4 rounded-xl hover:bg-secondary transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  <span>Kontrol Ediliyor...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Doğrulamayı Kontrol Et</span>
                </>
              )}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={loading || countdown > 0}
              className="w-full bg-white text-dark font-bold py-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : countdown > 0 ? (
                <span>Tekrar Gönder ({countdown}s)</span>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>E-postayı Tekrar Gönder</span>
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-primary/10 rounded-xl">
            <p className="text-sm text-dark text-center">
              E-postayı bulamıyor musunuz? Spam klasörünü kontrol edin.
            </p>
          </div>

          {/* Logout */}
          <div className="mt-6 text-center">
            <button
              onClick={onLogout}
              className="text-gray hover:text-dark font-medium transition-colors text-sm"
            >
              Farklı hesapla giriş yap
            </button>
          </div>
        </div>

        {/* Auto-check info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Doğrulama otomatik kontrol ediliyor...
          </p>
        </div>
      </div>
    </div>
  );
};
