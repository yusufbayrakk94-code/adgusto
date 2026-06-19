import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabase.ts';

Deno.serve(
  withSecureHandler(async (req, user) => {
    const supabase = createServiceRoleClient();
    const { clientId, clientSecret, developerToken } = await req.json();

    if (!clientId || !clientSecret || !developerToken) {
      return jsonResponse({ error: 'Missing required parameters' }, 400);
    }

    const { data: connection, error: connectionError } = await supabase
      .from('google_ads_connections')
      .select('*')
      .eq('user_id', user.uid)
      .maybeSingle();

    if (connectionError || !connection) {
      return jsonResponse(
        { error: 'No Google Ads connection found', details: connectionError?.message },
        404,
      );
    }

    let accessToken = connection.access_token;
    const now = new Date();
    const expiry = new Date(connection.token_expiry);

    if (now >= expiry) {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: connection.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        return jsonResponse(
          { error: 'Failed to refresh access token', details: errorData },
          500,
        );
      }

      const tokens = await tokenResponse.json();
      accessToken = tokens.access_token;

      const newExpiry = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

      await supabase
        .from('google_ads_connections')
        .update({
          access_token: accessToken,
          token_expiry: newExpiry,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.uid);
    }

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
    `;

    const response = await fetch(
      `https://googleads.googleapis.com/v17/customers/${connection.customer_id}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'developer-token': developerToken,
          'Content-Type': 'application/json',
          'login-customer-id': connection.customer_id,
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Campaigns] Google Ads API error:', response.status, errorText);
      return jsonResponse(
        {
          error: 'Failed to fetch campaigns from Google Ads API',
          details: errorText,
          status: response.status,
        },
        response.status,
      );
    }

    const data = await response.json();
    const campaignMap = new Map<string, {
      id: string;
      name: string;
      status: string;
      budget: number;
      impressions: number;
      clicks: number;
      cost: number;
      conversions: number;
    }>();

    (data.results || []).forEach((result: {
      campaign: { id: string; name: string; status: string };
      campaignBudget?: { amountMicros?: string };
      metrics?: {
        impressions?: string;
        clicks?: string;
        costMicros?: string;
        conversions?: string;
      };
    }) => {
      const campaignId = result.campaign.id;

      if (!campaignMap.has(campaignId)) {
        campaignMap.set(campaignId, {
          id: campaignId,
          name: result.campaign.name,
          status: result.campaign.status,
          budget: result.campaignBudget?.amountMicros
            ? Number(result.campaignBudget.amountMicros) / 1_000_000
            : 0,
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0,
        });
      }

      const campaign = campaignMap.get(campaignId)!;
      campaign.impressions += parseInt(result.metrics?.impressions || '0', 10);
      campaign.clicks += parseInt(result.metrics?.clicks || '0', 10);
      campaign.cost += parseInt(result.metrics?.costMicros || '0', 10) / 1_000_000;
      campaign.conversions += parseFloat(result.metrics?.conversions || '0');
    });

    return jsonResponse({ campaigns: Array.from(campaignMap.values()) });
  }, { methods: ['POST'] }),
);
