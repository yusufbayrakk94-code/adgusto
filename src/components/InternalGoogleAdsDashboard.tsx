import React, { useState, useEffect } from 'react';
import { Shield, Building2, TrendingUp, DollarSign, MousePointer, Eye, Users, AlertCircle, RefreshCw, Pause, Play, Loader2 } from 'lucide-react';
import { useInternalAccess } from '../hooks/useInternalAccess';
import {
  fetchGoogleAdsAccounts,
  fetchGoogleAdsCampaigns,
  updateCampaignStatus,
  GoogleAdsAccount,
  GoogleAdsCampaign,
} from '../services/internalGoogleAdsService';

export default function InternalGoogleAdsDashboard() {
  const { isWhitelisted, user, isLoading: accessLoading, error: accessError } = useInternalAccess();
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<GoogleAdsAccount | null>(null);
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingCampaign, setUpdatingCampaign] = useState<string | null>(null);

  useEffect(() => {
    if (isWhitelisted) {
      loadAccounts();
    }
  }, [isWhitelisted]);

  const loadAccounts = async () => {
    setIsLoadingAccounts(true);
    setError(null);
    try {
      const accountsData = await fetchGoogleAdsAccounts();
      setAccounts(accountsData.filter(acc => !acc.isManager));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const loadCampaigns = async (account: GoogleAdsAccount) => {
    setSelectedAccount(account);
    setIsLoadingCampaigns(true);
    setError(null);
    try {
      const campaignsData = await fetchGoogleAdsCampaigns(account.customerId);
      setCampaigns(campaignsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
      setCampaigns([]);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const handleUpdateCampaignStatus = async (campaignId: string, newStatus: 'ENABLED' | 'PAUSED') => {
    if (!selectedAccount) return;

    setUpdatingCampaign(campaignId);
    try {
      await updateCampaignStatus(selectedAccount.customerId, campaignId, newStatus);

      // Update local state
      setCampaigns(prev =>
        prev.map(c => c.campaignId === campaignId ? { ...c, status: newStatus } : c)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update campaign');
    } finally {
      setUpdatingCampaign(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark">Checking access...</h3>
        </div>
      </div>
    );
  }

  if (!isWhitelisted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border-2 border-red-200 rounded-3xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-dark text-center mb-3">Access Denied</h2>
          <p className="text-gray text-center mb-4">
            {accessError || 'You are not authorized to access the internal Google Ads management dashboard.'}
          </p>
          <p className="text-sm text-gray text-center">
            This tool is restricted to whitelisted internal team members only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark">Internal Google Ads Manager</h1>
                <p className="text-sm text-gray">MCC Account Management Dashboard</p>
              </div>
            </div>
            {user && (
              <div className="bg-white border-2 border-primary/30 rounded-2xl px-4 py-2">
                <p className="text-sm font-bold text-dark">{user.fullName}</p>
                <p className="text-xs text-gray capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts List */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Google Ads Accounts
                </h2>
                <button
                  onClick={loadAccounts}
                  disabled={isLoadingAccounts}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-dark ${isLoadingAccounts ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {isLoadingAccounts ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray">Loading accounts...</p>
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray mx-auto mb-2" />
                  <p className="text-sm text-gray">No accounts found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {accounts.map((account) => (
                    <button
                      key={account.customerId}
                      onClick={() => loadCampaigns(account)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAccount?.customerId === account.customerId
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      <p className="font-bold text-dark mb-1">{account.name}</p>
                      <p className="text-xs text-gray">ID: {account.customerId}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{account.currency}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{account.timezone}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Campaigns List */}
          <div className="lg:col-span-2">
            {!selectedAccount ? (
              <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-12 text-center">
                <Building2 className="w-16 h-16 text-gray mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">Select an Account</h3>
                <p className="text-gray">Choose a Google Ads account from the list to view its campaigns</p>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-dark">{selectedAccount.name}</h2>
                    <p className="text-sm text-gray">Campaigns (Last 30 Days)</p>
                  </div>
                  <button
                    onClick={() => loadCampaigns(selectedAccount)}
                    disabled={isLoadingCampaigns}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-dark ${isLoadingCampaigns ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {isLoadingCampaigns ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-gray">Loading campaigns...</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-gray mx-auto mb-3" />
                    <p className="text-gray">No campaigns found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.campaignId}
                        className="border-2 border-gray-200 rounded-2xl p-5 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-dark mb-1">{campaign.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                campaign.status === 'ENABLED'
                                  ? 'bg-green-100 text-green-700'
                                  : campaign.status === 'PAUSED'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {campaign.status}
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {campaign.channelType}
                              </span>
                            </div>
                          </div>

                          {user?.role !== 'viewer' && campaign.status !== 'REMOVED' && (
                            <button
                              onClick={() => handleUpdateCampaignStatus(
                                campaign.campaignId,
                                campaign.status === 'ENABLED' ? 'PAUSED' : 'ENABLED'
                              )}
                              disabled={updatingCampaign === campaign.campaignId}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50 ${
                                campaign.status === 'ENABLED'
                                  ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                              }`}
                            >
                              {updatingCampaign === campaign.campaignId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : campaign.status === 'ENABLED' ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                              {campaign.status === 'ENABLED' ? 'Pause' : 'Enable'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-bold text-blue-900">Impressions</p>
                            </div>
                            <p className="text-lg font-bold text-blue-900">
                              {formatNumber(campaign.metrics.impressions)}
                            </p>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <MousePointer className="w-4 h-4 text-green-600" />
                              <p className="text-xs font-bold text-green-900">Clicks</p>
                            </div>
                            <p className="text-lg font-bold text-green-900">
                              {formatNumber(campaign.metrics.clicks)}
                            </p>
                            <p className="text-xs text-green-700">
                              CTR: {(campaign.metrics.ctr * 100).toFixed(2)}%
                            </p>
                          </div>

                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="w-4 h-4 text-purple-600" />
                              <p className="text-xs font-bold text-purple-900">Cost</p>
                            </div>
                            <p className="text-lg font-bold text-purple-900">
                              {formatCurrency(campaign.metrics.cost)}
                            </p>
                            <p className="text-xs text-purple-700">
                              Avg CPC: {formatCurrency(campaign.metrics.averageCpc)}
                            </p>
                          </div>

                          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                              <p className="text-xs font-bold text-orange-900">Conversions</p>
                            </div>
                            <p className="text-lg font-bold text-orange-900">
                              {campaign.metrics.conversions.toFixed(2)}
                            </p>
                            <p className="text-xs text-orange-700">
                              CPA: {formatCurrency(campaign.metrics.cpa)}
                            </p>
                          </div>
                        </div>

                        {campaign.metrics.roas > 0 && (
                          <div className="mt-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-dark">ROAS</span>
                              <span className="text-lg font-bold text-green-700">
                                {campaign.metrics.roas.toFixed(2)}x
                              </span>
                            </div>
                            <p className="text-xs text-gray mt-1">
                              Conversion Value: {formatCurrency(campaign.metrics.conversionsValue)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
