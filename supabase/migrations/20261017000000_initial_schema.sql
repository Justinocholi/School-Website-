-- School Website and Student Result Management System
-- Initial Migration: Schema, RLS, Indexes, and Functions

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER ROLES ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'administrator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE record_status AS ENUM ('active', 'inactive', 'archived', 'graduated', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE result_status AS ENUM ('draft', 'pending_review', 'published', 'correction_requested');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    display_name TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    level TEXT NOT NULL, -- e.g. 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'
    status record_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- e.g. 'MTH', 'ENG', 'BIO'
    status record_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CLASS_SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_class_subject UNIQUE (class_id, subject_id)
);

-- 7. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_id TEXT NOT NULL UNIQUE, -- Admission ID e.g. 'GFS001'
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    other_names TEXT,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    admission_date DATE,
    status record_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ACADEMIC SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.academic_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g. '2026/2027'
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TERMS TABLE
CREATE TABLE IF NOT EXISTS public.terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. 'First Term', 'Second Term', 'Third Term'
    sequence_number INT NOT NULL, -- 1, 2, 3
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_session_term_seq UNIQUE (academic_session_id, sequence_number)
);

-- 10. ASSESSMENT COMPONENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g. 'Continuous Assessment (CA)', 'Examination'
    code TEXT NOT NULL UNIQUE, -- 'ca', 'exam'
    maximum_score NUMERIC(5,2) NOT NULL DEFAULT 100, -- e.g. 30.00 for CA, 70.00 for Exam
    sequence_number INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. GRADING SCALES TABLE
CREATE TABLE IF NOT EXISTS public.grading_scales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    rules JSONB NOT NULL, -- Array of [{grade: 'A', min_score: 75, max_score: 100, remark: 'Excellent', gpa_point: 5.0}, ...]
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE RESTRICT,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
    status result_status NOT NULL DEFAULT 'draft',
    total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    grade TEXT NOT NULL DEFAULT '',
    remarks TEXT NOT NULL DEFAULT '',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_subject_term UNIQUE (student_id, subject_id, term_id)
);

-- 13. RESULT SCORES (Normalized Breakdown for Components like CA and Exam)
CREATE TABLE IF NOT EXISTS public.result_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID NOT NULL REFERENCES public.results(id) ON DELETE CASCADE,
    assessment_component_id UUID NOT NULL REFERENCES public.assessment_components(id) ON DELETE RESTRICT,
    score NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_result_component UNIQUE (result_id, assessment_component_id)
);

-- 14. IMPORT JOBS TABLE
CREATE TABLE IF NOT EXISTS public.import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_type TEXT NOT NULL, -- 'students', 'results_subject', 'results_class'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    total_rows INT NOT NULL DEFAULT 0,
    successful_rows INT NOT NULL DEFAULT 0,
    failed_rows INT NOT NULL DEFAULT 0,
    created_rows INT NOT NULL DEFAULT 0,
    updated_rows INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. IMPORT ERRORS TABLE
CREATE TABLE IF NOT EXISTS public.import_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID NOT NULL REFERENCES public.import_jobs(id) ON DELETE CASCADE,
    row_number INT NOT NULL,
    record_identifier TEXT, -- e.g. student_id
    error_code TEXT NOT NULL,
    error_message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General', -- 'General', 'Academic', 'Admissions', 'Sports'
    target_audience TEXT NOT NULL DEFAULT 'all', -- 'public', 'students', 'all'
    status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published'
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    change_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. SCHOOL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_name TEXT NOT NULL,
    school_motto TEXT NOT NULL,
    logo_url TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    current_session_id UUID REFERENCES public.academic_sessions(id) ON DELETE SET NULL,
    current_term_id UUID REFERENCES public.terms(id) ON DELETE SET NULL,
    default_grading_scale_id UUID REFERENCES public.grading_scales(id) ON DELETE SET NULL,
    admissions_open BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. STUDENT ACTIVATION CODES (for secure first-time signin or admin-initiated password resets)
