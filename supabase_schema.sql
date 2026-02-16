-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    settings JSONB DEFAULT '{"allow_public_upload": false}',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_code ON organizations(code);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON organizations(is_active);

-- Organization Applications table
CREATE TABLE IF NOT EXISTS organization_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    address TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_position VARCHAR(255),
    documents JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_applications_status ON organization_applications(status);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- Job Levels table
CREATE TABLE IF NOT EXISTS job_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level_order INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    organization_id UUID REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    job_level_id UUID REFERENCES job_levels(id),
    employee_id VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'public'
        CHECK (role IN ('super_admin', 'org_admin', 'employee', 'public')),
    verification_status VARCHAR(20) DEFAULT 'public'
        CHECK (verification_status IN ('public', 'pending', 'verified', 'rejected')),
    verification_requested_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    last_login TIMESTAMPTZ,
    preferences JSONB DEFAULT '{"theme": "light"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, employee_id)
);

-- GK Quizzes table
CREATE TABLE IF NOT EXISTS gk_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'medium'
        CHECK (difficulty IN ('easy', 'medium', 'hard')),
    questions JSONB NOT NULL,
    total_questions INTEGER NOT NULL,
    times_taken INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal Documents table
CREATE TABLE IF NOT EXISTS personal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    extracted_text TEXT,
    ai_summary TEXT,
    questions JSONB DEFAULT '[]',
    processing_status VARCHAR(20) DEFAULT 'pending'
        CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    processing_attempts INTEGER DEFAULT 0,
    processing_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Organization Documents table
CREATE TABLE IF NOT EXISTS organization_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    department_id UUID REFERENCES departments(id),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    page_count INTEGER DEFAULT 0,
    policy_tag VARCHAR(200),
    chapter_tag VARCHAR(200),
    section_tag VARCHAR(200),
    tags JSONB DEFAULT '[]',
    extracted_text TEXT,
    ai_summary TEXT,
    key_points JSONB DEFAULT '[]',
    processing_status VARCHAR(20) DEFAULT 'pending'
        CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    view_count INTEGER DEFAULT 0,
    quiz_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES organization_documents(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL CHECK (jsonb_array_length(options) = 4),
    correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
    explanation TEXT,
    difficulty VARCHAR(10) DEFAULT 'medium'
        CHECK (difficulty IN ('easy', 'medium', 'hard')),
    policy_tag VARCHAR(200),
    chapter_tag VARCHAR(200),
    section_tag VARCHAR(200),
    ai_confidence FLOAT DEFAULT 0.0,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(20) NOT NULL
        CHECK (source_type IN ('gk', 'personal', 'organization')),
    source_id UUID NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score_percentage DECIMAL(5,2) NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    questions_attempted JSONB NOT NULL,
    answers JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (correct_answers <= total_questions)
);

-- Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active organizations" ON organizations FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view themselves" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can manage their own personal documents" ON personal_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Verified employees can view org documents" ON organization_documents FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid() AND verification_status = 'verified')
);
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (user_id = auth.uid());


-- Automatic Profile Creation removed (moved to application layer)
