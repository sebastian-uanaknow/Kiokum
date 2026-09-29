/*
  # Fix search_path Security Issue in has_memory_permission Function

  1. Changes
    - Add explicit schema qualifications to prevent search_path attacks
    - Set search path to empty in SECURITY DEFINER function
    - Use fully qualified names for all tables and functions

  2. Security
    - Prevents role mutable search_path vulnerability
    - Ensures function uses correct schema regardless of caller's search_path
*/

-- Drop and recreate the function with proper security settings
DROP FUNCTION IF EXISTS has_memory_permission(uuid, uuid, access_role);

CREATE OR REPLACE FUNCTION public.has_memory_permission(memory_id uuid, user_id uuid, required_role access_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role public.access_role;
  is_owner boolean;
  user_email text;
BEGIN
  -- Check if user is the owner
  SELECT EXISTS (
    SELECT 1 FROM public.memories
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
  FROM public.shared_access sa
  JOIN public.memories m ON m.owner_id = sa.memory_owner_id
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