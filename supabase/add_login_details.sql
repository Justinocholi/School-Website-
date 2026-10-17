-- Greenfield International College
-- SQL Migration / Script to Add Student and Admin Login Accounts directly to Supabase
-- This inserts confirmed credentials into auth.users, auth.identities, public.profiles, and public.students

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SCHOOL ADMINISTRATOR ACCOUNT
-- Login Email:    admin@greenfieldcollege.edu
-- Login Password: Admin@2026
-- Role:           administrator
-- ============================================================================

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
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@greenfieldcollege.edu',
    crypt('Admin@2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"administrator","display_name":"School Administrator"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Admin@2026', gen_salt('bf')),
    email = 'admin@greenfieldcollege.edu',
    email_confirmed_at = now(),
    updated_at = now();

-- Ensure Administrator Identity exists for Supabase GoTrue Auth
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id'
    ) THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'a0000000-0000-0000-0000-000000000001',
            json_build_object('sub', 'a0000000-0000-0000-0000-000000000001', 'email', 'admin@greenfieldcollege.edu'),
            'email',
            'admin@greenfieldcollege.edu',
            now(),
            now(),
            now()
        )
        ON CONFLICT (provider, provider_id) DO NOTHING;
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'a0000000-0000-0000-0000-000000000001',
            json_build_object('sub', 'a0000000-0000-0000-0000-000000000001', 'email', 'admin@greenfieldcollege.edu'),
            'email',
            now(),
            now(),
            now()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Administrator Profile
INSERT INTO public.profiles (id, role, display_name, email, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'administrator',
    'School Administrator',
    'admin@greenfieldcollege.edu',
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET
    role = 'administrator',
    display_name = 'School Administrator',
    email = 'admin@greenfieldcollege.edu',
    updated_at = now();

-- ============================================================================
-- 2. STUDENT ACCOUNT 1: Daniel Okafor
-- Student ID:     GFS001
-- Internal Email: gfs001@student.greenfieldcollege.edu
-- Login Password: Student@2026
-- Class:          JSS 2A
-- ============================================================================

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
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'gfs001@student.greenfieldcollege.edu',
    crypt('Student@2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"student","display_name":"Daniel Okafor","student_id":"GFS001"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Student@2026', gen_salt('bf')),
    email = 'gfs001@student.greenfieldcollege.edu',
    email_confirmed_at = now(),
    updated_at = now();

-- Identity for GFS001
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id'
    ) THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000002',
            'a0000000-0000-0000-0000-000000000002',
            json_build_object('sub', 'a0000000-0000-0000-0000-000000000002', 'email', 'gfs001@student.greenfieldcollege.edu'),
            'email',
            'gfs001@student.greenfieldcollege.edu',
            now(),
            now(),
            now()
        )
        ON CONFLICT (provider, provider_id) DO NOTHING;
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000002',
            'a0000000-0000-0000-0000-000000000002',
            json_build_object('sub', 'a0000000-0000-0000-0000-000000000002', 'email', 'gfs001@student.greenfieldcollege.edu'),
            'email',
            now(),
            now(),
            now()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Student 1 Profile
INSERT INTO public.profiles (id, role, display_name, email, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'student',
    'Daniel Okafor',
    'gfs001@student.greenfieldcollege.edu',
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET
    role = 'student',
    display_name = 'Daniel Okafor',
    email = 'gfs001@student.greenfieldcollege.edu',
    updated_at = now();

-- Student 1 Record in public.students
INSERT INTO public.students (
    id,
    user_id,
    student_id,
    first_name,
    last_name,
    other_names,
    class_id,
    admission_date,
    status
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'a0000000-0000-0000-0000-000000000002',
    'GFS001',
    'Daniel',
    'Okafor',
    'Chukwudi',
    '77777777-7777-7777-7777-777777777773', -- JSS 2A
    '2025-09-08',
    'active'
) ON CONFLICT (student_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    class_id = EXCLUDED.class_id,
    status = EXCLUDED.status;

-- ============================================================================
-- 3. STUDENT ACCOUNT 2: Sarah Adamu
-- Student ID:     GFS002
-- Internal Email: gfs002@student.greenfieldcollege.edu
-- Login Password: Student@2026
-- Class:          JSS 2A
-- ============================================================================

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
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'gfs002@student.greenfieldcollege.edu',
    crypt('Student@2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"student","display_name":"Sarah Adamu","student_id":"GFS002"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Student@2026', gen_salt('bf')),
    email = 'gfs002@student.greenfieldcollege.edu',
    email_confirmed_at = now(),
    updated_at = now();

-- Identity for GFS002
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'auth' AND table_name = 'identities' AND column_name = 'provider_id'
    ) THEN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000003',
            'a0000000-0000-0000-0000-000000000003',
            json_build_object('sub', 'a0000000-0000-0000-0000-000000000003', 'email', 'gfs002@student.greenfieldcollege.edu'),
            'email',
            'gfs002@student.greenfieldcollege.edu',
            now(),
            now(),
            now()
        )
        ON CONFLICT (provider, provider_id) DO NOTHING;
    ELSE
        INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000003',
            'a0000000-0000-0000-0000-000000000003',
            json_build_object('sub', 'a0000000-0000-0000-0000-000000000003', 'email', 'gfs002@student.greenfieldcollege.edu'),
            'email',
            now(),
            now(),
            now()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Student 2 Profile
