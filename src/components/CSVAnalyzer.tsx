import React, { useState } from 'react';
import { Upload, Download, BarChart3, TrendingUp, PieChart, Target, Award, AlertTriangle, Lightbulb, FileText, Activity, Sparkles, LogOut, ArrowLeft } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { CampaignAnalysis } from '../types/campaign';
import { CampaignAnalyzer } from '../services/campaignAnalyzer';
import { GroqService } from '../services/groqService';
import { FirestoreService } from '../services/firestoreService';
import { auth } from '../config/firebase';

const COLORS = ['#94fa01', '#0c4650', '#94fa01', '#7b67ed', '#e2e8f0', '#cbd5e1'];

// ChartData tipini eksik alanlarla genişlet
type ChartData = {
  ctrComparison: { campaign: string; ctr: number }[];
  cpcTrend: { campaign: string; cpc: number }[];
  spendDistribution: { campaign: string; spend: number }[];
  [key: string]: any;
};

interface CampaignAnalyzerProps {
  userEmail?: string;
  onLogout?: () => void;
  onBack?: () => void;
  onGoHome?: () => void;
  onRefreshStats?: () => Promise<void>;
}

export const CSVAnalyzer: React.FC<CampaignAnalyzerProps> = ({ userEmail, onLogout, onBack, onGoHome, onRefreshStats }) => {
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

  const downloadSampleExcel = async () => {
    const XLSX = await import('xlsx');

    const sampleData = [
      {
        'Kampanya Adı': 'Yaz Koleksiyonu',
        'Gösterim': 150000,
        'Tıklama': 4500,
        'CTR (%)': 3.0,
        'CPC (TL)': 2.5,
        'Dönüşüm': 225,
        'Harcama (TL)': 11250
      },
      {
        'Kampanya Adı': 'Kış İndirimi',
        'Gösterim': 120000,
        'Tıklama': 3600,
        'CTR (%)': 3.0,
        'CPC (TL)': 3.2,
        'Dönüşüm': 180,
        'Harcama (TL)': 11520
      },
      {
        'Kampanya Adı': 'Bahar Kampanyası',
        'Gösterim': 200000,
        'Tıklama': 8000,
        'CTR (%)': 4.0,
        'CPC (TL)': 1.8,
        'Dönüşüm': 400,
        'Harcama (TL)': 14400
      },
      {
        'Kampanya Adı': 'Sonbahar Trendi',
        'Gösterim': 100000,
        'Tıklama': 2000,
        'CTR (%)': 2.0,
        'CPC (TL)': 4.5,
        'Dönüşüm': 80,
        'Harcama (TL)': 9000
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kampanyalar');

    XLSX.writeFile(workbook, 'kampanya-ornegi.xlsx');
  };

  const handleFile = async (file: File) => {
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setError('Lütfen bir Excel (.xlsx, .xls) veya CSV dosyası yükleyin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
  const parsedCampaigns = await CampaignAnalyzer.parseCSV(file);
  const campaignAnalysis = CampaignAnalyzer.analyzeCampaigns(parsedCampaigns);
  const charts = CampaignAnalyzer.prepareChartData(parsedCampaigns) || {};

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
        campaignAnalysis.expertAnalysis = groqAnalysis.expertAnalysis || campaignAnalysis.expertAnalysis;
        campaignAnalysis.insights = groqAnalysis.insights || campaignAnalysis.insights;
        campaignAnalysis.recommendations = groqAnalysis.improvements || campaignAnalysis.recommendations;
      } catch (groqError) {
        console.warn('Groq API analizi başarısız, yerel analiz kullanılıyor:', groqError);
      }

      setAnalysis(campaignAnalysis);
      // ChartData tipini tam karşılayacak şekilde eksik alanları ekle
      const chartsAny = charts as any;
      setChartData({
        ctrComparison: Array.isArray(chartsAny.ctrComparison) ? chartsAny.ctrComparison : [],
        cpcTrend: Array.isArray(chartsAny.cpcTrend) ? chartsAny.cpcTrend : [],
        spendDistribution: Array.isArray(chartsAny.spendDistribution) ? chartsAny.spendDistribution : []
      });
      
      const currentUser = auth.currentUser;
      if (currentUser) {
        await FirestoreService.saveCSVAnalysis(
          currentUser.uid,
          file.name,
          campaignAnalysis.summary,
          campaignAnalysis
        );
        console.log('CSV analysis saved to Firestore');

        // Refresh stats
        if (onRefreshStats) {
          await onRefreshStats();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dosya işlenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setChartData(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0c4650] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#0c4650] mb-2">Kampanyalar Analiz Ediliyor...</h3>
          <p className="text-[#0c4650]/60">Verileriniz işleniyor ve içgörüler üretiliyor</p>
        </div>
      </div>
    );
  }

  if (!analysis || !chartData) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-[#e2e8f0] shadow-none">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-[#0c4650] hover:text-[#94fa01] px-3 py-2 rounded-lg hover:bg-[#94fa01]/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Geri</span>
                </button>
              )}
              <div className="w-10 h-10 bg-[#94fa01] rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#0c4650]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#0c4650]">Kampanya Analisti</h1>
                <p className="text-sm text-[#0c4650]/60">AI destekli kampanya performans analizi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {userEmail && (
                <span className="text-sm text-[#0c4650]/60 hidden sm:block">{userEmail}</span>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-[#0c4650] hover:text-[#94fa01] px-3 py-2 rounded-lg hover:bg-[#94fa01]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              )}
            </div>
          </div>
        </header>
  <main className="max-w-4xl mx-auto px-4 py-8 font-inter">
          {/* Sample Download */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-6 shadow-none">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#0c4650] mb-2">Örnek Excel Dosyası İndir</h3>
                <p className="text-[#0c4650]/60">
                  Doğru format için örnek kampanya verileri içeren Excel dosyasını indirin
                </p>
              </div>
              <button
                onClick={downloadSampleExcel}
                className="flex items-center space-x-2 bg-[#94fa01] text-[#0c4650] px-4 py-2 rounded-lg hover:bg-[#94fa01]/80 focus:ring-2 focus:ring-[#94fa01] focus:ring-offset-2"
              >
                <Download className="w-4 h-4" />
                <span>Örnek İndir</span>
              </button>
            </div>
          </div>
          {/* Upload Area */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive 
                  ? 'border-[#94fa01] bg-[#94fa01]/10' 
                  : 'border-[#e2e8f0] hover:border-[#94fa01] hover:bg-[#94fa01]/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-[#94fa01]/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[#0c4650]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0c4650] mb-4">
                Kampanya Verilerini Yükle
              </h3>
              <p className="text-[#0c4650]/60 mb-8">
                Excel veya CSV dosyanızı buraya sürükleyip bırakın veya seçmek için tıklayın
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center space-x-2 bg-[#94fa01] text-[#0c4650] px-6 py-3 rounded-lg cursor-pointer hover:bg-[#94fa01]/80 focus:ring-2 focus:ring-[#94fa01] focus:ring-offset-2"
              >
                <FileText className="w-4 h-4" />
                <span>Dosya Seç</span>
              </label>
              <p className="text-xs text-[#0c4650]/60 mt-4">
                Desteklenen formatlar: Excel (.xlsx, .xls) veya CSV
              </p>
              <div className="mt-3 bg-[#94fa01]/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-[#0c4650] mb-2">
                  Sütun adları esnek - aşağıdakilerden herhangi birini kullanabilirsiniz:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#0c4650]/70">
                  <div>
                    <span className="font-medium">Kampanya:</span> Kampanya Adı, Campaign, Name, Ad, Reklam
                  </div>
                  <div>
                    <span className="font-medium">Gösterim:</span> Gösterim, Impressions, Görüntüleme, Views
                  </div>
                  <div>
                    <span className="font-medium">Tıklama:</span> Tıklama, Clicks, Tıklama Sayısı
                  </div>
                  <div>
                    <span className="font-medium">Harcama:</span> Harcama, Spend, Cost, Maliyet, Bütçe
                  </div>
                  <div>
                    <span className="font-medium">CTR:</span> CTR, CTR (%), Tıklama Oranı
                  </div>
                  <div>
                    <span className="font-medium">CPC:</span> CPC, CPC (TL), Avg. CPC, Tıklama Maliyeti
                  </div>
                </div>
                <p className="text-xs text-[#0c4650]/60 mt-2">
                  Sistem kendi Excel/CSV dosyanızı otomatik olarak anlayacaktır
                </p>
              </div>
            </div>
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 font-medium">Hata</p>
                </div>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-white text-[#0c4650]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] shadow-none">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-[#0c4650] hover:text-[#94fa01] px-3 py-2 rounded-lg hover:bg-[#94fa01]/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
            )}
            <div className="w-10 h-10 bg-[#94fa01] rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-[#0c4650]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#0c4650]">Kampanya Analizi</h1>
              <p className="text-sm text-[#0c4650]/60">{analysis.totalCampaigns} kampanya analiz edildi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={resetAnalysis}
              className="flex items-center space-x-2 bg-[#94fa01]/10 hover:bg-[#94fa01]/20 text-[#0c4650] px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-[#94fa01] focus:ring-offset-2"
            >
              <Upload className="w-4 h-4" />
              <span>Yeni Dosya Yükle</span>
            </button>
            {userEmail && onLogout && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#0c4650]/60 hidden sm:block">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-[#0c4650] hover:text-[#94fa01] px-3 py-2 rounded-lg hover:bg-[#94fa01]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Analysis Summary */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0c4650]" />
            </div>
            <h2 className="text-xl font-semibold text-[#0c4650]">Analiz Özeti</h2>
          </div>
          <p className="text-[#0c4650] text-lg leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="font-semibold text-[#0c4650]">Performans Puanı</h3>
            </div>
            <div className="text-3xl font-bold text-[#0c4650] mb-2">{analysis.performanceScore}</div>
            <p className="text-sm text-[#0c4650]/60">100 üzerinden</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="font-semibold text-[#0c4650]">En İyi Kampanya</h3>
            </div>
            <div className="text-lg font-bold text-[#0c4650] mb-2 truncate" title={analysis.bestCampaign}>
              {analysis.bestCampaign}
            </div>
            <p className="text-sm text-[#0c4650]/60">En yüksek performans</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="font-semibold text-[#0c4650]">Geliştirilmeli</h3>
            </div>
            <div className="text-lg font-bold text-[#0c4650] mb-2 truncate" title={analysis.worstCampaign}>
              {analysis.worstCampaign}
            </div>
            <p className="text-sm text-[#0c4650]/60">Düşük performans</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="font-semibold text-[#0c4650]">Toplam Kampanya</h3>
            </div>
            <div className="text-3xl font-bold text-[#0c4650] mb-2">{analysis.totalCampaigns}</div>
            <p className="text-sm text-[#0c4650]/60">analiz edildi</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0c4650]">CTR Karşılaştırması</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={chartData.ctrComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="campaign" stroke="#0c4650" tick={{ fontSize: 12 }} />
                <YAxis stroke="#0c4650" label={{ value: 'CTR (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Tıklama Oranı']}
                  labelFormatter={(label) => `Kampanya: ${label}`}
                />
                <Bar dataKey="ctr" fill="#94fa01" name="CTR Oranı" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0c4650]">CPC Trendleri</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.cpcTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="campaign" stroke="#0c4650" tick={{ fontSize: 12 }} />
                <YAxis stroke="#0c4650" label={{ value: 'Maliyet (₺)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} ₺`, 'Tıklama Başı Maliyet']}
                  labelFormatter={(label) => `Kampanya: ${label}`}
                />
                <Line type="monotone" dataKey="cpc" stroke="#0c4650" strokeWidth={2} name="Tıklama Maliyeti" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0c4650]">Harcamaların Dağılımı</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={chartData.spendDistribution}
                  dataKey="spend"
                  nameKey="campaign"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.percentage}%`}
                >
                  {chartData.spendDistribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} ₺`, 'Toplam Harcama']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0c4650]">Anahtar İçgörüler</h3>
            </div>
            <div className="space-y-4">
              {analysis.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#94fa01] mt-2" />
                  <p className="text-[#0c4650]">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-none">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0c4650]">Öneriler</h3>
            </div>
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#94fa01] mt-2" />
                  <p className="text-[#0c4650]">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expert Analysis (if exists) */}
        {analysis.expertAnalysis && (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-6 shadow-none">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-[#94fa01]/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0c4650]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0c4650]">Uzman Analizi</h3>
            </div>
            <p className="text-[#0c4650] leading-relaxed">{analysis.expertAnalysis}</p>
          </div>
        )}

        {/* Back to Home Button */}
        {onGoHome && (
          <div className="flex justify-center">
            <button
              onClick={onGoHome}
              className="flex items-center space-x-2 bg-[#94fa01] text-[#0c4650] px-6 py-3 rounded-2xl font-medium hover:bg-[#94fa01]/90 transition-all focus:ring-2 focus:ring-[#94fa01] focus:ring-offset-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
