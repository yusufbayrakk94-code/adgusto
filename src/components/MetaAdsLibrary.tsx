import React, { useState } from 'react';
import { Search, Save, ExternalLink, Calendar, Tag, Loader2, AlertCircle, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import { useLanguage } from '../hooks/useLanguage';

interface MetaAd {
  metadata?: {
    ad_archive_id?: string;
    page_name?: string;
  };
  ad_content?: {
    body?: string;
    link_caption?: string;
    link_description?: string;
    link_title?: string;
    images?: Array<{
      resized_image_url?: string;
      original_image_url?: string;
    }>;
    videos?: Array<{
      video_preview_image_url?: string;
      video_url?: string;
    }>;
  };
  additional_info?: {
    display_format?: string;
    started_running?: string;
    page_profile_uri?: string;
  };
  distribution?: {
    publisher_platform?: string[];
  };
  [key: string]: any;
}

const AdCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-black animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded w-8" />
      </div>
    </div>
  </div>
);

const AdCard: React.FC<{ ad: MetaAd; onSave: (ad: MetaAd) => void; saving: boolean }> = ({ ad, onSave, saving }) => {
  const { t } = useLanguage();
  const adId = ad.metadata?.ad_archive_id || '';
  const advertiser = ad.metadata?.page_name || 'Unknown Advertiser';
  const title = ad.ad_content?.link_title || ad.ad_content?.link_caption || advertiser;
  const text = ad.ad_content?.body || '';

  const displayFormat = ad.additional_info?.display_format || '';
  const imageUrl = displayFormat === 'VIDEO'
    ? ad.ad_content?.videos?.[0]?.video_preview_image_url || ''
    : ad.ad_content?.images?.[0]?.resized_image_url || '';

  const adUrl = ad.additional_info?.page_profile_uri || '';
  const startDate = ad.additional_info?.started_running;
  const platforms = ad.distribution?.publisher_platform || [];

  const getPlatformIcon = (platform: string) => {
    const normalizedPlatform = platform.toUpperCase();
    if (normalizedPlatform === 'FACEBOOK') return <Facebook className="w-3 h-3" />;
    if (normalizedPlatform === 'INSTAGRAM') return <Instagram className="w-3 h-3" />;
    if (normalizedPlatform === 'MESSENGER') return <MessageCircle className="w-3 h-3" />;
    return null;
  };

  const getPlatformName = (platform: string) => {
    const normalizedPlatform = platform.toUpperCase();
    if (normalizedPlatform === 'FACEBOOK') return 'Facebook';
    if (normalizedPlatform === 'INSTAGRAM') return 'Instagram';
    if (normalizedPlatform === 'MESSENGER') return 'Messenger';
    if (normalizedPlatform === 'AUDIENCE_NETWORK') return 'Audience Network';
    if (normalizedPlatform === 'THREADS') return 'Threads';
    return platform;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-black hover:shadow-2xl hover:border-[#94fa01] transition-all group"
    >
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {platforms.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[50%]">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-medium text-[#94fa01] border border-[#94fa01] flex items-center gap-1"
                >
                  {getPlatformIcon(platform)}
                  <span>{getPlatformName(platform)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-black mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{text}</p>

        <div className="flex items-center gap-2 text-xs text-black mb-3">
          <Tag className="w-3 h-3" />
          <span className="font-medium">{advertiser}</span>
        </div>

        {startDate && (
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <Calendar className="w-3 h-3" />
            <span>{new Date(startDate).toLocaleDateString('tr-TR')}</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onSave(ad)}
            disabled={saving}
            className="flex-1 px-3 py-2 bg-[#94fa01] hover:bg-[#7dd001] disabled:bg-gray-400 text-black text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-black"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('common.saving')}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{t('metaAds.saveAd')}</span>
              </>
            )}
          </button>

          {adUrl && (
            <a
              href={adUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-black hover:bg-[#94fa01] text-white hover:text-black rounded-lg transition-all border-2 border-black"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function MetaAdsLibrary() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('tr');
  const [country, setCountry] = useState('TR');
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingAdId, setSavingAdId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError(t('metaAds.errorSearch'));
      return;
    }

    setLoading(true);
    setError('');
    setAds([]);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const token = await user.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-meta-ads`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchTerm: searchTerm.trim(),
            language,
            country,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Arama başarısız oldu');
      }

      setAds(result.data || []);

      if (!result.data || result.data.length === 0) {
        setError(t('metaAds.noResults'));
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAd = async (ad: MetaAd) => {
    console.log('handleSaveAd called with ad:', ad);
    const adId = ad.metadata?.ad_archive_id;
    console.log('Ad ID:', adId);

    if (!adId) {
      setError('Reklam ID bulunamadı');
      return;
    }

    setSavingAdId(adId);
    setError('');
    setSuccessMessage('');

    try {
      const user = auth.currentUser;
      console.log('Current user:', user?.uid);

      if (!user) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const token = await user.getIdToken();
      console.log('Token obtained');

      const displayFormat = ad.additional_info?.display_format || '';
      const imageUrl = displayFormat === 'VIDEO'
        ? ad.ad_content?.videos?.[0]?.video_preview_image_url || ''
        : ad.ad_content?.images?.[0]?.resized_image_url || '';

      const platforms = ad.distribution?.publisher_platform || ['Facebook'];
      const primaryPlatform = platforms[0] || 'Facebook';

      const requestBody = {
        adData: {
          ad_id: adId,
          ad_title: ad.ad_content?.link_title || ad.ad_content?.link_caption || '',
          ad_text: ad.ad_content?.body || '',
          advertiser_name: ad.metadata?.page_name || '',
          page_name: ad.metadata?.page_name || '',
          platform: primaryPlatform,
          image_url: imageUrl,
          video_url: ad.ad_content?.videos?.[0]?.video_url || null,
          cta_text: null,
          link_url: ad.additional_info?.page_profile_uri || null,
          started_running: ad.additional_info?.started_running || null,
          ...ad,
        },
        tags: [],
        notes: '',
      };
      console.log('Request body:', requestBody);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-meta-ad`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Kaydetme başarısız oldu');
      }

      setSuccessMessage(t('metaAds.saveAd') + ' ' + t('common.success'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Kaydetme başarısız oldu');
    } finally {
      setSavingAdId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">{t('metaAds.title')}</h1>
          <p className="text-gray-700 font-medium">{t('metaAds.subtitle')}</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 bg-white rounded-xl p-6 shadow-lg border-2 border-black">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-2">
                {t('metaAds.searchLabel')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('metaAds.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-[#94fa01] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Dil
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-[#94fa01] font-medium"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                {t('metaAds.countryLabel')}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-[#94fa01] font-medium"
              >
                <option value="TR">Türkiye</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2.5 bg-[#94fa01] hover:bg-[#7dd001] disabled:bg-gray-400 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-black"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('metaAds.searching')}</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>{t('common.search')}</span>
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-100 border-2 border-red-600 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-900 font-semibold">{error}</p>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-[#94fa01] border-2 border-black rounded-lg flex items-start gap-3"
            >
              <Save className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
              <p className="text-black font-bold">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <AdCardSkeleton key={i} />
            ))}
          </div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad, index) => (
              <AdCard
                key={ad.metadata?.ad_archive_id || index}
                ad={ad}
                onSave={handleSaveAd}
                saving={savingAdId === ad.metadata?.ad_archive_id}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
