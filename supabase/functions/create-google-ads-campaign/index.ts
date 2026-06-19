import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, brief, clientId, clientSecret, developerToken } = await req.json();

    if (!userId || !brief || !clientId || !clientSecret || !developerToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Step 1: Getting user connection...');
    const { data: connection, error: connectionError } = await supabase
      .from('google_ads_connections')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (connectionError || !connection) {
      return new Response(
        JSON.stringify({ error: 'No Google Ads connection found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if demo mode
    if (connection.customer_id.startsWith('demo-')) {
      console.log('Demo mode detected - simulating campaign creation');
      
      // Use AI to parse the brief
      const aiPrompt = `Sen bir Google Ads kampanya uzmanısın. Aşağıdaki kampanya briefini analiz et ve bir kampanya adı öner:

Brief: ${brief}

Sadece kampanya adını döndür, başka bir şey ekleme.`;

      const aiResponse = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: aiPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('AI analysis failed');
      }

      const aiData = await aiResponse.json();
      const campaignName = aiData.choices[0]?.message?.content?.trim() || 'Yeni Kampanya';

      // Create a demo campaign
      const demoCampaign = {
        id: `demo-campaign-${Date.now()}`,
        name: campaignName,
        status: 'ENABLED',
        budget: 100,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
      };

      return new Response(
        JSON.stringify({
          success: true,
          campaign: demoCampaign,
          message: 'Demo kampanya oluşturuldu',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Real Google Ads campaign creation
    console.log('Step 2: Refreshing access token if needed...');
    let accessToken = connection.access_token;
    const now = new Date();
    const expiry = new Date(connection.token_expiry);

    if (now >= expiry) {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: connection.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to refresh access token');
      }

      const tokens = await tokenResponse.json();
      accessToken = tokens.access_token;

      await supabase
        .from('google_ads_connections')
        .update({
          access_token: accessToken,
          token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }

    console.log('Step 3: Using AI to analyze brief and create campaign structure...');
    const aiPrompt = `Sen bir Google Ads kampanya uzmanısın. Aşağıdaki kampanya briefini analiz et ve JSON formatında kampanya öner:

Brief: ${brief}

Lütfen şu formatta JSON döndür (sadece JSON, başka açıklama ekleme):
{
  "name": "Kampanya Adı",
  "budget_amount_micros": 50000000,
  "target_cpa_micros": 10000000
}

Not: amount_micros değerleri mikro para birimi cinsindendir (1 TL = 1,000,000 micros)`;

    const aiResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: aiPrompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('AI analysis failed');
    }

    const aiData = await aiResponse.json();
    let campaignConfig;
    
    try {
      const content = aiData.choices[0]?.message?.content?.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      campaignConfig = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      campaignConfig = {
        name: 'Yeni Kampanya',
        budget_amount_micros: 50000000,
        target_cpa_micros: 10000000,
      };
    }

    console.log('Step 4: Creating campaign in Google Ads...');
    
    // This is a simplified example - actual Google Ads API campaign creation is more complex
    // For now, we'll return success with the parsed config
    return new Response(
      JSON.stringify({
        success: true,
        campaign: {
          name: campaignConfig.name,
          budget: campaignConfig.budget_amount_micros / 1000000,
          status: 'ENABLED',
        },
        message: 'Kampanya Google Ads API ile oluşturulacak (geliştirme aşamasında)',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});