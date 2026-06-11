import { getFirebaseAuth } from './firebase-admin.ts';
import { corsHeaders, jsonResponse, optionsResponse } from './cors.ts';
import { createServiceRoleClient } from './supabase.ts';

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
}

export interface WhitelistEntry {
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status = 401,
    public body: Record<string, unknown> = { error: message },
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function extractBearerToken(req: Request): string {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Missing or invalid Authorization header');
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    throw new AuthError('Missing bearer token');
  }

  return token;
}

export async function verifyFirebaseIdToken(req: Request): Promise<AuthenticatedUser> {
  const token = extractBearerToken(req);

  try {
    const decoded = await getFirebaseAuth().verifyIdToken(token);

    return {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified ?? false,
    };
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    throw new AuthError('Invalid or expired token');
  }
}

export async function requireInternalWhitelist(user: AuthenticatedUser): Promise<WhitelistEntry> {
  if (!user.email) {
    throw new AuthError('Email claim missing on token', 403);
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('internal_whitelist')
    .select('email, full_name, role, is_active')
    .eq('email', user.email)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new AuthError(
      'Access denied. You are not whitelisted for internal tools.',
      403,
      { error: 'Access denied. You are not whitelisted for internal tools.', isWhitelisted: false },
    );
  }

  return data;
}

export function requireInternalRole(entry: WhitelistEntry, allowedRoles: string[]): void {
  if (!allowedRoles.includes(entry.role)) {
    throw new AuthError(
      `Insufficient permissions. Role '${entry.role}' is not allowed.`,
      403,
    );
  }
}

export type SecureHandler = (req: Request, user: AuthenticatedUser) => Promise<Response>;
export type InternalAccessHandler = (
  req: Request,
  user: AuthenticatedUser,
  whitelist: WhitelistEntry,
) => Promise<Response>;

export interface SecureHandlerOptions {
  methods?: string[];
  cors?: Record<string, string>;
}

function handleAuthError(error: unknown, cors: Record<string, string>): Response {
  if (error instanceof AuthError) {
    return jsonResponse(error.body, error.status, cors);
  }

  console.error('Unhandled secure handler error:', error);
  return jsonResponse(
    { error: error instanceof Error ? error.message : 'Internal server error' },
    500,
    cors,
  );
}

export function withSecureHandler(
  handler: SecureHandler,
  options: SecureHandlerOptions = {},
): (req: Request) => Promise<Response> {
  const cors = options.cors ?? corsHeaders;
  const methods = options.methods;

  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') {
      return optionsResponse(cors);
    }

    if (methods && !methods.includes(req.method)) {
      return jsonResponse({ error: 'Method not allowed' }, 405, cors);
    }

    try {
      const user = await verifyFirebaseIdToken(req);
      return await handler(req, user);
    } catch (error) {
      return handleAuthError(error, cors);
    }
  };
}

export function withInternalAccessHandler(
  handler: InternalAccessHandler,
  options: SecureHandlerOptions = {},
): (req: Request) => Promise<Response> {
  return withSecureHandler(async (req, user) => {
    const whitelist = await requireInternalWhitelist(user);
    return handler(req, user, whitelist);
  }, options);
}
