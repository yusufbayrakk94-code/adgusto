import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  LogOut,
  ArrowLeft,
  Trash2,
  Eye,
  BarChart3,
  FileText,
  TrendingUp,
  Sparkles,
  Building2,
  Target,
  Users as UsersIcon,
  DollarSign,
  CheckCircle,
  PieChart as PieChartIcon,
  Palette,
  Plus,
  X,
  Star,
  Tag,
  Calendar,
  ExternalLink,
  Edit2,
  Check,
  Loader2,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FirestoreService } from '../services/firestoreService';
import { BrandColorService, BrandColor, BrandColorPalette } from '../services/brandColorService';
import { ServiceAnalysis } from '../types';
import { auth } from '../config/firebase';
import { useLanguage } from '../hooks/useLanguage';

interface SavedAd {
  id: string;
  user_id: string;
  ad_id: string;
  ad_title: string;
  ad_text: string;
  advertiser_name: string;
  page_name: string;
  platform: string;
  image_url: string;
  storage_url: string;
  video_url?: string;
  cta_text?: string;
  link_url?: string;
  started_running?: string;
  tags: string[];
  notes?: string;
  raw_data: any;
  created_at: string;
  updated_at: string;
}

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
  onViewAnalysis: (analysis: ServiceAnalysis) => void;
  userEmail?: string;
  userId: string;
  userStats?: any;
  onRefresh: () => Promise<void>;
}

