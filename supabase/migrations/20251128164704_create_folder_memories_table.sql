/*
  # Create Folder Memories Junction Table

  1. New Tables
    - `folder_memories`
      - `id` (uuid, primary key)
      - `folder_id` (uuid, foreign key to folders)
      - `memory_id` (uuid, foreign key to memories)
      - `created_at` (timestamp)
      - Unique constraint on (folder_id, memory_id) to prevent duplicates

  2. Security
    - Enable RLS on `folder_memories` table
    - Users can insert memories into their own folders
    - Users can view folder contents for their own folders
    - Users can remove memories from their own folders

  3. Notes
    - Allows many-to-many relationship between folders and memories
    - A memory can be in multiple folders
    - A folder can contain multiple memories
*/

-- Create the junction table
CREATE TABLE IF NOT EXISTS folder_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  memory_id uuid NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(folder_id, memory_id)
);

-- Enable RLS
ALTER TABLE folder_memories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can add memories to their own folders
CREATE POLICY "Users can add memories to own folders"
ON folder_memories
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM folders
    WHERE folders.id = folder_memories.folder_id
    AND folders.user_id = auth.uid()
  )
);

-- Policy: Users can view their own folder contents
CREATE POLICY "Users can view own folder contents"
ON folder_memories
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM folders
    WHERE folders.id = folder_memories.folder_id
    AND folders.user_id = auth.uid()
  )
);

-- Policy: Users can remove memories from their own folders
CREATE POLICY "Users can remove memories from own folders"
ON folder_memories
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM folders
    WHERE folders.id = folder_memories.folder_id
    AND folders.user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_folder_memories_folder_id ON folder_memories(folder_id);
CREATE INDEX IF NOT EXISTS idx_folder_memories_memory_id ON folder_memories(memory_id);