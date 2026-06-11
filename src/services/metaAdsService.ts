import { supabase } from '../config/supabase';

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaConnection {
  access_token: string;
  permissions: string[];
  expires_in: number | null;
  connected_at: string;
  ad_account_id?: string;
  business_id?: string;
  page_id?: string;
}

export interface MetaCampaign {
  campaign_id: string;
  campaign_name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  objective: string | null;
  daily_budget: number | null;
  lifetime_budget: number | null;
  start_time: string | null;
  end_time: string | null;
  insights: any;
  created_at: string;
  updated_at: string;
}

export interface MetaAdAccount {
  id: string;
  account_id: string;
  name: string;
  currency: string;
  timezone_name: string;
  account_status: number;
}

export interface MetaCampaignInsights {
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpm: number;
}

export class MetaAdsService {
  static async saveConnection(
    userId: string,
    accessToken: string,
    permissions: string[],
    expiresIn?: number
  ): Promise<MetaConnection> {
    const connectionData = {
      user_id: userId,
      access_token: accessToken,
      permissions,
      expires_in: expiresIn ?? null,
      connected_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('meta_ads_connections')
      .upsert(connectionData, { onConflict: 'user_id' });

    if (error) {
      throw new Error(`Failed to save connection: ${error.message}`);
    }

    return {
      access_token: accessToken,
      permissions,
      expires_in: expiresIn ?? null,
      connected_at: connectionData.connected_at
    };
  }

  static async getConnection(userId: string): Promise<MetaConnection | null> {
    const { data, error } = await supabase
      .from('meta_ads_connections')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching connection:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      access_token: data.access_token,
      permissions: data.permissions,
      expires_in: data.expires_in,
      connected_at: data.connected_at,
      ad_account_id: data.ad_account_id,
      business_id: data.business_id,
      page_id: data.page_id
    };
  }

  static async deleteAllUserCampaigns(userId: string): Promise<void> {
    const { error } = await supabase
      .from('meta_ad_campaigns')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete campaigns: ${error.message}`);
    }
  }

  static async deleteConnection(userId: string): Promise<void> {
    await this.deleteAllUserCampaigns(userId);

    const { error } = await supabase
      .from('meta_ads_connections')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete connection: ${error.message}`);
    }
  }

  static async fetchAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
    try {
      const response = await fetch(
        `${META_API_BASE}/me/adaccounts?fields=id,account_id,name,currency,timezone_name,account_status&access_token=${accessToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Meta API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async fetchCampaigns(
    accessToken: string,
    adAccountId: string
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${META_API_BASE}/${adAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time&access_token=${accessToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Meta API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async fetchCampaignInsights(
    accessToken: string,
    campaignId: string
  ): Promise<MetaCampaignInsights | null> {
    try {
      const response = await fetch(
        `${META_API_BASE}/${campaignId}/insights?fields=impressions,clicks,spend,reach,ctr,cpc,cpm&access_token=${accessToken}`
      );

      if (!response.ok) {
        console.error(`Failed to fetch insights for campaign ${campaignId}: ${response.status} ${response.statusText}`);
        return {
          impressions: null as any,
          clicks: null as any,
          spend: null as any,
          reach: null as any,
          ctr: null as any,
          cpc: null as any,
          cpm: null as any
        };
      }

      const result = await response.json();
      return result.data?.[0] || null;
    } catch (error) {
      console.error(`Error fetching insights for campaign ${campaignId}:`, error);
      return {
        impressions: null as any,
        clicks: null as any,
        spend: null as any,
        reach: null as any,
        ctr: null as any,
        cpc: null as any,
        cpm: null as any
      };
    }
  }

  static async saveCampaign(
    userId: string,
    campaignData: any
  ): Promise<MetaCampaign> {
    const campaign = {
      user_id: userId,
      campaign_id: campaignData.id,
      campaign_name: campaignData.name,
      status: campaignData.status,
      objective: campaignData.objective ?? null,
      daily_budget: campaignData.daily_budget ?? null,
      lifetime_budget: campaignData.lifetime_budget ?? null,
      start_time: campaignData.start_time ?? null,
      end_time: campaignData.stop_time ?? null,
      insights: campaignData.insights || {}
    };

    const { data, error } = await supabase
      .from('meta_ad_campaigns')
      .upsert(campaign, { onConflict: 'campaign_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save campaign: ${error.message}`);
    }

    return {
      campaign_id: data.campaign_id,
      campaign_name: data.campaign_name,
      status: data.status,
      objective: data.objective,
      daily_budget: data.daily_budget,
      lifetime_budget: data.lifetime_budget,
      start_time: data.start_time,
      end_time: data.end_time,
      insights: data.insights,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  static async getUserCampaigns(userId: string): Promise<MetaCampaign[]> {
    const { data, error } = await supabase
      .from('meta_ad_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }

    return (data || []).map(row => ({
      campaign_id: row.campaign_id,
      campaign_name: row.campaign_name,
      status: row.status,
      objective: row.objective,
      daily_budget: row.daily_budget,
      lifetime_budget: row.lifetime_budget,
      start_time: row.start_time,
      end_time: row.end_time,
      insights: row.insights,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  static async updateCampaignStatus(
    accessToken: string,
    campaignId: string,
    status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  ): Promise<void> {
    try {
      const response = await fetch(
        `${META_API_BASE}/${campaignId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            access_token: accessToken
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Meta API error: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  static async createCampaign(
    accessToken: string,
    adAccountId: string,
    campaignData: {
      name: string;
      objective: string;
      status: string;
      daily_budget?: number;
      lifetime_budget?: number;
    }
  ): Promise<any> {
    try {
      const body: any = {
        name: campaignData.name,
        objective: campaignData.objective,
        status: campaignData.status,
        access_token: accessToken
      };

      if (campaignData.daily_budget) {
        body.daily_budget = campaignData.daily_budget;
      }
      if (campaignData.lifetime_budget) {
        body.lifetime_budget = campaignData.lifetime_budget;
      }

      const response = await fetch(
        `${META_API_BASE}/${adAccountId}/campaigns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create campaign');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
