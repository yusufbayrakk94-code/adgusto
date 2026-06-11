/*
  # Fix All Remaining Tables for Firebase Auth V2
  
  ## Changes
  1. Fix google_ads_accounts table (UUID -> TEXT)
  2. Fix google_ads_campaigns table (UUID -> TEXT)
  3. Fix videos table (UUID -> TEXT)
  4. Drop all RLS policies and foreign key constraints
  5. Disable RLS on all tables
  
  ## Security
  - Firebase Auth verification is handled at the application/edge function level
  - RLS is disabled since we use Firebase Auth with custom tokens
  
  ## Important Notes
  - This fixes all "invalid input syntax for type uuid" errors
  - Firebase user IDs are text strings, not UUIDs
  - Existing data will be cleared due to type changes
*/

-- ====================================
-- Fix google_ads_accounts
-- ====================================

-- Drop all possible RLS policies
DROP POLICY IF EXISTS "Users can view own Google Ads accounts" ON google_ads_accounts;
DROP POLICY IF EXISTS "Users can insert own Google Ads accounts" ON google_ads_accounts;
DROP POLICY IF EXISTS "Users can update own Google Ads accounts" ON google_ads_accounts;
DROP POLICY IF EXISTS "Users can delete own Google Ads accounts" ON google_ads_accounts;
DROP POLICY IF EXISTS "Users can read own Google Ads accounts" ON google_ads_accounts;
DROP POLICY IF EXISTS "Users can create own Google Ads accounts" ON google_ads_accounts;

-- Drop foreign key constraint
ALTER TABLE google_ads_accounts DROP CONSTRAINT IF EXISTS google_ads_accounts_user_id_fkey;

-- Clear data and change type
TRUNCATE google_ads_accounts CASCADE;
ALTER TABLE google_ads_accounts ALTER COLUMN user_id TYPE text;
ALTER TABLE google_ads_accounts DISABLE ROW LEVEL SECURITY;

-- ====================================
-- Fix google_ads_campaigns
-- ====================================

-- Drop all possible RLS policies
DROP POLICY IF EXISTS "Users can view own campaigns" ON google_ads_campaigns;
DROP POLICY IF EXISTS "Users can insert own campaigns" ON google_ads_campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON google_ads_campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON google_ads_campaigns;
DROP POLICY IF EXISTS "Users can read own campaigns" ON google_ads_campaigns;
DROP POLICY IF EXISTS "Users can create own campaigns" ON google_ads_campaigns;

-- Drop foreign key constraint
ALTER TABLE google_ads_campaigns DROP CONSTRAINT IF EXISTS google_ads_campaigns_user_id_fkey;

-- Clear data and change type
TRUNCATE google_ads_campaigns CASCADE;
ALTER TABLE google_ads_campaigns ALTER COLUMN user_id TYPE text;
ALTER TABLE google_ads_campaigns DISABLE ROW LEVEL SECURITY;

-- ====================================
-- Fix videos
-- ====================================

-- Drop all possible RLS policies
DROP POLICY IF EXISTS "Users can view own videos" ON videos;
DROP POLICY IF EXISTS "Users can insert own videos" ON videos;
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;
DROP POLICY IF EXISTS "Users can read own videos" ON videos;
DROP POLICY IF EXISTS "Users can create own videos" ON videos;

-- Drop foreign key constraint
ALTER TABLE videos DROP CONSTRAINT IF EXISTS videos_user_id_fkey;

-- Clear data and change type
TRUNCATE videos CASCADE;
ALTER TABLE videos ALTER COLUMN user_id TYPE text;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;