CREATE TABLE IF NOT EXISTS public.student_activation_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 20. ADMISSIONS ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.admissions_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    target_class TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'contacted'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON public.results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_term_id ON public.results(term_id);
CREATE INDEX IF NOT EXISTS idx_results_subject_id ON public.results(subject_id);
CREATE INDEX IF NOT EXISTS idx_results_status ON public.results(status);
CREATE INDEX IF NOT EXISTS idx_result_scores_result_id ON public.result_scores(result_id);
CREATE INDEX IF NOT EXISTS idx_import_errors_job_id ON public.import_errors(import_job_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON public.announcements(slug);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activation_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_enquiries ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'administrator'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'teacher'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_auth_student_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM public.students
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles can be read by authenticated users"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL TO authenticated
USING (public.is_admin());

-- 2. School Settings Policies
CREATE POLICY "Anyone can read school settings"
ON public.school_settings FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage school settings"
ON public.school_settings FOR ALL TO authenticated
USING (public.is_admin());

-- 3. Classes & Subjects
CREATE POLICY "Anyone can read active classes"
ON public.classes FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage classes"
ON public.classes FOR ALL TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can read active subjects"
ON public.subjects FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage subjects"
ON public.subjects FOR ALL TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can read class subjects"
ON public.class_subjects FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage class subjects"
ON public.class_subjects FOR ALL TO authenticated
USING (public.is_admin());

-- 4. Academic Sessions & Terms
CREATE POLICY "Anyone can read sessions"
ON public.academic_sessions FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage sessions"
ON public.academic_sessions FOR ALL TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can read terms"
ON public.terms FOR SELECT TO public
USING (true);

CREATE POLICY "Admins manage terms"
ON public.terms FOR ALL TO authenticated
USING (public.is_admin());

-- 5. Assessment Components & Grading Scales
CREATE POLICY "Anyone can read assessment components"
ON public.assessment_components FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins manage assessment components"
ON public.assessment_components FOR ALL TO authenticated
USING (public.is_admin());

CREATE POLICY "Anyone can read grading scales"
ON public.grading_scales FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins manage grading scales"
ON public.grading_scales FOR ALL TO authenticated
USING (public.is_admin());

-- 6. Students
CREATE POLICY "Students can view their own student record"
ON public.students FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins have full access to students"
ON public.students FOR ALL TO authenticated
USING (public.is_admin());

-- 7. Results
CREATE POLICY "Students can only read their own published results"
ON public.results FOR SELECT TO authenticated
USING (
    (student_id = public.get_auth_student_id() AND status = 'published')
    OR public.is_admin()
);

CREATE POLICY "Admins have full access to results"
ON public.results FOR ALL TO authenticated
USING (public.is_admin());

-- 8. Result Scores
CREATE POLICY "Students can read their own published result scores"
ON public.result_scores FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.results r
        WHERE r.id = result_scores.result_id
          AND r.student_id = public.get_auth_student_id()
          AND r.status = 'published'
    )
    OR public.is_admin()
);

CREATE POLICY "Admins have full access to result scores"
ON public.result_scores FOR ALL TO authenticated
USING (public.is_admin());

-- 9. Announcements
CREATE POLICY "Public can view published public announcements"
ON public.announcements FOR SELECT TO public
USING (status = 'published');

CREATE POLICY "Admins have full access to announcements"
ON public.announcements FOR ALL TO authenticated
USING (public.is_admin());

-- 10. Audit Logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT TO authenticated
USING (public.is_admin());

-- 11. Import Jobs & Errors
CREATE POLICY "Admins have full access to import jobs"
ON public.import_jobs FOR ALL TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins have full access to import errors"
ON public.import_errors FOR ALL TO authenticated
USING (public.is_admin());

-- 12. Admissions Enquiries
CREATE POLICY "Anyone can submit admissions enquiries"
ON public.admissions_enquiries FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Admins can view and manage admissions enquiries"
ON public.admissions_enquiries FOR ALL TO authenticated
USING (public.is_admin());
