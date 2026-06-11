export interface Campaign {
  campaign: string;
  date?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  spend: number;
  revenue?: number;
}

export interface CampaignAnalysis {
  summary: string;
  performanceScore: number;
  bestCampaign: string;
  worstCampaign: string;
  totalCampaigns: number;
  insights: string[];
  recommendations: string[];
  expertAnalysis: string;
  benchmarks: {
    avgCTR: number;
    avgCPC: number;
    avgConversionRate: number;
  };
}

export interface ChartData {
  ctrComparison: Array<{ campaign: string; ctr: number }>;
  cpcTrend: Array<{ campaign: string; cpc: number; date?: string }>;
  spendDistribution: Array<{ campaign: string; spend: number; percentage: number }>;
}