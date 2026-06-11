/*
  # Create brand_colors table

  1. New Tables
    - `brand_colors`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (text) - Firebase user ID who owns this color palette
      - `palette_name` (text) - Name of the color palette (e.g., "Primary Brand Colors")
      - `colors` (jsonb) - Array of color objects with hex codes and labels
      - `is_default` (boolean) - Whether this is the user's default palette
      - `created_at` (timestamptz) - When the palette was created
      - `updated_at` (timestamptz) - When the palette was last updated

  2. Security
    - Enable RLS on `brand_colors` table
    - Add policies for users to manage their own brand colors
    - Users can read, insert, update, and delete their own color palettes

  3. Important Notes
    - Uses Firebase Auth user IDs (text type) instead of Supabase auth.users
    - Colors stored as JSONB array for flexibility
    - Only one palette can be set as default per user
*/

-- Create brand_colors table
CREATE TABLE IF NOT EXISTS brand_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  palette_name text NOT NULL DEFAULT 'My Brand Palette',
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brand_colors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own brand colors"
  ON brand_colors FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own brand colors"
  ON brand_colors FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own brand colors"
  ON brand_colors FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true))
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own brand colors"
  ON brand_colors FOR DELETE
  USING (user_id = current_setting('app.current_user_id', true));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_colors_user_id ON brand_colors(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_colors_is_default ON brand_colors(user_id, is_default) WHERE is_default = true;

-- Create function to ensure only one default palette per user
CREATE OR REPLACE FUNCTION ensure_single_default_palette()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE brand_colors
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_ensure_single_default_palette ON brand_colors;
CREATE TRIGGER trigger_ensure_single_default_palette
  BEFORE INSERT OR UPDATE ON brand_colors
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_palette();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_brand_colors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_brand_colors_updated_at ON brand_colors;
CREATE TRIGGER trigger_update_brand_colors_updated_at
  BEFORE UPDATE ON brand_colors
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_colors_updated_at();
