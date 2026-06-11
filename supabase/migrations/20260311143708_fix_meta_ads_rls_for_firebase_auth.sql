/*
  # Fix Meta Ads RLS for Firebase Authentication

  1. Changes
    - Remove RLS from meta_ads_connections table (Firebase Auth doesn't work with Supabase RLS)
    - Remove RLS from meta_ad_campaigns table (Firebase Auth doesn't work with Supabase RLS)
    - Application-level security will be enforced through user_id checks in the service layer
  
  2. Security Notes
    - RLS is disabled because this app uses Firebase Auth, not Supabase Auth
    - Security is maintained at application level through user_id validation
    - All queries filter by user_id to ensure data isolation
*/

-- Disable RLS on meta_ads_connections
ALTER TABLE meta_ads_connections DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies on meta_ads_connections
DROP POLICY IF EXISTS "Users can view own Meta Ads connections" ON meta_ads_connections;
DROP POLICY IF EXISTS "Users can insert own Meta Ads connections" ON meta_ads_connections;
DROP POLICY IF EXISTS "Users can update own Meta Ads connections" ON meta_ads_connections;
DROP POLICY IF EXISTS "Users can delete own Meta Ads connections" ON meta_ads_connections;

-- Disable RLS on meta_ad_campaigns
ALTER TABLE meta_ad_campaigns DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies on meta_ad_campaigns
DROP POLICY IF EXISTS "Users can view own Meta Ad campaigns" ON meta_ad_campaigns;
DROP POLICY IF EXISTS "Users can insert own Meta Ad campaigns" ON meta_ad_campaigns;
DROP POLICY IF EXISTS "Users can update own Meta Ad campaigns" ON meta_ad_campaigns;
DROP POLICY IF EXISTS "Users can delete own Meta Ad campaigns" ON meta_ad_campaigns;
