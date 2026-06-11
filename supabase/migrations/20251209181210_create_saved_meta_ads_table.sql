/*
  # Create saved_meta_ads table

  1. New Tables
    - `saved_meta_ads`
      - `id` (uuid, primary key) - Unique identifier for each saved ad
      - `user_id` (text) - Firebase Auth user ID who saved the ad
      - `ad_id` (text) - Original Apify/Meta ad ID
      - `ad_title` (text) - Title/headline of the ad
      - `ad_text` (text) - Ad copy/description
      - `advertiser_name` (text) - Name of the advertiser
      - `page_name` (text) - Facebook page name
      - `platform` (text) - Platform (Facebook, Instagram, etc.)
      - `image_url` (text) - URL to the ad image
      - `storage_url` (text) - Supabase Storage URL for saved image
      - `video_url` (text, nullable) - URL to video if exists
      - `cta_text` (text, nullable) - Call to action text
      - `link_url` (text, nullable) - Landing page URL
      - `started_running` (timestamptz, nullable) - When ad started running
      - `tags` (text[], default empty array) - User-defined tags for organization
      - `notes` (text, nullable) - User notes about the ad
      - `raw_data` (jsonb) - Full raw data from Apify
      - `created_at` (timestamptz) - When the ad was saved
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `saved_meta_ads` table
    - Add policy for users to read their own saved ads
    - Add policy for users to insert their own saved ads
    - Add policy for users to update their own saved ads
    - Add policy for users to delete their own saved ads
  
  3. Indexes
    - Index on user_id for fast user queries
    - Index on created_at for sorting
    - Index on tags for tag-based filtering
*/

CREATE TABLE IF NOT EXISTS saved_meta_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  ad_id text NOT NULL,
  ad_title text DEFAULT '',
  ad_text text DEFAULT '',
  advertiser_name text DEFAULT '',
  page_name text DEFAULT '',
  platform text DEFAULT '',
  image_url text DEFAULT '',
  storage_url text DEFAULT '',
  video_url text,
  cta_text text,
  link_url text,
  started_running timestamptz,
  tags text[] DEFAULT '{}',
  notes text,
  raw_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_meta_ads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own saved ads"
  ON saved_meta_ads FOR SELECT
  TO authenticated
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert own saved ads"
  ON saved_meta_ads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own saved ads"
  ON saved_meta_ads FOR UPDATE
  TO authenticated
  USING (user_id = auth.jwt()->>'sub')
  WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can delete own saved ads"
  ON saved_meta_ads FOR DELETE
  TO authenticated
  USING (user_id = auth.jwt()->>'sub');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_meta_ads_user_id ON saved_meta_ads(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_meta_ads_created_at ON saved_meta_ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_meta_ads_tags ON saved_meta_ads USING GIN(tags);

-- Add unique constraint to prevent duplicate saves
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_meta_ads_user_ad ON saved_meta_ads(user_id, ad_id);