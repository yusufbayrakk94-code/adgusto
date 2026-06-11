import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VideoRequest {
  prompt: string;
  duration: number;
  provider: 'minimax' | 'runway' | 'luma';
}

const AI_PROVIDERS = {
  'minimax': { name: 'Minimax', model: 'fal-ai/minimax-video' },
  'runway': { name: 'Runway Gen3', model: 'fal-ai/runway-gen3/turbo' },
  'luma': { name: 'Luma Dream Machine', model: 'fal-ai/luma-dream-machine' },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Request received:', req.method, req.url);
    
    const { prompt, duration, provider }: VideoRequest = await req.json();
    console.log('Parsed body:', { prompt: prompt?.substring(0, 50), duration, provider });

    if (!prompt || !duration || !provider) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = Deno.env.get('FAL_API_KEY');
    if (!apiKey) {
      console.error('FAL_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'FAL_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const providerInfo = AI_PROVIDERS[provider];
    let requestBody: any = { prompt };

    if (provider === 'minimax') {
      requestBody.duration = duration;
    } else if (provider === 'runway') {
      requestBody.duration = Math.min(duration, 10);
      requestBody.aspect_ratio = '16:9';
    } else if (provider === 'luma') {
      requestBody.aspect_ratio = '16:9';
      requestBody.loop = false;
    }

    console.log('Submitting video request:', { provider, model: providerInfo.model });

    const submitResponse = await fetch(`https://queue.fal.run/${providerInfo.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Submission error:', submitResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Video request failed',
          details: errorText,
          status: submitResponse.status 
        }),
        {
          status: submitResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const submitData = await submitResponse.json();
    const requestId = submitData.request_id;
    console.log('Video request submitted successfully:', requestId);

    return new Response(
      JSON.stringify({ 
        requestId,
        model: providerInfo.model,
        status: 'SUBMITTED',
        message: 'Video generation started. Use the request ID to check status.'
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
