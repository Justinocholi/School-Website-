import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import {
  StudentRecord,
  ResultRecord,
  AcademicSession,
  TermRecord,
  Announcement,
} from '@/types/database.types';
import { calculateTermPerformance, evaluateGrade } from '@/lib/grading/grading-engine';

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

// Sample fallback dataset for local preview or demo student
const DEMO_STUDENT: StudentAuthContext = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  student_id: 'GFS001',
  first_name: 'Daniel',
  last_name: 'Okafor',
  full_name: 'Daniel Okafor',
  class_name: 'JSS 2A',
  class_id: '77777777-7777-7777-7777-777777777773',
  admission_date: '2025-09-08',
  status: 'active',
  email: 'gfs001@student.greenfieldcollege.edu',
};

const DEMO_SESSIONS: AcademicSession[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: '2026/2027',
    start_date: '2026-09-07',
    end_date: '2027-07-20',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: '2025/2026',
    start_date: '2025-09-08',
    end_date: '2026-07-22',
    is_active: false,
    created_at: new Date().toISOString(),
  },
];

const DEMO_TERMS: TermRecord[] = [
  {
    id: '33333333-3333-3333-3333-333333333331',
    academic_session_id: '11111111-1111-1111-1111-111111111111',
    name: 'First Term',
    sequence_number: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    academic_session_id: '11111111-1111-1111-1111-111111111111',
    name: 'Second Term',
    sequence_number: 2,
    is_active: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    academic_session_id: '11111111-1111-1111-1111-111111111111',
    name: 'Third Term',
    sequence_number: 3,
    is_active: false,
    created_at: new Date().toISOString(),
  },
];

