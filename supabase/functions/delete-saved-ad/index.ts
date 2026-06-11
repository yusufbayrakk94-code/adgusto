import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabase.ts';

Deno.serve(
  withSecureHandler(async (req, user) => {
    const { id } = await req.json();

    if (!id) {
      return jsonResponse({ success: false, error: 'Ad ID is required' }, 400);
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('saved_meta_ads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.uid);

    if (error) {
      throw error;
    }

    return jsonResponse({ success: true });
  }, { methods: ['DELETE'] }),
);
