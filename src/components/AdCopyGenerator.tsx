import React, { useState } from 'react';
import { MessageSquare, Copy, CheckCircle, Zap, ArrowRight, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { GroqService } from '../services/groqService';

interface AdCopyGeneratorProps {
  onBack?: () => void;
}

interface AdCopy {
  headline: string;
  description: string;
  callToAction: string;
  platform: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const AdCopyGenerator: React.FC<AdCopyGeneratorProps> = ({ onBack }) => {
  const [service, setService] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [adCopies, setAdCopies] = useState<AdCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms: Platform[] = [
    { id: 'facebook', name: 'Facebook', icon: '📘', description: 'Sosyal ağ reklamları' },
    { id: 'instagram', name: 'Instagram', icon: '📸', description: 'Görsel odaklı reklamlar' },
    { id: 'google', name: 'Google Ads', icon: '🔍', description: 'Arama reklamları' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'B2B profesyonel reklamlar' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', description: 'Kısa video reklamlar' },
    { id: 'youtube', name: 'YouTube', icon: '📺', description: 'Video reklamları' }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const generateCopies = async () => {
    console.log('=== GENERATE BUTTON CLICKED ===');
    console.log('Service:', service);
    console.log('Selected Platforms:', selectedPlatforms);

    if (!service.trim()) {
      setError('Lütfen hizmet açıklamasını girin');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Lütfen en az bir platform seçin');
      return;
    }

    setLoading(true);
    setError(null);
    setAdCopies([]);

    try {
      const groqService = new GroqService();
      console.log('Calling GroqService...');

      const result = await groqService.generateAdCopies(service, selectedPlatforms);

      console.log('=== RESULT FROM SERVICE ===');
      console.log('Result:', result);
      console.log('Result type:', typeof result);
      console.log('Is array?', Array.isArray(result));
      console.log('Length:', result?.length);

      if (!result || !Array.isArray(result) || result.length === 0) {
        console.error('Result is empty or invalid');
        setError('Reklam metinleri oluşturulamadı. Lütfen tekrar deneyin.');
        return;
      }

      console.log('Setting adCopies state with:', result);
      setAdCopies(result);
      console.log('State set successfully');
    } catch (err) {
      console.error('=== ERROR IN GENERATE ===');
      console.error('Error:', err);
      setError('Bir hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
      console.log('=== GENERATE COMPLETE ===');
    }
  };

  const copyToClipboard = async (index: number) => {
    const copy = adCopies[index];
    const text = `${copy.headline}\n\n${copy.description}\n\n${copy.callToAction}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Reklam Metinleri Oluşturuluyor</h3>
          <p className="text-gray">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-gray hover:text-dark transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Geri</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Reklam Metni Oluşturucu</h1>
          </div>
          <p className="text-gray text-base max-w-2xl mx-auto">
            Hizmetinizi tanımlayın, platformları seçin ve profesyonel reklam metinleri oluşturun
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg mb-12">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-dark mb-4">
                Hizmet Açıklaması
              </label>
              <textarea
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Örn: Organik cilt bakım ürünleri satışı yapan e-ticaret sitesi"
                rows={4}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-dark placeholder-gray rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-6">
                Platform Seçimi ({selectedPlatforms.length} platform seçildi)
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition-all
                      ${selectedPlatforms.includes(platform.id)
                        ? 'bg-primary/10 border-primary shadow-lg'
                        : 'bg-white border-gray-200 hover:border-primary hover:shadow-lg'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <h3 className="font-bold text-dark text-base">{platform.name}</h3>
                          <p className="text-xs text-gray">{platform.description}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlatforms.includes(platform.id)
                          ? 'bg-primary border-primary'
                          : 'border-gray-300'
                      }`}>
                        {selectedPlatforms.includes(platform.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={generateCopies}
              disabled={loading || !service.trim() || selectedPlatforms.length === 0}
              className="w-full bg-primary hover:bg-secondary text-dark font-bold py-4 px-6 rounded-xl transition-all disabled:bg-gray-200 disabled:text-gray disabled:cursor-not-allowed flex items-center justify-center space-x-3 group shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Zap className="w-5 h-5" />
              <span>Reklam Metinleri Oluştur</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {adCopies.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-dark">
                Oluşturulan Reklam Metinleri ({adCopies.length} adet)
              </h2>
              <button
                onClick={generateCopies}
                disabled={loading}
                className="inline-flex items-center space-x-2 border-2 border-primary bg-white hover:bg-primary text-dark px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yeniden Oluştur</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {adCopies.map((copy, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg hover:border-primary hover:shadow-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {platforms.find(p => p.name === copy.platform)?.icon || '📱'}
                      </span>
                      <span className="text-sm font-bold text-dark bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                        {copy.platform}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(index)}
                      className="flex items-center space-x-1 text-dark hover:bg-primary/10 transition-all p-2 rounded-lg"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray uppercase">Başlık</label>
                      <h3 className="font-bold text-dark mt-2 text-base leading-tight">{copy.headline}</h3>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray uppercase">Açıklama</label>
                      <p className="text-dark mt-2 text-sm leading-relaxed">{copy.description}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray uppercase">Eylem Çağrısı</label>
                      <div className="bg-primary/20 text-dark px-4 py-2 rounded-xl inline-block font-bold mt-2 text-sm border border-primary/30">
                        {copy.callToAction}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adCopies.length === 0 && !loading && (
          <div className="text-center py-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-dashed border-gray-300">
            <Sparkles className="w-16 h-16 text-gray mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark mb-2">Reklam Metinlerinizi Oluşturun</h3>
            <p className="text-gray">
              Hizmetinizi tanımlayın ve platformları seçin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
