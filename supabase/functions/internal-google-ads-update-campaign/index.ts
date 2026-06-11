import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import axios from 'npm:axios@1.12.2';
import { requireInternalRole, withInternalAccessHandler } from '../_shared/auth.ts';
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
  withInternalAccessHandler(async (req, _user, whitelist) => {
    requireInternalRole(whitelist, ['admin', 'manager']);

    const { customerId, campaignId, status } = await req.json();

    if (!customerId || !campaignId || !status) {
      return jsonResponse(
        { error: 'Missing required fields: customerId, campaignId, status' },
        400,
      );
    }

    const validStatuses = ['ENABLED', 'PAUSED'];
    if (!validStatuses.includes(status)) {
      return jsonResponse({ error: 'Invalid status. Must be ENABLED or PAUSED' }, 400);
    }

    const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN')!;
    const accessToken = await getGoogleAdsAccessToken();
    const cleanCustomerId = customerId.replace(/-/g, '');

    const mutation = {
      operations: [
        {
          update: {
            resourceName: `customers/${cleanCustomerId}/campaigns/${campaignId}`,
            status,
          },
          updateMask: 'status',
        },
      ],
    };

    await axios.post(
      `https://googleads.googleapis.com/v17/customers/${cleanCustomerId}/campaigns:mutate`,
      mutation,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
          'login-customer-id': Deno.env.get('GOOGLE_ADS_MCC_CUSTOMER_ID')!.replace(/-/g, ''),
        },
      },
    );

    return jsonResponse({
      success: true,
      message: `Campaign ${status === 'ENABLED' ? 'enabled' : 'paused'} successfully`,
    });
  }, { methods: ['POST'] }),
);
