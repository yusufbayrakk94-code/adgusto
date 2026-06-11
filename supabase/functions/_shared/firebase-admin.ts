import { cert, getApps, initializeApp, type App } from 'https://esm.sh/firebase-admin@11.8.0/app';
import { getAuth, type Auth } from 'https://esm.sh/firebase-admin@11.8.0/auth';

let adminApp: App | null = null;

export function getFirebaseAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  if (adminApp) {
    return adminApp;
  }

  const projectId = Deno.env.get('FIREBASE_ADMIN_PROJECT_ID');
  const privateKey = Deno.env.get('FIREBASE_ADMIN_PRIVATE_KEY')?.replace(/\\n/g, '\n');
  const clientEmail = Deno.env.get('FIREBASE_ADMIN_CLIENT_EMAIL');

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Missing Firebase Admin configuration (FIREBASE_ADMIN_* env vars)');
  }

  adminApp = initializeApp({
    credential: cert({ projectId, privateKey, clientEmail }),
  });

  return adminApp;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}
