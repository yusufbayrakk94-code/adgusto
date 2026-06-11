import React from 'react';
import { ServiceAnalysis } from '../types';
import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  LogOut,
  Target,
  BarChart3,
  Zap,
  Home
} from 'lucide-react';

interface AnalysisResultsProps {
  analysis: ServiceAnalysis;
  onBack: () => void;
  onLogout: () => void;
  userEmail?: string;
  onGoHome: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  onBack,
  onLogout,
  userEmail,
  onGoHome
}) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 text-dark flex flex-col items-center justify-start p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Analiz Sonuçları</h1>
          </div>
          <p className="text-gray text-base max-w-2xl mx-auto">
            <span className="text-dark font-bold">{analysis?.service || 'Hizmet'}</span> için özel pazarlama stratejisi
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-200">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray hover:text-dark font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onGoHome}
                className="flex items-center gap-2 text-gray hover:text-dark font-bold transition-colors"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-gray hover:text-red-500 font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış
              </button>
            </div>
          </div>

          {/* Success Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-6 py-3">
              <Zap className="w-5 h-5 text-dark" />
              <span className="text-dark font-bold text-sm">Analiz Tamamlandı</span>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-10">
            <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-dark" />
                </div>
                <h2 className="text-2xl font-bold text-dark">Strateji Özeti</h2>
              </div>
              <p className="text-dark leading-relaxed text-base">
                {analysis?.summary || 'Özet bulunamadı'}
              </p>
            </div>
          </div>

          {/* Platforms Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Önerilen Platformlar</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {analysis?.channels?.map((channel, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-dark text-xl">{channel.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <span className="text-dark font-bold text-sm">{channel.effectiveness}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray mb-6 leading-relaxed text-sm">{channel.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                      <span className="text-gray font-bold text-xs block mb-1">Maliyet</span>
                      <div className="text-dark font-bold">{channel.cost}</div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
                      <span className="text-gray font-bold text-xs block mb-1">Hedef</span>
                      <div className="text-dark font-bold">{channel.targetAudience}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Recommendation Section */}
          {analysis?.budgetRecommendation && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-dark" />
                </div>
                <h2 className="text-2xl font-bold text-dark">Bütçe Önerisi</h2>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <p className="text-sm text-gray mb-1">Minimum Aylık Bütçe</p>
                    <p className="text-2xl font-bold text-dark">{analysis.budgetRecommendation.minBudget} ₺</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-4 border border-primary/30">
                    <p className="text-sm text-gray mb-1">Optimal Aylık Bütçe</p>
                    <p className="text-2xl font-bold text-primary">{analysis.budgetRecommendation.optimalBudget} ₺</p>
                  </div>
                </div>

                {analysis.budgetRecommendation.budgetDistribution && (
                  <div className="mb-6">
                    <h3 className="font-bold text-dark mb-3">Platform Dağılımı</h3>
                    <div className="space-y-3">
                      {analysis.budgetRecommendation.budgetDistribution.map((dist: any, index: number) => (
                        <div key={index} className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-dark">{dist.platform}</span>
                            <span className="text-primary font-bold">{dist.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${dist.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray">{dist.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.budgetRecommendation.expectedResults && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <h3 className="font-bold text-dark mb-2">Beklenen Sonuçlar</h3>
                    <p className="text-gray text-sm leading-relaxed">{analysis.budgetRecommendation.expectedResults}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Formats Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-dark" />
              </div>
              <h2 className="text-2xl font-bold text-dark">Reklam Formatları</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis?.adTypes?.map((adType, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-lg"
                >
                  <h3 className="font-bold text-dark text-lg mb-3">{adType.type}</h3>
                  <p className="text-gray mb-4 leading-relaxed text-sm">{adType.description}</p>
                  <div className="inline-block">
                    <span className="text-xs font-bold text-dark bg-primary/20 border border-primary/30 px-4 py-2 rounded-full">
                      {adType.bestFor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* New Analysis Button */}
          <div className="flex justify-center mt-10 pt-8 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-8 py-4 bg-primary text-dark rounded-xl hover:bg-primary/90 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Yeni Analiz Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
