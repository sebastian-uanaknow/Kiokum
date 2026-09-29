-- Fix memory_images SELECT policy: replace subquery to auth.users with auth.jwt() ->> 'email'
DROP POLICY IF EXISTS "Users can view images of memories they have access to" ON memory_images;

CREATE POLICY "Users can view images of memories they have access to"
  ON memory_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memories
      WHERE memories.id = memory_images.memory_id
      AND (
        memories.user_id = auth.uid()
        OR memories.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM shared_access sa
          WHERE sa.memory_owner_id = memories.owner_id
          AND sa.shared_with_email = (auth.jwt() ->> 'email')
        )
      )
    )
  );