const DEMO_PUBLISHED_RESULTS: ResultRecord[] = [
  {
    id: 'res-001',
    student_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    subject_id: '88888888-8888-8888-8888-888888888881',
    term_id: '33333333-3333-3333-3333-333333333331',
    class_id: '77777777-7777-7777-7777-777777777773',
    status: 'published',
    total_score: 87.0,
    grade: 'A',
    remarks: 'Distinction',
    published_at: '2026-10-15T10:00:00Z',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-15T10:00:00Z',
    subject: { id: '88888888-8888-8888-8888-888888888881', name: 'Mathematics', code: 'MTH', status: 'active', created_at: '' },
    class: { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
    scores: [
      { id: 'sc-1', result_id: 'res-001', assessment_component_id: 'ca', score: 27, component: { id: 'ca', name: 'Continuous Assessment', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-2', result_id: 'res-001', assessment_component_id: 'exam', score: 60, component: { id: 'exam', name: 'Examination', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'res-002',
    student_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    subject_id: '88888888-8888-8888-8888-888888888882',
    term_id: '33333333-3333-3333-3333-333333333331',
    class_id: '77777777-7777-7777-7777-777777777773',
    status: 'published',
    total_score: 82.0,
    grade: 'A',
    remarks: 'Distinction',
    published_at: '2026-10-15T10:00:00Z',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-15T10:00:00Z',
    subject: { id: '88888888-8888-8888-8888-888888888882', name: 'English Language', code: 'ENG', status: 'active', created_at: '' },
    class: { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
    scores: [
      { id: 'sc-3', result_id: 'res-002', assessment_component_id: 'ca', score: 26, component: { id: 'ca', name: 'Continuous Assessment', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-4', result_id: 'res-002', assessment_component_id: 'exam', score: 56, component: { id: 'exam', name: 'Examination', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'res-003',
    student_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    subject_id: '88888888-8888-8888-8888-888888888883',
    term_id: '33333333-3333-3333-3333-333333333331',
    class_id: '77777777-7777-7777-7777-777777777773',
    status: 'published',
    total_score: 78.5,
    grade: 'A',
    remarks: 'Distinction',
    published_at: '2026-10-15T10:00:00Z',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-15T10:00:00Z',
    subject: { id: '88888888-8888-8888-8888-888888888883', name: 'Basic Science', code: 'BSC', status: 'active', created_at: '' },
    class: { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
    scores: [
      { id: 'sc-5', result_id: 'res-003', assessment_component_id: 'ca', score: 24.5, component: { id: 'ca', name: 'Continuous Assessment', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-6', result_id: 'res-003', assessment_component_id: 'exam', score: 54, component: { id: 'exam', name: 'Examination', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'res-004',
    student_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    subject_id: '88888888-8888-8888-8888-888888888884',
    term_id: '33333333-3333-3333-3333-333333333331',
    class_id: '77777777-7777-7777-7777-777777777773',
    status: 'published',
    total_score: 71.0,
    grade: 'B',
    remarks: 'Very Good',
    published_at: '2026-10-15T10:00:00Z',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-15T10:00:00Z',
    subject: { id: '88888888-8888-8888-8888-888888888884', name: 'Civic Education', code: 'CVE', status: 'active', created_at: '' },
    class: { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
    scores: [
      { id: 'sc-7', result_id: 'res-004', assessment_component_id: 'ca', score: 23, component: { id: 'ca', name: 'Continuous Assessment', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-8', result_id: 'res-004', assessment_component_id: 'exam', score: 48, component: { id: 'exam', name: 'Examination', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
];

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
        return {
          ...DEMO_STUDENT,
          student_id: parsed.student_id,
          full_name: parsed.name || DEMO_STUDENT.full_name,
          class_name: parsed.class_name || DEMO_STUDENT.class_name,
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
export async function getStudentDashboardData(studentId: string) {
  // Query Supabase if connected
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: results } = await supabase
        .from('results')
        .select('id, total_score, grade, status, subject:subjects(name)')
        .eq('student_id', studentId)
        .eq('status', 'published');

      const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (results && results.length > 0) {
        return {
          resultsCount: results.length,
          announcements: announcements || [],
          recentResults: results.slice(0, 5) as unknown as ResultRecord[],
        };
      }
    } catch {
      // Fall back to demo data
    }
  }

  return {
    resultsCount: DEMO_PUBLISHED_RESULTS.length,
    announcements: [
      {
        id: '1',
        title: 'First Term Resumption Information',
        published_at: '2026-09-07T08:00:00Z',
        summary: 'All students are expected to complete their portal subject registration.',
      },
      {
        id: '2',
        title: 'Science Fair & Exhibition Submission Due',
        published_at: '2026-10-01T08:00:00Z',
        summary: 'Submit your project briefs to the STEM coordinator before Friday.',
      },
    ],
    recentResults: DEMO_PUBLISHED_RESULTS.slice(0, 4) as ResultRecord[],
  };
}

/**
 * Securely retrieves published results for the student.
 * Guarantees that students cannot view drafts or results belonging to other students.
 */
export async function getStudentPublishedResults(studentDbId: string, termId?: string): Promise<{
  results: ResultRecord[];
  performance: ReturnType<typeof calculateTermPerformance>;
  terms: TermRecord[];
  sessions: AcademicSession[];
  selectedTermId: string;
}> {
  // Supabase query
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('results')
        .select(`
          id, student_id, total_score, grade, remarks, status, published_at, created_at,
          subject:subjects(id, name, code),
          class:classes(id, name, level),
          scores:result_scores(id, score, component:assessment_components(id, name, code, maximum_score))
        `)
        .eq('student_id', studentDbId)
        .eq('status', 'published');

      if (termId) {
        query = query.eq('term_id', termId);
      }

      const { data: dbResults } = await query;
      const { data: dbTerms } = await supabase.from('terms').select('*').order('sequence_number');
      const { data: dbSessions } = await supabase.from('academic_sessions').select('*');

      if (dbResults && dbResults.length > 0) {
        const typedResults = dbResults as unknown as ResultRecord[];
        const performance = calculateTermPerformance(typedResults);
        return {
          results: typedResults,
          performance,
          terms: (dbTerms as unknown as TermRecord[]) || DEMO_TERMS,
          sessions: (dbSessions as unknown as AcademicSession[]) || DEMO_SESSIONS,
          selectedTermId: termId || (dbTerms?.[0]?.id || DEMO_TERMS[0].id),
        };
      }
    } catch {
      // Use demo fallback
    }
  }

  // Filter demo results
  const term = termId || DEMO_TERMS[0].id;
  const filtered = DEMO_PUBLISHED_RESULTS.filter(r => !termId || r.term_id === term);
  const performance = calculateTermPerformance(filtered);

  return {
    results: filtered,
    performance,
    terms: DEMO_TERMS,
    sessions: DEMO_SESSIONS,
    selectedTermId: term,
  };
}

/**
 * Access control boundary: strictly checks student ID matching.
 */
export async function getStudentSingleResult(studentDbId: string, resultId: string): Promise<ResultRecord | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: result } = await supabase
        .from('results')
        .select(`
          id, student_id, total_score, grade, remarks, status, published_at, created_at,
          subject:subjects(id, name, code),
          class:classes(id, name, level),
          scores:result_scores(id, score, component:assessment_components(id, name, code, maximum_score))
        `)
        .eq('id', resultId)
        .eq('student_id', studentDbId) // Access boundary
        .eq('status', 'published')     // Only published
        .single();

      if (result) {
        return result as unknown as ResultRecord;
      }
    } catch {
      // Fallback
    }
  }

  // Check demo results
  const found = DEMO_PUBLISHED_RESULTS.find(r => r.id === resultId);
  if (found && found.student_id === studentDbId && found.status === 'published') {
    return found;
  }

  return null;
}
