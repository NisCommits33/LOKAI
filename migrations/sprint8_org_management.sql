-- Enable RLS on departments and job_levels if not already enabled
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_levels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to refresh
DROP POLICY IF EXISTS "Departments represent organizational structure" ON departments;
DROP POLICY IF EXISTS "Job levels represent hierarchy" ON job_levels;
DROP POLICY IF EXISTS "View departments" ON departments;
DROP POLICY IF EXISTS "Manage departments" ON departments;
DROP POLICY IF EXISTS "View job levels" ON job_levels;
DROP POLICY IF EXISTS "Manage job levels" ON job_levels;

-- Policy: Everyone in the organization can VIEW departments
CREATE POLICY "View departments"
ON departments FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE id = auth.uid()
  )
);

-- Policy: Only Org Admins can MANAGE (Insert/Update/Delete) departments
CREATE POLICY "Manage departments"
ON departments FOR ALL
USING (
  exists (
    select 1 from users
    where id = auth.uid()
    and role = 'org_admin'
    and organization_id = departments.organization_id
  )
)
WITH CHECK (
  exists (
    select 1 from users
    where id = auth.uid()
    and role = 'org_admin'
    and organization_id = departments.organization_id
  )
);

-- Policy: Everyone in the organization can VIEW job levels
CREATE POLICY "View job levels"
ON job_levels FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM users
    WHERE id = auth.uid()
  )
);

-- Policy: Only Org Admins can MANAGE (Insert/Update/Delete) job levels
CREATE POLICY "Manage job levels"
ON job_levels FOR ALL
USING (
  exists (
    select 1 from users
    where id = auth.uid()
    and role = 'org_admin'
    and organization_id = job_levels.organization_id
  )
)
WITH CHECK (
  exists (
    select 1 from users
    where id = auth.uid()
    and role = 'org_admin'
    and organization_id = job_levels.organization_id
  )
);
