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
