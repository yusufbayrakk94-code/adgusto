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
  withInternalAccessHandler(async (_req, _user, _whitelist) => {
    const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');
    const mccCustomerId = Deno.env.get('GOOGLE_ADS_MCC_CUSTOMER_ID');

    if (!developerToken || !mccCustomerId) {
      return jsonResponse({ error: 'Google Ads API credentials not configured' }, 500);
    }

    const accessToken = await getGoogleAdsAccessToken();

    const query = `
      SELECT
        customer_client.id,
        customer_client.descriptive_name,
        customer_client.currency_code,
        customer_client.time_zone,
        customer_client.manager,
        customer_client.status
      FROM customer_client
      WHERE customer_client.status = 'ENABLED'
    `;

    const googleAdsResponse = await axios.post(
      `https://googleads.googleapis.com/v17/customers/${mccCustomerId}/googleAds:search`,
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
        },
      },
    );

    const accounts = googleAdsResponse.data.results?.map((result: {
      customerClient: {
        id: string;
        descriptiveName: string;
        currencyCode: string;
        timeZone: string;
        manager: boolean;
        status: string;
      };
    }) => ({
      customerId: result.customerClient.id,
      name: result.customerClient.descriptiveName,
      currency: result.customerClient.currencyCode,
      timezone: result.customerClient.timeZone,
      isManager: result.customerClient.manager,
      status: result.customerClient.status,
    })) || [];

    return jsonResponse({ accounts });
  }, { methods: ['GET'] }),
);
