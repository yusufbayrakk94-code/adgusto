import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler, requireInternalWhitelist } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';

Deno.serve(
  withSecureHandler(async (_req, user) => {
    const whitelistEntry = await requireInternalWhitelist(user);

    return jsonResponse({
      isWhitelisted: true,
      user: {
        email: user.email,
        fullName: whitelistEntry.full_name,
        role: whitelistEntry.role,
      },
    });
  }, { methods: ['GET'] }),
);
