/*
  # Create Meta Ads Connections Table

  1. New Tables
    - `meta_ads_connections`
      - `id` (uuid, primary key)
      - `user_id` (text, references Firebase Auth user)
      - `access_token` (text, encrypted Meta access token)
      - `ad_account_id` (text, Meta Ad Account ID)
      - `business_id` (text, Meta Business ID)
      - `page_id` (text, Meta Page ID)
      - `permissions` (jsonb, stores granted permissions)
      - `token_expires_at` (timestamptz, token expiration)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `meta_ads_connections` table
    - Add policies for authenticated users to manage their own connections
  
  3. Important Notes
    - user_id is text type to support Firebase Auth UIDs
    - access_token should be encrypted at application level before storage
    - permissions stored as JSONB for flexibility
*/

CREATE TABLE IF NOT EXISTS meta_ads_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  access_token text NOT NULL,
  ad_account_id text,
  business_id text,
  page_id text,
  permissions jsonb DEFAULT '[]'::jsonb,
  token_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_meta_ads_connections_user_id ON meta_ads_connections(user_id);

-- Enable RLS
ALTER TABLE meta_ads_connections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own Meta Ads connections
CREATE POLICY "Users can view own Meta Ads connections"
  ON meta_ads_connections
  FOR SELECT
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can insert their own Meta Ads connections
CREATE POLICY "Users can insert own Meta Ads connections"
  ON meta_ads_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can update their own Meta Ads connections
CREATE POLICY "Users can update own Meta Ads connections"
  ON meta_ads_connections
  FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can delete their own Meta Ads connections
CREATE POLICY "Users can delete own Meta Ads connections"
  ON meta_ads_connections
  FOR DELETE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_meta_ads_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meta_ads_connections_updated_at
  BEFORE UPDATE ON meta_ads_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_meta_ads_connections_updated_at();
