import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';

Deno.serve(
  withSecureHandler(async (req, _user) => {
    const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN');
    if (!developerToken) {
      console.error('[Account Info] Missing developer token in environment');
      return jsonResponse({ error: 'Server configuration error' }, 500);
    }

    const { accessToken, customerId } = await req.json();

    if (!accessToken) {
      return jsonResponse({ error: 'Missing accessToken' }, 400);
    }

    let customerIdToUse = customerId;

    if (!customerIdToUse) {
      console.log('[Account Info] No customer ID provided, trying to list accessible customers...');

      try {
        const customersResponse = await fetch(
          'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'developer-token': developerToken,
            },
          },
        );

        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          if (customersData.resourceNames?.length > 0) {
            customerIdToUse = customersData.resourceNames[0].split('/')[1];
          }
        } else {
          const errorText = await customersResponse.text();
          console.error('[Account Info] Failed to list customers:', customersResponse.status, errorText);
        }
      } catch (error) {
        console.error('[Account Info] Error listing customers:', error);
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

    const query = `
      SELECT
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone,
        customer.manager
      FROM customer
      WHERE customer.id = ${customerIdToUse}
    `;

    const detailsResponse = await fetch(
      `https://googleads.googleapis.com/v17/customers/${customerIdToUse}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error('[Account Info] Customer details error:', detailsResponse.status, errorText);

      return jsonResponse({
        customer_id: customerIdToUse,
        account_name: `Google Ads Account ${customerIdToUse}`,
        currency_code: 'TRY',
        time_zone: 'Europe/Istanbul',
      });
    }

    const detailsData = await detailsResponse.json();
    const customer = detailsData.results?.[0]?.customer;

    return jsonResponse({
      customer_id: customerIdToUse,
      account_name: customer?.descriptiveName || `Google Ads Account ${customerIdToUse}`,
      currency_code: customer?.currencyCode || 'TRY',
      time_zone: customer?.timeZone || 'Europe/Istanbul',
    });
  }, { methods: ['POST'] }),
);
