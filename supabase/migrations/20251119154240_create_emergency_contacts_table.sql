/*
  # Create Emergency Contacts Table

  1. New Tables
    - `emergency_contacts`
      - `id` (uuid, primary key) - Unique identifier for each emergency contact
      - `user_id` (uuid, foreign key) - References auth.users table
      - `contact_name` (text) - Name of the emergency contact person
      - `contact_email` (text) - Email of the emergency contact person
      - `created_at` (timestamptz) - Timestamp when the record was created
      - `updated_at` (timestamptz) - Timestamp when the record was last updated

  2. Security
    - Enable RLS on `emergency_contacts` table
    - Add policy for authenticated users to read their own emergency contacts
    - Add policy for authenticated users to insert their own emergency contacts
    - Add policy for authenticated users to update their own emergency contacts
    - Add policy for authenticated users to delete their own emergency contacts

  3. Notes
    - Emergency contacts are tied to authenticated users
    - Each user can have their emergency contact information stored securely
    - All operations are restricted to the contact owner through RLS policies
*/

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own emergency contacts"
  ON emergency_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts"
  ON emergency_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts"
  ON emergency_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts"
  ON emergency_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS emergency_contacts_user_id_idx ON emergency_contacts(user_id);