INSERT INTO public.profiles (id, role, display_name, email, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'student',
    'Sarah Adamu',
    'gfs002@student.greenfieldcollege.edu',
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET
    role = 'student',
    display_name = 'Sarah Adamu',
    email = 'gfs002@student.greenfieldcollege.edu',
    updated_at = now();

-- Student 2 Record in public.students
INSERT INTO public.students (
    id,
    user_id,
    student_id,
    first_name,
    last_name,
    other_names,
    class_id,
    admission_date,
    status
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'a0000000-0000-0000-0000-000000000003',
    'GFS002',
    'Sarah',
    'Adamu',
    'Fatima',
    '77777777-7777-7777-7777-777777777773', -- JSS 2A
    '2025-09-08',
    'active'
) ON CONFLICT (student_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    class_id = EXCLUDED.class_id,
    status = EXCLUDED.status;

-- ============================================================================
-- 4. PUBLISHED RESULTS & SCORES (For Student GFS001 - Daniel Okafor)
-- Session: 2026/2027 First Term
-- Subjects: Mathematics, English Language, Basic Science, Civic Education
-- ============================================================================

-- Mathematics (CA: 26.5/30, Exam: 60/70 => Total: 86.5, Grade: A)
INSERT INTO public.results (
    id, student_id, subject_id, term_id, class_id, status, total_score, grade, remarks, published_at
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '88888888-8888-8888-8888-888888888881',
    '33333333-3333-3333-3333-333333333331',
    '77777777-7777-7777-7777-777777777773',
    'published',
    86.50,
    'A',
    'Distinction',
    now()
) ON CONFLICT (student_id, subject_id, term_id) DO UPDATE SET
    total_score = EXCLUDED.total_score,
    grade = EXCLUDED.grade,
    remarks = EXCLUDED.remarks,
    status = 'published';

INSERT INTO public.result_scores (result_id, assessment_component_id, score)
VALUES
    ('c0000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444441', 26.50), -- CA
    ('c0000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444442', 60.00)  -- Exam
ON CONFLICT (result_id, assessment_component_id) DO UPDATE SET score = EXCLUDED.score;

-- English Language (CA: 22.0/30, Exam: 52/70 => Total: 74.0, Grade: B)
INSERT INTO public.results (
    id, student_id, subject_id, term_id, class_id, status, total_score, grade, remarks, published_at
) VALUES (
    'c0000000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '88888888-8888-8888-8888-888888888882',
    '33333333-3333-3333-3333-333333333331',
    '77777777-7777-7777-7777-777777777773',
    'published',
    74.00,
    'B',
    'Very Good',
    now()
) ON CONFLICT (student_id, subject_id, term_id) DO UPDATE SET
    total_score = EXCLUDED.total_score,
    grade = EXCLUDED.grade,
    remarks = EXCLUDED.remarks,
    status = 'published';

INSERT INTO public.result_scores (result_id, assessment_component_id, score)
VALUES
    ('c0000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444441', 22.00), -- CA
    ('c0000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444442', 52.00)  -- Exam
ON CONFLICT (result_id, assessment_component_id) DO UPDATE SET score = EXCLUDED.score;

-- Basic Science (CA: 24.5/30, Exam: 54/70 => Total: 78.5, Grade: A)
INSERT INTO public.results (
    id, student_id, subject_id, term_id, class_id, status, total_score, grade, remarks, published_at
) VALUES (
    'c0000000-0000-0000-0000-000000000003',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '88888888-8888-8888-8888-888888888883',
    '33333333-3333-3333-3333-333333333331',
    '77777777-7777-7777-7777-777777777773',
    'published',
    78.50,
    'A',
    'Distinction',
    now()
) ON CONFLICT (student_id, subject_id, term_id) DO UPDATE SET
    total_score = EXCLUDED.total_score,
    grade = EXCLUDED.grade,
    remarks = EXCLUDED.remarks,
    status = 'published';

INSERT INTO public.result_scores (result_id, assessment_component_id, score)
VALUES
    ('c0000000-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444441', 24.50), -- CA
    ('c0000000-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444442', 54.00)  -- Exam
ON CONFLICT (result_id, assessment_component_id) DO UPDATE SET score = EXCLUDED.score;

-- Civic Education (CA: 23.0/30, Exam: 48/70 => Total: 71.0, Grade: B)
INSERT INTO public.results (
    id, student_id, subject_id, term_id, class_id, status, total_score, grade, remarks, published_at
) VALUES (
    'c0000000-0000-0000-0000-000000000004',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '88888888-8888-8888-8888-888888888884',
    '33333333-3333-3333-3333-333333333331',
    '77777777-7777-7777-7777-777777777773',
    'published',
    71.00,
    'B',
    'Very Good',
    now()
) ON CONFLICT (student_id, subject_id, term_id) DO UPDATE SET
    total_score = EXCLUDED.total_score,
    grade = EXCLUDED.grade,
    remarks = EXCLUDED.remarks,
    status = 'published';

INSERT INTO public.result_scores (result_id, assessment_component_id, score)
VALUES
    ('c0000000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444441', 23.00), -- CA
    ('c0000000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444442', 48.00)  -- Exam
ON CONFLICT (result_id, assessment_component_id) DO UPDATE SET score = EXCLUDED.score;
