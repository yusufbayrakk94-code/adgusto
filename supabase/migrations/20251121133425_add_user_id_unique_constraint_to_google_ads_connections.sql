/*
  # Add unique constraint to google_ads_connections

  1. Changes
    - Add unique constraint on user_id column in google_ads_connections table
    - This ensures one user can only have one Google Ads connection
  
  2. Security
    - No changes to RLS policies
*/

-- Add unique constraint to user_id if it doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'google_ads_connections_user_id_key'
  ) THEN
    ALTER TABLE google_ads_connections 
    ADD CONSTRAINT google_ads_connections_user_id_key UNIQUE (user_id);
  END IF;
END $$;
