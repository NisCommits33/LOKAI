-- 1. Create Default Organizations (e.g., LOKAI System Org)
INSERT INTO organizations (name, code, contact_email)
VALUES ('LOKAI System', 'LOKAI', 'admin@lokai.gov.np');

-- 2. Define Super Admin (admin@lokai.gov.np)
-- NOTE: In a real Supabase environment, you'd use auth.signup() or insert into auth.users manually.
-- This script assumes the user exists in auth.users or will be created.
-- For local dev, we can try to insert into auth.users if the extension is available, 
-- but usually, we just map it in public.users.

-- 3. Seed Default Departments (Template)
-- We will use a function to apply these to new organizations later, 
-- but for now, let's insert for a few sample orgs.

INSERT INTO organizations (name, code, contact_email)
VALUES 
('Civil Aviation Authority of Nepal', 'CAAN', 'info@caanepal.gov.np'),
('Nepal Oil Corporation', 'NOC', 'info@noc.org.np'),
('Nepal Telecom', 'NT', 'info@ntc.net.np');

-- Function to seed defaults for an organization
CREATE OR REPLACE FUNCTION seed_org_defaults(target_org_id UUID) 
RETURNS VOID AS $$
BEGIN
    -- Departments
    INSERT INTO departments (organization_id, name, code)
    VALUES 
    (target_org_id, 'Administration', 'ADMIN'),
    (target_org_id, 'Finance', 'FIN'),
    (target_org_id, 'Human Resources', 'HR'),
    (target_org_id, 'Information Technology', 'IT'),
    (target_org_id, 'Legal', 'LEGAL'),
    (target_org_id, 'Operations', 'OPS'),
    (target_org_id, 'Planning & Monitoring', 'PLAN'),
    (target_org_id, 'Public Relations', 'PR'),
    (target_org_id, 'Research & Development', 'RD'),
    (target_org_id, 'Security', 'SEC'),
    (target_org_id, 'Training', 'TRN');

    -- Job Levels
    INSERT INTO job_levels (organization_id, name, rank)
    VALUES 
    (target_org_id, 'Level 1: Assistant', 1),
    (target_org_id, 'Level 2: Officer', 2),
    (target_org_id, 'Level 3: Senior Officer', 3),
    (target_org_id, 'Level 4: Supervisor', 4),
    (target_org_id, 'Level 5: Manager', 5),
    (target_org_id, 'Level 6: Senior Manager', 6),
    (target_org_id, 'Level 7: Director', 7),
    (target_org_id, 'Level 8: Executive Director', 8),
    (target_org_id, 'Level 9: Department Head', 9);
END;
$$ LANGUAGE plpgsql;

-- Apply defaults to seeded orgs
DO $$
DECLARE
    org_record RECORD;
BEGIN
    FOR org_record IN SELECT id FROM organizations WHERE code IN ('CAAN', 'NOC', 'NT') LOOP
        PERFORM seed_org_defaults(org_record.id);
    END LOOP;
END $$;
