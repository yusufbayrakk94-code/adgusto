import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  Upload,
  Download,
  BarChart3,
  TrendingUp,
  PieChart,
  Target,
  Award,
  AlertTriangle,
  Lightbulb,
  FileText,
  Activity,
  Sparkles,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { Campaign, CampaignAnalysis, ChartData } from '../types/campaign';
import { CampaignAnalyzer } from '../services/campaignAnalyzer';
import { GroqService } from '../services/groqService';
import { FirestoreService } from '../services/firestoreService';
import { auth } from '../config/firebase';
import { useLanguage } from '../hooks/useLanguage';

const COLORS = ['#97fa07', '#e0ff4f', '#0b0b0b', '#828282', '#f59e0b', '#ef4444'];

interface CampaignAnalyzerProps {
  user?: User | null;
  onBack?: () => void;
}

const CampaignAnalyzerComponent: React.FC<CampaignAnalyzerProps> = ({ user, onBack }) => {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analysis, setAnalysis] = useState<CampaignAnalysis | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        'Kampanya Adı': 'Yaz Koleksiyonu',
        'Gösterim': '150000',
        'Tıklama': '4500',
        'CTR (%)': '3.0',
        'CPC (TL)': '2.5',
        'Dönüşüm': '225',
        'Harcama (TL)': '11250'
      },
      {
        'Kampanya Adı': 'Kış İndirimi',
        'Gösterim': '120000',
        'Tıklama': '3600',
        'CTR (%)': '3.0',
        'CPC (TL)': '3.2',
        'Dönüşüm': '180',
        'Harcama (TL)': '11520'
      },
      {
        'Kampanya Adı': 'Bahar Kampanyası',
        'Gösterim': '200000',
        'Tıklama': '8000',
        'CTR (%)': '4.0',
        'CPC (TL)': '1.8',
        'Dönüşüm': '400',
        'Harcama (TL)': '14400'
      },
      {
        'Kampanya Adı': 'Sonbahar Trendi',
        'Gösterim': '100000',
        'Tıklama': '2000',
        'CTR (%)': '2.0',
        'CPC (TL)': '4.5',
        'Dönüşüm': '80',
        'Harcama (TL)': '9000'
      }
    ];

    const headers = Object.keys(sampleData[0]);
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'kampanya-ornegi.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError(t('campaignAnalyzer.errorUpload'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedCampaigns = await CampaignAnalyzer.parseCSV(file);
      const campaignAnalysis = CampaignAnalyzer.analyzeCampaigns(parsedCampaigns);
      const charts = CampaignAnalyzer.prepareChartData(parsedCampaigns);

      // Groq API ile gelişmiş analiz
      try {
        const groqService = new GroqService();
        const csvData = {
          campaigns: parsedCampaigns,
          totalSpend: parsedCampaigns.reduce((sum, c) => sum + c.spend, 0),
          totalImpressions: parsedCampaigns.reduce((sum, c) => sum + c.impressions, 0),
          totalClicks: parsedCampaigns.reduce((sum, c) => sum + c.clicks, 0),
          averageCTR: parsedCampaigns.reduce((sum, c) => sum + c.ctr, 0) / parsedCampaigns.length,
          averageCPC: parsedCampaigns.reduce((sum, c) => sum + c.cpc, 0) / parsedCampaigns.length
        };
        
        const groqAnalysis = await groqService.analyzeCSVData(csvData, file.name);
        
        // Groq analizini mevcut analizle birleştir
        campaignAnalysis.expertAnalysis = groqAnalysis.expertAnalysis || campaignAnalysis.expertAnalysis;
        campaignAnalysis.insights = groqAnalysis.insights || campaignAnalysis.insights;
        campaignAnalysis.recommendations = groqAnalysis.improvements || campaignAnalysis.recommendations;
      } catch (groqError) {
        console.warn('Groq API analizi başarısız, yerel analiz kullanılıyor:', groqError);
      }

      setCampaigns(parsedCampaigns);
      setAnalysis(campaignAnalysis);
      setChartData(charts);
      
      // Save to Firestore (if user is logged in)
      const currentUser = auth.currentUser;
      if (currentUser) {
        await FirestoreService.saveCSVAnalysis(
          currentUser.uid, 
          file.name, 
          campaignAnalysis.summary, 
          campaignAnalysis
        );
        console.log('CSV analysis saved to Firestore');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dosya işlenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setCampaigns([]);
    setAnalysis(null);
    setChartData(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Analiz Ediliyor</h3>
          <p className="text-gray">Verileriniz işleniyor, lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  if (!analysis || !chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 font-sans">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center space-x-2 text-gray hover:text-dark transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Geri</span>
              </button>
            )}
          </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Kampanya Analizi</h1>
          </div>
          <p className="text-gray text-base max-w-2xl mx-auto">
            Kampanya verilerinizi yükleyin ve detaylı analiz raporunu görüntüleyin
          </p>
        </div>
          {/* Sample Download */}
          <div className="bg-white border-2 border-primary/20 rounded-3xl p-8 mb-8 shadow-lg hover:border-primary transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-dark mb-2">Örnek CSV Dosyası</h3>
                <p className="text-gray">
                  Doğru formatta CSV hazırlamak için örnek dosyayı indirin
                </p>
              </div>
              <button
                onClick={downloadSampleCSV}
                className="flex items-center space-x-2 bg-primary hover:bg-secondary text-dark px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Download className="w-5 h-5" />
                <span>İndir</span>
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-dark" />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                CSV Dosyası Yükle
              </h3>
              <p className="text-gray mb-8">
                Dosyayı buraya sürükleyin veya yüklemek için tıklayın
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center space-x-2 bg-primary hover:bg-secondary text-dark px-8 py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <FileText className="w-5 h-5" />
                <span>Dosya Seç</span>
              </label>
              <p className="text-xs text-gray mt-6">
                Gerekli sütunlar: Kampanya Adı, Gösterim, Tıklama, CTR, CPC, Dönüşüm, Harcama
              </p>
            </div>
            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 font-bold">Hata</p>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 text-gray hover:text-dark transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Geri</span>
            </button>
          )}
          <button
            onClick={resetAnalysis}
            className="flex items-center space-x-2 bg-primary hover:bg-secondary text-dark px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Upload className="w-5 h-5" />
            <span>Yeni Analiz</span>
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-dark" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark">Analiz Sonuçları</h1>
          </div>
          <p className="text-gray text-base">{analysis.totalCampaigns} kampanya analiz edildi</p>
        </div>
        {/* Analysis Summary */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-3xl p-8 mb-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-dark" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Genel Özet</h2>
          </div>
          <p className="text-dark text-lg leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-dark" />
              </div>
              <h3 className="font-bold text-dark text-sm">Performans Skoru</h3>
            </div>
            <div className="text-4xl font-bold text-dark mb-2">{analysis.performanceScore}</div>
            <p className="text-sm text-gray">100 üzerinden</p>
          </div>
          <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-dark" />
              </div>
              <h3 className="font-bold text-dark text-sm">En İyi Kampanya</h3>
            </div>
            <div className="text-lg font-bold text-dark mb-2 line-clamp-2">{analysis.bestCampaign}</div>
            <p className="text-sm text-gray">En yüksek performans</p>
          </div>
          <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-dark text-sm">Dikkat Gereken Kampanya</h3>
            </div>
            <div className="text-lg font-bold text-dark mb-2 line-clamp-2">{analysis.worstCampaign}</div>
            <p className="text-sm text-gray">Optimizasyon gerekli</p>
          </div>
          <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-dark" />
              </div>
              <h3 className="font-bold text-dark text-sm">Toplam Kampanya</h3>
            </div>
            <div className="text-4xl font-bold text-dark mb-2">{analysis.totalCampaigns}</div>
            <p className="text-sm text-gray">analiz edildi</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* CTR Comparison */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-lg font-bold text-dark">Kampanyalara Göre CTR</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.ctrComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="campaign"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Tıklama Oranı']}
                  labelStyle={{ color: '#282828' }}
                />
                <Bar dataKey="ctr" fill="#97fa07" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* CPC Trend */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-lg font-bold text-dark">Kampanyalara Göre CPC</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.cpcTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="campaign"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`₺${value.toFixed(2)}`, 'Tıklama Başı Maliyet']}
                  labelStyle={{ color: '#282828' }}
                />
                <Line
                  type="monotone"
                  dataKey="cpc"
                  stroke="#0b0b0b"
                  strokeWidth={3}
                  dot={{ fill: '#97fa07', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend Distribution */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-dark" />
            </div>
            <h3 className="text-lg font-bold text-dark">Harcama Dağılımı</h3>
          </div>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={chartData.spendDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="spend"
                    label={({ campaign, percentage }) => `${campaign}: ${percentage}%`}
                  >
                    {chartData.spendDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`₺${value.toFixed(2)}`, 'Toplam Harcama']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-8">
              <div className="space-y-3">
                {chartData.spendDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-dark flex-1 font-medium">{item.campaign}</span>
                    <span className="text-sm font-bold text-dark">
                      ₺{item.spend.toFixed(2)} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-lg font-bold text-dark">Önemli Bulgular</h3>
            </div>
            <div className="space-y-3">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-dark text-sm font-medium">{insight}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-lg font-bold text-dark">Öneriler</h3>
            </div>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-secondary/10 rounded-xl border border-secondary/30">
                  <div className="w-2 h-2 bg-dark rounded-full mt-2 flex-shrink-0" />
                  <p className="text-dark text-sm font-medium">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expert Analysis */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-dark" />
            </div>
            <h2 className="text-2xl font-bold text-dark">Uzman Analizi</h2>
          </div>
          <div className="mb-8">
            <p className="text-dark leading-relaxed text-base">{analysis.expertAnalysis}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-gray-200">
            <div className="text-center p-4 bg-primary/10 rounded-2xl">
              <div className="text-3xl font-bold text-dark mb-2">
                {analysis.benchmarks.avgCTR.toFixed(2)}%
              </div>
              <div className="text-sm text-gray font-medium">Ortalama CTR</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-2xl">
              <div className="text-3xl font-bold text-dark mb-2">
                ₺{analysis.benchmarks.avgCPC.toFixed(2)}
              </div>
              <div className="text-sm text-gray font-medium">Ortalama CPC</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-2xl">
              <div className="text-3xl font-bold text-dark mb-2">
                {analysis.benchmarks.avgConversionRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray font-medium">Dönüşüm Oranı</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CampaignAnalyzerComponent };