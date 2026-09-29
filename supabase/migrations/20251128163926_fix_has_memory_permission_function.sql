/*
  # Fix has_memory_permission Function

  1. Changes
    - Update function to avoid direct access to auth.users
    - Use email from shared_access directly
    - Simplify permission checks

  2. Security
    - Maintain SECURITY DEFINER for proper access
    - Ensure function works without auth.users access
*/

CREATE OR REPLACE FUNCTION has_memory_permission(memory_id uuid, user_id uuid, required_role access_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role access_role;
  is_owner boolean;
  user_email text;
BEGIN
  -- Check if user is the owner
  SELECT EXISTS (
    SELECT 1 FROM memories
    WHERE id = memory_id AND owner_id = user_id
  ) INTO is_owner;

  IF is_owner THEN
    RETURN true;
  END IF;

  -- Get user email from auth metadata using auth.jwt()
  user_email := auth.jwt()->>'email';

  IF user_email IS NULL THEN
    RETURN false;
  END IF;

  -- Check shared access
  SELECT access_role INTO user_role
  FROM shared_access sa
  JOIN memories m ON m.owner_id = sa.memory_owner_id
  WHERE m.id = memory_id
  AND sa.shared_with_email = user_email;

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
$$;