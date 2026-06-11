import { auth } from '../config/firebase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface InternalAccessCheck {
  isWhitelisted: boolean;
  user?: {
    email: string;
    fullName: string;
    role: 'admin' | 'manager' | 'viewer';
  };
  error?: string;
}

export interface GoogleAdsAccount {
  customerId: string;
  name: string;
  currency: string;
  timezone: string;
  isManager: boolean;
  status: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionsValue: number;
  ctr: number;
  averageCpc: number;
  cpa: number;
  roas: number;
}

export interface GoogleAdsCampaign {
  campaignId: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  channelType: string;
  budget: number;
  metrics: CampaignMetrics;
}

async function getAuthHeader(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const idToken = await user.getIdToken();
  return `Bearer ${idToken}`;
}

export async function checkInternalAccess(): Promise<InternalAccessCheck> {
  try {
    console.log('Checking internal access...');
    console.log('SUPABASE_URL:', SUPABASE_URL);

    const authHeader = await getAuthHeader();
    const apiUrl = `${SUPABASE_URL}/functions/v1/check-internal-access`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('Access check failed:', data);
      return {
        isWhitelisted: false,
        error: data.error || 'Access check failed',
      };
    }

    return data;
  } catch (error) {
    console.error('Error checking internal access:', error);
    return {
      isWhitelisted: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchGoogleAdsAccounts(): Promise<GoogleAdsAccount[]> {
  try {
    const authHeader = await getAuthHeader();
    const apiUrl = `${SUPABASE_URL}/functions/v1/internal-google-ads-accounts`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch accounts');
    }

    const data = await response.json();
    return data.accounts || [];
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    throw error;
  }
}

export async function fetchGoogleAdsCampaigns(customerId: string): Promise<GoogleAdsCampaign[]> {
  try {
    const authHeader = await getAuthHeader();
    const apiUrl = `${SUPABASE_URL}/functions/v1/internal-google-ads-campaigns?customerId=${customerId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch campaigns');
    }

    const data = await response.json();
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

export async function updateCampaignStatus(
  customerId: string,
  campaignId: string,
  status: 'ENABLED' | 'PAUSED'
): Promise<void> {
  try {
    const authHeader = await getAuthHeader();
    const apiUrl = `${SUPABASE_URL}/functions/v1/internal-google-ads-update-campaign`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        campaignId,
        status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update campaign');
    }
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
}

export const internalGoogleAdsService = {
  checkInternalAccess,
  fetchGoogleAdsAccounts,
  fetchGoogleAdsCampaigns,
  updateCampaignStatus,
};
