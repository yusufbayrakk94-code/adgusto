export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

export function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = corsHeaders,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

export function optionsResponse(headers: Record<string, string> = corsHeaders): Response {
  return new Response(null, { status: 204, headers });
}
