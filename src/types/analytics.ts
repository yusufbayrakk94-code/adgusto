// Google Analytics ile ilgili tipler
export interface AnalyticsTokenData {
  accessToken: string;
  expiresAt: number;
}

export interface AnalyticsAccount {
  name: string;
  accountId: string;
  properties: AnalyticsProperty[];
}

export interface AnalyticsProperty {
  name: string;
  propertyId: string;
  displayName: string;
  createTime: string;
}

export interface AnalyticsMetric {
  name: string;
  value: number | string;
}

export interface AnalyticsReport {
  dimensions: {
    date: string;
    source: string;
  };
  metrics: {
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
}

// Groq Analiz Sonuçları
export interface TrafficAnalysis {
  summary: string;
  recommendations: string[];
  trends: {
    traffic: string;
    engagement: string;
    sources: string;
  };
  actionItems: string[];
}