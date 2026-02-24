-- Sprint 3: User Personal Documents & Targeted Org Quizzes

-- 1. Update organization_documents with job_level_id for granular targeting
ALTER TABLE organization_documents 
ADD COLUMN IF NOT EXISTS job_level_id UUID REFERENCES job_levels(id);

-- Add index for the new column
CREATE INDEX IF NOT EXISTS idx_org_docs_job_level_id ON organization_documents(job_level_id);

-- 2. Storage Setup for Personal Documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('personal-documents', 'personal-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for personal-documents bucket
-- Allow users to manage their own bucket folders (organized by user_id)
CREATE POLICY "Users can manage their own storage"
ON storage.objects FOR ALL
USING (auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Note: The personal_documents table already exists in supabase_schema.sql
-- We just need to ensure RLS is correct for it.
ALTER TABLE personal_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own personal documents" ON personal_documents;
CREATE POLICY "Users can manage their own personal documents"
ON personal_documents FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
