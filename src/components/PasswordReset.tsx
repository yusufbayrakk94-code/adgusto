import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { CheckCircle, AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PasswordResetProps {
  oobCode: string;
  onBack: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ oobCode, onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCode = async () => {
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setVerifying(false);
      } catch (err: any) {
        console.error('Error verifying reset code:', err);
        setError('Bu şifre sıfırlama linki geçersiz veya süresi dolmuş. Lütfen yeni bir link isteyin.');
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth?mode=signin');
      }, 3000);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError('Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#0c4650] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0c4650]/60">Doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#0c4650] mb-2">Geçersiz Link</h2>
            <p className="text-[#0c4650]/70 mb-6">{error}</p>
            <button
              onClick={onBack}
              className="bg-[#94fa01] text-[#0c4650] px-6 py-2 rounded-lg hover:bg-[#94fa01]/80 transition-colors font-medium"
            >
              Giriş Sayfasına Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#0c4650] mb-2">Şifre Değiştirildi!</h2>
            <p className="text-[#0c4650]/70 mb-6">
              Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="flex items-center text-[#0c4650] hover:text-[#94fa01] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Geri Dön
        </button>

        <div className="bg-white border-2 border-[#e2e8f0] rounded-2xl p-8 shadow-sm">
          <div className="w-12 h-12 bg-[#94fa01] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-[#0c4650]" />
          </div>

          <h2 className="text-2xl font-semibold text-[#0c4650] text-center mb-2">
            Yeni Şifre Belirle
          </h2>
          <p className="text-[#0c4650]/60 text-center mb-6">
            {email} hesabı için yeni şifrenizi belirleyin
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0c4650] mb-2">
                Yeni Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent text-[#0c4650]"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0c4650] mb-2">
                Şifre Tekrar
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent text-[#0c4650]"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#94fa01] text-[#0c4650] py-3 rounded-lg hover:bg-[#94fa01]/80 focus:ring-2 focus:ring-[#94fa01] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#0c4650]/30 border-t-[#0c4650] rounded-full animate-spin mr-2" />
                  Kaydediliyor...
                </div>
              ) : (
                'Şifreyi Değiştir'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
