-- Migration: Robust RLS Recovery Fix
-- Date: 2026-02-18
-- Target: Resolve 500 Internal Server Error (RLS Infinite Recursion)

-- 1. TEMPORARILY DISABLE RLS to allow recovery if you are locked out
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES on the users table (Clearing the slate)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN 
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public' LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.users';
  END LOOP;
END $$;

-- 3. RE-CREATE HELPER FUNCTIONS with explicit search_path and schema pointers
-- These functions MUST be created by a superuser (default in Supabase SQL editor)
-- to correctly bypass RLS via SECURITY DEFINER.
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT AS $$
  -- We query public.users directly. SECURITY DEFINER + Superuser owner = No RLS check inside.
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_auth_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- 4. RE-ENABLE RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. IMPLEMENT NON-RECURSIVE POLICIES

-- BASE POLICY: Users can always see and manage their own record.
-- This is critical for the AuthProvider to function.
CREATE POLICY "users_self_select" ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_self_update" ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "users_self_insert" ON public.users FOR INSERT WITH CHECK (id = auth.uid());

-- ADMIN POLICY: Org admins can manage their organization members.
-- This calls the helper function which does NOT trigger recursion.
CREATE POLICY "org_admin_view_members" ON public.users FOR SELECT USING (
  public.get_auth_user_role() = 'org_admin' 
  AND organization_id = public.get_auth_user_org_id()
);

CREATE POLICY "org_admin_update_members" ON public.users FOR UPDATE USING (
  public.get_auth_user_role() = 'org_admin' 
  AND organization_id = public.get_auth_user_org_id()
);

-- SUPER ADMIN POLICY
CREATE POLICY "super_admin_full_access" ON public.users FOR ALL USING (
  public.get_auth_user_role() = 'super_admin'
);
