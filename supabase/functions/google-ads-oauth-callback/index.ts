import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabase.ts';

Deno.serve(
  withSecureHandler(async (req, user) => {
    const clientId = Deno.env.get('GOOGLE_ADS_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_ADS_CLIENT_SECRET');
    const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');

    if (!clientId || !clientSecret || !developerToken) {
      console.error('[OAuth Callback] Missing Google Ads credentials');
      return jsonResponse({ error: 'Server configuration error' }, 500);
    }

    const { code, redirectUri, customerId } = await req.json();

    if (!code || !redirectUri) {
      return jsonResponse({ error: 'Missing code or redirectUri' }, 400);
    }

    console.log('[OAuth Callback] Exchanging authorization code for tokens...');

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('[OAuth Callback] Token exchange error:', errorData);
      return jsonResponse(
        { error: `Token exchange failed: ${errorData.error_description || errorData.error}` },
        400,
      );
    }

    const tokens = await tokenResponse.json();

    if (!tokens.refresh_token) {
      console.error('[OAuth Callback] No refresh token received');
      return jsonResponse(
        { error: 'No refresh token received. Please revoke app access and try again.' },
        400,
      );
    }

    const expiryDate = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    const accountInfo = {
      customer_id: customerId || '',
      account_name: '',
      currency_code: 'TRY',
      time_zone: 'Europe/Istanbul',
    };

    let customerIdToUse = customerId;

    if (!customerIdToUse) {
      try {
        const customersResponse = await fetch(
          'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'developer-token': developerToken,
            },
          },
        );

        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          if (customersData.resourceNames?.length > 0) {
            customerIdToUse = customersData.resourceNames[0].split('/')[1];
          }
        }
      } catch (error) {
        console.error('[OAuth Callback] Error listing customers:', error);
      }
    }

    if (!customerIdToUse) {
      return jsonResponse(
        {
          error: 'No customer ID found',
          details: 'Unable to fetch customer list. Please provide customer ID manually.',
          requiresManualInput: true,
        },
        404,
      );
    }

    accountInfo.customer_id = customerIdToUse;
    accountInfo.account_name = `Google Ads Account ${customerIdToUse}`;

    try {
      const query = `
        SELECT
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          customer.time_zone
        FROM customer
        WHERE customer.id = ${customerIdToUse}
      `;

      const detailsResponse = await fetch(
        `https://googleads.googleapis.com/v17/customers/${customerIdToUse}/googleAds:search`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            'developer-token': developerToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        },
      );

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        const customer = detailsData.results?.[0]?.customer;
        if (customer) {
          accountInfo.account_name = customer.descriptiveName || accountInfo.account_name;
          accountInfo.currency_code = customer.currencyCode || accountInfo.currency_code;
          accountInfo.time_zone = customer.timeZone || accountInfo.time_zone;
        }
      }
    } catch (error) {
      console.error('[OAuth Callback] Error fetching account details:', error);
    }

    console.log('[OAuth Callback] Saving connection to database...');

    const serviceRoleClient = createServiceRoleClient();
    const { error: dbError } = await serviceRoleClient
      .from('google_ads_connections')
      .upsert(
        {
          user_id: user.uid,
          customer_id: accountInfo.customer_id,
          account_name: accountInfo.account_name,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: expiryDate,
          currency_code: accountInfo.currency_code,
          time_zone: accountInfo.time_zone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

    if (dbError) {
      console.error('[OAuth Callback] Database error:', dbError);
      return jsonResponse({ error: `Database error: ${dbError.message}` }, 500);
    }

    console.log('[OAuth Callback] Connection saved successfully');

    return jsonResponse({
      success: true,
      accountInfo,
    });
  }, { methods: ['POST'] }),
);
