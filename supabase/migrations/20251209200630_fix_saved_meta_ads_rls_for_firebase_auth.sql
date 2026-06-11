/*
  # Fix RLS Policies for Firebase Auth

  1. Changes
    - Drop existing RLS policies that use Supabase Auth
    - Since we use Firebase Auth and edge functions with SERVICE_ROLE_KEY
    - Auth is already handled in edge functions, so RLS can be disabled
    
  2. Security
    - Edge functions handle Firebase token verification
    - SERVICE_ROLE_KEY bypasses RLS anyway
    - This simplifies the setup and removes confusion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own saved ads" ON saved_meta_ads;
DROP POLICY IF EXISTS "Users can insert own saved ads" ON saved_meta_ads;
DROP POLICY IF EXISTS "Users can update own saved ads" ON saved_meta_ads;
DROP POLICY IF EXISTS "Users can delete own saved ads" ON saved_meta_ads;

-- Disable RLS since auth is handled in edge functions
ALTER TABLE saved_meta_ads DISABLE ROW LEVEL SECURITY;