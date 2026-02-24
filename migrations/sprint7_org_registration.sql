-- ============================================================
-- Sprint 7: Organization Registration & Approval System
-- ============================================================

-- 1. Create a trigger function to handle organization approval
CREATE OR REPLACE FUNCTION handle_org_application_approval()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- Only proceed if status changed to 'approved'
    IF (OLD.status != 'approved' AND NEW.status = 'approved') THEN
        
        -- Create the organization record
        INSERT INTO organizations (
            name, 
            code, 
            description, 
            address, 
            contact_email,
            is_active
        ) VALUES (
            NEW.name,
            NEW.code,
            NEW.description,
            NEW.address,
            NEW.contact_email,
            true
        ) RETURNING id INTO new_org_id;

        -- Update the applicant's profile
        UPDATE users SET
            organization_id = new_org_id,
            role = 'org_admin',
            verification_status = 'verified',
            verified_at = NOW()
        WHERE email = NEW.applicant_email;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_org_application_approved ON organization_applications;
CREATE TRIGGER on_org_application_approved
    AFTER UPDATE ON organization_applications
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION handle_org_application_approval();

-- 3. Storage bucket for organization verification documents
-- Note: Buckets are usually created via Supabase dashboard or API, 
-- but we define the policy here if the bucket is created.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('org-documents', 'org-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for org-documents bucket
CREATE POLICY "Public can upload org documents"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'org-documents');

CREATE POLICY "Admins can view org documents"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'org-documents');
