import Papa from 'papaparse';
import { CSVData } from '../types';

export class CSVService {
  static parseCSV(file: File): Promise<CSVData> {
    return new Promise((resolve, reject) => {
      // Dosya okuma kontrolü
      if (!file || file.size === 0) {
        reject(new Error('Geçersiz dosya'));
        return;
      }

      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        delimiter: ',',
        complete: (results) => {
          if (results.errors.length > 0) {
            const errorMsg = results.errors[0].message;
            reject(new Error(`CSV dosyası okunamadı: ${errorMsg}`));
            return;
          }

          const data = results.data as string[][];
          if (data.length === 0) {
            reject(new Error('CSV dosyası boş veya geçersiz'));
            return;
          }

          // En az 2 satır olmalı (başlık + 1 veri)
          if (data.length < 2) {
            reject(new Error('CSV dosyasında yeterli veri yok. En az 1 başlık ve 1 veri satırı gereklidir'));
            return;
          }

          const headers = data[0];
          const rows = data.slice(1);

          // Başlık kontrolü
          if (!headers || headers.length === 0) {
            reject(new Error('CSV dosyasında başlık satırı bulunamadı'));
            return;
          }

          // Boş başlıkları filtrele
          const validHeaders = headers.filter(h => h && h.trim().length > 0);
          if (validHeaders.length === 0) {
            reject(new Error('CSV dosyasında geçerli başlık bulunamadı'));
            return;
          }

          // Veri satırlarını kontrol et
          const validRows = rows.filter(row => 
            row && row.length > 0 && row.some(cell => cell && cell.trim().length > 0)
          );

          if (validRows.length === 0) {
            reject(new Error('CSV dosyasında geçerli veri satırı bulunamadı'));
            return;
          }

          resolve({
            headers: validHeaders,
            rows: validRows,
            totalRows: validRows.length
          });
        },
        error: (error) => {
          reject(new Error(`Dosya okuma hatası: ${error.message}`));
        }
      });
    });
  }

  static generateTemplate(): string {
    const headers = [
      'Kampanya Adı',
      'Platform',
      'Harcama (TL)',
      'Gösterim',
      'Tıklama',
      'Dönüşüm',
      'CTR (%)',
      'CPC (TL)',
      'Dönüşüm Oranı (%)',
      'Tarih'
    ];

    const sampleData = [
      ['Yaz Kampanyası', 'Google Ads', '1500', '25000', '750', '45', '3.0', '2.0', '6.0', '2024-01-15'],
      ['Marka Bilinirlik', 'Meta Ads', '2200', '45000', '1200', '72', '2.67', '1.83', '6.0', '2024-01-15'],
      ['Ürün Tanıtım', 'LinkedIn', '800', '8000', '240', '18', '3.0', '3.33', '7.5', '2024-01-15']
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static downloadTemplate(): void {
    const csvContent = this.generateTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'reklam_analizi_template.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static extractMetrics(data: CSVData): any {
    const metrics = {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      campaigns: []
    };

    // Header'ları analiz et ve sütun indekslerini bul
    const headers = data.headers.map(h => h.toLowerCase());
    const spendIndex = headers.findIndex(h => h.includes('harcama') || h.includes('spend') || h.includes('cost'));
    const impressionIndex = headers.findIndex(h => h.includes('gösterim') || h.includes('impression'));
    const clickIndex = headers.findIndex(h => h.includes('tıklama') || h.includes('click'));
    const conversionIndex = headers.findIndex(h => h.includes('dönüşüm') || h.includes('conversion'));

    data.rows.forEach(row => {
      const campaign: any = {};
      
      // Kampanya adı (genellikle ilk sütun)
      campaign.name = row[0] || 'Bilinmeyen Kampanya';
      
      // Metrikleri çıkar
      if (spendIndex >= 0) {
        const spend = parseFloat(row[spendIndex]?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        campaign.spend = spend;
        metrics.totalSpend += spend;
      }
      
      if (impressionIndex >= 0) {
        const impressions = parseInt(row[impressionIndex]?.replace(/[^\d]/g, '')) || 0;
        campaign.impressions = impressions;
        metrics.totalImpressions += impressions;
      }
      
      if (clickIndex >= 0) {
        const clicks = parseInt(row[clickIndex]?.replace(/[^\d]/g, '')) || 0;
        campaign.clicks = clicks;
        metrics.totalClicks += clicks;
      }
      
      if (conversionIndex >= 0) {
        const conversions = parseInt(row[conversionIndex]?.replace(/[^\d]/g, '')) || 0;
        campaign.conversions = conversions;
        metrics.totalConversions += conversions;
      }

      metrics.campaigns.push(campaign);
    });

    // Ortalama metrikleri hesapla
    if (metrics.totalImpressions > 0) {
      metrics.averageCTR = (metrics.totalClicks / metrics.totalImpressions) * 100;
    }
    
    if (metrics.totalClicks > 0) {
      metrics.averageCPC = metrics.totalSpend / metrics.totalClicks;
    }

    return metrics;
  }
}