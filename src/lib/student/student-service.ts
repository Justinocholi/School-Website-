import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import {
  ResultRecord,
  AcademicSession,
  TermRecord,
} from '@/types/database.types';
import { calculateTermPerformance } from '@/lib/grading/grading-engine';
import {
  getAdminResults,
  getAdminTerms,
  getAdminSessions,
  getAdminStudentById,
} from '@/lib/admin/admin-service';

export interface StudentAuthContext {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  class_name: string;
  class_id?: string;
  admission_date?: string;
  status: string;
  user_id?: string;
  email?: string;
}

function mapStudentRowToContext(student: any): StudentAuthContext {
  const classObj = student.class as { id: string; name: string } | null;
  const studentCode = String(student.student_id || '').toUpperCase();
  return {
    id: student.id,
    student_id: studentCode,
    first_name: student.first_name,
    last_name: student.last_name,
    full_name: `${student.first_name} ${student.last_name}`.trim(),
    class_name: classObj?.name || 'Unassigned',
    class_id: student.class_id || classObj?.id || undefined,
    admission_date: student.admission_date || undefined,
    status: student.status || 'active',
    user_id: student.user_id || undefined,
    email: `${studentCode.toLowerCase()}@student.greenfieldcollege.edu`,
  };
}

/**
 * Returns the currently authenticated student from Supabase.
 * Always resolves live student data from public.students in Supabase.
 */
export async function getAuthenticatedStudent(): Promise<StudentAuthContext | null> {
  const supabaseAdmin = createAdminClient();

  // 1. Check active student session cookie first (set on student login)
  try {
    const cookieStore = await cookies();
    const uidCookie = cookieStore.get('student_portal_uid');
    if (uidCookie?.value) {
      const student = await getAdminStudentById(uidCookie.value);
      if (student && student.status === 'active') {
        return mapStudentRowToContext(student);
      }
    }
  } catch {
    // Continue to Supabase Auth check
  }

  // 2. Check Supabase Auth session
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Find by user_id first
      const { data: studentByUser } = await supabaseAdmin
        .from('students')
        .select(
          'id, user_id, student_id, first_name, last_name, other_names, class_id, admission_date, status, class:classes(id, name, level)'
        )
        .eq('user_id', user.id)
        .maybeSingle();

      if (studentByUser && studentByUser.status === 'active') {
        return mapStudentRowToContext(studentByUser);
      }

      // Fallback: match by user_metadata.student_id or student email prefix
      const metaStudentId =
        user.user_metadata?.student_id ||
        (user.email?.endsWith('@student.greenfieldcollege.edu')
          ? user.email.split('@')[0].toUpperCase()
          : null);

      if (metaStudentId) {
        const studentByCode = await getAdminStudentById(String(metaStudentId));
        if (studentByCode && studentByCode.status === 'active') {
          if (!studentByCode.user_id) {
            await supabaseAdmin
              .from('students')
              .update({ user_id: user.id })
              .eq('id', studentByCode.id);
          }
          return mapStudentRowToContext(studentByCode);
        }
      }
    }
  } catch {
    // Unauthenticated
  }

  return null;
}

/**
 * Retrieves student dashboard summary: published results, academic session, announcements.
 */
export async function getStudentDashboardData(studentIdOrDbId: string) {
  const supabaseAdmin = createAdminClient();

  const [studentResults, { data: dbAnnouncements }] = await Promise.all([
    getAdminResults({
      status: 'published',
      studentId: studentIdOrDbId,
    }),
    supabaseAdmin
      .from('announcements')
      .select('id, title, summary, published_at')
      .eq('status', 'published')
      .in('target_audience', ['all', 'students'])
      .order('published_at', { ascending: false })
      .limit(5),
  ]);

  const announcements =
    dbAnnouncements && dbAnnouncements.length > 0
      ? dbAnnouncements.map((a) => ({
          id: a.id,
          title: a.title,
          published_at: a.published_at || new Date().toISOString(),
          summary: a.summary,
        }))
      : [
          {
            id: '1',
            title: 'Academic Term Resumption & Assessment Policy',
            published_at: '2026-09-07T08:00:00Z',
            summary:
              'All scholars are advised to inspect their terminal continuous assessments and examination scores.',
          },
          {
            id: '2',
            title: 'Science Fair & STEM Exhibition Submission Due',
            published_at: '2026-10-01T08:00:00Z',
            summary:
              'Submit your project briefs to the STEM coordinator before Friday.',
          },
        ];

  return {
    resultsCount: studentResults.length,
    announcements,
    recentResults: studentResults.slice(0, 10) as ResultRecord[],
  };
}

/**
 * Securely retrieves published results for the student from Supabase.
 * Guarantees that students cannot view drafts or results belonging to other students.
 */
export async function getStudentPublishedResults(
  studentDbIdOrId: string,
  termId?: string
): Promise<{
  results: ResultRecord[];
  performance: ReturnType<typeof calculateTermPerformance>;
  terms: TermRecord[];
  sessions: AcademicSession[];
  selectedTermId: string;
}> {
  const [terms, sessions, allStudentPublished] = await Promise.all([
    getAdminTerms(),
    getAdminSessions(),
    getAdminResults({
      status: 'published',
      studentId: studentDbIdOrId,
    }),
  ]);

  const activeTerm = terms.find((t: TermRecord) => t.is_active);
  let currentTermId =
    termId ||
    activeTerm?.id ||
    terms[0]?.id ||
    '33333333-3333-3333-3333-333333333331';

  // If no explicit termId filter was requested in the URL and the active term has 0 results
  // for this student, but another term has published results, auto-select the term with results.
  if (!termId && allStudentPublished.length > 0) {
    const hasInCurrent = allStudentPublished.some(
      (r) => r.term_id === currentTermId
    );
    if (!hasInCurrent) {
      currentTermId = allStudentPublished[0].term_id;
    }
  }

  const studentResults = allStudentPublished.filter(
    (r) => r.term_id === currentTermId
  );

  const performance = calculateTermPerformance(studentResults);

  return {
    results: studentResults,
    performance,
    terms,
    sessions,
    selectedTermId: currentTermId,
  };
}

/**
 * Access control boundary: strictly checks student ID matching against Supabase.
 */
export async function getStudentSingleResult(
  studentDbIdOrId: string,
  resultId: string
): Promise<ResultRecord | null> {
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(resultId.trim())) {
    return null;
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from('results')
    .select(
      `
      id, student_id, subject_id, class_id, term_id, status, total_score, grade, remarks, published_at, created_at, updated_at,
      student:students(id, user_id, student_id, first_name, last_name, other_names, class_id, admission_date, status, created_at, updated_at),
      subject:subjects(id, name, code, status, created_at),
      class:classes(id, name, level, status, created_at),
      term:terms(id, name, sequence_number, is_active, academic_session_id),
      scores:result_scores(id, result_id, score, assessment_component_id, component:assessment_components(id, name, code, maximum_score, sequence_number, is_active))
    `
    )
    .eq('id', resultId.trim())
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const sTrim = studentDbIdOrId.trim();
  const sUpper = sTrim.toUpperCase();
  const studentObj = (data as any).student;

  const isOwner =
    data.student_id === sTrim ||
    studentObj?.id === sTrim ||
    studentObj?.student_id?.toUpperCase() === sUpper;

  if (!isOwner) {
    return null;
  }

  return {
    ...(data as unknown as ResultRecord),
    total_score: Number(data.total_score ?? 0),
    scores: Array.isArray((data as any).scores)
      ? (data as any).scores.map((s: any) => ({
          ...s,
          score: Number(s.score ?? 0),
        }))
      : [],
  };
}
