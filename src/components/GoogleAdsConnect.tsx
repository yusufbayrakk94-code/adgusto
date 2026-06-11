import React, { useState, useEffect } from 'react';
import { Link2, RefreshCw, AlertCircle, TrendingUp, BarChart3, DollarSign, MousePointerClick, Eye, CheckCircle, PenSquare, Send } from 'lucide-react';
import { GoogleAdsService, GoogleAdsCampaign, GoogleAdsAccount } from '../services/googleAdsService';
import { GroqService } from '../services/groqService';
import { useLanguage } from '../hooks/useLanguage';

interface GoogleAdsConnectProps {
  userId: string;
  onRefreshStats?: () => void;
}

export const GoogleAdsConnect: React.FC<GoogleAdsConnectProps> = ({ userId, onRefreshStats }) => {
  const { t } = useLanguage();
  const [connection, setConnection] = useState<GoogleAdsAccount | null>(null);
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([]);
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [campaignBrief, setCampaignBrief] = useState('');
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [briefSuccess, setBriefSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadConnection();
    checkForOAuthCallback();
  }, [userId]);

  const checkForOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      setError(`${t('googleAds.errorConnect')}: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && state === userId) {
      try {
        await GoogleAdsService.handleOAuthCallback(code, userId);
        window.history.replaceState({}, document.title, window.location.pathname);
        await loadConnection();
      } catch (error: any) {
        console.error('Error handling OAuth callback:', error);
        const errorMessage = error instanceof Error ? error.message : t('common.unknownError');
        setError(`${t('googleAds.errorConnect')}: ${errorMessage}`);

        if (error.requiresManualInput) {
          setShowManualForm(true);
        }
      }
    }
  };

  const loadConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      const conn = await GoogleAdsService.getConnection(userId);
      setConnection(conn);

      if (conn) {
        await loadCampaigns();
      }
    } catch (error) {
      console.error('Error loading connection:', error);
      setError(t('googleAds.errorConnect'));
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      setError(null);
      const campaignData = await GoogleAdsService.fetchCampaigns(userId);
      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError(t('googleAds.errorConnect'));
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleConnect = () => {
    GoogleAdsService.initiateOAuth(userId);
  };

  const handleManualConnect = async () => {
    if (!customerId.trim()) {
      setError(t('googleAds.errorConnect'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await GoogleAdsService.saveManualConnection(userId, customerId.trim());
      setShowManualForm(false);
      setCustomerId('');
      await loadConnection();
    } catch (error) {
      console.error('Error with manual connection:', error);
      setError(t('googleAds.errorConnect'));
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm(t('googleAds.confirmDisconnect'))) {
      return;
    }

    try {
      setLoading(true);
      await GoogleAdsService.disconnectAccount(userId);
      setConnection(null);
      setCampaigns([]);
      setRecommendations('');
    } catch (error) {
      console.error('Error disconnecting:', error);
      setError(t('googleAds.errorConnect'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (campaigns.length === 0) {
      setError(t('googleAds.errorConnect'));
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      const campaignSummary = campaigns.map(c => ({
        name: c.name,
        status: c.status,
        budget: c.budget,
        impressions: c.impressions || 0,
        clicks: c.clicks || 0,
        cost: c.cost || 0,
        conversions: c.conversions || 0,
        ctr: c.impressions ? ((c.clicks || 0) / c.impressions * 100).toFixed(2) : 0,
        cpc: c.clicks ? ((c.cost || 0) / c.clicks).toFixed(2) : 0,
        conversionRate: c.clicks ? ((c.conversions || 0) / c.clicks * 100).toFixed(2) : 0,
      }));

      const prompt = `Aşağıdaki Google Ads kampanya verilerini analiz et ve detaylı öneriler sun:

${JSON.stringify(campaignSummary, null, 2)}

Lütfen şunları içeren detaylı bir analiz yap:
1. Genel kampanya performansı değerlendirmesi
2. En iyi ve en kötü performans gösteren kampanyalar
3. Bütçe optimizasyon önerileri
4. CTR (tıklama oranı) iyileştirme önerileri
5. Dönüşüm oranı artırma stratejileri
6. Maliyet optimizasyonu önerileri
7. Hedefleme ve teklif stratejisi önerileri

Önerileri Türkçe olarak, madde madde ve uygulanabilir şekilde sun.`;

      const analysis = await GroqService.analyzeText(prompt);
      setRecommendations(analysis);
    } catch (error) {
      console.error('Error analyzing campaigns:', error);
      setError(t('googleAds.errorConnect'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateCampaignFromBrief = async () => {
    if (!campaignBrief.trim()) {
      setError(t('googleAds.errorConnect'));
      return;
    }

    try {
      setCreatingCampaign(true);
      setError(null);
      setBriefSuccess(null);

      const result = await GoogleAdsService.createCampaignFromBrief(userId, campaignBrief);

      if (result.success) {
        setBriefSuccess(t('googleAds.campaignCreated'));
        setCampaignBrief('');
        setShowBriefForm(false);

        await loadCampaigns();

        setTimeout(() => setBriefSuccess(null), 5000);
      } else {
        setError(result.message || 'Kampanya oluşturulamadı');
      }
    } catch (error) {
      console.error('Error creating campaign from brief:', error);
      setError(t('googleAds.errorConnect'));
    } finally {
      setCreatingCampaign(false);
    }
  };

  const calculateTotals = () => {
    return campaigns.reduce(
      (acc, campaign) => ({
        impressions: acc.impressions + (campaign.impressions || 0),
        clicks: acc.clicks + (campaign.clicks || 0),
        cost: acc.cost + (campaign.cost || 0),
        conversions: acc.conversions + (campaign.conversions || 0),
      }),
      { impressions: 0, clicks: 0, cost: 0, conversions: 0 }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0c4650] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0c4650]/60">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-[#0c4650] mb-2">{t('googleAds.title')}</h1>
            <p className="text-[#0c4650]/60">{t('googleAds.subtitle')}</p>
          </div>

          <div className="bg-white border-2 border-[#e2e8f0] rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#94fa01]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-[#0c4650]" />
              </div>
              <h2 className="text-xl font-semibold text-[#0c4650] mb-2">{t('googleAds.connect')}</h2>
              <p className="text-[#0c4650]/60 mb-6 max-w-md mx-auto">
                {t('googleAds.subtitle')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConnect}
                className="w-full bg-[#94fa01] text-[#0c4650] px-6 py-3 rounded-lg font-medium hover:bg-[#94fa01]/80 transition-colors flex items-center justify-center space-x-2"
              >
                <Link2 className="w-5 h-5" />
                <span>{t('googleAds.connect')}</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('common.or')}</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    await GoogleAdsService.saveManualConnection(userId, 'demo-' + Date.now());
                    await loadConnection();
                  } catch (error) {
                    setError(t('googleAds.errorConnect'));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full border-2 border-[#e2e8f0] text-[#0c4650] px-6 py-3 rounded-lg font-medium hover:bg-[#f8fafc] transition-colors"
              >
                {t('googleAds.demoMode')}
              </button>

              <div className="bg-[#94fa01]/10 border border-[#94fa01]/30 rounded-lg p-4">
                <p className="text-xs text-[#0c4650]/70 text-center">
                  {t('googleAds.connectionInfo')}
                </p>
              </div>

              {!showManualForm && (
                <button
                  onClick={() => setShowManualForm(true)}
                  className="w-full text-center text-sm text-[#0c4650]/60 hover:text-[#0c4650] transition-colors"
                >
                  {t('googleAds.manualConnect')}
                </button>
              )}
            </div>
          </div>

          {showManualForm && (
            <div className="mt-6 bg-white border-2 border-[#e2e8f0] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#0c4650] mb-4">{t('googleAds.manualConnect')}</h3>
              <p className="text-sm text-[#0c4650]/60 mb-4">
                {t('googleAds.manualInfo')}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0c4650] mb-2">
                    {t('googleAds.customerId')}
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="1234567890"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#94fa01] focus:border-[#94fa01]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleManualConnect}
                    disabled={!customerId.trim()}
                    className="flex-1 bg-[#94fa01] text-[#0c4650] px-6 py-3 rounded-lg hover:bg-[#94fa01]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {t('googleAds.connect')}
                  </button>
                  <button
                    onClick={() => {
                      setShowManualForm(false);
                      setCustomerId('');
                      setError(null);
                    }}
                    className="px-6 py-3 border-2 border-gray-200 text-[#0c4650] rounded-lg hover:border-gray-300 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const totals = calculateTotals();
  const avgCtr = totals.impressions ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0';
  const avgCpc = totals.clicks ? (totals.cost / totals.clicks).toFixed(2) : '0';
  const conversionRate = totals.clicks ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-[#0c4650] mb-2">{t('googleAds.campaigns')}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-[#0c4650]/60">
                {t('googleAds.connectedAccount')}: {connection.account_name} ({connection.customer_id})
              </p>
              {(connection.customer_id.startsWith('demo-') || connection.customer_id.startsWith('test-')) && (
                <span className="px-2 py-1 bg-[#94fa01] text-[#0c4650] text-xs font-medium rounded-full">
                  Test Mode
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBriefForm(!showBriefForm)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#94fa01] text-[#0c4650] rounded-lg hover:bg-[#94fa01]/80 transition-colors font-medium"
            >
              <PenSquare className="w-4 h-4" />
              <span>{t('googleAds.newCampaign')}</span>
            </button>
            <button
              onClick={loadCampaigns}
              disabled={loadingCampaigns}
              className="flex items-center space-x-2 px-4 py-2 border border-[#e2e8f0] text-[#0c4650] rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingCampaigns ? 'animate-spin' : ''}`} />
              <span>{t('common.refresh')}</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {t('googleAds.disconnect')}
            </button>
          </div>
        </div>

        {briefSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-600 text-sm">{briefSuccess}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {showBriefForm && (
          <div className="mb-8 bg-white border-2 border-[#94fa01] rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#94fa01] rounded-lg flex items-center justify-center">
                <PenSquare className="w-5 h-5 text-[#0c4650]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0c4650]">{t('googleAds.createFromBrief')}</h2>
                <p className="text-sm text-[#0c4650]/60">{t('googleAds.briefDescription')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0c4650] mb-2">
                  {t('googleAds.campaignBrief')}
                </label>
                <textarea
                  value={campaignBrief}
                  onChange={(e) => setCampaignBrief(e.target.value)}
                  placeholder="Örnek: 25-40 yaş arası kadınlar için yeni koleksiyonumuzu tanıtan bir kampanya oluştur. Günlük bütçe 50 TL, hedef İstanbul ve Ankara. Tıklama başına maksimum 2 TL. Ürün: Yaz Elbise Koleksiyonu 2024"
                  rows={6}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#94fa01] focus:border-[#94fa01] resize-none"
                />
                <p className="text-xs text-[#0c4650]/60 mt-2">
                  {t('googleAds.briefTip')}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateCampaignFromBrief}
                  disabled={creatingCampaign || !campaignBrief.trim()}
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#94fa01] text-[#0c4650] px-6 py-3 rounded-lg hover:bg-[#94fa01]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Send className="w-4 h-4" />
                  <span>{creatingCampaign ? t('common.creating') : t('googleAds.createCampaign')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowBriefForm(false);
                    setCampaignBrief('');
                    setError(null);
                  }}
                  disabled={creatingCampaign}
                  className="px-6 py-3 border-2 border-gray-200 text-[#0c4650] rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {campaigns.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border-2 border-[#e2e8f0] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0c4650]/60">{t('googleAds.totalImpressions')}</span>
                  <Eye className="w-5 h-5 text-[#0c4650]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0c4650]">{totals.impressions.toLocaleString()}</div>
                <div className="text-xs text-[#0c4650]/40 mt-1">CTR: {avgCtr}%</div>
              </div>

              <div className="bg-white border-2 border-[#e2e8f0] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0c4650]/60">{t('googleAds.totalClicks')}</span>
                  <MousePointerClick className="w-5 h-5 text-[#0c4650]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0c4650]">{totals.clicks.toLocaleString()}</div>
                <div className="text-xs text-[#0c4650]/40 mt-1">Ort. CPC: ${avgCpc}</div>
              </div>

              <div className="bg-white border-2 border-[#e2e8f0] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0c4650]/60">{t('googleAds.totalSpend')}</span>
                  <DollarSign className="w-5 h-5 text-[#0c4650]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0c4650]">${totals.cost.toFixed(2)}</div>
              </div>

              <div className="bg-white border-2 border-[#e2e8f0] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0c4650]/60">{t('googleAds.conversions')}</span>
                  <CheckCircle className="w-5 h-5 text-[#0c4650]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0c4650]">{totals.conversions.toFixed(0)}</div>
                <div className="text-xs text-[#0c4650]/40 mt-1">Oran: {conversionRate}%</div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#e2e8f0] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0c4650]">{t('googleAds.campaigns')}</h2>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex items-center space-x-2 bg-[#94fa01] text-[#0c4650] px-4 py-2 rounded-lg hover:bg-[#94fa01]/80 transition-colors disabled:opacity-50"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{analyzing ? t('common.analyzing') : t('googleAds.analyze')}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.campaignName')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.status')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.budget')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.impressions')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.clicks')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0c4650]">CTR</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.spend')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0c4650]">{t('googleAds.conversion')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => {
                      const ctr = campaign.impressions ? ((campaign.clicks || 0) / campaign.impressions * 100).toFixed(2) : '0.00';
                      return (
                        <tr key={campaign.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                          <td className="py-3 px-4 text-sm text-[#0c4650]">{campaign.name}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              campaign.status === 'ENABLED' ? 'bg-green-100 text-green-700' :
                              campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#0c4650] text-right">${campaign.budget.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-[#0c4650] text-right">{campaign.impressions?.toLocaleString() || 0}</td>
                          <td className="py-3 px-4 text-sm text-[#0c4650] text-right">{campaign.clicks?.toLocaleString() || 0}</td>
                          <td className="py-3 px-4 text-sm text-[#0c4650] text-right">{ctr}%</td>
                          <td className="py-3 px-4 text-sm text-[#0c4650] text-right">${campaign.cost?.toFixed(2) || '0.00'}</td>
                          <td className="py-3 px-4 text-sm text-[#0c4650] text-right">{campaign.conversions?.toFixed(0) || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {recommendations && (
              <div className="bg-white border-2 border-[#94fa01] rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#94fa01] rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#0c4650]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#0c4650]">{t('googleAds.aiRecommendations')}</h2>
                </div>
                <div className="prose prose-sm max-w-none text-[#0c4650]/80 whitespace-pre-wrap">
                  {recommendations}
                </div>
              </div>
            )}
          </>
        )}

        {campaigns.length === 0 && !loadingCampaigns && (
          <div className="bg-white border-2 border-[#e2e8f0] rounded-xl p-12 text-center">
            <BarChart3 className="w-12 h-12 text-[#0c4650]/20 mx-auto mb-4" />
            <p className="text-[#0c4650]/60">{t('googleAds.noCampaigns')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
