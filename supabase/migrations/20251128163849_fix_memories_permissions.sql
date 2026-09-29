/*
  # Fix Memories Table Permissions

  1. Changes
    - Drop existing restrictive policies on memories table
    - Create simple policies that allow all authenticated users to upload
    - Allow users to manage their own memories
    - Allow viewing of all memories

  2. Security
    - All authenticated users can insert memories
    - Users can update and delete their own memories
    - All authenticated users can view all memories
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view accessible memories" ON memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON memories;
DROP POLICY IF EXISTS "Users can update accessible memories" ON memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON memories;

-- Policy: Any authenticated user can insert memories
CREATE POLICY "Authenticated users can insert memories"
ON memories
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND 
  owner_id = auth.uid()
);

-- Policy: Any authenticated user can view all memories
CREATE POLICY "Authenticated users can view all memories"
ON memories
FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can update their own memories
CREATE POLICY "Users can update own memories"
ON memories
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Policy: Users can delete their own memories
CREATE POLICY "Users can delete own memories"
ON memories
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());