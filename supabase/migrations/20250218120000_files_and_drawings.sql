-- File Upload & Management: files_and_drawings table
-- (Scope name: "files_&_drawings" — SQL identifiers cannot contain &, so we use files_and_drawings)

CREATE TABLE IF NOT EXISTS files_and_drawings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE files_and_drawings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "files_and_drawings_read_own" ON files_and_drawings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "files_and_drawings_insert_own" ON files_and_drawings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "files_and_drawings_update_own" ON files_and_drawings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "files_and_drawings_delete_own" ON files_and_drawings
  FOR DELETE USING (auth.uid() = user_id);
