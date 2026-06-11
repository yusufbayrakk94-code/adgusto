import React, { useState, useEffect } from 'react';
import { User, LogOut, Save, Edit2, LineChart, Video, Clock } from 'lucide-react';
import { AuthService } from '../services/authService';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

interface UserProfile {
  id: string;
  name: string | null;
  created_at: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await AuthService.getUserProfile(user.uid);
      setProfile(profileData);
      setName(profileData?.name || '');
    } catch (err: any) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const updatedProfile = await AuthService.updateUserProfile(user.uid, { name });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err: any) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(profile?.name || '');
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0c4650] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0c4650]/60">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0c4650]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] shadow-none">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#94fa01] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#0c4650]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#0c4650]">Dashboard</h1>
              <p className="text-sm text-[#0c4650]/60">Tekrar hoş geldin!</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center space-x-2 text-[#0c4650] hover:text-[#94fa01] px-3 py-2 rounded-lg hover:bg-[#94fa01]/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#0c4650]">Profil Bilgileri</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-[#94fa01] hover:text-[#0c4650] px-3 py-2 rounded-lg hover:bg-[#94fa01]/10 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[#0c4650] mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-[#0c4650]/40"
              />
            </div>

            {/* Name (editable) */}
            <div>
              <label className="block text-sm font-medium text-[#0c4650] mb-2">
                İsim
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınızı girin"
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent"
                />
              ) : (
                <input
                  type="text"
                  value={profile?.name || 'Belirtilmedi'}
                  disabled
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-[#0c4650]/40"
                />
              )}
            </div>

            {/* Member since */}
            <div>
              <label className="block text-sm font-medium text-[#0c4650] mb-2">
                Üyelik Başlangıcı
              </label>
              <input
                type="text"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Bilinmiyor'}
                disabled
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-[#0c4650]/40"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Action buttons */}
            {isEditing && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-[#94fa01] text-[#0c4650] px-4 py-2 rounded-lg hover:bg-[#94fa01]/80 focus:ring-2 focus:ring-[#94fa01] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-[#0c4650]/30 border-t-[#0c4650] rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Kaydet</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-[#e2e8f0] text-[#0c4650] rounded-lg hover:bg-[#f8fafc] focus:ring-2 focus:ring-[#0c4650] focus:ring-offset-2"
                >
                  Vazgeç
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="mt-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
          <h3 className="text-lg font-semibold text-[#0c4650] mb-4">Hesap İstatistikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#94fa01]/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#94fa01]">1</div>
              <div className="text-sm text-[#0c4650]/60">Aktif Oturum</div>
            </div>
            <div className="bg-[#0c4650]/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#0c4650]">
                {profile?.created_at ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-[#0c4650]/60">Gün Aktif</div>
            </div>
            <div className="bg-[#94fa01]/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#94fa01]">
                {profile?.name ? 'Tamamlandı' : 'Eksik'}
              </div>
              <div className="text-sm text-[#0c4650]/60">Profil Durumu</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-6 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#94fa01]" />
            <h3 className="text-lg font-semibold text-[#0c4650]">Yakında Gelecek Özellikler</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative border-2 border-[#e2e8f0] rounded-xl p-6 bg-gradient-to-br from-[#f8fafc] to-white overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="bg-[#94fa01] text-[#0c4650] text-xs font-bold px-3 py-1 rounded-full">Yakında</span>
              </div>
              <div className="w-12 h-12 bg-[#0c4650]/10 rounded-xl flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-[#0c4650]" />
              </div>
              <h4 className="text-base font-bold text-[#0c4650] mb-2">Reklam Yönetimi</h4>
              <p className="text-sm text-[#0c4650]/60">
                Tüm reklam kampanyalarınızı tek bir yerden yönetin, performansları takip edin ve optimize edin.
              </p>
            </div>
            <div className="relative border-2 border-[#e2e8f0] rounded-xl p-6 bg-gradient-to-br from-[#f8fafc] to-white overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="bg-[#94fa01] text-[#0c4650] text-xs font-bold px-3 py-1 rounded-full">Yakında</span>
              </div>
              <div className="w-12 h-12 bg-[#0c4650]/10 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-[#0c4650]" />
              </div>
              <h4 className="text-base font-bold text-[#0c4650] mb-2">Reklam Videosu Oluşturucu</h4>
              <p className="text-sm text-[#0c4650]/60">
                AI destekli video oluşturma aracı ile saniyeler içinde profesyonel reklam videoları üretin.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};