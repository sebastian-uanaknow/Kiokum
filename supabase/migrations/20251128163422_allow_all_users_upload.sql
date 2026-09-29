/*
  # Allow All Authenticated Users to Upload Files

  1. Changes
    - Update storage policies to allow any authenticated user to upload
    - Allow users to upload to any folder path
    - Maintain read/update/delete access for all authenticated users

  2. Security
    - Still requires authentication
    - Users authenticated can upload anywhere
    - All authenticated users can access any file in the bucket
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Policy: Any authenticated user can upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memories');

-- Policy: Any authenticated user can read files
CREATE POLICY "Authenticated users can read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'memories');

-- Policy: Any authenticated user can update files
CREATE POLICY "Authenticated users can update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'memories')
WITH CHECK (bucket_id = 'memories');

-- Policy: Any authenticated user can delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'memories');