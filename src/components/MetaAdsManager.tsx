import React, { useState, useEffect } from 'react';
import { Facebook, Plus, RefreshCw, Play, Pause, Archive, TrendingUp, DollarSign, Eye, MousePointer, Link as LinkIcon, CircleAlert as AlertCircle, Sparkles, Unlink } from 'lucide-react';
import { MetaAdsService, MetaConnection, MetaCampaign, MetaAdAccount } from '../services/metaAdsService';
import { GroqService } from '../services/groqService';

interface MetaAdsManagerProps {
  user: any;
}

const META_APP_ID = import.meta.env.VITE_META_APP_ID || 'YOUR_META_APP_ID';
const REDIRECT_URI = 'https://www.adgusto.app/meta-ads-callback';

export const MetaAdsManager: React.FC<MetaAdsManagerProps> = ({ user }) => {
  const [connection, setConnection] = useState<MetaConnection | null>(null);
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [adAccounts, setAdAccounts] = useState<MetaAdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    loadConnection();
  }, [user]);

  useEffect(() => {
    // Check both hash fragment (for token response) and query params
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const expiresIn = hashParams.get('expires_in') || queryParams.get('expires_in');

    if (accessToken) {
      handleOAuthCallback(accessToken, expiresIn ? parseInt(expiresIn) : undefined);
      window.history.replaceState({}, document.title, '/meta-ads-manager');
    }
  }, []);

  const loadConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      const conn = await MetaAdsService.getConnection(user.uid);
      setConnection(conn);

      if (conn?.access_token) {
        await loadAdAccounts(conn.access_token);
        await loadCampaigns();
      }
    } catch (err: any) {
      console.error('Error loading connection:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdAccounts = async (accessToken: string) => {
    try {
      const accounts = await MetaAdsService.fetchAdAccounts(accessToken);
      setAdAccounts(accounts);
      if (accounts.length > 0 && !selectedAccount) {
        setSelectedAccount(accounts[0].id);
      }
    } catch (err: any) {
      console.error('Error loading ad accounts:', err);
      setError('Reklam hesapları yüklenemedi');
    }
  };

  const loadCampaigns = async () => {
    try {
      const userCampaigns = await MetaAdsService.getUserCampaigns(user.uid);
      setCampaigns(userCampaigns);
    } catch (err: any) {
      console.error('Error loading campaigns:', err);
    }
  };

  const handleOAuthCallback = async (accessToken: string, expiresIn?: number) => {
    try {
      setLoading(true);
      const permissions = [
        'ads_read',
        'ads_management',
        'business_management',
        'pages_read_engagement',
        'pages_show_list'
      ];

      await MetaAdsService.saveConnection(user.uid, accessToken, permissions, expiresIn);
      await loadConnection();
    } catch (err: any) {
      console.error('Error saving connection:', err);
      setError('Bağlantı kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  const connectToMeta = () => {
    const scope = 'ads_read,ads_management,business_management,pages_read_engagement,pages_show_list';
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&response_type=token`;
    window.location.href = authUrl;
  };

  const handleRefresh = async () => {
    if (!connection?.access_token || !selectedAccount) return;

    try {
      setRefreshing(true);
      setError(null);

      const metaCampaigns = await MetaAdsService.fetchCampaigns(
        connection.access_token,
        selectedAccount
      );

      for (const campaign of metaCampaigns) {
        const insights = await MetaAdsService.fetchCampaignInsights(
          connection.access_token,
          campaign.id
        );

        await MetaAdsService.saveCampaign(user.uid, {
          ...campaign,
          insights
        });
      }

      await loadCampaigns();
    } catch (err: any) {
      console.error('Error refreshing campaigns:', err);
      setError('Kampanyalar yenilenemedi');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (campaignId: string, status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED') => {
    if (!connection?.access_token) return;

    try {
      await MetaAdsService.updateCampaignStatus(
        connection.access_token,
        campaignId,
        status
      );
      await handleRefresh();
    } catch (err: any) {
      console.error('Error updating campaign status:', err);
      setError('Kampanya durumu güncellenemedi');
    }
  };

  const formatCurrency = (amount: any) => {
    if (amount === null || amount === undefined) return '-';
    const num = Number(amount);
    if (isNaN(num)) return '-';
    return `₺${(num / 100).toFixed(2)}`;
  };

  const formatNumber = (num: any) => {
    if (num === null || num === undefined) return '-';
    const n = Number(num);
    if (isNaN(n)) return '-';
    return n.toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0c4650] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0c4650]/60">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-white text-[#0c4650]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1877f2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Facebook className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Meta Reklamlarını Yönet</h1>
            <p className="text-[#0c4650]/70 mb-8 max-w-2xl mx-auto">
              Facebook ve Instagram reklamlarınızı tek bir yerden yönetin. Kampanya performanslarını takip edin,
              bütçeleri optimize edin ve reklam metinlerinizi oluşturun.
            </p>

            <button
              onClick={connectToMeta}
              className="inline-flex items-center space-x-2 bg-[#1877f2] text-white px-6 py-3 rounded-lg hover:bg-[#1565c0] transition-colors"
            >
              <LinkIcon className="w-5 h-5" />
              <span>Meta'ya Bağlan</span>
            </button>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 border border-[#e2e8f0] rounded-lg">
                <TrendingUp className="w-8 h-8 text-[#94fa01] mb-3" />
                <h3 className="font-semibold mb-2">Kampanya Yönetimi</h3>
                <p className="text-sm text-[#0c4650]/70">
                  Tüm kampanyalarınızı görüntüleyin, düzenleyin ve performanslarını analiz edin.
                </p>
              </div>

              <div className="p-6 border border-[#e2e8f0] rounded-lg">
                <DollarSign className="w-8 h-8 text-[#94fa01] mb-3" />
                <h3 className="font-semibold mb-2">Bütçe Optimizasyonu</h3>
                <p className="text-sm text-[#0c4650]/70">
                  Reklam harcamalarınızı takip edin ve bütçenizi en verimli şekilde kullanın.
                </p>
              </div>

              <div className="p-6 border border-[#e2e8f0] rounded-lg">
                <Eye className="w-8 h-8 text-[#94fa01] mb-3" />
                <h3 className="font-semibold mb-2">Performans Takibi</h3>
                <p className="text-sm text-[#0c4650]/70">
                  Gösterim, tıklama ve dönüşüm metriklerini gerçek zamanlı izleyin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      setError(null);

      await MetaAdsService.deleteConnection(user.uid);

      setConnection(null);
      setCampaigns([]);
      setAdAccounts([]);
      setSelectedAccount('');
      setShowDisconnectDialog(false);

      setError(null);
      setTimeout(() => {
        alert('Meta bağlantısı başarıyla kaldırıldı');
      }, 100);
    } catch (err: any) {
      console.error('Error disconnecting:', err);
      setError('Bağlantı kaldırılırken hata oluştu: ' + err.message);
    } finally {
      setDisconnecting(false);
    }
  };

  const handleCreateCampaign = async (campaignData: {
    name: string;
    objective: string;
    status: string;
    daily_budget: number;
  }) => {
    if (!connection?.access_token || !selectedAccount) return;

    try {
      setError(null);
      const budgetInCents = campaignData.daily_budget * 100;

      const createdCampaign = await MetaAdsService.createCampaign(
        connection.access_token,
        selectedAccount,
        {
          name: campaignData.name,
          objective: campaignData.objective,
          status: campaignData.status,
          daily_budget: budgetInCents
        }
      );

      await MetaAdsService.saveCampaign(user.uid, {
        id: createdCampaign.id,
        name: campaignData.name,
        status: campaignData.status,
        objective: campaignData.objective,
        daily_budget: budgetInCents,
        insights: null
      });

      setShowCreateModal(false);
      await handleRefresh();
    } catch (err: any) {
      console.error('Error creating campaign:', err);
      setError('Kampanya oluşturulamadı: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0c4650]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#1877f2] rounded-full flex items-center justify-center">
              <Facebook className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Meta Reklam Yöneticisi</h1>
              <p className="text-sm text-[#0c4650]/60">Facebook & Instagram Reklamları</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {adAccounts.length > 0 && (
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent"
              >
                {adAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Yenile</span>
            </button>

            <button
              onClick={() => setShowBriefModal(true)}
              className="flex items-center space-x-2 bg-[#94fa01] text-[#0c4650] px-4 py-2 rounded-lg hover:bg-[#7fcf00] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Brief ile Kampanya Oluştur</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 border border-[#e2e8f0] text-[#0c4650] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Manuel Kampanya</span>
            </button>

            <button
              onClick={() => setShowDisconnectDialog(true)}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Unlink className="w-4 h-4" />
              <span>Bağlantıyı Kes</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Hata</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#0c4650]/60 mb-4">Henüz kampanya bulunamadı</p>
            <button
              onClick={handleRefresh}
              className="text-[#94fa01] hover:underline"
            >
              Kampanyaları Meta'dan yükle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map(campaign => (
              <div
                key={campaign.campaign_id}
                className="p-6 border border-[#e2e8f0] rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{campaign.campaign_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-[#0c4650]/60">
                      <span>Amaç: {campaign.objective || '-'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {campaign.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(campaign.campaign_id, 'PAUSED')}
                        className="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors"
                        title="Duraklat"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(campaign.campaign_id, 'ACTIVE')}
                        className="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors"
                        title="Başlat"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(campaign.campaign_id, 'ARCHIVED')}
                      className="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors"
                      title="Arşivle"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-[#f8fafc] rounded-lg">
                    <div className="flex items-center space-x-2 text-[#0c4650]/60 text-xs mb-1">
                      <Eye className="w-3 h-3" />
                      <span>Gösterim</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatNumber(campaign.insights?.impressions)}
                    </p>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg">
                    <div className="flex items-center space-x-2 text-[#0c4650]/60 text-xs mb-1">
                      <MousePointer className="w-3 h-3" />
                      <span>Tıklama</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatNumber(campaign.insights?.clicks)}
                    </p>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg">
                    <div className="flex items-center space-x-2 text-[#0c4650]/60 text-xs mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Harcama</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatCurrency(campaign.insights?.spend ? campaign.insights.spend * 100 : null)}
                    </p>
                  </div>

                  <div className="p-3 bg-[#f8fafc] rounded-lg">
                    <div className="flex items-center space-x-2 text-[#0c4650]/60 text-xs mb-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>CTR</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {campaign.insights?.ctr !== null && campaign.insights?.ctr !== undefined ? `${Number(campaign.insights.ctr).toFixed(2)}%` : '-'}
                    </p>
                  </div>
                </div>

                {(campaign.daily_budget || campaign.lifetime_budget) && (
                  <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                    <div className="flex items-center space-x-6 text-sm text-[#0c4650]/60">
                      {campaign.daily_budget && (
                        <span>Günlük Bütçe: {formatCurrency(campaign.daily_budget)}</span>
                      )}
                      {campaign.lifetime_budget && (
                        <span>Toplam Bütçe: {formatCurrency(campaign.lifetime_budget)}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showDisconnectDialog && (
          <DisconnectDialog
            onConfirm={handleDisconnect}
            onCancel={() => setShowDisconnectDialog(false)}
            isDisconnecting={disconnecting}
          />
        )}

        {showBriefModal && (
          <BriefCampaignModal
            onClose={() => setShowBriefModal(false)}
            onCreate={handleCreateCampaign}
          />
        )}

        {showCreateModal && (
          <CreateCampaignModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateCampaign}
          />
        )}
      </div>
    </div>
  );
};

interface CreateCampaignModalProps {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    objective: string;
    status: string;
    daily_budget: number;
  }) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('OUTCOME_TRAFFIC');
  const [status, setStatus] = useState('PAUSED');
  const [dailyBudget, setDailyBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !dailyBudget) {
      return;
    }

    onCreate({
      name: name.trim(),
      objective,
      status,
      daily_budget: parseFloat(dailyBudget)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-[#0c4650] mb-6">Yeni Kampanya Oluştur</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0c4650] mb-2">
              Kampanya Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent"
              placeholder="Örn: Yaz İndirimi 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c4650] mb-2">
              Kampanya Amacı
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent"
            >
              <option value="OUTCOME_TRAFFIC">Trafik</option>
              <option value="OUTCOME_AWARENESS">Farkındalık</option>
              <option value="OUTCOME_ENGAGEMENT">Etkileşim</option>
              <option value="OUTCOME_LEADS">Potansiyel Müşteri</option>
              <option value="OUTCOME_SALES">Satış</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c4650] mb-2">
              Durum
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent"
            >
              <option value="PAUSED">Duraklat</option>
              <option value="ACTIVE">Aktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c4650] mb-2">
              Günlük Bütçe (TL)
            </label>
            <input
              type="number"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent"
              placeholder="Örn: 100"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#e2e8f0] text-[#0c4650] rounded-lg hover:bg-[#f8fafc] transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#94fa01] text-[#0c4650] rounded-lg hover:bg-[#7fcf00] transition-colors font-medium"
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BriefCampaignModalProps {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    objective: string;
    status: string;
    daily_budget: number;
  }) => void;
}

const BriefCampaignModal: React.FC<BriefCampaignModalProps> = ({ onClose, onCreate }) => {
  const [brief, setBrief] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brief.trim()) {
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      const groqService = new GroqService();
      const campaignData = await groqService.analyzeCampaignBrief(brief);

      onCreate(campaignData);
    } catch (err: any) {
      console.error('Brief analiz hatası:', err);
      setError(err.message || 'Brief analiz edilirken bir hata oluştu');
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#94fa01] rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#0c4650]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0c4650]">Brief ile Kampanya Oluştur</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0c4650] mb-2">
              Kampanya Brief'i
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#94fa01] focus:border-transparent min-h-[200px] resize-y"
              placeholder="Örnek:&#10;&#10;Yeni koleksiyon tanıtımı için bir kampanya oluşturmak istiyorum. Hedef kitle 25-45 yaş arası kadınlar. Günlük 500 TL bütçe ayırdım. Kampanya amacı web sitesine trafik çekmek."
              required
              disabled={analyzing}
            />
            <p className="text-sm text-[#0c4650]/60 mt-2">
              AI, brief'inizi analiz ederek kampanya adı, amacı, durumu ve bütçeyi otomatik olarak belirleyecektir.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={analyzing}
              className="flex-1 px-4 py-2 border border-[#e2e8f0] text-[#0c4650] rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={analyzing || !brief.trim()}
              className="flex-1 px-4 py-2 bg-[#94fa01] text-[#0c4650] rounded-lg hover:bg-[#7fcf00] transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI ile Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DisconnectDialog: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  isDisconnecting: boolean;
}> = ({ onConfirm, onCancel, isDisconnecting }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0c4650] mb-2">
              Bağlantıyı Kesmek İstediğinizden Emin Misiniz?
            </h3>
            <p className="text-sm text-[#0c4650]/70">
              Meta hesabınızla bağlantıyı keserseniz, tüm kampanya verileri silinecektir. Bu işlem geri alınamaz.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDisconnecting}
            className="flex-1 px-4 py-2 border border-[#e2e8f0] text-[#0c4650] rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDisconnecting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isDisconnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Kaldırılıyor...</span>
              </>
            ) : (
              <>
                <Unlink className="w-4 h-4" />
                <span>Bağlantıyı Kes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
