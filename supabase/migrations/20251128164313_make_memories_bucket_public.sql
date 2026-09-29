/*
  # Make Memories Bucket Public

  1. Changes
    - Update memories bucket to be public
    - This allows images to be displayed without authentication

  2. Security
    - Files are still protected by RLS policies for upload/delete
    - Public URLs will work for viewing images
*/

UPDATE storage.buckets
SET public = true
WHERE name = 'memories';