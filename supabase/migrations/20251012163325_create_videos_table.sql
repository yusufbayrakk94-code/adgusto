/*
  # Create Videos Table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt` (text, video generation prompt)
      - `sector` (text, industry sector)
      - `duration` (integer, video duration in seconds)
      - `video_url` (text, generated video URL)
      - `ai_provider` (text, AI provider used)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `videos` table
    - Policy: Users can insert their own videos
    - Policy: Users can read their own videos
    - Policy: Users can delete their own videos
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt text NOT NULL,
  sector text NOT NULL,
  duration integer NOT NULL,
  video_url text NOT NULL,
  ai_provider text DEFAULT 'minimax',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);