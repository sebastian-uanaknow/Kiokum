/*
  # Add Roles and Permissions System

  1. Changes to existing tables
    - Update shared_access table to use role-based permissions
    - Change access_level from simple string to enum with specific roles

  2. New Types
    - Create enum for access roles: owner, editor, viewer

  3. Security
    - Update RLS policies to respect role-based permissions
    - Owner has full control
    - Editor can modify but not delete
    - Viewer can only read

  4. Important Notes
    - The memory creator is always the owner
    - Owners can assign roles to other users
    - Roles determine what actions users can perform
*/

-- Create enum for access roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'access_role') THEN
    CREATE TYPE access_role AS ENUM ('owner', 'editor', 'viewer');
  END IF;
END $$;

-- Update shared_access table to use role-based access
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_access' AND column_name = 'access_level'
  ) THEN
    -- Drop the old column if it exists and recreate with proper type
    ALTER TABLE shared_access DROP COLUMN IF EXISTS access_level;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_access' AND column_name = 'access_role'
  ) THEN
    ALTER TABLE shared_access ADD COLUMN access_role access_role DEFAULT 'viewer';
  END IF;
END $$;

-- Add column to track who shared the memory (for audit purposes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'shared_access' AND column_name = 'shared_by_id'
  ) THEN
    ALTER TABLE shared_access ADD COLUMN shared_by_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Update memories table to track ownership
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'memories' AND column_name = 'owner_id'
  ) THEN
    -- Add owner_id column (will be same as user_id initially)
    ALTER TABLE memories ADD COLUMN owner_id uuid REFERENCES auth.users(id);
    
    -- Set owner_id to user_id for existing records
    UPDATE memories SET owner_id = user_id WHERE owner_id IS NULL;
    
    -- Make it NOT NULL after setting values
    ALTER TABLE memories ALTER COLUMN owner_id SET NOT NULL;
  END IF;
END $$;

-- Create function to check if user has permission for a memory
CREATE OR REPLACE FUNCTION has_memory_permission(
  memory_id uuid,
  user_id uuid,
  required_role access_role
)
RETURNS boolean AS $$
DECLARE
  user_role access_role;
  is_owner boolean;
BEGIN
  -- Check if user is the owner
  SELECT EXISTS (
    SELECT 1 FROM memories
    WHERE id = memory_id AND owner_id = user_id
  ) INTO is_owner;
  
  IF is_owner THEN
    RETURN true;
  END IF;
  
  -- Check shared access
  SELECT access_role INTO user_role
  FROM shared_access sa
  JOIN memories m ON m.owner_id = sa.memory_owner_id
  WHERE m.id = memory_id
    AND sa.shared_with_email = (
      SELECT email FROM auth.users WHERE id = user_id
    );
  
  -- Compare roles: owner > editor > viewer
  IF user_role IS NULL THEN
    RETURN false;
  END IF;
  
  IF required_role = 'viewer' THEN
    RETURN user_role IN ('viewer', 'editor', 'owner');
  ELSIF required_role = 'editor' THEN
    RETURN user_role IN ('editor', 'owner');
  ELSIF required_role = 'owner' THEN
    RETURN user_role = 'owner';
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for memories table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own memories" ON memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON memories;
DROP POLICY IF EXISTS "Users can update own memories" ON memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON memories;

-- SELECT: Users can view memories they own or have access to
CREATE POLICY "Users can view accessible memories"
ON memories FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM shared_access sa
    WHERE sa.memory_owner_id = owner_id
      AND sa.shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- INSERT: Users can insert their own memories
CREATE POLICY "Users can insert own memories"
ON memories FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND owner_id = auth.uid());

-- UPDATE: Users can update memories they own or have editor role
CREATE POLICY "Users can update accessible memories"
ON memories FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid() OR
  has_memory_permission(id, auth.uid(), 'editor'::access_role)
)
WITH CHECK (
  owner_id = auth.uid() OR
  has_memory_permission(id, auth.uid(), 'editor'::access_role)
);

-- DELETE: Only owners can delete memories
CREATE POLICY "Users can delete own memories"
ON memories FOR DELETE
TO authenticated
USING (owner_id = auth.uid());