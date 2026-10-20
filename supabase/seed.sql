-- Seed data for School Website and Student Result Management System
-- Provides baseline academic structure, grading scale, assessment components, and initial school configuration

-- 1. Academic Sessions
INSERT INTO public.academic_sessions (id, name, start_date, end_date, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '2026/2027', '2026-09-07', '2027-07-20', true),
    ('22222222-2222-2222-2222-222222222222', '2025/2026', '2025-09-08', '2026-07-22', false)
ON CONFLICT (name) DO NOTHING;

-- 2. Terms for 2026/2027
INSERT INTO public.terms (id, academic_session_id, name, sequence_number, start_date, end_date, is_active)
VALUES
    ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'First Term', 1, '2026-09-07', '2026-12-18', true),
    ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Second Term', 2, '2027-01-11', '2027-04-09', false),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Third Term', 3, '2027-04-26', '2027-07-20', false)
ON CONFLICT (academic_session_id, sequence_number) DO NOTHING;

-- 3. Assessment Components (CA 30, Exam 70)
INSERT INTO public.assessment_components (id, name, code, maximum_score, sequence_number, is_active)
VALUES
    ('44444444-4444-4444-4444-444444444441', 'Continuous Assessment', 'ca', 30.00, 1, true),
    ('44444444-4444-4444-4444-444444444442', 'Examination', 'exam', 70.00, 2, true)
ON CONFLICT (code) DO NOTHING;

-- 4. Grading Scale (Configurable rules)
INSERT INTO public.grading_scales (id, name, version, is_active, rules)
VALUES
    ('55555555-5555-5555-5555-555555555555', 'Standard Secondary Grading Scale', 1, true, '[
        {"grade": "A", "min_score": 75, "max_score": 100, "remark": "Distinction", "gpa_point": 5.0},
        {"grade": "B", "min_score": 65, "max_score": 74.99, "remark": "Very Good", "gpa_point": 4.0},
        {"grade": "C", "min_score": 50, "max_score": 64.99, "remark": "Credit", "gpa_point": 3.0},
        {"grade": "D", "min_score": 45, "max_score": 49.99, "remark": "Pass", "gpa_point": 2.0},
        {"grade": "E", "min_score": 40, "max_score": 44.99, "remark": "Weak Pass", "gpa_point": 1.0},
        {"grade": "F", "min_score": 0, "max_score": 39.99, "remark": "Fail", "gpa_point": 0.0}
    ]'::jsonb)
ON CONFLICT DO NOTHING;

-- 5. School Settings
INSERT INTO public.school_settings (
    id, school_name, school_motto, logo_url, email, phone, address,
    current_session_id, current_term_id, default_grading_scale_id, admissions_open
)
VALUES (
    '66666666-6666-6666-6666-666666666666',
    'Greenfield International College',
    'Knowledge, Integrity, and Excellence',
    '/logo.png',
    'info@greenfieldcollege.edu',
    '+234 (0) 803 123 4567',
    '15 Heritage Boulevard, Victoria Island, Lagos, Nigeria',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333331',
    '55555555-5555-5555-5555-555555555555',
    true
)
ON CONFLICT DO NOTHING;

-- 6. Classes
INSERT INTO public.classes (id, name, level, status)
VALUES
    ('77777777-7777-7777-7777-777777777771', 'JSS 1A', 'JSS 1', 'active'),
    ('77777777-7777-7777-7777-777777777772', 'JSS 1B', 'JSS 1', 'active'),
    ('77777777-7777-7777-7777-777777777773', 'JSS 2A', 'JSS 2', 'active'),
    ('77777777-7777-7777-7777-777777777774', 'JSS 3A', 'JSS 3', 'active'),
    ('77777777-7777-7777-7777-777777777775', 'SS 1 Science', 'SS 1', 'active'),
    ('77777777-7777-7777-7777-777777777776', 'SS 2 Science', 'SS 2', 'active')
ON CONFLICT (name) DO NOTHING;

-- 7. Subjects
INSERT INTO public.subjects (id, name, code, status)
VALUES
    ('88888888-8888-8888-8888-888888888881', 'Mathematics', 'MTH', 'active'),
    ('88888888-8888-8888-8888-888888888882', 'English Language', 'ENG', 'active'),
    ('88888888-8888-8888-8888-888888888883', 'Basic Science', 'BSC', 'active'),
    ('88888888-8888-8888-8888-888888888884', 'Civic Education', 'CVE', 'active'),
    ('88888888-8888-8888-8888-888888888885', 'Physics', 'PHY', 'active'),
    ('88888888-8888-8888-8888-888888888886', 'Chemistry', 'CHM', 'active'),
    ('88888888-8888-8888-8888-888888888887', 'Biology', 'BIO', 'active')
ON CONFLICT (code) DO NOTHING;

-- 8. Sample Announcements
INSERT INTO public.announcements (id, title, slug, summary, body, category, target_audience, status)
VALUES
    ('99999999-9999-9999-9999-999999999991', 
     'Resumption Date for 2026/2027 Academic Session', 
     'resumption-date-2026-2027', 
     'All students and parents are requested to note the resumption timeline for First Term.', 
     'We are pleased to welcome all returning and newly admitted students to Greenfield International College for the 2026/2027 academic session. Boarding students are expected to arrive on Sunday, September 6th, 2026, while academic activities commence promptly on Monday, September 7th, 2026.', 
     'Academic', 'all', 'published'),
    ('99999999-9999-9999-9999-999999999992', 
     'Admissions Now Open for JSS1, JSS2 and SS1 Transfer Students', 
     'admissions-open-2026-2027', 
     'Application forms are now available online and at the admissions administrative office.', 
     'Greenfield International College invites prospective students for admission into Junior Secondary and Senior Secondary classes for the 2026/2027 academic year. Entrance examinations and interview schedules are detailed on our admissions page.', 
     'Admissions', 'public', 'published')
ON CONFLICT (slug) DO NOTHING;
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
