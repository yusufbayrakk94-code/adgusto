/*
  # Fix RLS Policies and User ID Types

  ## Changes
  1. Drop all insecure RLS policies from brand_colors and google_ads_connections
  2. Change user_id column type from text to uuid in both tables
  3. Add proper RLS policies with auth.uid() checks for both tables
  4. Ensure all policies are restrictive and secure

  ## Security
  - All policies now check auth.uid() = user_id
  - Users can only access their own data
  - Policies are separated by operation (SELECT, INSERT, UPDATE, DELETE)
  - Policies require authentication

  ## Important Notes
  - This will clear existing data in brand_colors and google_ads_connections
  - Users will need to reconnect their Google Ads accounts
  - Users will need to recreate their brand color palettes
*/

-- Drop all existing policies for brand_colors
DROP POLICY IF EXISTS "Enable all operations for brand_colors" ON brand_colors;
DROP POLICY IF EXISTS "Users can delete brand colors" ON brand_colors;
DROP POLICY IF EXISTS "Users can insert brand colors" ON brand_colors;
DROP POLICY IF EXISTS "Users can update brand colors" ON brand_colors;
DROP POLICY IF EXISTS "Users can view brand colors" ON brand_colors;

-- Drop all existing policies for google_ads_connections
DROP POLICY IF EXISTS "Users can delete own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can insert own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can update own Google Ads connections" ON google_ads_connections;
DROP POLICY IF EXISTS "Users can view own Google Ads connections" ON google_ads_connections;

-- Clear existing data (required for type change)
TRUNCATE brand_colors CASCADE;
TRUNCATE google_ads_connections CASCADE;

-- Change user_id type to uuid in brand_colors
ALTER TABLE brand_colors 
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Change user_id type to uuid in google_ads_connections
ALTER TABLE google_ads_connections 
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Add foreign key constraints to auth.users
ALTER TABLE brand_colors
  DROP CONSTRAINT IF EXISTS brand_colors_user_id_fkey;

ALTER TABLE brand_colors
  ADD CONSTRAINT brand_colors_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE google_ads_connections
  DROP CONSTRAINT IF EXISTS google_ads_connections_user_id_fkey;

ALTER TABLE google_ads_connections
  ADD CONSTRAINT google_ads_connections_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Create secure RLS policies for brand_colors
CREATE POLICY "Users can view own brand colors"
  ON brand_colors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand colors"
  ON brand_colors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand colors"
  ON brand_colors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand colors"
  ON brand_colors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create secure RLS policies for google_ads_connections
CREATE POLICY "Users can view own Google Ads connections"
  ON google_ads_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google Ads connections"
  ON google_ads_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google Ads connections"
  ON google_ads_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Google Ads connections"
  ON google_ads_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
