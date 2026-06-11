import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Campaign, CampaignAnalysis, ChartData } from '../types/campaign';

export class CampaignAnalyzer {
  // Sayısal değerleri temizle ve parse et
  private static parseNumericValue(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    // Zaten sayıysa direkt döndür
    if (typeof value === 'number') {
      return value;
    }

    // String'e çevir ve temizle
    let strValue = String(value).trim();

    // Para birimi sembollerini ve ekstra karakterleri temizle
    strValue = strValue.replace(/[TL$€£¥₺\s]/g, '');

    // Yüzde işaretini temizle
    strValue = strValue.replace(/%/g, '');

    // Türkçe binlik ve ondalık ayırıcıları normalize et
    // Örnek: 1.234,56 -> 1234.56
    if (strValue.includes('.') && strValue.includes(',')) {
      // Her ikisi de varsa, . binlik ayırıcıdır
      strValue = strValue.replace(/\./g, '').replace(',', '.');
    } else if (strValue.includes(',')) {
      // Sadece virgül varsa, ondalık ayırıcı olabilir
      const parts = strValue.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Muhtemelen ondalık: 12,50
        strValue = strValue.replace(',', '.');
      } else {
        // Muhtemelen binlik: 1,234
        strValue = strValue.replace(/,/g, '');
      }
    }

