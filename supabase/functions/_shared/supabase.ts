import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.57.2';

export function createServiceRoleClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase service role configuration');
  }

  return createClient(supabaseUrl, supabaseKey);
}
