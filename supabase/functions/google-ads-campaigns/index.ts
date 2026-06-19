import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import axios from 'npm:axios@1.12.2';
import { withInternalAccessHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';

async function getGoogleAdsAccessToken(): Promise<string> {
  const clientId = Deno.env.get('GOOGLE_ADS_CLIENT_ID')!;
  const clientSecret = Deno.env.get('GOOGLE_ADS_CLIENT_SECRET')!;
  const refreshToken = Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN')!;

  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  return tokenResponse.data.access_token;
}

Deno.serve(
  withInternalAccessHandler(async (req, _user, _whitelist) => {
    const url = new URL(req.url);
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
      return jsonResponse({ error: 'Missing customerId parameter' }, 400);
    }

    const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN')!;
    const accessToken = await getGoogleAdsAccessToken();
    const cleanCustomerId = customerId.replace(/-/g, '');

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE campaign.status != 'REMOVED'
        AND segments.date DURING LAST_30_DAYS
    `;

    const googleAdsResponse = await axios.post(
      `https://googleads.googleapis.com/v17/customers/${cleanCustomerId}/googleAds:search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
          'login-customer-id': Deno.env.get('GOOGLE_ADS_MCC_CUSTOMER_ID')!.replace(/-/g, ''),
        },
      },
    );

    const campaigns = googleAdsResponse.data.results || [];
    return jsonResponse({ campaigns });
  }, { methods: ['GET'] }),
);