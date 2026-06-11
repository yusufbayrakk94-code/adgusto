import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const falApiKey = Deno.env.get('FAL_API_KEY');
    
    console.log('FAL_API_KEY exists:', !!falApiKey);
    console.log('FAL_API_KEY length:', falApiKey?.length || 0);
    
    if (!falApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'FAL_API_KEY not found in environment',
          env_vars: Object.keys(Deno.env.toObject())
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, duration, provider } = await req.json();
    
    console.log('Request received:', { prompt, duration, provider });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test successful',
        hasKey: true,
        prompt,
        duration,
        provider
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
