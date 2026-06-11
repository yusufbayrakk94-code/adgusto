/*
  # Create user_profiles table for Firebase Authentication

  1. New Tables
    - `user_profiles`
      - `id` (text, primary key) - Firebase user.uid
      - `created_at` (timestamp, default now)
      - `name` (text, nullable) - User's display name

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own data
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with Firebase UID as text
CREATE TABLE user_profiles (
  id text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (id = auth.jwt() ->> 'sub')
  WITH CHECK (id = auth.jwt() ->> 'sub');

-- Create index for performance
CREATE INDEX idx_user_profiles_id ON user_profiles(id);