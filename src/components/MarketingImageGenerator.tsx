import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Palette, Download, RefreshCw } from 'lucide-react';
import { ImageGenerationService, ImageQuality } from '../services/imageGenerationService';

const SECTORS = {
  'ecommerce': 'E-ticaret / Ürün Satış',
  'tech': 'Teknoloji / SaaS',
  'food': 'Yiyecek / İçecek',
  'fashion': 'Moda / Giyim',
  'service': 'Hizmet / Kurumsal'
};

const FORMATS = {
  'square': { name: 'Kare (1:1)', width: 1024, height: 1024 },
  'landscape': { name: 'Yatay (16:9)', width: 1792, height: 1024 },
  'portrait': { name: 'Dikey (9:16)', width: 1024, height: 1792 }
};

export default function MarketingImageGenerator() {
  const [productName, setProductName] = useState('');
  const [brandColors, setBrandColors] = useState('');
  const [slogan, setSlogan] = useState('');
  const [sector, setSector] = useState<keyof typeof SECTORS>('ecommerce');
  const [format, setFormat] = useState<keyof typeof FORMATS>('square');
  const [quality, setQuality] = useState<ImageQuality>('basic');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = () => {
    const sectorPrompts = {
      'ecommerce': `E-ticaret reklam görseli: ${productName}. ${brandColors} renk paletinde. Ürün merkez odak noktası, modern temiz kompozisyon, profesyonel ürün fotoğrafçılığı`,
      'tech': `Teknoloji SaaS reklam görseli: ${productName}. ${brandColors} renk paletinde. Dijital, modern, yenilikçi, gradient teknolojik arka plan`,
      'food': `Yiyecek içecek reklam görseli: ${productName}. ${brandColors} renk paletinde. Ürün ön planda, iştah açıcı sunum, doğal ortam`,
      'fashion': `Moda reklam görseli: ${productName}. ${brandColors} renk paletinde. Şık, trend, yüksek kontrastlı, model üzerinde estetik sunum`,
      'service': `Kurumsal hizmet reklam görseli: ${productName}. ${brandColors} renk paletinde. Profesyonel, güven verici, minimalist`
    };

    let prompt = sectorPrompts[sector];

    if (slogan) {
      prompt += `. Görselin üst kısmında okunaklı yazı ile: "${slogan}"`;
    }

    prompt += '. Profesyonel reklam fotoğrafçılığı, yüksek kalite, reklam afişi';

    return prompt;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== GENERATE BUTTON CLICKED ===');
    console.log('Product:', productName);
    console.log('Colors:', brandColors);
    console.log('Sector:', sector);
    console.log('Format:', format);
    console.log('Quality:', quality);

    if (!productName.trim() || !brandColors.trim()) {
      setError('Lütfen ürün adı ve marka renklerini girin');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const prompt = generatePrompt();
      console.log('Generated Prompt:', prompt);

      const service = new ImageGenerationService();
      const formatInfo = FORMATS[format];

      const url = await service.generateImage({
        prompt,
        quality,
        width: formatInfo.width,
        height: formatInfo.height
      });

      console.log('Image generated successfully:', url);
      setImageUrl(url);
    } catch (err) {
      console.error('=== GENERATION ERROR ===');
      console.error('Error:', err);
      setError('Görsel oluşturulamadı: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
      console.log('=== GENERATION COMPLETE ===');
    }
  };

  const handleNewImage = () => {
    setImageUrl(null);
    setProductName('');
    setBrandColors('');
    setSlogan('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Görsel Oluşturuluyor</h3>
          <p className="text-gray">Lütfen bekleyin, bu 10-30 saniye sürebilir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Görsel Oluşturucu</h1>
          </div>
          <p className="text-gray text-base max-w-2xl mx-auto">
            AI ile profesyonel reklam görselleri oluşturun
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-dark mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Kalite Seviyesi
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setQuality('basic')}
                  className={`px-6 py-5 rounded-2xl border-2 transition-all ${
                    quality === 'basic'
                      ? 'border-primary bg-primary/20 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                >
                  <div className="font-bold text-lg text-dark">Hızlı</div>
                  <div className="text-xs text-gray mt-1">~5 saniye</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuality('pro')}
                  className={`px-6 py-5 rounded-2xl border-2 transition-all ${
                    quality === 'pro'
                      ? 'border-primary bg-primary/20 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                >
                  <div className="font-bold text-lg text-dark">Pro</div>
                  <div className="text-xs text-gray mt-1">~10 saniye</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuality('advanced')}
                  className={`px-6 py-5 rounded-2xl border-2 transition-all ${
                    quality === 'advanced'
                      ? 'border-primary bg-primary/20 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                >
                  <div className="font-bold text-lg text-dark">Ultra</div>
                  <div className="text-xs text-gray mt-1">~30 saniye</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-4">Sektör</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(SECTORS).map(([key, name]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSector(key as keyof typeof SECTORS)}
                    className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      sector === key
                        ? 'border-primary bg-primary/20 text-dark'
                        : 'border-gray-200 hover:border-primary/50 bg-white text-gray'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Ürün Bilgileri
              </label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray mb-2">Ürün/Hizmet Adı</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Örn: Kablosuz Kulaklık"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray mb-2">Marka Renkleri</label>
                  <input
                    type="text"
                    value={brandColors}
                    onChange={(e) => setBrandColors(e.target.value)}
                    placeholder="Örn: Siyah ve Mavi"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray mb-2">
                    Slogan <span className="text-gray-400 font-normal">(İsteğe Bağlı)</span>
                  </label>
                  <input
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="Örn: Ses Kalitesini Keşfet"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-4">Format</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(FORMATS).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormat(key as keyof typeof FORMATS)}
                    className={`px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      format === key
                        ? 'border-primary bg-primary/20 text-dark'
                        : 'border-gray-200 hover:border-primary/50 bg-white text-gray'
                    }`}
                  >
                    <div className="font-bold">{value.name}</div>
                    <div className="text-xs text-gray mt-1">{value.width}x{value.height}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !productName.trim() || !brandColors.trim()}
              className="w-full bg-primary hover:bg-secondary text-dark font-bold py-4 px-6 rounded-xl transition-all disabled:bg-gray-200 disabled:text-gray disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Görsel Oluştur</span>
            </button>
          </form>

          {imageUrl && (
            <div className="mt-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-dark">Görseliniz Hazır</h3>
                <button
                  onClick={handleNewImage}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-dark text-sm rounded-xl transition font-bold"
                >
                  Yeni Görsel
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-primary">
                <img
                  src={imageUrl}
                  alt={productName}
                  className="w-full"
                />
                <div className="absolute top-4 right-4 bg-primary text-dark px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                  {FORMATS[format].name}
                </div>
                <div className="absolute top-4 left-4 bg-dark text-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                  {quality === 'basic' ? 'Hızlı' : quality === 'pro' ? 'Pro' : 'Ultra'}
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={imageUrl}
                  download={`${productName.toLowerCase().replace(/\s/g, '-')}-reklam.png`}
                  className="flex-1 text-center bg-primary text-dark font-bold py-4 rounded-xl hover:bg-secondary transition shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Görseli İndir</span>
                </a>
                <button
                  onClick={handleGenerate}
                  className="px-8 bg-gray-100 text-dark font-bold rounded-xl hover:bg-gray-200 transition shadow-md flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Yeniden Oluştur</span>
                </button>
              </div>

              <div className="p-5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray">
                      <strong className="text-dark">Ürün:</strong> {productName}
                    </p>
                    <p className="text-gray">
                      <strong className="text-dark">Slogan:</strong> {slogan || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray">
                      <strong className="text-dark">Renk:</strong> {brandColors}
                    </p>
                    <p className="text-gray">
                      <strong className="text-dark">Sektör:</strong> {SECTORS[sector]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
