-- Sprint 9: Organization Document Management RLS & Indexes

-- Ensure RLS is enabled
ALTER TABLE organization_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Verified employees can view org documents" ON organization_documents;
DROP POLICY IF EXISTS "Org admins can manage documents" ON organization_documents;
DROP POLICY IF EXISTS "View organization documents" ON organization_documents;
DROP POLICY IF EXISTS "Manage organization documents" ON organization_documents;

-- Policy: Everyone in the organization (verified) can VIEW documents
CREATE POLICY "View organization documents"
ON organization_documents FOR SELECT
USING (
  exists (
    select 1 from users
    where id = auth.uid()
    and organization_id = organization_documents.organization_id
    and verification_status = 'verified'
  )
);

-- Policy: Only Org Admins can MANAGE (Insert/Update/Delete) documents
CREATE POLICY "Manage organization documents"
ON organization_documents FOR ALL
USING (
  exists (
    select 1 from users
    where id = auth.uid()
    and role = 'org_admin'
    and organization_id = organization_documents.organization_id
  )
)
WITH CHECK (
  exists (
    select 1 from users
    where id = auth.uid()
    and role = 'org_admin'
    and organization_id = organization_documents.organization_id
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_org_docs_org_id ON organization_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_docs_dept_id ON organization_documents(department_id);
CREATE INDEX IF NOT EXISTS idx_org_docs_processing_status ON organization_documents(processing_status);
