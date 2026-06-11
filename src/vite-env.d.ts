/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;

  readonly VITE_GROQ_API_KEY?: string;
  readonly VITE_HF_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_FAL_API_KEY?: string;

  readonly VITE_GOOGLE_ADS_DEVELOPER_TOKEN?: string;
  readonly VITE_GOOGLE_ADS_CLIENT_ID?: string;
  readonly VITE_GOOGLE_ADS_CLIENT_SECRET?: string;

  readonly VITE_LEMONSQUEEZY_STORE_ID?: string;
  readonly VITE_LEMONSQUEEZY_VARIANT_STARTER?: string;
  readonly VITE_LEMONSQUEEZY_VARIANT_PRO?: string;

  readonly VITE_META_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
