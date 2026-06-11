import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink, Calendar, Tag, Plus, X, Edit2, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
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
            <span className="text-xs font-medium text-gray-700">{t('metaAds.tags')}</span>
            {!isAddingTag && (
              <button
                onClick={() => setIsAddingTag(true)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {t('common.add')}
              </button>
            )}
          </div>

          {isAddingTag && (
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder={t('metaAds.tagNamePlaceholder')}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleAddTag}
                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTag('');
                }}
                className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {ad.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
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
            <span className="text-xs font-medium text-gray-700">{t('metaAds.notes')}</span>
            {!isEditingNotes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                {ad.notes ? t('common.edit') : t('common.add')}
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('metaAds.notesPlaceholder')}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex gap-1 mt-1">
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  {t('common.save')}
                </button>
                <button
                  onClick={() => {
                    setIsEditingNotes(false);
                    setNotes(ad.notes || '');
                  }}
                  className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-600 line-clamp-2">
              {ad.notes || t('metaAds.noNotesAdded')}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {ad.link_url && (
            <a
              href={ad.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('common.view')}</span>
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
    </motion.div>
  );
};

export default function SavedAdsPage() {
  const { t } = useLanguage();
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    loadSavedAds();
  }, []);

  const loadSavedAds = async () => {
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(t('common.mustLogin'));
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

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || t('metaAds.loadError'));
      }

      setSavedAds(result.data || []);
    } catch (err) {
      console.error('Load error:', err);
      setError(err instanceof Error ? err.message : t('metaAds.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<SavedAd>) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(t('common.mustLogin'));
      }

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

      if (!result.success) {
        throw new Error(result.error || t('metaAds.updateError'));
      }

      setSavedAds(prev =>
        prev.map(ad =>
          ad.id === id ? { ...ad, ...updates } : ad
        )
      );
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : t('metaAds.updateError'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('metaAds.deleteConfirmation'))) {
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(t('common.mustLogin'));
      }

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

      if (!result.success) {
        throw new Error(result.error || t('metaAds.deleteError'));
      }

      setSavedAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : t('metaAds.deleteError'));
    }
  };

  const allTags = Array.from(new Set(savedAds.flatMap(ad => ad.tags)));
  const filteredAds = filterTag
    ? savedAds.filter(ad => ad.tags.includes(filterTag))
    : savedAds;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('metaAds.savedAds')}</h1>
          <p className="text-gray-600">{t('metaAds.savedAdsDescription')}</p>
        </div>

        {allTags.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t('metaAds.filterByTags')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag(null)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  filterTag === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('metaAds.all')} ({savedAds.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filterTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag} ({savedAds.filter(ad => ad.tags.includes(tag)).length})
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAds.map((ad) => (
              <SavedAdCard
                key={ad.id}
                ad={ad}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterTag ? t('metaAds.noAdsInTag') : t('metaAds.noSavedAds')}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterTag
                ? t('metaAds.selectDifferentTag')
                : t('metaAds.startExploring')}
            </p>
            {!filterTag && (
              <a
                href="/dashboard?page=meta-ads"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('metaAds.searchAds')}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
