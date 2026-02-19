-- ============================================================
-- Sprint 6: Employee Verification System
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    code text,
    created_at timestamptz DEFAULT now()
);

-- Ensure columns exist if table was created previously
ALTER TABLE departments ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- 2. Create job_levels table  
CREATE TABLE IF NOT EXISTS job_levels (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    grade text,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Ensure columns exist if table was created in a previous run without them
ALTER TABLE job_levels ADD COLUMN IF NOT EXISTS grade text;
ALTER TABLE job_levels ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE job_levels ADD COLUMN IF NOT EXISTS level_order integer;
ALTER TABLE job_levels ALTER COLUMN organization_id DROP NOT NULL;

-- Fix existing null level_order before seeding
-- We update existing rows with null level_order to 0 to satisfy the NOT NULL constraint
UPDATE job_levels SET level_order = 0 WHERE level_order IS NULL;
ALTER TABLE job_levels ALTER COLUMN level_order SET DEFAULT 0;

-- Ensure uniqueness on name for conflict handling during seeding
-- We use a DO block to safely add the constraint only if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'job_levels_name_key') THEN
        ALTER TABLE job_levels ADD CONSTRAINT job_levels_name_key UNIQUE (name);
    END IF;
END $$;

-- 3. Add new columns to users table
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES departments(id),
    ADD COLUMN IF NOT EXISTS job_level_id uuid REFERENCES job_levels(id),
    ADD COLUMN IF NOT EXISTS rejection_reason text,
    ADD COLUMN IF NOT EXISTS verified_at timestamptz,
    ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES users(id);

-- 4. Enable RLS on departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_view_departments"
    ON departments FOR SELECT USING (true);

-- 5. Enable RLS on job_levels
ALTER TABLE job_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_view_job_levels"
    ON job_levels FOR SELECT USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed Nepalese civil service job levels
-- We use ON CONFLICT (name) to ensure we update existing roles or add new ones
-- Columns like organization_id and level_order are handled robustly
INSERT INTO job_levels (name, grade, description, level_order) VALUES
    ('Secretary', 'Special Class', 'Top-level civil service official', 1),
    ('Joint Secretary', 'Gazetted First Class', 'Senior department head', 2),
    ('Under Secretary', 'Gazetted Second Class', 'Mid-level department official', 3),
    ('Section Officer', 'Gazetted Third Class', 'Section management level', 4),
    ('Non-Gazetted First Class', 'NG First Class', 'Senior clerical and technical', 5),
    ('Non-Gazetted Second Class', 'NG Second Class', 'Clerical and support', 6),
    ('Non-Gazetted Third Class', 'NG Third Class', 'Entry clerical level', 7),
    ('Assistant Level', 'Assistant', 'Administrative assistant', 8)
ON CONFLICT (name) DO UPDATE SET
    grade = EXCLUDED.grade,
    description = EXCLUDED.description,
    level_order = EXCLUDED.level_order;
