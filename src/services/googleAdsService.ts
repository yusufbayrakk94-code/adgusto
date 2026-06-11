import { supabase, supabaseUrl } from '../config/supabase';
import { auth } from '../config/firebase';

const GOOGLE_ADS_CLIENT_ID = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;
const GOOGLE_ADS_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_ADS_CLIENT_SECRET;
const GOOGLE_ADS_DEVELOPER_TOKEN = import.meta.env.VITE_GOOGLE_ADS_DEVELOPER_TOKEN;
const REDIRECT_URI = `${window.location.origin}/google-ads-callback`;

if (!GOOGLE_ADS_CLIENT_ID) {
  throw new Error('Missing Google Ads Client ID');
}

export interface GoogleAdsAccount {
  id: string;
  user_id: string;
  customer_id: string;
  account_name: string;
  access_token: string;
  refresh_token: string;
  token_expiry: string;
  currency_code?: string;
  time_zone?: string;
  created_at: string;
  updated_at: string;
}

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  impressions?: number;
  clicks?: number;
  cost?: number;
  conversions?: number;
}

async function getFirebaseIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Failed to authenticate. Please try logging in again.');
  }

  return user.getIdToken();
}

export class GoogleAdsService {
  static initiateOAuth(userId: string): void {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_ADS_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', userId);

    console.log('[OAuth] Initiating OAuth flow for user:', userId);
    console.log('[OAuth] Redirect URI:', REDIRECT_URI);
    console.log('[OAuth] Authorization URL:', authUrl.toString());
    window.location.href = authUrl.toString();
  }

