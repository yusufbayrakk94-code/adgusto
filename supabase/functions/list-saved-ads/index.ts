import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabase.ts';

Deno.serve(
  withSecureHandler(async (_req, user) => {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('saved_meta_ads')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return jsonResponse({
      success: true,
      data: data || [],
    });
  }, { methods: ['GET'] }),
);
