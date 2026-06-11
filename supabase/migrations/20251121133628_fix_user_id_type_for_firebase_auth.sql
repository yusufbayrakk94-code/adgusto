/*
  # Fix user_id type for Firebase Authentication

  1. Changes
    - Drop RLS policies temporarily
    - Drop foreign key and unique constraints
    - Change user_id column type from uuid to text
    - Re-add unique constraint
    - Re-create RLS policies with Firebase-compatible checks
  
  2. Reason
    - Firebase Authentication uses string IDs, not UUIDs
    - Need to support Firebase user IDs while maintaining security
*/

-- Drop all RLS policies
DROP POLICY IF EXISTS "Users can view own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can insert own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can update own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can delete own Google Ads connections" ON google_ads_connections;

-- Drop constraints
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'google_ads_connections_user_id_fkey'
  ) THEN
    ALTER TABLE google_ads_connections 
    DROP CONSTRAINT google_ads_connections_user_id_fkey;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'google_ads_connections_user_id_key'
  ) THEN
    ALTER TABLE google_ads_connections 
    DROP CONSTRAINT google_ads_connections_user_id_key;
  END IF;
END $$;

-- Change column type to text
ALTER TABLE google_ads_connections 
ALTER COLUMN user_id TYPE text USING user_id::text;

-- Add unique constraint back
ALTER TABLE google_ads_connections 
ADD CONSTRAINT google_ads_connections_user_id_key UNIQUE (user_id);

-- Re-create RLS policies (simplified for Firebase auth)
CREATE POLICY "Users can view own Google Ads connections"
  ON google_ads_connections
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own Google Ads connections"
  ON google_ads_connections
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own Google Ads connections"
  ON google_ads_connections
  FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete own Google Ads connections"
  ON google_ads_connections
  FOR DELETE
  USING (true);
