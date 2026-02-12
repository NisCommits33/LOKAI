-- SCRIPT TO CREATE INITIAL SUPER ADMIN
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    admin_email TEXT := 'admin@lokai.gov.np'; -- Updated to project name
    admin_password TEXT := 'LOKAI_Admin_2024'; -- User should change this
BEGIN
    -- 1. Create user in auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"LOKAI Super Admin"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

    -- 2. Create identities for the user
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        new_user_id,
        format('{"sub":"%s","email":"%s"}', new_user_id, admin_email)::jsonb,
        'email',
        now(),
        now(),
        now()
    );

    -- 3. Insert into public.users
    INSERT INTO users (
        id, 
        email, 
        full_name, 
        role, 
        verification_status, 
        is_active, 
        is_profile_complete
    )
    VALUES (
        new_user_id,
        admin_email,
        'LOKAI Super Admin',
        'super_admin',
        'approved',
        TRUE,
        TRUE
    );

    RAISE NOTICE 'Super Admin created with ID: %', new_user_id;
END $$;