  static async handleOAuthCallback(code: string, userId: string, customerId?: string): Promise<void> {
    try {
      console.log('[OAuth] Exchanging authorization code and saving connection...');

      const firebaseToken = await getFirebaseIdToken();
      const apiUrl = `${supabaseUrl}/functions/v1/google-ads-oauth-callback`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUri: REDIRECT_URI,
          customerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[OAuth] Callback error:', errorData);
        throw new Error(errorData.error || 'OAuth callback failed');
      }

      const result = await response.json();
      console.log('[OAuth] Connection saved successfully:', result);
    } catch (error) {
      console.error('[OAuth] Error handling OAuth callback:', error);
      throw error;
    }
  }

  static async fetchAccountInfo(accessToken: string, customerId?: string): Promise<{
    customer_id: string;
    account_name: string;
    currency_code: string;
    time_zone: string;
  }> {
    const apiUrl = `${supabaseUrl}/functions/v1/google-ads-account-info`;

    console.log('[API] Calling account info edge function...');
    if (customerId) {
      console.log('[API] Using manual customer ID:', customerId);
    }

    const firebaseToken = await getFirebaseIdToken();
    console.log('[API] Firebase token acquired');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
        customerId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Edge function error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      let errorMessage = 'Failed to fetch account info from Google Ads API';
      let requiresManualInput = false;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
        requiresManualInput = errorJson.requiresManualInput || false;

        if (errorJson.details) {
          console.error('[API] Error details:', errorJson.details);
          errorMessage += `: ${errorJson.details}`;
        }
      } catch (e) {
        errorMessage += `: ${errorText}`;
      }

      const error: any = new Error(errorMessage);
      error.requiresManualInput = requiresManualInput;
      throw error;
    }

    const data = await response.json();
    console.log('[API] Account info received successfully:', data);
    return data;
  }

  static async getConnection(userId: string): Promise<GoogleAdsAccount | null> {
    try {
      const { data, error } = await supabase
        .from('google_ads_connections')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting connection:', error);
      return null;
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_ADS_CLIENT_ID,
          client_secret: GOOGLE_ADS_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const tokens = await response.json();
      return tokens.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  static async getValidAccessToken(userId: string): Promise<string | null> {
    try {
      const connection = await this.getConnection(userId);
      if (!connection) return null;

      const now = new Date();
      const expiry = new Date(connection.token_expiry);

      if (now >= expiry) {
        const newAccessToken = await this.refreshAccessToken(connection.refresh_token);
        const newExpiry = new Date(Date.now() + 3600 * 1000).toISOString();

        await supabase
          .from('google_ads_connections')
          .update({
            access_token: newAccessToken,
            token_expiry: newExpiry,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        return newAccessToken;
      }

      return connection.access_token;
    } catch (error) {
      console.error('Error getting valid access token:', error);
      return null;
    }
  }

  static async fetchCampaigns(userId: string): Promise<GoogleAdsCampaign[]> {
    const connection = await this.getConnection(userId);

    if (!connection) {
      throw new Error('No Google Ads connection found');
    }

    if (connection.customer_id.startsWith('demo-') || connection.customer_id.startsWith('test-')) {
      console.log('[Campaigns] Using demo/test data for:', connection.customer_id);
      return this.generateDemoCampaigns();
    }

    const apiUrl = `${supabaseUrl}/functions/v1/google-ads-campaigns`;

    console.log('[Campaigns] Fetching campaigns for user:', userId);

    const firebaseToken = await getFirebaseIdToken();
    console.log('[Campaigns] Firebase token acquired');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: GOOGLE_ADS_CLIENT_ID,
        clientSecret: GOOGLE_ADS_CLIENT_SECRET,
        developerToken: GOOGLE_ADS_DEVELOPER_TOKEN,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Campaigns] API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      let errorMessage = 'Failed to fetch campaigns from Google Ads API';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
        if (errorJson.details) {
          console.error('[Campaigns] Error details:', errorJson.details);
          errorMessage += `: ${errorJson.details}`;
        }
      } catch (e) {
        errorMessage += `: ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('[Campaigns] Campaigns received:', data.campaigns?.length || 0, 'campaigns');
    return data.campaigns || [];
  }

  private static generateDemoCampaigns(): GoogleAdsCampaign[] {
    return [
      {
        id: '1',
        name: 'Marka Bilinirliği Kampanyası',
        status: 'ENABLED',
        budget: 1500,
        impressions: 125000,
        clicks: 3750,
        cost: 1275.50,
        conversions: 112,
      },
      {
        id: '2',
        name: 'Ürün Lansmanı - Yaz Koleksiyonu',
        status: 'ENABLED',
        budget: 2000,
        impressions: 98000,
        clicks: 4200,
        cost: 1850.75,
        conversions: 185,
      },
      {
        id: '3',
        name: 'Remarketing - Sepet Terk Eden',
        status: 'ENABLED',
        budget: 800,
        impressions: 45000,
        clicks: 2100,
        cost: 650.25,
        conversions: 95,
      },
      {
        id: '4',
        name: 'Rakip Marka Hedefleme',
        status: 'PAUSED',
        budget: 1200,
        impressions: 35000,
        clicks: 980,
        cost: 425.00,
        conversions: 28,
      },
      {
        id: '5',
        name: 'Coğrafi Hedefleme - İstanbul',
        status: 'ENABLED',
        budget: 1000,
        impressions: 67000,
        clicks: 2800,
        cost: 890.50,
        conversions: 78,
      },
    ];
  }

  static async disconnectAccount(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('google_ads_connections')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error disconnecting account:', error);
      throw error;
    }
  }

  static async saveManualConnection(userId: string, customerId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('google_ads_connections')
        .upsert({
          user_id: userId,
          customer_id: customerId,
          account_name: `Google Ads Account ${customerId}`,
          access_token: 'manual',
          refresh_token: 'manual',
          token_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving manual connection:', error);
      throw error;
    }
  }

  static async createCampaignFromBrief(userId: string, brief: string): Promise<{ success: boolean; message?: string; campaign?: any }> {
    try {
      const apiUrl = `${supabaseUrl}/functions/v1/create-google-ads-campaign`;

      console.log('[Campaign Creation] Creating campaign from brief for user:', userId);

      const firebaseToken = await getFirebaseIdToken();
      console.log('[Campaign Creation] Firebase token acquired');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          brief,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Campaign Creation] API error:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          return {
            success: false,
            message: errorData.error || 'Kampanya oluşturulamadı',
          };
        } catch (e) {
          return {
            success: false,
            message: 'Kampanya oluşturulamadı: ' + errorText,
          };
        }
      }

      const data = await response.json();
      console.log('[Campaign Creation] Campaign created successfully:', data);
      return {
        success: true,
        campaign: data.campaign,
      };
    } catch (error) {
      console.error('[Campaign Creation] Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bir hata oluştu',
      };
    }
  }
}
