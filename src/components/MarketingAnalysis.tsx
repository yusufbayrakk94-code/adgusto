import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, Lightbulb, DollarSign, FileText, Share2, Download, Target } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { useLanguage } from '../hooks/useLanguage';

interface MarketingAnalysisProps {
    onAnalyze: (service: string, sector?: string) => Promise<any>;
    loading: boolean;
    onBack: () => void;
    onLogout?: () => void;
    userEmail?: string;
    onGoHome?: () => void;
    onResultReady?: () => void;
}

interface MarketingAnalysisPropsExtended extends MarketingAnalysisProps {
    onNavigateToImageGenerator?: (campaignData: any) => void;
}

const MarketingAnalysisComponent: React.FC<MarketingAnalysisPropsExtended> = ({
    onAnalyze,
    loading,
    onBack,
    onNavigateToImageGenerator,
    onResultReady
}) => {
    const { t } = useLanguage();
    const [service, setService] = useState('');
    const [rawResult, setRawResult] = useState<any>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [selectedAdType, setSelectedAdType] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const normalizeAnalysisResult = (raw: any) => {
        if (!raw) return null;
        if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object') {
            return raw[0];
        }
        if (raw?.data && typeof raw.data === 'object') {
            return raw.data;
        }
        if (raw?.result && typeof raw.result === 'object') {
            return raw.result;
        }
        return raw;
    };

    const result = normalizeAnalysisResult(rawResult);

    useEffect(() => {
        if (result) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [result]);

    const handleNewAnalysis = () => {
        setRawResult(null);
        setService('');
        setError(undefined);
    };

    const handleDownloadPDF = () => {
        if (result) {
            generatePDF({
                service,
                sector: 'general',
                ...result
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isAnalyzing) return;

        setError(undefined);
        setRawResult(null);
        setIsAnalyzing(true);

        if (!service.trim()) {
            setError(t('marketingAnalysis.errorService'));
            setIsAnalyzing(false);
            return;
        }

        try {
            const analysis = await onAnalyze(service.trim());

            if (!analysis) {
                setError(t('marketingAnalysis.errorAnalysis'));
                setIsAnalyzing(false);
                return;
            }

            const normalized = normalizeAnalysisResult(analysis);
            console.log('Analysis result:', analysis);
            console.log('Normalized result:', normalized);
            console.log('budgetRecommendation:', normalized?.budgetRecommendation);
            console.log('adTypes:', normalized?.adTypes);
            console.log('organicContent:', normalized?.organicContent);

            setIsAnalyzing(false);
            setRawResult(normalized);
            if (normalized && onResultReady) {
                onResultReady();
            }
        } catch (err) {
            console.error('Analysis error:', err);
            const errorMessage = err instanceof Error ? err.message : t('marketingAnalysis.errorAnalysis');
            setError(errorMessage);
            setIsAnalyzing(false);
        }
    };


    return (
        <div className="min-h-screen bg-white text-dark">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray hover:text-dark transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('common.back')}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h1 className="text-lg font-semibold text-dark">{t('marketingAnalysis.title')}</h1>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Analiz Yapılıyor Ekranı */}
                {isAnalyzing && (
                    <div className="text-center py-16">
                        <div className="mb-8">
                            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                        <h2 className="text-2xl font-semibold text-dark mb-3">Analiz Yapılıyor</h2>
                        <p className="text-gray text-sm max-w-md mx-auto mb-6">
                            Ürününüz için kapsamlı bir pazarlama stratejisi oluşturuyoruz. Bu işlem 10-20 saniye sürebilir...
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}

                {/* Ürün Adı Formu */}
                {!result && !isAnalyzing && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                            <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-dark mb-3">Pazarlama Analizi</h2>
                            <p className="text-gray text-base max-w-md mx-auto">Ürününüz veya hizmetiniz için yapay zeka destekli kapsamlı pazarlama stratejisi oluşturun</p>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                                <label htmlFor="service" className="block text-base font-semibold text-dark mb-3">
                                    Ürün veya Hizmet Adı
                                </label>
                                <input
                                    id="service"
                                    type="text"
                                    className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                                    value={service}
                                    onChange={e => setService(e.target.value)}
                                    placeholder="Örneğin: El Kremi, Diş Kliniği, Web Tasarım Hizmeti..."
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="max-w-2xl mx-auto p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="max-w-2xl mx-auto pt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary text-dark font-bold py-4 text-lg rounded-xl hover:bg-secondary transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                                disabled={loading || isAnalyzing}
                            >
                                {(loading || isAnalyzing) ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analiz Yapılıyor...
                                    </span>
                                ) : 'Analiz Et'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Sonuç Alanı */}
                {result && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-semibold text-dark mb-2">{t('campaignAnalyzer.results')}</h2>
                            <p className="text-gray text-sm">{t('marketingAnalysis.subtitle')}</p>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-dark mb-2">Analiz Tamamlandı</h3>
                            <p className="text-gray text-sm mb-3">{result?.summary || 'Pazarlama analizi başarıyla tamamlandı.'}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                    <p className="text-xs text-gray mb-1">Hizmet</p>
                                    <p className="text-base font-semibold text-dark">{result?.service || service}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                    <p className="text-xs text-gray mb-1">Kanal Sayısı</p>
                                    <p className="text-base font-semibold text-dark">{Array.isArray(result?.channels) ? result.channels.length : 0}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                    <p className="text-xs text-gray mb-1">Reklam Türü</p>
                                    <p className="text-base font-semibold text-dark">{Array.isArray(result?.adTypes) ? result.adTypes.length : 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* PDF İndir Butonu - ÜST */}
                        <button
                            className="w-full bg-primary text-dark font-semibold py-4 rounded-lg hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-lg"
                            onClick={handleDownloadPDF}
                        >
                            <Download className="w-5 h-5" />
                            {t('marketingAnalysis.downloadPDF')}
                        </button>

                        {/* Bütçe Önerisi */}
                        {result?.budgetRecommendation && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-dark">{t('marketingAnalysis.budgetTitle')}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray mb-1">Minimum Bütçe</p>
                                        <p className="text-xl font-bold text-dark">{result?.budgetRecommendation?.minBudget || 0} TL</p>
                                    </div>
                                    <div className="bg-primary/5 p-4 rounded-lg">
                                        <p className="text-xs text-gray mb-1">Optimal Bütçe</p>
                                        <p className="text-xl font-bold text-primary">{result?.budgetRecommendation?.optimalBudget || 0} TL</p>
                                    </div>
                                </div>
                                {result?.budgetRecommendation?.budgetDistribution && Array.isArray(result.budgetRecommendation.budgetDistribution) && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-dark">Platform Dağılımı:</p>
                                        {result.budgetRecommendation.budgetDistribution.map((dist: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-dark">{dist?.platform || 'Platform'}</p>
                                                    <p className="text-xs text-gray">{dist?.rationale || ''}</p>
                                                </div>
                                                <span className="text-lg font-bold text-primary">{dist?.percentage || 0}%</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {result?.budgetRecommendation?.expectedResults && (
                                    <p className="text-xs text-gray mt-4">{result.budgetRecommendation.expectedResults}</p>
                                )}
                            </div>
                        )}

                        {/* Kanallar */}
                        {result?.channels && Array.isArray(result.channels) && result.channels.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-dark">Kanal Önerileri</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {result.channels.map((channel: any, idx: number) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-sm font-semibold text-dark mb-2">{channel?.name || 'Kanal'}</p>
                                            <p className="text-xs text-gray mb-2">{channel?.description || ''}</p>
                                            <p className="text-xs text-dark">Etkililik: {channel?.effectiveness ?? '—'}</p>
                                            <p className="text-xs text-dark">Maliyet: {channel?.cost || '—'}</p>
                                            <p className="text-xs text-dark">Hedef Kitle: {channel?.targetAudience || '—'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reklam Formatları */}
                        {result?.adTypes && Array.isArray(result.adTypes) && result.adTypes.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-dark">{t('marketingAnalysis.adTypesTitle')}</h3>
                                </div>
                                <p className="text-xs text-gray mb-4">{t('imageGenerator.subtitle')}</p>
                                <div className="space-y-3">
                                    {result.adTypes.map((adType: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-primary transition-all">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-dark mb-1">{adType?.type || 'Reklam Formatı'}</p>
                                                    <p className="text-xs text-gray mb-2">{adType?.description || ''}</p>
                                                    <p className="text-xs text-primary font-medium">{adType?.bestFor || ''}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedAdType(adType);
                                                    if (onNavigateToImageGenerator) {
                                                        onNavigateToImageGenerator({
                                                            service: result?.service || service,
                                                            adType: adType,
                                                            sector: 'general'
                                                        });
                                                    }
                                                }}
                                                className="mt-3 w-full bg-primary text-dark text-sm font-semibold py-2 rounded-lg hover:bg-secondary transition-all"
                                            >
                                                {t('marketingAnalysis.createImages')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Copy Text Önerileri */}
                        {result?.copyTexts && Array.isArray(result.copyTexts) && result.copyTexts.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-dark">Reklam Metni Önerileri</h3>
                                </div>
                                <div className="space-y-3">
                                    {result.copyTexts.map((copy: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm font-semibold text-dark mb-1">{copy?.platform || 'Platform'}</p>
                                            <p className="text-xs text-gray mb-1">{copy?.headline || ''}</p>
                                            <p className="text-xs text-dark mb-1">{copy?.description || ''}</p>
                                            <p className="text-xs text-primary">CTA: {copy?.callToAction || ''}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Organik İçerik Önerileri */}
                        {result?.organicContent && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-dark">{t('marketingAnalysis.organicTitle')}</h3>
                                </div>

                                {/* Blog Yazıları */}
                                {result?.organicContent?.blogPosts && Array.isArray(result.organicContent.blogPosts) && result.organicContent.blogPosts.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-dark mb-3">Blog Yazısı Önerileri:</p>
                                        <div className="space-y-3">
                                            {result.organicContent.blogPosts.map((post: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-medium text-dark mb-1">{post?.title || 'Blog Yazısı'}</p>
                                                    <p className="text-xs text-gray mb-2">{post?.summary || ''}</p>
                                                    {post?.keywords && Array.isArray(post.keywords) && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {post.keywords.map((keyword: string, kidx: number) => (
                                                                <span key={kidx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                                    {keyword}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sosyal Medya İçerikleri */}
                                {result?.organicContent?.socialMediaPosts && Array.isArray(result.organicContent.socialMediaPosts) && result.organicContent.socialMediaPosts.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Share2 className="w-4 h-4 text-primary" />
                                            <p className="text-sm font-semibold text-dark">Sosyal Medya İçerikleri:</p>
                                        </div>
                                        <div className="space-y-3">
                                            {result.organicContent.socialMediaPosts.map((post: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-medium text-dark">{post?.platform || 'Platform'}</p>
                                                        <span className="text-xs text-gray">{post?.visualSuggestion || ''}</span>
                                                    </div>
                                                    <p className="text-sm text-dark mb-2">{post?.content || ''}</p>
                                                    {post?.hashtags && Array.isArray(post.hashtags) && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {post.hashtags.map((tag: string, tidx: number) => (
                                                                <span key={tidx} className="text-xs text-primary">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* İçerik Takvimi */}
                                {result?.organicContent?.contentCalendar && (
                                    <div className="p-4 bg-primary/5 rounded-lg">
                                        <p className="text-xs font-semibold text-dark mb-2">İçerik Takvimi:</p>
                                        <p className="text-xs text-gray">{result.organicContent.contentCalendar}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Diğer Sonuçlar (JSON) */}
                        <details open={false} className="bg-gray-50 border border-gray-200 rounded-lg">
                            <summary className="p-4 cursor-pointer text-sm font-medium text-dark hover:bg-gray-100 transition-colors">
                                Detaylı Analiz Verilerini Göster
                            </summary>
                            <div className="p-6 max-h-[400px] overflow-auto">
                                <pre className="whitespace-pre-wrap font-mono text-xs text-dark leading-relaxed">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        </details>

                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                className="flex-1 bg-primary text-dark font-semibold py-3 rounded-lg hover:bg-secondary transition-all flex items-center justify-center gap-2"
                                onClick={handleDownloadPDF}
                            >
                                <Download className="w-4 h-4" />
                                {t('common.download')}
                            </button>
                            <button
                                className="flex-1 bg-dark text-primary font-semibold py-3 rounded-lg hover:bg-dark/90 transition-all"
                                onClick={handleNewAnalysis}
                            >
                                {t('common.newAnalysis')}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export const MarketingAnalysis = MarketingAnalysisComponent;
