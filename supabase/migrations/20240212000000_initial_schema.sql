-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'org_admin', 'dept_admin', 'employee');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'deactivated');

-- 2. ORGANIZATIONS
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    logo_url TEXT,
    contact_email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DEPARTMENTS
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- 4. JOB LEVELS
CREATE TABLE job_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rank INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, rank)
);

-- 5. USERS (Public Profiles)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    organization_id UUID REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    job_level_id UUID REFERENCES job_levels(id),
    employee_id VARCHAR(50),
    role user_role NOT NULL DEFAULT 'employee',
    verification_status verification_status DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    deactivated_by UUID REFERENCES users(id),
    deactivated_at TIMESTAMP WITH TIME ZONE,
    deactivation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DEPARTMENT ADMINS (Many-to-Many)
CREATE TABLE department_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, department_id)
);

-- 7. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    changes JSONB,
    reason TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ENABLE RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. BASIC RLS POLICIES

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Super Admin can read everything
CREATE POLICY "Super Admin View All" ON organizations FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Super Admin View All Users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));

-- Org Admin can read their organization's data
CREATE POLICY "Org Admin View Org" ON organizations FOR SELECT USING (id = (SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'org_admin'));
CREATE POLICY "Org Admin View Users" ON users FOR SELECT USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'org_admin'));