const SavedAdCard: React.FC<{
  ad: SavedAd;
  onUpdate: (id: string, updates: Partial<SavedAd>) => void;
  onDelete: (id: string) => void;
}> = ({ ad, onUpdate, onDelete }) => {
  const { t } = useLanguage();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(ad.notes || '');
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleSaveNotes = () => {
    onUpdate(ad.id, { notes });
    setIsEditingNotes(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !ad.tags.includes(newTag.trim())) {
      onUpdate(ad.id, { tags: [...ad.tags, newTag.trim()] });
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate(ad.id, { tags: ad.tags.filter(t => t !== tagToRemove) });
  };

  const imageUrl = ad.storage_url || ad.image_url;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={ad.ad_title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {ad.platform && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              {ad.platform}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{ad.ad_title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{ad.ad_text}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Tag className="w-3 h-3" />
          <span className="font-medium">{ad.advertiser_name}</span>
        </div>

        {ad.started_running && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Calendar className="w-3 h-3" />
            <span>{new Date(ad.started_running).toLocaleDateString('tr-TR')}</span>
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Etiketler</span>
            {!isAddingTag && (
              <button
                onClick={() => setIsAddingTag(true)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Ekle
              </button>
            )}
          </div>

          {isAddingTag && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Etiket adı"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <button
                onClick={handleAddTag}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTag('');
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {ad.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Notlar</span>
            {!isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Notlarınızı buraya yazın..."
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded text-xs transition-colors"
                >
                  {t('common.save')}
                </button>
                <button
                  onClick={() => {
                    setIsEditingNotes(false);
                    setNotes(ad.notes || '');
                  }}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded text-xs transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-600 line-clamp-2">
              {ad.notes || 'Not eklenmemiş'}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {ad.link_url && (
            <a
              href={ad.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ziyaret Et
            </a>
          )}
          <button
            onClick={() => onDelete(ad.id)}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBack,
  onLogout,
  onViewAnalysis,
  userEmail,
  userId,
  userStats
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [brandPalettes, setBrandPalettes] = useState<BrandColorPalette[]>([]);
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [savedAdsLoading, setSavedAdsLoading] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const [showAddPalette, setShowAddPalette] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [newPaletteColors, setNewPaletteColors] = useState<BrandColor[]>([{ hex: '#94fa01', label: '' }]);
  const [paletteError, setPaletteError] = useState<string | null>(null);
  const [paletteSaving, setPaletteSaving] = useState(false);

  const totalActivities = (userStats?.totalAdCopies || 0) + (userStats?.totalMarketingAnalyses || 0) +
    (userStats?.totalCSVAnalyses || 0) + (userStats?.totalImageGenerations || 0) + (userStats?.totalImageAnalyses || 0);

  const marketingAnalyses = userStats?.recentActivity?.filter((a: any) => a && a.type === 'marketing') || [];
  const adCopyAnalyses = userStats?.recentActivity?.filter((a: any) => a && a.type === 'ad-copy') || [];
  const csvAnalyses = userStats?.recentActivity?.filter((a: any) => a && a.type === 'csv') || [];
  const imageGenerations = userStats?.recentActivity?.filter((a: any) => a && a.type === 'image-generation') || [];
  const imageAnalyses = userStats?.recentActivity?.filter((a: any) => a && a.type === 'image-analysis') || [];

  const allTags = Array.from(new Set((savedAds || []).flatMap(ad => ad?.tags || [])));
  const filteredAds = filterTag ? (savedAds || []).filter(ad => ad?.tags?.includes(filterTag)) : (savedAds || []);

  const loadSavedAds = async () => {
    setSavedAdsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setSavedAds([]);
        return [];
      }

      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-saved-ads`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setSavedAds(result.data || []);
        return result.data || [];
      }
      return [];
    } catch (err) {
      console.error('Load saved ads error:', err);
      return [];
    } finally {
      setSavedAdsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [onboarding, palettes] = await Promise.all([
          FirestoreService.getOnboardingData(userId).catch(() => null),
          BrandColorService.getUserPalettes(userId).catch(() => [])
        ]);

        if (mounted) {
          setOnboardingData(onboarding);
          setBrandPalettes(palettes);
        }

        await loadSavedAds();
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleUpdateSavedAd = async (id: string, updates: Partial<SavedAd>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Oturum açmanız gerekiyor');

      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-saved-ad`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, updates }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setSavedAds(prev => prev.map(ad => ad.id === id ? { ...ad, ...updates } : ad));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteSavedAd = async (id: string) => {
    if (!confirm('Bu reklamı silmek istediğinizden emin misiniz?')) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Oturum açmanız gerekiyor');

      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-saved-ad`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setSavedAds(prev => prev.filter(ad => ad.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDeleteAnalysis = async (id: string, type: string) => {
    try {
      if (type === 'marketing') await FirestoreService.deleteMarketingAnalysis(userId, id);
      else if (type === 'ad-copy') await FirestoreService.deleteAdCopy(userId, id);
      else if (type === 'csv') await FirestoreService.deleteCSVAnalysis(userId, id);
      else if (type === 'image-generation') await FirestoreService.deleteImageGeneration(userId, id);
      else if (type === 'image-analysis') await FirestoreService.deleteImageAnalysis(userId, id);
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const handleAddColor = () => {
    setNewPaletteColors([...newPaletteColors, { hex: '#000000', label: '' }]);
  };

  const handleRemoveColor = (index: number) => {
    if (newPaletteColors.length > 1) {
      setNewPaletteColors(newPaletteColors.filter((_, i) => i !== index));
    }
  };

  const handleColorChange = (index: number, field: 'hex' | 'label', value: string) => {
    const updated = [...newPaletteColors];
    updated[index][field] = value;
    setNewPaletteColors(updated);
  };

  const handleSavePalette = async () => {
    setPaletteError(null);
    setPaletteSaving(true);

    try {
      const newPalette = await BrandColorService.createPalette({
        user_id: userId,
        palette_name: newPaletteName,
        colors: newPaletteColors,
        is_default: brandPalettes.length === 0
      });

      setBrandPalettes([newPalette, ...brandPalettes]);
      setShowAddPalette(false);
      setNewPaletteName('');
      setNewPaletteColors([{ hex: '#94fa01', label: '' }]);
    } catch (error: any) {
      console.error('Error saving palette:', error);
      setPaletteError(error?.message || 'Palet kaydedilemedi');
    } finally {
      setPaletteSaving(false);
    }
  };

  const handleDeletePalette = async (id: string) => {
    try {
      await BrandColorService.deletePalette(id, userId);
      setBrandPalettes(brandPalettes.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting palette:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await BrandColorService.setDefaultPalette(id, userId);
      setBrandPalettes(brandPalettes.map(p => ({ ...p, is_default: p.id === id })));
    } catch (error) {
      console.error('Error setting default palette:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-dark" />
          </div>
          <p className="text-gray">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-dark">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray hover:text-dark transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t('common.back')}</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-3xl overflow-hidden shadow-lg mb-12">
          <div className="p-10">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark mb-2">{t('nav.profile')}</h1>
                <div className="flex items-center space-x-2 text-gray">
                  <Mail className="w-4 h-4" />
                  <span>{userEmail}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white border-2 border-primary rounded-2xl p-6 text-center hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-primary mb-2">{totalActivities}</div>
                <div className="text-dark font-bold text-sm">{t('profile.totalActivities')}</div>
              </div>
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-dark mb-2">{userStats?.totalMarketingAnalyses || 0}</div>
                <div className="text-gray font-medium text-sm">{t('profile.marketingAnalyses')}</div>
              </div>
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-dark mb-2">{userStats?.totalAdCopies || 0}</div>
                <div className="text-gray font-medium text-sm">{t('profile.adCopyGeneration')}</div>
              </div>
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-dark mb-2">{userStats?.totalCSVAnalyses || 0}</div>
                <div className="text-gray font-medium text-sm">{t('profile.csvAnalysis')}</div>
              </div>
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-dark mb-2">{userStats?.totalImageGenerations || 0}</div>
                <div className="text-gray font-medium text-sm">{t('profile.imageGeneration')}</div>
              </div>
              <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 text-center hover:border-primary hover:shadow-lg transition-all">
                <div className="text-4xl font-bold text-dark mb-2">{userStats?.totalImageAnalyses || 0}</div>
                <div className="text-gray font-medium text-sm">{t('profile.imageAnalysis')}</div>
              </div>
            </div>

            {/* Activity Chart */}
            {totalActivities > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <PieChartIcon className="w-6 h-6 text-dark" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark">{t('profile.activityDistribution')}</h3>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: t('profile.marketingAnalyses'), value: userStats?.totalMarketingAnalyses || 0, color: '#97fa07' },
                        { name: t('profile.adCopyGeneration'), value: userStats?.totalAdCopies || 0, color: '#0c4650' },
                        { name: t('profile.csvAnalysis'), value: userStats?.totalCSVAnalyses || 0, color: '#ff6b6b' },
                        { name: t('profile.imageGeneration'), value: userStats?.totalImageGenerations || 0, color: '#4ecdc4' },
                        { name: t('profile.imageAnalysis'), value: userStats?.totalImageAnalyses || 0, color: '#ffd93d' }
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: t('profile.marketingAnalyses'), value: userStats?.totalMarketingAnalyses || 0, color: '#97fa07' },
                        { name: t('profile.adCopyGeneration'), value: userStats?.totalAdCopies || 0, color: '#0c4650' },
                        { name: t('profile.csvAnalysis'), value: userStats?.totalCSVAnalyses || 0, color: '#ff6b6b' },
                        { name: t('profile.imageGeneration'), value: userStats?.totalImageGenerations || 0, color: '#4ecdc4' },
                        { name: t('profile.imageAnalysis'), value: userStats?.totalImageAnalyses || 0, color: '#ffd93d' }
                      ].filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-6 py-4 bg-dark text-primary rounded-2xl hover:bg-dark/90 font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t('nav.logout')}
            </button>
          </div>
        </div>

        {/* Onboarding Info */}
        {onboardingData && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">İşletme Bilgileri</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {onboardingData.businessName && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-dark">İşletme Adı</h3>
                  </div>
                  <p className="text-gray">{onboardingData.businessName}</p>
                </div>
              )}

              {onboardingData.industry && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-dark">Sektör</h3>
                  </div>
                  <p className="text-gray">{onboardingData.industry}</p>
                </div>
              )}

              {onboardingData.businessSize && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <UsersIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-dark">İşletme Büyüklüğü</h3>
                  </div>
                  <p className="text-gray">{onboardingData.businessSize}</p>
                </div>
              )}

              {onboardingData.monthlyBudget && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-dark">Aylık Bütçe</h3>
                  </div>
                  <p className="text-gray">{onboardingData.monthlyBudget}</p>
                </div>
              )}

              {onboardingData.goals && onboardingData.goals.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-dark">Hedefler</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.goals.map((goal: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/20 text-dark rounded-full text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{goal}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {onboardingData.challenges && onboardingData.challenges.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-dark">Zorluklar</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.challenges.map((challenge: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 text-dark rounded-full text-sm font-medium"
                      >
                        <span>{challenge}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Brand Palettes */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">{t('profile.brandPalettes')}</h2>
            </div>
            <button
              onClick={() => {
                setNewPaletteName('Palet 1');
                setNewPaletteColors([{ hex: '#94fa01', label: 'Ana Renk' }]);
                setPaletteError(null);
                setShowAddPalette(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-primary text-dark font-bold rounded-xl hover:bg-secondary transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('profile.addPalette')}
            </button>
          </div>

          {showAddPalette && (
            <div className="bg-gray-50 border-2 border-primary/30 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-dark">{t('profile.addPalette')}</h3>
                <button
                  onClick={() => {
                    setShowAddPalette(false);
                    setNewPaletteName('');
                    setNewPaletteColors([{ hex: '#94fa01', label: '' }]);
                    setPaletteError(null);
                  }}
                  className="p-2 text-gray hover:text-dark hover:bg-gray-200 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Palet Adı</label>
                  <input
                    type="text"
                    value={newPaletteName}
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    placeholder="Örn: Ana Markam Renkleri"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-dark">Renkler</label>
                    <button
                      onClick={handleAddColor}
                      className="text-sm text-primary hover:text-secondary font-medium"
                    >
                      + Renk Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newPaletteColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                          className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                          className="w-32 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none font-mono text-sm"
                          placeholder="#000000"
                        />
                        <input
                          type="text"
                          value={color.label}
                          onChange={(e) => handleColorChange(index, 'label', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                          placeholder="Renk adı"
                        />
                        {newPaletteColors.length > 1 && (
                          <button
                            onClick={() => handleRemoveColor(index)}
                            className="p-2 text-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {paletteError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    {paletteError}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSavePalette}
                    disabled={paletteSaving}
                    className="flex-1 px-6 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {paletteSaving ? 'Kaydediliyor...' : t('common.save')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddPalette(false);
                      setNewPaletteName('');
                      setNewPaletteColors([{ hex: '#94fa01', label: '' }]);
                      setPaletteError(null);
                    }}
                    disabled={paletteSaving}
                    className="px-6 py-3 border-2 border-gray-200 text-gray font-medium rounded-xl hover:border-gray-300 transition-all disabled:opacity-50"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {brandPalettes.length > 0 ? (
            <div className="space-y-4">
              {brandPalettes.map((palette) => (
                <div key={palette.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-dark">{palette.palette_name}</h3>
                        {palette.is_default && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-dark text-xs font-bold rounded-full">
                            <Star className="w-3 h-3" />
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray">{palette.colors.length} renk</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!palette.is_default && (
                        <button
                          onClick={() => palette.id && handleSetDefault(palette.id)}
                          className="p-3 text-gray hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title="Varsayılan yap"
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => palette.id && handleDeletePalette(palette.id)}
                        className="p-3 text-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {palette.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-sm">
                          <div className="font-medium text-dark">{color.label}</div>
                          <div className="text-gray font-mono text-xs">{color.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <Palette className="w-12 h-12 text-gray mx-auto mb-3" />
              <p className="text-gray mb-4">Henüz palet oluşturmadınız</p>
              <button
                onClick={() => {
                  setNewPaletteName('Palet 1');
                  setNewPaletteColors([{ hex: '#94fa01', label: 'Ana Renk' }]);
                  setPaletteError(null);
                  setShowAddPalette(true);
                }}
                className="inline-flex items-center px-6 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-secondary transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                İlk Paleti Oluştur
              </button>
            </div>
          )}
        </div>

        {/* Saved Ads */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-dark" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark">Kayıtlı Reklamlar</h2>
              <p className="text-sm text-gray">İlham aldığınız reklamları burada bulabilirsiniz</p>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-dark">Etiketlere Göre Filtrele</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterTag(null)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filterTag === null
                      ? 'bg-primary text-dark font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tümü ({savedAds.length})
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      filterTag === tag
                        ? 'bg-primary text-dark font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag} ({savedAds.filter(ad => ad.tags.includes(tag)).length})
                  </button>
                ))}
              </div>
            </div>
          )}

          {savedAdsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <SavedAdCard
                  key={ad.id}
                  ad={ad}
                  onUpdate={handleUpdateSavedAd}
                  onDelete={handleDeleteSavedAd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <Bookmark className="w-12 h-12 text-gray mx-auto mb-3" />
              <h3 className="font-bold text-dark mb-2">
                {filterTag ? 'Bu etikette reklam yok' : 'Henüz kayıtlı reklam yok'}
              </h3>
              <p className="text-gray mb-6">
                {filterTag
                  ? 'Farklı bir etiket seçin veya yeni reklamlar ekleyin'
                  : 'Meta Reklam Kütüphanesi\'nden reklamları keşfetmeye başlayın'}
              </p>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        {marketingAnalyses.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Pazarlama Analizleri</h2>
            </div>
            <div className="space-y-4">
              {marketingAnalyses.map((analysis: any) => (
                <div key={analysis?.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-dark mb-2">{analysis?.input}</h3>
                      <p className="text-xs text-gray">
                        {analysis?.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih yok'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewAnalysis(analysis)}
                        className="p-3 text-gray hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => analysis?.id && handleDeleteAnalysis(analysis.id, 'marketing')}
                        className="p-3 text-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adCopyAnalyses.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Reklam Metinleri</h2>
            </div>
            <div className="space-y-4">
              {adCopyAnalyses.map((analysis: any) => (
                <div key={analysis?.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-dark mb-2">{analysis?.prompt}</h3>
                      <p className="text-gray text-sm mb-2 line-clamp-2">
                        {Array.isArray(analysis?.generatedText) ? analysis?.generatedText[0] : analysis?.generatedText}
                      </p>
                      <p className="text-xs text-gray">
                        {analysis?.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih yok'}
                      </p>
                    </div>
                    <button
                      onClick={() => analysis?.id && handleDeleteAnalysis(analysis.id, 'ad-copy')}
                      className="p-3 text-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {csvAnalyses.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Kampanya Analizleri</h2>
            </div>
            <div className="space-y-4">
              {csvAnalyses.map((analysis: any) => (
                <div key={analysis?.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-dark mb-2">{analysis?.fileName}</h3>
                      <p className="text-gray text-sm mb-2 line-clamp-2">{analysis?.summary}</p>
                      <p className="text-xs text-gray">
                        {analysis?.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih yok'}
                      </p>
                    </div>
                    <button
                      onClick={() => analysis?.id && handleDeleteAnalysis(analysis.id, 'csv')}
                      className="p-3 text-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {imageGenerations.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Görsel Üretimler</h2>
            </div>
            <div className="space-y-4">
              {imageGenerations.map((generation: any) => (
                <div key={generation?.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-dark mb-2">{generation?.sector} - {generation?.format}</h3>
                      <p className="text-gray text-sm mb-2 line-clamp-2">{generation?.prompt}</p>
                      <p className="text-xs text-gray">
                        {generation?.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih yok'}
                      </p>
                    </div>
                    <button
                      onClick={() => generation?.id && handleDeleteAnalysis(generation.id, 'image-generation')}
                      className="p-3 text-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {imageAnalyses.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Görsel Analizleri</h2>
            </div>
            <div className="space-y-4">
              {imageAnalyses.map((analysis: any) => (
                <div key={analysis?.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-dark mb-2">{analysis?.fileName}</h3>
                      <p className="text-gray text-sm mb-2">Görsel analizi tamamlandı</p>
                      <p className="text-xs text-gray">
                        {analysis?.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih yok'}
                      </p>
                    </div>
                    <button
                      onClick={() => analysis?.id && handleDeleteAnalysis(analysis.id, 'image-analysis')}
                      className="p-3 text-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalActivities === 0 && savedAds.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-dashed border-gray-300">
            <Sparkles className="w-16 h-16 text-gray mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark mb-2">Henüz aktivite yok</h3>
            <p className="text-gray mb-6">Analizlere başlamak için dashboard'a geri dönün</p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-secondary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('common.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
