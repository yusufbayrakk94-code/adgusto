import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { requestId, model } = await req.json();

    if (!requestId || !model) {
      return new Response(
        JSON.stringify({ error: 'Missing requestId or model' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = Deno.env.get('FAL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'FAL_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check status
    const statusUrl = `https://queue.fal.run/${model}/requests/${requestId}/status`;
    const statusResponse = await fetch(statusUrl, {
      headers: {
        'Authorization': `Key ${apiKey}`,
      },
    });

    if (!statusResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to check status', status: statusResponse.status }),
        {
          status: statusResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const statusData = await statusResponse.json();

    // If completed, fetch the result
    if (statusData.status === 'COMPLETED') {
      const resultUrl = `https://queue.fal.run/${model}/requests/${requestId}`;
      const resultResponse = await fetch(resultUrl, {
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
      });

      if (resultResponse.ok) {
        const resultData = await resultResponse.json();
        return new Response(
          JSON.stringify({ 
            status: 'COMPLETED',
            videoUrl: resultData.video?.url || resultData.video,
            data: resultData 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Return current status
    return new Response(
      JSON.stringify({ 
        status: statusData.status,
        ...statusData 
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
