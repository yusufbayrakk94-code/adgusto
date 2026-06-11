export interface ServiceAnalysis {
  service: string;
  channels: ChannelRecommendation[];
  adTypes: AdTypeRecommendation[];
  copyTexts: CopyTextRecommendation[];
  summary: string;
  budgetRecommendation?: BudgetRecommendation;
  organicContent?: OrganicContent;
  id?: string;
  createdAt?: string;
}

export interface BudgetRecommendation {
  minBudget: number;
  optimalBudget: number;
  budgetDistribution?: Array<{
    platform: string;
    percentage: number;
    rationale: string;
  }>;
  expectedResults?: string;
}

export interface OrganicContent {
  blogPosts?: Array<{
    title: string;
    summary: string;
    keywords: string[];
  }>;
  socialMediaPosts?: Array<{
    platform: string;
    content: string;
    hashtags: string[];
    visualSuggestion: string;
  }>;
  contentCalendar?: string;
}

export interface ChannelRecommendation {
  name: string;
  description: string;
  effectiveness: number;
  cost: string;
  targetAudience: string;
}

export interface AdTypeRecommendation {
  type: string;
  description: string;
  bestFor: string;
  examples: string[];
}

export interface CopyTextRecommendation {
  headline: string;
  description: string;
  callToAction: string;
  platform: string;
}

export interface CSVData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export interface CSVAnalysis {
  summary: string;
  insights: string[];
  improvements: string[];
  expertAnalysis: string;
  keyMetrics: {
    totalSpend?: number;
    totalImpressions?: number;
    totalClicks?: number;
    averageCTR?: number;
    averageCPC?: number;
  };
}