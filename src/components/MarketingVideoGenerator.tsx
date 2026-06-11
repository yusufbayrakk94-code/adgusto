import React, { useState, useEffect } from 'react';
import { Video, Play, Wand2, Sparkles, Film, Loader2 } from 'lucide-react';
import { VideoService } from '../services/videoService';
import { supabase } from '../config/supabase';
import { useLanguage } from '../hooks/useLanguage';

const SECTOR_TEMPLATES = {
  'e-commerce': {
    name: 'E-ticaret / Ürün Satış',
    template: (product: string, description: string) =>
      `${product} ürününün tanıtım videosu. ${description}. Modern, dinamik, ürün odaklı. Ürün detayları, kullanım senaryoları, profesyonel çekim.`
  },
  'tech-saas': {
    name: 'Teknoloji / SaaS',
    template: (product: string, description: string) =>
      `${product} yazılımının tanıtım videosu. ${description}. Dijital, modern, yenilikçi. Arayüz gösterimi, özellik vurgulaması, teknolojik animasyon.`
  },
  'food-beverage': {
    name: 'Yiyecek / İçecek',
    template: (product: string, description: string) =>
      `${product} ürününün tanıtım videosu. ${description}. İştah açıcı, canlı, yaşam tarzı odaklı. Ürün hazırlığı, servis sunumu, tüketim anı.`
  },
  'fashion': {
    name: 'Moda / Giyim',
    template: (product: string, description: string) =>
      `${product} ürününün moda tanıtım videosu. ${description}. Şık, trend, yüksek kontrastlı. Model üzerinde gösterim, stil vurgusu, moda çekimi.`
  },
  'service-corporate': {
    name: 'Hizmet Sektörü / Kurumsal',
    template: (product: string, description: string) =>
      `${product} hizmetinin tanıtım videosu. ${description}. Profesyonel, güven verici, minimalist. Hizmet süreci, fayda gösterimi, kurumsal sunum.`
  }
};

const VIDEO_DURATIONS = {
  '5': { name: '5 saniye', seconds: 5 },
  '10': { name: '10 saniye', seconds: 10 },
};

type AIProvider = ' ' | ' ' | ' ';

const AI_PROVIDERS = {
  'minimax': { name: 'Minimax (Hızlı)', model: 'fal-ai/minimax-video' },
  'runway': { name: 'Runway Gen3 (Kaliteli)', model: 'fal-ai/runway-gen3/turbo' },
  'luma': { name: 'Luma Dream Machine (En İyi)', model: 'fal-ai/luma-dream-machine' },
};

