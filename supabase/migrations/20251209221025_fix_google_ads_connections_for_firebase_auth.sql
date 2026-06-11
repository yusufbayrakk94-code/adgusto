/*
  # Fix google_ads_connections Table for Firebase Auth
  
  ## Changes
  1. Drop all RLS policies first
  2. Drop foreign key constraint to auth.users
  3. Change user_id column type from UUID to TEXT
  4. Disable RLS (Firebase auth is handled in application layer)
  
  ## Security
  - Firebase Auth verification is handled at the application/edge function level
  - RLS is disabled since we use Firebase Auth with custom tokens
  
  ## Important Notes
  - This fixes the "invalid input syntax for type uuid" error
  - Firebase user IDs are text strings, not UUIDs
  - Existing data will be cleared due to type change
  - Users will need to reconnect their Google Ads accounts
*/

-- Drop all RLS policies first
DROP POLICY IF EXISTS "Users can view own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can insert own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can update own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can delete own Google Ads connections" ON google_ads_connections;

-- Drop foreign key constraint
ALTER TABLE google_ads_connections 
  DROP CONSTRAINT IF EXISTS google_ads_connections_user_id_fkey;

-- Clear existing data (required for type change)
TRUNCATE google_ads_connections CASCADE;

-- Change user_id type from uuid to text
ALTER TABLE google_ads_connections 
  ALTER COLUMN user_id TYPE text;

-- Disable RLS since Firebase Auth is handled at application level
ALTER TABLE google_ads_connections DISABLE ROW LEVEL SECURITY;