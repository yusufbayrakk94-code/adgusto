import React from 'react';
import { Link2, TrendingUp, BarChart3, DollarSign, MousePointerClick, Eye, CheckCircle, Lock } from 'lucide-react';

export const GoogleAdsPreview: React.FC = () => {
  const demoCampaigns = [
    {
      id: '1',
      name: 'Marka Bilinirliği Kampanyası',
      status: 'ENABLED',
      budget: 1500,
      impressions: 125000,
      clicks: 3750,
      cost: 1275.50,
      conversions: 112,
    },
    {
      id: '2',
      name: 'Ürün Lansmanı - Yaz Koleksiyonu',
      status: 'ENABLED',
      budget: 2000,
      impressions: 98000,
      clicks: 4200,
      cost: 1850.75,
      conversions: 185,
    },
    {
      id: '3',
      name: 'Remarketing - Sepet Terk Eden',
      status: 'ENABLED',
      budget: 800,
      impressions: 45000,
      clicks: 2100,
      cost: 650.25,
      conversions: 95,
    },
    {
      id: '4',
      name: 'Rakip Marka Hedefleme',
      status: 'PAUSED',
      budget: 1200,
      impressions: 35000,
      clicks: 980,
      cost: 425.00,
      conversions: 28,
    },
  ];

  const totals = demoCampaigns.reduce(
    (acc, campaign) => ({
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      cost: acc.cost + campaign.cost,
      conversions: acc.conversions + campaign.conversions,
    }),
    { impressions: 0, clicks: 0, cost: 0, conversions: 0 }
  );

  const avgCtr = ((totals.clicks / totals.impressions) * 100).toFixed(2);
  const avgCpc = (totals.cost / totals.clicks).toFixed(2);
  const conversionRate = ((totals.conversions / totals.clicks) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-light text-[#0b0b0b]">Google Ads Yönetimi</h1>
            <span className="px-3 py-1 bg-[#94fa01]/20 text-[#0b0b0b] text-sm font-medium rounded-full border border-[#94fa01]">
              Demo Önizleme
            </span>
          </div>
          <p className="text-[#0b0b0b]/60">Google Ads kampanyalarını oluştur, analiz et ve Yapay Zeka destekli önerilerle revize et</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-sm bg-white/40 z-10 rounded-2xl flex items-center justify-center">
            <div className="bg-white border-2 border-[#94fa01] rounded-2xl p-8 max-w-md text-center shadow-2xl">
              <div className="w-16 h-16 bg-[#94fa01]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#0b0b0b]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0b0b0b] mb-3">Çok Yakında!</h2>
              <p className="text-[#0b0b0b]/70 mb-6">
                Google Ads reklam yönetimi özelliğiyle reklamlarını güvenle yönetebilir, kampanyalarını sadece yazarak oluşturabilir ve AdGusto analizleri ile optimize edebilirsin.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-[#0b0b0b]/50">
                <Link2 className="w-4 h-4" />
                <span>AdGusto ile düşük efor yüksek performans</span>
              </div>
            </div>
          </div>

          <div className="pointer-events-none select-none">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border-2 border-[#0b0b0b]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0b0b0b]/60">Toplam Gösterim</span>
                  <Eye className="w-5 h-5 text-[#0b0b0b]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0b0b0b]">{totals.impressions.toLocaleString()}</div>
                <div className="text-xs text-[#0b0b0b]/40 mt-1">CTR: {avgCtr}%</div>
              </div>

              <div className="bg-white border-2 border-[#0b0b0b]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0b0b0b]/60">Toplam Tıklama</span>
                  <MousePointerClick className="w-5 h-5 text-[#0b0b0b]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0b0b0b]">{totals.clicks.toLocaleString()}</div>
                <div className="text-xs text-[#0b0b0b]/40 mt-1">Ort. CPC: ${avgCpc}</div>
              </div>

              <div className="bg-white border-2 border-[#0b0b0b]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0b0b0b]/60">Toplam Harcama</span>
                  <DollarSign className="w-5 h-5 text-[#0b0b0b]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0b0b0b]">${totals.cost.toFixed(2)}</div>
              </div>

              <div className="bg-white border-2 border-[#0b0b0b]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0b0b0b]/60">Dönüşümler</span>
                  <CheckCircle className="w-5 h-5 text-[#0b0b0b]/40" />
                </div>
                <div className="text-2xl font-semibold text-[#0b0b0b]">{totals.conversions.toFixed(0)}</div>
                <div className="text-xs text-[#0b0b0b]/40 mt-1">Oran: {conversionRate}%</div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#0b0b0b]/20 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0b0b0b]">Kampanyalar</h2>
                <button
                  disabled
                  className="flex items-center space-x-2 bg-[#94fa01]/20 text-[#0b0b0b] px-4 py-2 rounded-lg cursor-not-allowed border border-[#94fa01]"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>AI ile Analiz Et</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#0b0b0b]/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#0b0b0b]">Kampanya Adı</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#0b0b0b]">Durum</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0b0b0b]">Bütçe</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0b0b0b]">Gösterim</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0b0b0b]">Tıklama</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0b0b0b]">CTR</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0b0b0b]">Harcama</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#0b0b0b]">Dönüşüm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoCampaigns.map((campaign) => {
                      const ctr = ((campaign.clicks / campaign.impressions) * 100).toFixed(2);
                      return (
                        <tr key={campaign.id} className="border-b border-[#0b0b0b]/10">
                          <td className="py-3 px-4 text-sm text-[#0b0b0b]">{campaign.name}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              campaign.status === 'ENABLED'
                                ? 'bg-[#94fa01]/20 text-[#0b0b0b] border border-[#94fa01]'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-[#0b0b0b] text-right">${campaign.budget.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-[#0b0b0b] text-right">{campaign.impressions.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm text-[#0b0b0b] text-right">{campaign.clicks.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm text-[#0b0b0b] text-right">{ctr}%</td>
                          <td className="py-3 px-4 text-sm text-[#0b0b0b] text-right">${campaign.cost.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-[#0b0b0b] text-right">{campaign.conversions.toFixed(0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border-2 border-[#94fa01]/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#0b0b0b]" />
                </div>
                <h2 className="text-xl font-semibold text-[#0b0b0b]">AI Önerileri</h2>
              </div>
              <div className="space-y-3 text-[#0b0b0b]/70">
                <p>• Marka Bilinirliği Kampanyası yüksek CTR oranı ile iyi performans gösteriyor (%3.00)</p>
                <p>• Remarketing kampanyasında dönüşüm oranı oldukça başarılı (%4.52)</p>
                <p>• Rakip Marka Hedefleme kampanyası düşük performans gösteriyor, bütçe optimizasyonu önerilir</p>
                <p>• Genel CPC ortalaması sektör standardının altında, bütçe artırımı değerlendirilebilir</p>
                <p>• Coğrafi hedefleme stratejisi genişletilebilir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
