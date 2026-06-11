/*
  # Create Meta Ad Campaigns Table

  1. New Tables
    - `meta_ad_campaigns`
      - `id` (uuid, primary key)
      - `user_id` (text, references Firebase Auth user)
      - `campaign_id` (text, Meta Campaign ID)
      - `campaign_name` (text)
      - `status` (text, ACTIVE/PAUSED/ARCHIVED)
      - `objective` (text, campaign objective)
      - `daily_budget` (numeric, daily budget in cents)
      - `lifetime_budget` (numeric, lifetime budget in cents)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `insights` (jsonb, campaign performance data)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `meta_ad_campaigns` table
    - Add policies for authenticated users to manage their own campaigns
*/

CREATE TABLE IF NOT EXISTS meta_ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  campaign_id text NOT NULL UNIQUE,
  campaign_name text NOT NULL,
  status text DEFAULT 'PAUSED',
  objective text,
  daily_budget numeric,
  lifetime_budget numeric,
  start_time timestamptz,
  end_time timestamptz,
  insights jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meta_ad_campaigns_user_id ON meta_ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_meta_ad_campaigns_campaign_id ON meta_ad_campaigns(campaign_id);

-- Enable RLS
ALTER TABLE meta_ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own campaigns
CREATE POLICY "Users can view own Meta Ad campaigns"
  ON meta_ad_campaigns
  FOR SELECT
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can insert their own campaigns
CREATE POLICY "Users can insert own Meta Ad campaigns"
  ON meta_ad_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can update their own campaigns
CREATE POLICY "Users can update own Meta Ad campaigns"
  ON meta_ad_campaigns
  FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Users can delete their own campaigns
CREATE POLICY "Users can delete own Meta Ad campaigns"
  ON meta_ad_campaigns
  FOR DELETE
  TO authenticated
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_meta_ad_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meta_ad_campaigns_updated_at
  BEFORE UPDATE ON meta_ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_meta_ad_campaigns_updated_at();
