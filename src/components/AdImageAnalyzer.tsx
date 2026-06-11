import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, CheckCircle, ArrowLeft, Wand2 } from 'lucide-react';
import { ImageAnalysisService, ImageAnalysisResult } from '../services/imageAnalysisService';
import { generateImprovedAdImage } from '../services/falService';

export default function AdImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [improving, setImproving] = useState(false);
  const [improvedImageUrl, setImprovedImageUrl] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Dosya boyutu 10MB\'dan küçük olmalı');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    console.log('=== ANALYZE BUTTON CLICKED ===');
    console.log('File:', selectedFile.name);

    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const service = new ImageAnalysisService();
      const analysisResult = await service.analyzeAdImage(selectedFile);

      console.log('Analysis complete:', analysisResult);
      setResult(analysisResult);
    } catch (err) {
      console.error('=== ANALYSIS ERROR ===');
      console.error('Error:', err);
      setError('Görsel analiz edilemedi: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setAnalyzing(false);
      console.log('=== ANALYSIS COMPLETE ===');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
    setSelectedImprovements([]);
    setImprovedImageUrl('');
  };

  const toggleImprovement = (improvement: string) => {
    setSelectedImprovements(prev =>
      prev.includes(improvement)
        ? prev.filter(i => i !== improvement)
        : [...prev, improvement]
    );
  };

  const handleImprove = async () => {
    if (!selectedFile || selectedImprovements.length === 0) {
      setError('Lütfen en az bir iyileştirme seçin');
      return;
    }

    setImproving(true);
    setError('');

    try {
      console.log('=== IMPROVEMENT START ===');
      console.log('Original file:', selectedFile.name);
      console.log('Selected improvements:', selectedImprovements);

      const service = new ImageAnalysisService();
      const uploadedUrl = await service.uploadImage(selectedFile);
      console.log('Uploaded image URL:', uploadedUrl);

      const improvedUrl = await generateImprovedAdImage(uploadedUrl, selectedImprovements);

      console.log('Improved image URL:', improvedUrl);
      setImprovedImageUrl(improvedUrl);
    } catch (err) {
      console.error('=== IMPROVEMENT ERROR ===', err);
      setError('Görsel iyileştirilemedi: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setImproving(false);
    }
  };

  if (analyzing || improving) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">
            {analyzing ? 'Görsel Analiz Ediliyor' : 'Görsel İyileştiriliyor'}
          </h3>
          <p className="text-gray">Bu 30-60 saniye sürebilir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Görsel Analizci</h1>
          </div>
          <p className="text-gray text-base max-w-2xl mx-auto">
            AI ile reklam görsellerinizi analiz edin ve iyileştirme önerileri alın
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
                <Upload className="w-6 h-6" />
                Görsel Yükle
              </h2>

              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                      <ImageIcon className="w-10 h-10 text-dark" />
                    </div>
                    <p className="mb-2 text-lg text-dark font-bold">
                      Görseli sürükle bırak veya tıkla
                    </p>
                    <p className="text-sm text-gray mb-4">PNG, JPG, JPEG dosyaları desteklenir</p>
                    <p className="text-xs text-gray bg-gray-100 px-4 py-2 rounded-lg">Maks. 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                    <img src={previewUrl} alt="Önizleme" className="w-full h-auto" />
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                    <p className="text-sm font-bold text-dark mb-2">✓ Görsel yüklendi</p>
                    <p className="text-xs text-gray">Analiz için butona tıklayın</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-dark font-bold rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    Farklı Görsel Seç
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full py-4 px-6 bg-primary hover:bg-secondary text-dark rounded-xl transition-all disabled:bg-gray-200 disabled:text-gray disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>AI ile Analiz Et</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${improvedImageUrl ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
                <ImageIcon className="w-6 h-6" />
                {improvedImageUrl ? 'Orijinal Görsel' : 'Analiz Edilen Görsel'}
              </h2>
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary shadow-lg mb-4">
                <img src={previewUrl} alt="Analiz edilen" className="w-full h-auto" />
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 bg-white border-2 border-gray-200 text-dark font-bold rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
              >
                Yeni Analiz
              </button>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-dark">Analiz Sonuçları</h2>
                </div>

                {result.summary && (
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-dark mb-3">📊 Genel Değerlendirme</h3>
                    <p className="text-sm text-gray leading-relaxed">{result.summary}</p>
                  </div>
                )}

                {result.composition.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📐</span>
                      <h3 className="text-lg font-bold text-dark">Kompozisyon</h3>
                    </div>
                    <div className="space-y-2">
                      {result.composition.map((item, idx) => (
                        <label
                          key={idx}
                          className={`bg-blue-50 border border-blue-200 rounded-xl p-4 cursor-pointer hover:bg-blue-100 transition-colors flex items-start gap-3 ${
                            selectedImprovements.includes(item) ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImprovements.includes(item)}
                            onChange={() => toggleImprovement(item)}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-sm text-dark font-medium flex-1">{item}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {result.colors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎨</span>
                      <h3 className="text-lg font-bold text-dark">Renkler</h3>
                    </div>
                    <div className="space-y-2">
                      {result.colors.map((item, idx) => (
                        <label
                          key={idx}
                          className={`bg-purple-50 border border-purple-200 rounded-xl p-4 cursor-pointer hover:bg-purple-100 transition-colors flex items-start gap-3 ${
                            selectedImprovements.includes(item) ? 'ring-2 ring-purple-500' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImprovements.includes(item)}
                            onChange={() => toggleImprovement(item)}
                            className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                          />
                          <p className="text-sm text-dark font-medium flex-1">{item}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {result.typography.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✍️</span>
                      <h3 className="text-lg font-bold text-dark">Tipografi</h3>
                    </div>
                    <div className="space-y-2">
                      {result.typography.map((item, idx) => (
                        <label
                          key={idx}
                          className={`bg-green-50 border border-green-200 rounded-xl p-4 cursor-pointer hover:bg-green-100 transition-colors flex items-start gap-3 ${
                            selectedImprovements.includes(item) ? 'ring-2 ring-green-500' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImprovements.includes(item)}
                            onChange={() => toggleImprovement(item)}
                            className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <p className="text-sm text-dark font-medium flex-1">{item}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {result.callToAction.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👆</span>
                      <h3 className="text-lg font-bold text-dark">Harekete Geçirme</h3>
                    </div>
                    <div className="space-y-2">
                      {result.callToAction.map((item, idx) => (
                        <label
                          key={idx}
                          className={`bg-orange-50 border border-orange-200 rounded-xl p-4 cursor-pointer hover:bg-orange-100 transition-colors flex items-start gap-3 ${
                            selectedImprovements.includes(item) ? 'ring-2 ring-orange-500' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImprovements.includes(item)}
                            onChange={() => toggleImprovement(item)}
                            className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                          />
                          <p className="text-sm text-dark font-medium flex-1">{item}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleImprove}
                  disabled={selectedImprovements.length === 0 || improving}
                  className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-dark font-bold rounded-xl transition-all disabled:bg-gray-200 disabled:text-gray disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:hover:translate-y-0"
                >
                  <Wand2 className="w-5 h-5" />
                  <span>
                    {selectedImprovements.length > 0
                      ? `${selectedImprovements.length} İyileştirmeyi Uygula`
                      : 'Önce Öneriler Seçin'}
                  </span>
                </button>
              </div>
            </div>

            {improvedImageUrl && (
              <div className="bg-white border-2 border-green-200 rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
                  <Wand2 className="w-6 h-6 text-green-600" />
                  İyileştirilmiş Görsel
                </h2>
                <div className="relative rounded-2xl overflow-hidden border-2 border-green-500 shadow-lg mb-4">
                  <img src={improvedImageUrl} alt="İyileştirilmiş" className="w-full h-auto" />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-sm font-bold text-dark mb-2">✓ İyileştirmeler Uygulandı</p>
                  <p className="text-xs text-gray">{selectedImprovements.length} öneri uygulandı</p>
                </div>
                <a
                  href={improvedImageUrl}
                  download="iyilestirilmis-gorsel.png"
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Görseli İndir</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
