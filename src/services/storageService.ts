import { ServiceAnalysis } from '../types';

export class StorageService {
  private static getStorageKey(userId: string): string {
    return `adgusto_analyses_${userId}`;
  }

  static saveAnalysis(userId: string, analysis: ServiceAnalysis): void {
    try {
      const existingAnalyses = this.getAnalyses(userId);
      const newAnalysis = {
        ...analysis,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      const updatedAnalyses = [newAnalysis, ...existingAnalyses].slice(0, 50); // Son 50 analizi sakla
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(updatedAnalyses));
    } catch (error) {
      console.error('Analiz kaydedilirken hata:', error);
    }
  }

  static getAnalyses(userId: string): (ServiceAnalysis & { id: string; createdAt: string })[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Analizler yüklenirken hata:', error);
      return [];
    }
  }

  static deleteAnalysis(userId: string, analysisId: string): void {
    try {
      const analyses = this.getAnalyses(userId);
      const filtered = analyses.filter(analysis => analysis.id !== analysisId);
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(filtered));
    } catch (error) {
      console.error('Analiz silinirken hata:', error);
    }
  }

  static clearAllAnalyses(userId: string): void {
    try {
      localStorage.removeItem(this.getStorageKey(userId));
    } catch (error) {
      console.error('Analizler temizlenirken hata:', error);
    }
  }
}