    const parsed = parseFloat(strValue);
    return isNaN(parsed) ? 0 : parsed;
  }

  static parseCSV(file: File): Promise<Campaign[]> {
    return new Promise((resolve, reject) => {
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

      if (isExcel) {
        // Excel dosyası işleme
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

            if (jsonData.length < 2) {
              reject(new Error('Excel dosyası boş veya geçersiz'));
              return;
            }

            // İlk satırı başlık olarak al
            const headers = jsonData[0];
            const rows = jsonData.slice(1);

            console.log('==================== EXCEL DOSYASI DETAYLARI ====================');
            console.log('Toplam satır sayısı (başlık hariç):', rows.length);
            console.log('Excel Başlıkları:', headers);
            console.log('Başlık tipleri:', headers.map((h: any) => `${h} (${typeof h})`));
            console.log('İlk 3 veri satırı:', rows.slice(0, 3));
            console.log('================================================================');

            // Başlık indekslerini bul
            const getCellValue = (row: any[], headerName: string): any => {
              const possibleNames: { [key: string]: string[] } = {
                'campaign': ['kampanya adı', 'campaign', 'campaign name', 'kampanya', 'ad name', 'name', 'isim', 'ad', 'reklam', 'reklam adı', 'ad group', 'reklam grubu'],
                'impressions': ['gösterim', 'impressions', 'impression', 'impr.', 'impr', 'görüntüleme', 'görünüm', 'gösterim sayısı', 'views'],
                'clicks': ['tıklama', 'clicks', 'click', 'tıklamalar', 'tıklama sayısı', 'toplam tıklama'],
                'ctr': ['ctr', 'ctr (%)', 'ctr(%)', 'tıklama oranı', 'click-through rate', 'tıklama yüzdesi', 'oran'],
                'cpc': ['cpc', 'cpc (tl)', 'cpc(tl)', 'tıklama başı maliyet', 'avg. cpc', 'ortalama cpc', 'avg cpc', 'tıklama maliyeti', 'cost per click'],
                'conversions': ['dönüşüm', 'conversions', 'conversion', 'conv.', 'dönüşümler', 'dönüşüm sayısı', 'satış'],
                'spend': ['harcama', 'harcama (tl)', 'spend', 'cost', 'maliyet', 'toplam harcama', 'bütçe', 'amount', 'tutar', 'total cost'],
                'date': ['tarih', 'date', 'day', 'gün', 'zaman'],
                'revenue': ['gelir', 'revenue', 'sales', 'satış geliri', 'toplam gelir']
              };

              const names = possibleNames[headerName] || [];

              // Tam eşleşme dene
              for (const name of names) {
                const index = headers.findIndex((h: any) =>
                  h && h.toString().toLowerCase().trim() === name
                );
                if (index !== -1 && row[index] !== undefined && row[index] !== null && row[index] !== '') {
                  return row[index];
                }
              }

              // Kısmi eşleşme dene
              for (const name of names) {
                const index = headers.findIndex((h: any) =>
                  h && (h.toString().toLowerCase().trim().includes(name) || name.includes(h.toString().toLowerCase().trim()))
                );
                if (index !== -1 && row[index] !== undefined && row[index] !== null && row[index] !== '') {
                  return row[index];
                }
              }

              return null;
            };

            const campaigns: Campaign[] = rows
              .filter((row: any[]) => row && row.length > 0 && row.some((cell: any) => cell !== null && cell !== undefined && cell !== ''))
              .map((row: any[], index: number) => {
                console.log(`\n>>> SATIR ${index + 1} İŞLENİYOR <<<`);
                console.log('Ham satır verisi:', row);

                const impressionsRaw = getCellValue(row, 'impressions');
                const clicksRaw = getCellValue(row, 'clicks');
                const spendRaw = getCellValue(row, 'spend');
                const ctrRaw = getCellValue(row, 'ctr');
                const cpcRaw = getCellValue(row, 'cpc');

                console.log('Ham değerler:', {
                  impressions: impressionsRaw,
                  clicks: clicksRaw,
                  spend: spendRaw,
                  ctr: ctrRaw,
                  cpc: cpcRaw
                });

                const impressions = this.parseNumericValue(impressionsRaw);
                const clicks = this.parseNumericValue(clicksRaw);
                const spend = this.parseNumericValue(spendRaw);
                const ctrValue = this.parseNumericValue(ctrRaw);
                const cpcValue = this.parseNumericValue(cpcRaw);
                const conversions = this.parseNumericValue(getCellValue(row, 'conversions'));
                const revenue = this.parseNumericValue(getCellValue(row, 'revenue'));

                // İlk kolonu kampanya adı olarak kullanmayı dene
                const campaignName = getCellValue(row, 'campaign') || row[0] || 'Kampanya ' + (index + 1);

                console.log('Parse edilmiş değerler:', {
                  campaign: campaignName,
                  impressions,
                  clicks,
                  spend,
                  ctr: ctrValue,
                  cpc: cpcValue
                });
                console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<\n');

                return {
                  campaign: String(campaignName).substring(0, 100),
                  date: getCellValue(row, 'date') || '',
                  impressions: Math.round(impressions),
                  clicks: Math.round(clicks),
                  ctr: ctrValue > 0 ? ctrValue : (impressions > 0 ? (clicks / impressions) * 100 : 0),
                  cpc: cpcValue > 0 ? cpcValue : (clicks > 0 ? spend / clicks : 0),
                  conversions: Math.round(conversions),
                  spend,
                  revenue,
                };
              });

            if (campaigns.length === 0) {
              const errorMessage = `Excel dosyasında satır bulunamadı. Bulunan başlıklar: ${headers.join(', ')}.

Desteklenen formatlar:
- Kampanya Adı, Gösterim, Tıklama, Harcama
- Campaign, Impressions, Clicks, Spend

Örnek CSV formatı için "Örnek CSV İndir" butonunu kullanabilirsiniz.`;
              reject(new Error(errorMessage));
              return;
            }

            console.log('Yüklenen kampanya sayısı:', campaigns.length);
            console.log('İlk kampanya:', campaigns[0]);

            resolve(campaigns);
          } catch (error) {
            reject(new Error('Excel dosyası işlenirken hata oluştu: ' + error));
          }
        };

        reader.onerror = () => {
          reject(new Error('Dosya okuma hatası'));
        };

        reader.readAsBinaryString(file);
      } else {
        // CSV dosyası işleme
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          delimiter: '',
          newline: '',
          quoteChar: '"',
          escapeChar: '"',
          dynamicTyping: false,
          encoding: 'UTF-8',
          complete: (results) => {
            if (results.errors.length > 0) {
              const criticalErrors = results.errors.filter(e => e.type !== 'Quotes');
              if (criticalErrors.length > 0) {
                console.warn('CSV parsing uyarıları:', results.errors);
              }
            }

            try {
              if (!results.data || results.data.length === 0) {
                reject(new Error('CSV dosyası boş veya okunamadı'));
                return;
              }

              // CSV başlıklarını ve ilk satırı logla
              const firstRow = results.data[0] as any;
              const headers = Object.keys(firstRow || {});
              console.log('CSV Başlıkları:', headers);
              console.log('İlk satır örneği:', firstRow);

              const getCellValue = (row: any, possibleKeys: string[]): any => {
                // İlk önce tam eşleşme dene
                for (const key of possibleKeys) {
                  if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                    return row[key];
                  }
                }

                // Sonra büyük/küçük harf duyarsız eşleşme dene
                const lowerKeys = Object.keys(row).map(k => k.toLowerCase().trim());
                for (const possibleKey of possibleKeys) {
                  const normalizedKey = possibleKey.toLowerCase().trim();
                  const matchingKeyIndex = lowerKeys.findIndex(k => k === normalizedKey);
                  if (matchingKeyIndex !== -1) {
                    const actualKey = Object.keys(row)[matchingKeyIndex];
                    if (row[actualKey] !== undefined && row[actualKey] !== null && row[actualKey] !== '') {
                      return row[actualKey];
                    }
                  }
                }

                // Kısmi eşleşme dene (kolon adı içinde arama)
                for (const possibleKey of possibleKeys) {
                  const normalizedKey = possibleKey.toLowerCase().trim();
                  const matchingKey = Object.keys(row).find(k =>
                    k.toLowerCase().trim().includes(normalizedKey) || normalizedKey.includes(k.toLowerCase().trim())
                  );
                  if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== '') {
                    return row[matchingKey];
                  }
                }

                return null;
              };

              const campaigns: Campaign[] = results.data
                .filter((row: any) => {
                  if (!row || typeof row !== 'object') return false;
                  const keys = Object.keys(row);
                  // En az bir değeri olan satırları kabul et
                  return keys.some(key => row[key] !== null && row[key] !== undefined && row[key] !== '');
                })
                .map((row: any, index: number) => {
                  const impressions = this.parseNumericValue(
                    getCellValue(row, ['Gösterim', 'Impressions', 'Impression', 'gösterim', 'impressions', 'GÖSTERIM', 'IMPRESSIONS', 'Impr.', 'Impr', 'Görüntüleme', 'Görünüm', 'Gösterim Sayısı', 'Views'])
                  );

                  const clicks = this.parseNumericValue(
                    getCellValue(row, ['Tıklama', 'Clicks', 'Click', 'tıklama', 'clicks', 'TIKLAMA', 'CLICKS', 'Tıklamalar', 'Tıklama Sayısı', 'Toplam Tıklama'])
                  );

                  const spend = this.parseNumericValue(
                    getCellValue(row, ['Harcama (TL)', 'Harcama', 'Spend', 'Cost', 'harcama', 'spend', 'cost', 'HARCAMA', 'SPEND', 'Maliyet', 'Toplam Harcama', 'Bütçe', 'Amount', 'Tutar', 'Total Cost'])
                  );

                  const ctrValue = this.parseNumericValue(
                    getCellValue(row, ['CTR (%)', 'CTR', 'ctr', 'CTR(%)', 'tıklama oranı', 'Click-through rate', 'Tıklama Yüzdesi', 'Oran'])
                  );

                  const cpcValue = this.parseNumericValue(
                    getCellValue(row, ['CPC (TL)', 'CPC', 'cpc', 'CPC(TL)', 'Avg. CPC', 'Ortalama CPC', 'Avg CPC', 'Tıklama Maliyeti', 'Cost Per Click', 'Tıklama Başı Maliyet'])
                  );

                  const conversions = this.parseNumericValue(
                    getCellValue(row, ['Dönüşüm', 'Conversions', 'Conversion', 'dönüşüm', 'conversions', 'DÖNÜŞÜM', 'CONVERSIONS', 'Conv.', 'Dönüşümler', 'Dönüşüm Sayısı', 'Satış'])
                  );

                  const revenue = this.parseNumericValue(
                    getCellValue(row, ['Gelir', 'Revenue', 'gelir', 'revenue', 'GELIR', 'REVENUE', 'Sales', 'Satış Geliri', 'Toplam Gelir'])
                  );

                  // İlk kolonu kampanya adı olarak kullanmayı dene
                  const firstColumn = Object.keys(row)[0];
                  const campaignName = getCellValue(row, [
                    'Kampanya Adı', 'Campaign', 'Campaign Name', 'kampanya adı', 'campaign',
                    'Kampanya', 'KAMPANYA ADI', 'Ad name', 'Name', 'İsim', 'Ad', 'Reklam', 'Reklam Adı', 'Ad Group', 'Reklam Grubu', firstColumn
                  ]) || row[firstColumn] || 'Kampanya ' + (index + 1);

                  console.log(`CSV Satır ${index + 1}:`, {
                    campaign: campaignName,
                    impressions,
                    clicks,
                    spend,
                    ctr: ctrValue,
                    cpc: cpcValue
                  });

                  return {
                    campaign: String(campaignName).substring(0, 100),
                    date: getCellValue(row, ['Tarih', 'Date', 'tarih', 'date', 'TARIH', 'DATE', 'Day', 'Gün']) || '',
                    impressions: Math.round(impressions),
                    clicks: Math.round(clicks),
                    ctr: ctrValue > 0 ? ctrValue : (impressions > 0 ? (clicks / impressions) * 100 : 0),
                    cpc: cpcValue > 0 ? cpcValue : (clicks > 0 ? spend / clicks : 0),
                    conversions: Math.round(conversions),
                    spend,
                    revenue,
                  };
                });

              if (campaigns.length === 0) {
                const errorMessage = `CSV dosyasında satır bulunamadı. Bulunan başlıklar: ${headers.join(', ')}.

Desteklenen formatlar:
- Kampanya Adı, Gösterim, Tıklama, Harcama
- Campaign, Impressions, Clicks, Spend

Örnek CSV formatı için "Örnek CSV İndir" butonunu kullanabilirsiniz.`;
                reject(new Error(errorMessage));
                return;
              }

              console.log('Yüklenen kampanya sayısı:', campaigns.length);
              console.log('İlk kampanya:', campaigns[0]);

              resolve(campaigns);
            } catch (error) {
              reject(new Error('Veri işleme hatası: ' + error));
            }
          },
          error: (error) => {
            reject(new Error('Dosya okuma hatası: ' + error.message));
          }
        });
      }
    });
  }

  static analyzeCampaigns(campaigns: Campaign[]): CampaignAnalysis {
    if (campaigns.length === 0) {
      throw new Error('No campaigns to analyze');
    }

    // Calculate totals and averages
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    
    const avgCTR = campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length;
    const avgCPC = campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length;
    const avgConversionRate = totalConversions / totalClicks * 100;

    // Find best and worst campaigns
    const bestCampaign = campaigns.reduce((best, current) => 
      current.ctr > best.ctr ? current : best
    );
    const worstCampaign = campaigns.reduce((worst, current) => 
      current.ctr < worst.ctr ? current : worst
    );

    // Calculate performance score (0-100)
    const industryBenchmarks = { ctr: 2.5, cpc: 0.5, conversionRate: 3.0 };
    const ctrScore = Math.min((avgCTR / industryBenchmarks.ctr) * 100, 100);
    const cpcScore = Math.min((industryBenchmarks.cpc / avgCPC) * 100, 100);
    const conversionScore = Math.min((avgConversionRate / industryBenchmarks.conversionRate) * 100, 100);
    const performanceScore = Math.round((ctrScore + cpcScore + conversionScore) / 3);

    // Generate insights
    const insights = [];
    if (avgCTR > industryBenchmarks.ctr) {
      insights.push(`Ortalama CTR'ınız %${avgCTR.toFixed(2)} ile sektör ortalamasının (%${industryBenchmarks.ctr}) üzerinde`);
    } else {
      insights.push(`Ortalama CTR'ınız %${avgCTR.toFixed(2)} ile sektör ortalamasının (%${industryBenchmarks.ctr}) altında`);
    }

    if (avgCPC < industryBenchmarks.cpc) {
      insights.push(`Ortalama CPC'niz ${avgCPC.toFixed(2)} TL ile sektör ortalamasına (${industryBenchmarks.cpc} TL) göre rekabetçi durumda`);
    } else {
      insights.push(`Ortalama CPC'niz ${avgCPC.toFixed(2)} TL ile sektör ortalamasından (${industryBenchmarks.cpc} TL) daha yüksek`);
    }

    insights.push(`"${bestCampaign.campaign}" kampanyanız %${bestCampaign.ctr.toFixed(2)} CTR ile en iyi performansı gösteriyor`);

    // Generate recommendations
    const recommendations = [];
    if (worstCampaign.ctr < 1.0) {
      recommendations.push(`"${worstCampaign.campaign}" kampanyasını duraklatmayı veya optimize etmeyi düşünün - CTR ortalamanın oldukça altında`);
    }
    if (avgCPC > industryBenchmarks.cpc) {
      recommendations.push('CPC maliyetlerini düşürmek için Kalite Puanını iyileştirmeye odaklanın');
    }
    recommendations.push('"' + bestCampaign.campaign + '" gibi yüksek performanslı kampanyalara daha fazla bütçe ayırın');

    // Generate summary
    const summary = `${campaigns.length} kampanyanın analizi ${performanceScore >= 70 ? 'güçlü' : performanceScore >= 50 ? 'orta' : 'zayıf'} bir genel performans gösteriyor. Toplam ${totalSpend.toFixed(2)} TL harcama ile ${totalClicks.toLocaleString()} tıklama ve ${totalConversions} dönüşüm elde edildi.`;

    // Expert analysis
    const expertAnalysis = `Kampanya portföyünüz ${performanceScore >= 70 ? 'mükemmel' : performanceScore >= 50 ? 'iyi' : 'endişe verici'} performans metrikleri gösteriyor. "${bestCampaign.campaign}" kampanyası %${bestCampaign.ctr.toFixed(2)} CTR ile öne çıkıyor ve hedefleme ile yaratıcı stratejinizin bu segment için iyi çalıştığını gösteriyor. ${worstCampaign.ctr < 1.0 ? `Ancak "${worstCampaign.campaign}" kampanyası %${worstCampaign.ctr.toFixed(2)} CTR ile acil dikkat gerektiriyor.` : ''} ROI'yi maksimize etmek için başarılı kampanyaları ölçeklendirmeye ve düşük performanslıları optimize etmeye veya duraklatmaya odaklanın.`;

    return {
      summary,
      performanceScore,
      bestCampaign: bestCampaign.campaign,
      worstCampaign: worstCampaign.campaign,
      totalCampaigns: campaigns.length,
      insights,
      recommendations,
      expertAnalysis,
      benchmarks: {
        avgCTR,
        avgCPC,
        avgConversionRate
      }
    };
  }

  static prepareChartData(campaigns: Campaign[]): ChartData {
    // CTR comparison data
    const ctrComparison = campaigns.map(c => ({
      campaign: c.campaign.length > 15 ? c.campaign.substring(0, 15) + '...' : c.campaign,
      ctr: parseFloat(c.ctr.toFixed(2))
    }));

    // CPC trend data
    const cpcTrend = campaigns.map(c => ({
      campaign: c.campaign.length > 15 ? c.campaign.substring(0, 15) + '...' : c.campaign,
      cpc: parseFloat(c.cpc.toFixed(2)),
      date: c.date
    }));

    // Spend distribution data
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const spendDistribution = campaigns.map(c => ({
      campaign: c.campaign.length > 15 ? c.campaign.substring(0, 15) + '...' : c.campaign,
      spend: parseFloat(c.spend.toFixed(2)),
      percentage: Math.round((c.spend / totalSpend) * 100)
    }));

    return {
      ctrComparison,
      cpcTrend,
      spendDistribution
    };
  }

  static generateSampleCSV(): string {
    const headers = ['Campaign', 'Date', 'Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'Spend', 'Revenue'];
    const sampleData = [
      ['Summer Sale', '2025-01-15', '15000', '450', '3.0', '0.35', '45', '157.50', '675'],
      ['Brand Awareness', '2025-01-15', '25000', '500', '2.0', '0.40', '30', '200.00', '450'],
      ['Product Launch', '2025-01-15', '8000', '320', '4.0', '0.30', '48', '96.00', '720'],
      ['Retargeting', '2025-01-15', '5000', '200', '4.0', '0.25', '25', '50.00', '375'],
    ];

    return [headers, ...sampleData]
      .map(row => row.join(','))
      .join('\n');
  }

  static downloadSampleCSV(): void {
    const csvContent = this.generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'sample_campaign_data.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}