async function generateVideoWithFal(
  prompt: string,
  duration: number,
  provider: AIProvider,
  onProgress?: (elapsed: number, status: string) => void
): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase yapılandırması bulunamadı.');
  }

  console.log('=== VIDEO GENERATION START ===');
  console.log('Request:', { prompt: prompt.substring(0, 50), duration, provider });

  const startTime = Date.now();

  const submitUrl = `${supabaseUrl}/functions/v1/generate-video`;
  const submitResponse = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      duration,
      provider,
    }),
  });

  if (!submitResponse.ok) {
    const errorData = await submitResponse.json().catch(() => ({ error: 'Unknown error' }));
    console.error('Submit error:', errorData);
    throw new Error(errorData.error || `Video submission failed (${submitResponse.status})`);
  }

  const submitResult = await submitResponse.json();
  const { requestId, model } = submitResult;
  console.log('Video request submitted:', requestId);

  const maxAttempts = 120;
  const pollInterval = 5000;
  const checkStatusUrl = `${supabaseUrl}/functions/v1/check-video-status`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Checking status (attempt ${attempt + 1}, elapsed ${elapsed}s)...`);

    if (onProgress) {
      onProgress(elapsed, 'IN_PROGRESS');
    }

    try {
      const statusResponse = await fetch(checkStatusUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, model }),
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        continue;
      }

      const statusResult = await statusResponse.json();
      console.log('Status:', statusResult.status);

      if (statusResult.status === 'COMPLETED' && statusResult.videoUrl) {
        console.log('=== VIDEO GENERATION COMPLETED ===');
        const finalElapsed = Math.floor((Date.now() - startTime) / 1000);
        if (onProgress) {
          onProgress(finalElapsed, 'COMPLETED');
        }
        return statusResult.videoUrl;
      }

      if (statusResult.status === 'FAILED') {
        throw new Error('Video generation failed');
      }
    } catch (error: any) {
      console.error('Status check error:', error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw new Error('Video generation timeout (10 minutes)');
}

const VIDEO_LIMIT = 3;

export const MarketingVideoGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSector, setSelectedSector] = useState<keyof typeof SECTOR_TEMPLATES>('e-commerce');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<keyof typeof VIDEO_DURATIONS>('5');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoCount, setVideoCount] = useState(0);
  const [aiProvider, setAiProvider] = useState<AIProvider>('minimax');
  const [showPreview, setShowPreview] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');

  const examples = {
    'e-commerce': { product: 'Kablosuz Kulaklık', description: '360 derece ürün gösterimi, özellik vurguları' },
    'tech-saas': { product: 'CRM Yazılımı', description: 'Dashboard animasyonu, özellik tanıtımı' },
    'food-beverage': { product: 'Soğuk Kahve', description: 'Hazırlık süreci, içim anı, tazelik vurgusu' },
    'fashion': { product: 'Denim Ceket', description: 'Model üzerinde gösterim, farklı kombinasyonlar' },
    'service-corporate': { product: 'Danışmanlık Hizmeti', description: 'Süreç gösterimi, müşteri memnuniyeti' }
  };

  useEffect(() => {
    const loadVideoCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const count = await VideoService.getVideoCount(user.id);
        setVideoCount(count);
      }
    };
    loadVideoCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (videoCount >= VIDEO_LIMIT) {
      setError(t('videoGenerator.errorLimit'));
      return;
    }

    if (!productName.trim() || !description.trim()) {
      setError(t('videoGenerator.errorFields'));
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setShowPreview(true);
    setProgressTime(0);
    setProgressStatus('');

    try {
      const template = SECTOR_TEMPLATES[selectedSector].template;
      const durationInfo = VIDEO_DURATIONS[duration];
      const optimizedPrompt = template(productName, description);

      console.log('Starting video generation...');
      const url = await generateVideoWithFal(
        optimizedPrompt,
        durationInfo.seconds,
        aiProvider,
        (elapsed, status) => {
          setProgressTime(elapsed);
          setProgressStatus(status);
        }
      );
      console.log('Video generated successfully:', url);

      setVideoUrl(url);
      setVideoCount(prev => prev + 1);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await VideoService.saveVideo(
            user.id,
            optimizedPrompt,
            selectedSector,
            durationInfo.seconds,
            url,
            aiProvider
          );
          console.log('Video saved to database');
        } catch (saveError) {
          console.error('Database save error:', saveError);
        }
      }
    } catch (err: any) {
      console.error('Video generation error:', err);
      setError(err.message || t('videoGenerator.errorGenerate'));
      setShowPreview(false);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    const example = examples[selectedSector];
    setProductName(example.product);
    setDescription(example.description);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-primary/10">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:px-8 lg:px-12 md:py-12">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-dark" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark">{t('videoGenerator.title')}</h1>
            </div>
            <p className="text-gray text-base max-w-2xl mx-auto">
              {t('videoGenerator.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* AI Model Seçimi */}
              <div>
                <label className="block text-sm font-bold text-dark mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  {t('videoGenerator.qualitySelect')}
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setAiProvider('minimax')}
                    className={`px-6 py-5 rounded-2xl border-2 transition-all ${
                      aiProvider === 'minimax'
                        ? 'border-primary bg-primary/20 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-dark">{t('videoGenerator.qualityFast')}</div>
                    <div className="text-xs text-gray mt-1">Minimax</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('runway')}
                    className={`px-6 py-5 rounded-2xl border-2 transition-all ${
                      aiProvider === 'runway'
                        ? 'border-primary bg-primary/20 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-dark">{t('videoGenerator.qualityGood')}</div>
                    <div className="text-xs text-gray mt-1">Runway</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('luma')}
                    className={`px-6 py-5 rounded-2xl border-2 transition-all ${
                      aiProvider === 'luma'
                        ? 'border-primary bg-primary/20 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-dark">{t('videoGenerator.qualityBest')}</div>
                    <div className="text-xs text-gray mt-1">Luma</div>
                  </button>
                </div>
              </div>

              {/* Sektör Seçimi */}
              <div>
                <label className="block text-sm font-bold text-dark mb-4">{t('videoGenerator.sectorSelect')}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(SECTOR_TEMPLATES).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedSector(key as keyof typeof SECTOR_TEMPLATES)}
                      className={`px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        selectedSector === key
                          ? 'border-primary bg-primary/20 shadow-md text-dark'
                          : 'border-gray-200 hover:border-primary/50 hover:shadow bg-white text-gray'
                      }`}
                    >
                      {value.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video İçeriği */}
              <div className="space-y-5">
                <label className="block text-sm font-bold text-dark mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t('videoGenerator.contentLabel')}
                </label>
                <div>
                  <label className="block text-xs font-semibold text-gray mb-2">{t('videoGenerator.productLabel')}</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={t('videoGenerator.productPlaceholder')}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray mb-2">{t('videoGenerator.promptLabel')}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('videoGenerator.promptPlaceholder')}
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Video Süresi */}
              <div>
                <label className="block text-sm font-bold text-dark mb-4">{t('videoGenerator.durationLabel')}</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(VIDEO_DURATIONS).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDuration(key as keyof typeof VIDEO_DURATIONS)}
                      className={`px-6 py-4 rounded-xl border-2 transition-all ${
                        duration === key
                          ? 'border-primary bg-primary/20 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 hover:shadow bg-white'
                      }`}
                    >
                      <div className="font-bold text-dark">{value.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={loadExample}
                  className="px-6 py-4 border-2 border-gray-200 text-gray rounded-xl hover:border-primary/50 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Sparkles className="w-5 h-5" />
                  {t('videoGenerator.loadExample')}
                </button>

                <button
                  type="submit"
                  disabled={loading || videoCount >= VIDEO_LIMIT}
                  className="flex-1 bg-primary text-dark px-6 py-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-lg"
                >
                  {loading ? (
                    <>
                      <Wand2 className="w-5 h-5 animate-spin" />
                      {t('videoGenerator.generating')}
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {t('common.generate')} ({videoCount}/{VIDEO_LIMIT})
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 mt-6 font-semibold">
              {error}
            </div>
          )}

          {showPreview && (
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-200 mt-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-dark">
                <Video className="w-6 h-6" />
                {videoUrl ? t('videoGenerator.generated') : t('videoGenerator.generatingTitle')}
              </h3>
              <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg relative">
                {!videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
                      style={{
                        filter: 'blur(100px)',
                        animation: 'pulse 3s ease-in-out infinite'
                      }}
                    />
                    <div className="relative z-10 text-center space-y-4">
                      <Loader2 className="w-16 h-16 text-white animate-spin mx-auto" />
                      <p className="text-white text-lg font-medium">
                        {t('videoGenerator.aiGenerating')}
                      </p>
                      {progressTime > 0 && (
                        <div className="space-y-2">
                          <p className="text-gray-300 text-sm">
                            {t('videoGenerator.elapsedTime')}: {Math.floor(progressTime / 60)}:{String(progressTime % 60).padStart(2, '0')}
                          </p>
                          {progressStatus && (
                            <p className="text-gray-400 text-xs">
                              Status: {progressStatus}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-gray-300 text-sm max-w-md mx-auto px-4">
                        {t('videoGenerator.processingMessage')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    autoPlay
                    loop
                  />
                )}
              </div>
              {videoUrl && (
                <div className="mt-6">
                  <a
                    href={videoUrl}
                    download
                    className="w-full block bg-primary text-dark px-6 py-4 rounded-xl hover:bg-primary/90 transition-all text-center font-bold shadow-lg"
                  >
                    {t('videoGenerator.downloadVideo')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
