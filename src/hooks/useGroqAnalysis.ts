import { useState } from 'react';
import { GroqService } from '../services/groqService';
import { ServiceAnalysis } from '../types';

export const useGroqAnalysis = () => {
  const [analysis, setAnalysis] = useState<ServiceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeService = async (service: string, sector?: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('=== GROQ Analysis Started ===');
      console.log('Service:', service);
      console.log('Sector:', sector);

      const groqService = new GroqService();
      const result = await groqService.analyzeService(service, sector);

      console.log('=== GROQ Analysis Result ===');
      console.log('Full result:', result);
      console.log('Has budgetRecommendation:', !!result?.budgetRecommendation);
      console.log('Has adTypes:', !!result?.adTypes);
      console.log('Has organicContent:', !!result?.organicContent);

      setAnalysis(result);
      return result;
    } catch (err) {
      console.error('=== GROQ Analysis Error ===', err);
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    loading,
    error,
    analyzeService,
    clearAnalysis
  };
};