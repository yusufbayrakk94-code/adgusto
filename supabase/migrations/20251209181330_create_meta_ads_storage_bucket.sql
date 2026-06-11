-- Create Meta Ads Storage Bucket
--
-- 1. New Storage Bucket
--    - meta-ads: Public bucket for storing saved ad images
--
-- 2. Security
--    - Users can upload to their own folder (user_id/*)
--    - Public read access for all saved images
--    - Users can only delete their own images

-- Create storage bucket for meta ads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meta-ads',
  'meta-ads',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload to own folder'
  ) THEN
    CREATE POLICY "Users can upload to own folder"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'meta-ads' AND
        (storage.foldername(name))[1] = auth.jwt()->>'sub'
      );
  END IF;
END $$;

-- Allow public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'meta-ads');
  END IF;
END $$;

-- Allow users to delete their own images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own images'
  ) THEN
    CREATE POLICY "Users can delete own images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'meta-ads' AND
        (storage.foldername(name))[1] = auth.jwt()->>'sub'
      );
  END IF;
END $$;