/*
  # Fix Critical Security Issue in Meta Ads Connections RLS

  1. Security Changes
    - DROP existing insecure RLS policies on meta_ads_connections that use USING (true)
    - CREATE proper restrictive policies that enforce user isolation
    - Ensure ONLY the authenticated user can access their own data
  
  2. Important Notes
    - Previous policies allowed ANY authenticated user to access ALL data
    - New policies properly restrict access using user_id comparison
    - Uses Firebase Auth user ID from JWT claims for validation
*/

-- Drop all existing insecure policies on meta_ads_connections
DROP POLICY IF EXISTS "Users can view own Meta Ads connections" ON meta_ads_connections;
DROP POLICY IF EXISTS "Users can insert own Meta Ads connections" ON meta_ads_connections;
DROP POLICY IF EXISTS "Users can update own Meta Ads connections" ON meta_ads_connections;
DROP POLICY IF EXISTS "Users can delete own Meta Ads connections" ON meta_ads_connections;

-- Add unique constraint on user_id to ensure one connection per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_meta_ads_connections_user_id_unique ON meta_ads_connections(user_id);

-- Create SECURE policies that properly enforce user isolation
CREATE POLICY "Users can view own Meta Ads connections"
  ON meta_ads_connections
  FOR SELECT
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own Meta Ads connections"
  ON meta_ads_connections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own Meta Ads connections"
  ON meta_ads_connections
  FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own Meta Ads connections"
  ON meta_ads_connections
  FOR DELETE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
