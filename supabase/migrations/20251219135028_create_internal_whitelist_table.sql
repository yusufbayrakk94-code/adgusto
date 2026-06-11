/*
  # Internal Access Control System

  1. New Table
    - `internal_whitelist`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Whitelisted email address
      - `full_name` (text) - User's full name
      - `role` (text) - Internal role (admin, manager, viewer)
      - `is_active` (boolean) - Whether the whitelist entry is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on table
    - Allow authenticated users to check if they're whitelisted

  3. Important Notes
    - This table controls access to internal Google Ads management tools
    - Only whitelisted users can access internal features
    - Initial admin user: yusufbayrakk94@gmail.com
*/

-- Create internal_whitelist table
CREATE TABLE IF NOT EXISTS internal_whitelist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_internal_whitelist_email ON internal_whitelist(email);
CREATE INDEX IF NOT EXISTS idx_internal_whitelist_active ON internal_whitelist(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE internal_whitelist ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Authenticated users can read whitelist" ON internal_whitelist;

-- Policy: Allow authenticated users to check if they're whitelisted
CREATE POLICY "Authenticated users can read whitelist"
  ON internal_whitelist FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial admin user
INSERT INTO internal_whitelist (email, full_name, role, is_active)
VALUES ('yusufbayrakk94@gmail.com', 'Yusuf Bayrak', 'admin', true)
ON CONFLICT (email) DO UPDATE 
SET is_active = true, role = 'admin', updated_at = now();