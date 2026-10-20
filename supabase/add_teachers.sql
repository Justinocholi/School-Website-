-- ============================================================================
-- Greenfield International College - Staff & Teacher Accounts Setup
-- This script provisions multiple teacher/staff accounts and configures
-- granular Role-Based Access Control (RBAC) in Supabase.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Helper function for any Staff member (Teachers + Administrators)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('teacher', 'administrator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update RLS policies to allow Teachers to add students, results & scores
DROP POLICY IF EXISTS "Staff have full access to students" ON public.students;
DROP POLICY IF EXISTS "Admins have full access to students" ON public.students;
CREATE POLICY "Staff have full access to students"
ON public.students FOR ALL TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "Staff have access to results" ON public.results;
DROP POLICY IF EXISTS "Admins have full access to results" ON public.results;
CREATE POLICY "Staff have access to results"
ON public.results FOR ALL TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "Staff have access to result scores" ON public.result_scores;
DROP POLICY IF EXISTS "Admins have full access to result scores" ON public.result_scores;
CREATE POLICY "Staff have access to result scores"
ON public.result_scores FOR ALL TO authenticated
USING (public.is_staff());

-- ============================================================================
-- 3. PROVISION TEACHER ACCOUNTS
-- Password for all teachers: Teacher@2026
-- ============================================================================

-- Teacher 1: Mr. David Adeleke (Mathematics & Physics)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000011',
    'authenticated',
    'authenticated',
    'david.adeleke@greenfieldcollege.edu',
    crypt('Teacher@2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"teacher","display_name":"Mr. David Adeleke","department":"Mathematics & Sciences"}'::jsonb,
    now(), now(), '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Teacher@2026', gen_salt('bf')),
    email = 'david.adeleke@greenfieldcollege.edu',
    email_confirmed_at = now(),
    updated_at = now();

-- Teacher 2: Mrs. Grace Danjuma (English Language & Literature)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000012',
    'authenticated',
    'authenticated',
    'grace.danjuma@greenfieldcollege.edu',
    crypt('Teacher@2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"teacher","display_name":"Mrs. Grace Danjuma","department":"Languages & Humanities"}'::jsonb,
    now(), now(), '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Teacher@2026', gen_salt('bf')),
    email = 'grace.danjuma@greenfieldcollege.edu',
    email_confirmed_at = now(),
    updated_at = now();

-- Teacher 3: Mr. Samuel Osei (Basic Science & Chemistry)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000013',
    'authenticated',
    'authenticated',
    'samuel.osei@greenfieldcollege.edu',
    crypt('Teacher@2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"teacher","display_name":"Mr. Samuel Osei","department":"Basic Sciences & Computing"}'::jsonb,
    now(), now(), '', '', '', ''
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Teacher@2026', gen_salt('bf')),
    email = 'samuel.osei@greenfieldcollege.edu',
    email_confirmed_at = now(),
    updated_at = now();

-- Identities for GoTrue authentication
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id'
    ) THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES 
            ('a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000011', json_build_object('sub', 'a0000000-0000-0000-0000-000000000011', 'email', 'david.adeleke@greenfieldcollege.edu'), 'email', 'david.adeleke@greenfieldcollege.edu', now(), now(), now()),
            ('a0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000012', json_build_object('sub', 'a0000000-0000-0000-0000-000000000012', 'email', 'grace.danjuma@greenfieldcollege.edu'), 'email', 'grace.danjuma@greenfieldcollege.edu', now(), now(), now()),
            ('a0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000013', json_build_object('sub', 'a0000000-0000-0000-0000-000000000013', 'email', 'samuel.osei@greenfieldcollege.edu'), 'email', 'samuel.osei@greenfieldcollege.edu', now(), now(), now())
        ON CONFLICT (provider, provider_id) DO NOTHING;
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES 
            ('a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000011', json_build_object('sub', 'a0000000-0000-0000-0000-000000000011', 'email', 'david.adeleke@greenfieldcollege.edu'), 'email', now(), now(), now()),
            ('a0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000012', json_build_object('sub', 'a0000000-0000-0000-0000-000000000012', 'email', 'grace.danjuma@greenfieldcollege.edu'), 'email', now(), now(), now()),
            ('a0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000013', json_build_object('sub', 'a0000000-0000-0000-0000-000000000013', 'email', 'samuel.osei@greenfieldcollege.edu'), 'email', now(), now(), now())
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- 4. Register Profiles for Teachers
INSERT INTO public.profiles (id, role, display_name, email, created_at, updated_at)
VALUES 
    ('a0000000-0000-0000-0000-000000000011', 'teacher', 'Mr. David Adeleke', 'david.adeleke@greenfieldcollege.edu', now(), now()),
    ('a0000000-0000-0000-0000-000000000012', 'teacher', 'Mrs. Grace Danjuma', 'grace.danjuma@greenfieldcollege.edu', now(), now()),
    ('a0000000-0000-0000-0000-000000000013', 'teacher', 'Mr. Samuel Osei', 'samuel.osei@greenfieldcollege.edu', now(), now())
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    display_name = EXCLUDED.display_name,
    email = EXCLUDED.email,
    updated_at = now();
