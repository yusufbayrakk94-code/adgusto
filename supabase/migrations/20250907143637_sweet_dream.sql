/*
  # Create user profiles and analysis tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `marketing_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service` (text)
      - `sector` (text)
      - `analysis_data` (jsonb)
      - `created_at` (timestamp)
    
    - `ad_copy_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service` (text)
      - `platforms` (text[])
      - `ad_copies` (jsonb)
      - `created_at` (timestamp)
    
    - `csv_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_name` (text)
      - `analysis_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Marketing Analyses Table
CREATE TABLE IF NOT EXISTS marketing_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service text NOT NULL,
  sector text,
  analysis_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketing_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own marketing analyses"
  ON marketing_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own marketing analyses"
  ON marketing_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own marketing analyses"
  ON marketing_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ad Copy Analyses Table
CREATE TABLE IF NOT EXISTS ad_copy_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service text NOT NULL,
  platforms text[] NOT NULL,
  ad_copies jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ad_copy_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ad copy analyses"
  ON ad_copy_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad copy analyses"
  ON ad_copy_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ad copy analyses"
  ON ad_copy_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- CSV Analyses Table
CREATE TABLE IF NOT EXISTS csv_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  analysis_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE csv_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own csv analyses"
  ON csv_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own csv analyses"
  ON csv_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own csv analyses"
  ON csv_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_analyses_user_id ON marketing_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_copy_analyses_user_id ON ad_copy_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_csv_analyses_user_id ON csv_analyses(user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();