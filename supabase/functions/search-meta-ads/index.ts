import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';

const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN');
const APIFY_ACTOR_ID = Deno.env.get('APIFY_ACTOR_ID') ?? 'jj5sAMeSoXotatkss';

interface SearchRequest {
  searchTerm: string;
  language?: string;
  country?: string;
}

Deno.serve(
  withSecureHandler(async (req, _user) => {
    if (!APIFY_API_TOKEN) {
      return jsonResponse({ success: false, error: 'APIFY_API_TOKEN not configured' }, 500);
    }

    const { searchTerm, country = 'TR' }: SearchRequest = await req.json();

    if (!searchTerm?.trim()) {
      return jsonResponse({ success: false, error: 'Search term is required' }, 400);
    }

    const targetCountry = country.toUpperCase();
    const adLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${targetCountry}&q=${encodeURIComponent(searchTerm.trim())}&search_type=keyword_unordered`;

    const apifyInput = {
      adLibraryUrl,
      maxResults: 10,
    };

    const apifyUrl = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`;

    const apifyResponse = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apifyInput),
      signal: AbortSignal.timeout(120000),
    });

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      throw new Error(`Apify API error: ${apifyResponse.status} - ${errorText}`);
    }

    const ads = await apifyResponse.json();

    return jsonResponse({
      success: true,
      data: ads,
      count: Array.isArray(ads) ? ads.length : 0,
    });
  }, { methods: ['POST'] }),
);
