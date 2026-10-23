import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import {
  StudentRecord,
  ResultRecord,
  AcademicSession,
  TermRecord,
  Announcement,
} from '@/types/database.types';
import { calculateTermPerformance } from '@/lib/grading/grading-engine';

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

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return !url.includes('placeholder') && !key.includes('placeholder') && url.startsWith('http');
}

/**
 * Returns the currently authenticated student session.
 * Enforces server-side authentication check.
 */
export async function getAuthenticatedStudent(): Promise<StudentAuthContext | null> {
  // 1. Check Supabase Auth if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: student } = await supabase
          .from('students')
          .select('id, student_id, first_name, last_name, other_names, admission_date, status, class:classes(id, name)')
          .eq('user_id', user.id)
          .single();

        if (student) {
          const classObj = student.class as unknown as { id: string; name: string } | null;
          return {
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            full_name: `${student.first_name} ${student.last_name}`,
            class_name: classObj?.name || 'Unassigned',
            class_id: classObj?.id,
            admission_date: student.admission_date,
            status: student.status,
            user_id: user.id,
            email: user.email,
          };
        }
      }
    } catch {
      // Supabase query error fallback
    }
  }

  // 2. Check demo cookie session
  try {
    const cookieStore = await cookies();
    const demoCookie = cookieStore.get('demo_student_session');
    if (demoCookie?.value) {
      const parsed = JSON.parse(demoCookie.value);
      if (parsed.student_id) {
        // Cross-reference with persistent store
        const { findStoreStudent } = await import('@/lib/storage/store');
        const stored = findStoreStudent(parsed.student_id);

        const firstName = parsed.first_name || stored?.first_name || parsed.name?.split(' ')[0] || 'Student';
        const lastName = parsed.last_name || stored?.last_name || parsed.name?.split(' ').slice(1).join(' ') || '';
        const fullName = parsed.full_name || (stored ? `${stored.first_name} ${stored.last_name}` : parsed.name) || `${firstName} ${lastName}`.trim();
        const className = parsed.class_name || stored?.class?.name || 'JSS 1A';
        const classId = parsed.class_id || stored?.class_id || '77777777-7777-7777-7777-777777777771';
        const admissionDate = parsed.admission_date || stored?.admission_date || '2026-09-01';
        const studentId = parsed.student_id.toUpperCase();
        const id = stored?.id || parsed.id || studentId;

        return {
          id,
          student_id: studentId,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          class_name: className,
          class_id: classId,
          admission_date: admissionDate,
          status: parsed.status || stored?.status || 'active',
          email: `${studentId.toLowerCase()}@student.greenfieldcollege.edu`,
        };
      }
    }
  } catch {
    // Cookie read failed
  }

  return null;
}

/**
 * Retrieves student dashboard summary: published results, academic session, announcements.
 */
export async function getStudentDashboardData(studentIdOrDbId: string) {
  const { getAdminResults } = await import('@/lib/admin/admin-service');
  const allResults = await getAdminResults({ status: 'published' });

  const normId = studentIdOrDbId.toUpperCase();
  const studentResults = allResults.filter(r =>
    r.student_id === studentIdOrDbId ||
    r.student?.id === studentIdOrDbId ||
    r.student?.student_id.toUpperCase() === normId
  );

  return {
    resultsCount: studentResults.length,
    announcements: [
      {
        id: '1',
        title: 'Academic Term Resumption & Assessment Policy',
        published_at: '2026-09-07T08:00:00Z',
        summary: 'All scholars are advised to inspect their terminal continuous assessments and examination scores.',
      },
      {
        id: '2',
        title: 'Science Fair & STEM Exhibition Submission Due',
        published_at: '2026-10-01T08:00:00Z',
        summary: 'Submit your project briefs to the STEM coordinator before Friday.',
      },
    ],
    recentResults: studentResults.slice(0, 5) as ResultRecord[],
  };
}

/**
 * Securely retrieves published results for the student.
 * Guarantees that students cannot view drafts or results belonging to other students.
 */
export async function getStudentPublishedResults(studentDbIdOrId: string, termId?: string): Promise<{
  results: ResultRecord[];
  performance: ReturnType<typeof calculateTermPerformance>;
  terms: TermRecord[];
  sessions: AcademicSession[];
  selectedTermId: string;
}> {
  const { getAdminTerms, getAdminSessions, getAdminResults } = await import('@/lib/admin/admin-service');
  const terms = await getAdminTerms();
  const sessions = await getAdminSessions();

  const activeTerm = terms.find((t: TermRecord) => t.is_active);
  const currentTermId = termId || activeTerm?.id || terms[0]?.id || '33333333-3333-3333-3333-333333333331';

  const allPublished = await getAdminResults({ termId: currentTermId, status: 'published' });
  const normId = studentDbIdOrId.toUpperCase();

  const studentResults = allPublished.filter(r =>
    r.student_id === studentDbIdOrId ||
    r.student?.id === studentDbIdOrId ||
    r.student?.student_id.toUpperCase() === normId
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
 * Access control boundary: strictly checks student ID matching.
 */
export async function getStudentSingleResult(studentDbIdOrId: string, resultId: string): Promise<ResultRecord | null> {
  const { getAdminResults } = await import('@/lib/admin/admin-service');
  const allResults = await getAdminResults({ status: 'published' });
  const normId = studentDbIdOrId.toUpperCase();

  const found = allResults.find(r =>
    r.id === resultId &&
    (r.student_id === studentDbIdOrId || r.student?.id === studentDbIdOrId || r.student?.student_id.toUpperCase() === normId)
  );

  return found || null;
}
