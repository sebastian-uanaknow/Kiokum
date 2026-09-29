/*
  # Add support for multiple images and audio descriptions

  ## Changes
  
  1. New Tables
    - `memory_images` - Stores multiple images for each memory
      - `id` (uuid, primary key)
      - `memory_id` (uuid, foreign key to memories)
      - `image_url` (text, URL of the image)
      - `order_index` (integer, for ordering images)
      - `created_at` (timestamp)
  
  2. Modified Tables
    - `memories` - Add new columns for audio descriptions
      - `description_type` (text, 'text' or 'audio')
      - `description_audio_url` (text, URL of audio description)
  
  3. Security
    - Enable RLS on `memory_images` table
    - Add policies for authenticated users to manage their memory images
*/

-- Add new columns to memories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'memories' AND column_name = 'description_type'
  ) THEN
    ALTER TABLE memories ADD COLUMN description_type text DEFAULT 'text' CHECK (description_type IN ('text', 'audio'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'memories' AND column_name = 'description_audio_url'
  ) THEN
    ALTER TABLE memories ADD COLUMN description_audio_url text;
  END IF;
END $$;

-- Create memory_images table
CREATE TABLE IF NOT EXISTS memory_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id uuid NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on memory_images
ALTER TABLE memory_images ENABLE ROW LEVEL SECURITY;

-- Policies for memory_images
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
          AND sa.shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
      )
    )
  );

CREATE POLICY "Users can insert images to their own memories"
  ON memory_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memories
      WHERE memories.id = memory_images.memory_id
      AND (memories.user_id = auth.uid() OR memories.owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can update images of their own memories"
  ON memory_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memories
      WHERE memories.id = memory_images.memory_id
      AND (memories.user_id = auth.uid() OR memories.owner_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memories
      WHERE memories.id = memory_images.memory_id
      AND (memories.user_id = auth.uid() OR memories.owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can delete images of their own memories"
  ON memory_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM memories
      WHERE memories.id = memory_images.memory_id
      AND (memories.user_id = auth.uid() OR memories.owner_id = auth.uid())
    )
  );