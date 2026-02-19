-- Migration: Fix RLS Infinite Recursion on Users Table
-- Date: 2026-02-18

-- 1. Helper functions (STABLE to avoid repeated lookups)
-- Using SECURITY DEFINER allows these functions to bypass RLS, breaking the recursion loop.
CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS TEXT STABLE AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_auth_organization_id()
RETURNS UUID STABLE AS $$
  SELECT organization_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Clear out ALL possible conflicting policies to ensure a clean state
DROP POLICY IF EXISTS "Users can view themselves" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Org Admins can view their organization members" ON users;
DROP POLICY IF EXISTS "Org Admins can update their organization members" ON users;
DROP POLICY IF EXISTS "Super Admins can do everything" ON users;

-- 3. Re-implement robust policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Standard users can see/edit only themselves
CREATE POLICY "Users can view themselves" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (id = auth.uid());

-- Org Admins can see/edit only their own organization members
CREATE POLICY "Org Admins can view their organization members" ON users 
FOR SELECT USING (
    get_auth_role() = 'org_admin' AND organization_id = get_auth_organization_id()
);

CREATE POLICY "Org Admins can update their organization members" ON users 
FOR UPDATE USING (
    get_auth_role() = 'org_admin' AND organization_id = get_auth_organization_id()
);

-- Super Admins use the helper function to avoid recursion
CREATE POLICY "Super Admins can do everything" ON users FOR ALL USING (
    get_auth_role() = 'super_admin'
);
