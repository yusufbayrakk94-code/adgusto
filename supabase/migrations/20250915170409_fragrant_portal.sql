/*
  # Add subscription fields to user_profiles

  1. Changes
    - Add `is_active` (boolean, default false)
    - Add `plan` (text, nullable) 
    - Add `trial_ends_at` (timestamp, nullable)
    - Add `subscription_id` (text, nullable)
    - Add `subscription_status` (text, nullable)
    - Add `renews_at` (timestamp, nullable)

  2. Security
    - Maintain existing RLS policies
*/

-- Add subscription fields to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_active boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN plan text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'trial_ends_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN trial_ends_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_status text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'renews_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN renews_at timestamptz;
  END IF;
END $$;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_id ON user_profiles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);