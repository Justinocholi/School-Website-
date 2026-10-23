import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  StudentRecord,
  ClassRecord,
  SubjectRecord,
  AcademicSession,
  TermRecord,
  ResultRecord,
  AuditLog,
  ImportJob,
  SchoolSettings,
  StaffRecord,
} from '@/types/database.types';
import { evaluateGrade } from '@/lib/grading/grading-engine';

// Canonical UUID-aligned mock state matching Supabase migrations and seeds
let mockClasses: ClassRecord[] = [
  { id: '77777777-7777-7777-7777-777777777771', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: new Date().toISOString(), student_count: 24 },
  { id: '77777777-7777-7777-7777-777777777772', name: 'JSS 1B', level: 'JSS 1', status: 'active', created_at: new Date().toISOString(), student_count: 22 },
  { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: new Date().toISOString(), student_count: 26 },
  { id: '77777777-7777-7777-7777-777777777774', name: 'JSS 3A', level: 'JSS 3', status: 'active', created_at: new Date().toISOString(), student_count: 20 },
  { id: '77777777-7777-7777-7777-777777777775', name: 'SS 1 Science', level: 'SS 1', status: 'active', created_at: new Date().toISOString(), student_count: 28 },
  { id: '77777777-7777-7777-7777-777777777776', name: 'SS 2 Science', level: 'SS 2', status: 'active', created_at: new Date().toISOString(), student_count: 25 },
];

let mockSubjects: SubjectRecord[] = [
  { id: '88888888-8888-8888-8888-888888888881', name: 'Mathematics', code: 'MTH', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888882', name: 'English Language', code: 'ENG', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888883', name: 'Basic Science', code: 'BSC', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888884', name: 'Civic Education', code: 'CVE', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888885', name: 'Physics', code: 'PHY', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888886', name: 'Chemistry', code: 'CHM', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888887', name: 'Biology', code: 'BIO', status: 'active', created_at: new Date().toISOString() },
];

let mockSessions: AcademicSession[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: '2026/2027', start_date: '2026-09-07', end_date: '2027-07-20', is_active: true, created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222222', name: '2025/2026', start_date: '2025-09-08', end_date: '2026-07-22', is_active: false, created_at: new Date().toISOString() },
];

let mockTerms: TermRecord[] = [
  { id: '33333333-3333-3333-3333-333333333331', academic_session_id: '11111111-1111-1111-1111-111111111111', name: 'First Term', sequence_number: 1, is_active: true, created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333332', academic_session_id: '11111111-1111-1111-1111-111111111111', name: 'Second Term', sequence_number: 2, is_active: false, created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333333', academic_session_id: '11111111-1111-1111-1111-111111111111', name: 'Third Term', sequence_number: 3, is_active: false, created_at: new Date().toISOString() },
];

let mockStaff: StaffRecord[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@greenfieldcollege.edu',
    display_name: 'School Administrator',
    role: 'administrator',
    department: 'Executive Governance',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    email: 'david.adeleke@greenfieldcollege.edu',
    display_name: 'Mr. David Adeleke',
    role: 'teacher',
    department: 'Mathematics & Sciences',
    assigned_subject: 'Mathematics',
    assigned_class: 'SS 1 Science',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000012',
    email: 'grace.danjuma@greenfieldcollege.edu',
    display_name: 'Mrs. Grace Danjuma',
    role: 'teacher',
    department: 'Languages & Humanities',
    assigned_subject: 'English Language',
    assigned_class: 'JSS 2A',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000013',
    email: 'samuel.osei@greenfieldcollege.edu',
    display_name: 'Mr. Samuel Osei',
    role: 'teacher',
    department: 'Basic Sciences & Computing',
    assigned_subject: 'Basic Science',
    assigned_class: 'JSS 1A',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
];

let mockStudents: StudentRecord[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    student_id: 'GFS001',
    first_name: 'Daniel',
    last_name: 'Okafor',
    class_id: '77777777-7777-7777-7777-777777777773',
    admission_date: '2025-09-08',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    student_id: 'GFS002',
    first_name: 'Sarah',
    last_name: 'Adamu',
    class_id: '77777777-7777-7777-7777-777777777773',
    admission_date: '2025-09-08',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    student_id: 'GFS003',
    first_name: 'Emeka',
    last_name: 'Chukwu',
    class_id: '77777777-7777-7777-7777-777777777775',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777775', name: 'SS 1 Science', level: 'SS 1', status: 'active', created_at: '' },
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    student_id: 'GFS004',
    first_name: 'Amina',
    last_name: 'Bello',
    class_id: '77777777-7777-7777-7777-777777777771',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777771', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: '' },
  },
];

let mockResults: ResultRecord[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    student_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    subject_id: '88888888-8888-8888-8888-888888888881',
    term_id: '33333333-3333-3333-3333-333333333331',
    class_id: '77777777-7777-7777-7777-777777777773',
    status: 'published',
    total_score: 86.5,
    grade: 'A',
    remarks: 'Distinction',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: mockStudents[0],
    subject: mockSubjects[0],
    class: mockClasses[2],
    scores: [
      { id: 'sc-1', result_id: 'c0000000-0000-0000-0000-000000000001', assessment_component_id: '44444444-4444-4444-4444-444444444441', score: 26.5, component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-2', result_id: 'c0000000-0000-0000-0000-000000000001', assessment_component_id: '44444444-4444-4444-4444-444444444442', score: 60, component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
];

let mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    action: 'PUBLISH_RESULTS',
    entity_type: 'results',
    entity_id: 'c0000000-0000-0000-0000-000000000001',
    change_summary: { subject: 'Mathematics', term: 'First Term', status: 'published' },
    created_at: new Date().toISOString(),
    actor_email: 'admin@greenfieldcollege.edu',
  },
];

let mockImportJobs: ImportJob[] = [
  {
    id: 'job-1',
    import_type: 'students',
    status: 'completed',
    file_name: 'jss2_students_2026.xlsx',
    total_rows: 25,
    successful_rows: 25,
    failed_rows: 0,
    created_rows: 25,
    updated_rows: 0,
    created_at: new Date().toISOString(),
  },
];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return !url.includes('placeholder') && !key.includes('placeholder') && url.startsWith('http');
}

export async function getAdminOverviewStats() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: classCount } = await supabase.from('classes').select('*', { count: 'exact', head: true });
      const { count: subjectCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });
      const { count: pendingResultCount } = await supabase.from('results').select('*', { count: 'exact', head: true }).eq('status', 'pending_review');
      const { count: publishedResultCount } = await supabase.from('results').select('*', { count: 'exact', head: true }).eq('status', 'published');

      if (studentCount !== null && studentCount !== undefined) {
        return {
          totalStudents: studentCount,
          totalClasses: classCount || mockClasses.length,
          totalSubjects: subjectCount || mockSubjects.length,
          pendingResults: pendingResultCount || 0,
          publishedResults: publishedResultCount || 0,
          recentImports: mockImportJobs.slice(0, 5),
          recentActivity: mockAuditLogs.slice(0, 5),
        };
      }
    } catch {
      // Database fallback
    }
  }

  return {
    totalStudents: mockStudents.length,
    totalClasses: mockClasses.length,
    totalSubjects: mockSubjects.length,
    pendingResults: mockResults.filter(r => r.status === 'pending_review').length,
    publishedResults: mockResults.filter(r => r.status === 'published').length,
    recentImports: mockImportJobs.slice(0, 5),
    recentActivity: mockAuditLogs.slice(0, 5),
  };
}

export async function getAdminStudents(query?: string, classId?: string, status?: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let q = supabase
        .from('students')
        .select('*, class:classes(id, name, level)')
        .order('student_id');

      if (classId) q = q.eq('class_id', classId);
      if (status) q = q.eq('status', status);

      const { data, error } = await q;
      if (!error && data !== null) {
        let list = data as unknown as StudentRecord[];
        if (query) {
          const qLower = query.toLowerCase();
          list = list.filter(s =>
            s.student_id.toLowerCase().includes(qLower) ||
            s.first_name.toLowerCase().includes(qLower) ||
            s.last_name.toLowerCase().includes(qLower)
          );
        }
        return list;
      }
    } catch {
      // fallback
    }
  }

  let list = [...mockStudents];
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(s =>
      s.student_id.toLowerCase().includes(q) ||
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q)
    );
  }
  if (classId) {
    list = list.filter(s => s.class_id === classId);
  }
  if (status) {
    list = list.filter(s => s.status === status);
  }
  return list;
}

export async function addAdminStudent(data: {
  student_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  class_id?: string;
  admission_date?: string;
}) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: inserted, error } = await supabase
        .from('students')
        .insert({
          student_id: data.student_id.toUpperCase(),
          first_name: data.first_name,
          last_name: data.last_name,
          other_names: data.other_names || null,
          class_id: data.class_id || null,
          admission_date: data.admission_date || null,
          status: 'active',
        })
        .select('*, class:classes(id, name, level)')
        .single();

      if (!error && inserted) {
        const studentRecord = inserted as unknown as StudentRecord;
        mockStudents.unshift(studentRecord);
        recordAuditLog('CREATE_STUDENT', 'students', studentRecord.id, {
          student_id: studentRecord.student_id,
          name: `${studentRecord.first_name} ${studentRecord.last_name}`,
        });
        return studentRecord;
      }
    } catch {
      // fallback to mock
    }
  }

  const existing = mockStudents.find(s => s.student_id === data.student_id.toUpperCase());
  if (existing) {
    throw new Error(`Student ID ${data.student_id} already exists`);
  }

  const assignedClass = mockClasses.find(c => c.id === data.class_id);

  const newStudent: StudentRecord = {
    id: `std-${Date.now()}`,
    student_id: data.student_id.toUpperCase(),
    first_name: data.first_name,
    last_name: data.last_name,
    other_names: data.other_names,
    class_id: data.class_id,
    admission_date: data.admission_date,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: assignedClass,
  };

  mockStudents.unshift(newStudent);
  recordAuditLog('CREATE_STUDENT', 'students', newStudent.id, {
    student_id: newStudent.student_id,
    name: `${newStudent.first_name} ${newStudent.last_name}`,
    class: assignedClass?.name,
  });

  return newStudent;
}

export async function getAdminClasses(): Promise<ClassRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (!error && data && data.length > 0) {
        return data as ClassRecord[];
      }
    } catch {
      // fallback
    }
  }
  return [...mockClasses];
}

export async function addAdminClass(data: { name: string; level: string }): Promise<ClassRecord> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: inserted, error } = await supabase
        .from('classes')
        .insert({ name: data.name, level: data.level, status: 'active' })
        .select()
        .single();

      if (!error && inserted) {
        const classObj = inserted as ClassRecord;
        mockClasses.push(classObj);
        recordAuditLog('CREATE_CLASS', 'classes', classObj.id, { name: classObj.name, level: classObj.level });
        return classObj;
      }
    } catch {
      // fallback
    }
  }

  const existing = mockClasses.find(c => c.name.toLowerCase() === data.name.toLowerCase());
  if (existing) {
    throw new Error(`Class name "${data.name}" already exists`);
  }

  const newClass: ClassRecord = {
    id: `cls-${Date.now()}`,
    name: data.name,
    level: data.level,
    status: 'active',
    student_count: 0,
    created_at: new Date().toISOString(),
  };

  mockClasses.push(newClass);
  recordAuditLog('CREATE_CLASS', 'classes', newClass.id, { name: newClass.name, level: newClass.level });
  return newClass;
}

export async function getAdminSubjects(): Promise<SubjectRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (!error && data && data.length > 0) {
        return data as SubjectRecord[];
      }
    } catch {
      // fallback
    }
  }
  return [...mockSubjects];
}

export async function addAdminSubject(data: { name: string; code: string }): Promise<SubjectRecord> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: inserted, error } = await supabase
        .from('subjects')
        .insert({ name: data.name, code: data.code.toUpperCase(), status: 'active' })
        .select()
        .single();

      if (!error && inserted) {
        const sub = inserted as SubjectRecord;
        mockSubjects.push(sub);
        recordAuditLog('CREATE_SUBJECT', 'subjects', sub.id, { name: sub.name, code: sub.code });
        return sub;
      }
    } catch {
      // fallback
    }
  }

  const existing = mockSubjects.find(s => s.code.toLowerCase() === data.code.toLowerCase());
  if (existing) {
    throw new Error(`Subject code "${data.code}" already exists`);
  }

  const newSubject: SubjectRecord = {
    id: `sub-${Date.now()}`,
    name: data.name,
    code: data.code.toUpperCase(),
    status: 'active',
    created_at: new Date().toISOString(),
  };

  mockSubjects.push(newSubject);
  recordAuditLog('CREATE_SUBJECT', 'subjects', newSubject.id, { name: newSubject.name, code: newSubject.code });
  return newSubject;
}

export async function getAdminSessions(): Promise<AcademicSession[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('academic_sessions')
        .select('*')
        .order('start_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as AcademicSession[];
      }
    } catch {
      // fallback
    }
  }
  return [...mockSessions];
}

export async function getAdminTerms(): Promise<TermRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .order('sequence_number');

      if (!error && data && data.length > 0) {
        return data as TermRecord[];
      }
    } catch {
      // fallback
    }
  }
  return [...mockTerms];
}

export async function setActiveAdminTerm(termId: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      // Deactivate other terms and activate target
      await supabase.from('terms').update({ is_active: false }).neq('id', termId);
      await supabase.from('terms').update({ is_active: true }).eq('id', termId);
      await supabase.from('school_settings').update({ current_term_id: termId }).neq('id', '00000000-0000-0000-0000-000000000000');
      recordAuditLog('SET_ACTIVE_TERM', 'terms', termId, { active_term_id: termId });
      return { success: true };
    } catch (err) {
      console.error('Failed to set active term in Supabase:', err);
    }
  }

  mockTerms.forEach(t => {
    t.is_active = (t.id === termId);
  });
  return { success: true };
}

export async function getAdminResults(filters?: { termId?: string; classId?: string; subjectId?: string; status?: string }) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let q = supabase
        .from('results')
        .select(`
          id, student_id, subject_id, class_id, term_id, status, total_score, grade, remarks, published_at, created_at, updated_at,
          student:students(id, student_id, first_name, last_name),
          subject:subjects(id, name, code),
          class:classes(id, name, level),
          scores:result_scores(id, score, assessment_component_id, component:assessment_components(id, name, code, maximum_score))
        `)
        .order('created_at', { ascending: false });

      if (filters?.termId) q = q.eq('term_id', filters.termId);
      if (filters?.classId) q = q.eq('class_id', filters.classId);
      if (filters?.subjectId) q = q.eq('subject_id', filters.subjectId);
      if (filters?.status) q = q.eq('status', filters.status);

      const { data, error } = await q;
      if (!error && data !== null) {
        return data as unknown as ResultRecord[];
      }
    } catch {
      // fallback
    }
  }

  let list = [...mockResults];
  if (filters?.termId) list = list.filter(r => r.term_id === filters.termId);
  if (filters?.classId) list = list.filter(r => r.class_id === filters.classId);
  if (filters?.subjectId) list = list.filter(r => r.subject_id === filters.subjectId);
  if (filters?.status) list = list.filter(r => r.status === filters.status);
  return list;
}

export async function saveSingleResult(data: {
  student_id: string; // student DB id or Admission number (e.g. GFS001)
  subject_id: string;
  class_id: string;
  term_id: string;
  ca_score: number;
  exam_score: number;
  status: 'draft' | 'pending_review' | 'published';
}): Promise<ResultRecord> {
  const total = Number(data.ca_score) + Number(data.exam_score);
  const evalResult = evaluateGrade(total);

  let studentDbId = data.student_id;
  let studentObj: StudentRecord | undefined;

  // Supabase Database Persistence
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      // 1. Resolve student UUID from database safely
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.student_id);
      let studentQuery = supabase.from('students').select('*, class:classes(id, name, level)');
      if (isUuid) {
        studentQuery = studentQuery.or(`id.eq.${data.student_id},student_id.eq.${data.student_id.toUpperCase()}`);
      } else {
        studentQuery = studentQuery.eq('student_id', data.student_id.toUpperCase());
      }
      const { data: foundStudent } = await studentQuery.limit(1).maybeSingle();

      if (foundStudent) {
        studentDbId = foundStudent.id;
        studentObj = foundStudent as unknown as StudentRecord;
      }

      // 2. Fetch component IDs
      const { data: components } = await supabase
        .from('assessment_components')
        .select('id, code');

      const caComp = components?.find(c => c.code === 'ca') || { id: '44444444-4444-4444-4444-444444444441' };
      const examComp = components?.find(c => c.code === 'exam') || { id: '44444444-4444-4444-4444-444444444442' };

      // 3. Upsert into results
      const { data: savedResult, error: upsertErr } = await supabase
        .from('results')
        .upsert({
          student_id: studentDbId,
          subject_id: data.subject_id,
          class_id: data.class_id,
          term_id: data.term_id,
          total_score: total,
          grade: evalResult.grade,
          remarks: evalResult.remark,
          status: data.status,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'student_id,subject_id,term_id' })
        .select(`
          id, student_id, subject_id, class_id, term_id, status, total_score, grade, remarks, published_at, created_at, updated_at,
          subject:subjects(id, name, code),
          class:classes(id, name, level)
        `)
        .single();

      if (upsertErr) {
        console.error('Supabase results upsert error:', upsertErr);
      }

      if (savedResult) {
        // 4. Upsert component scores
        await supabase.from('result_scores').upsert([
          {
            result_id: savedResult.id,
            assessment_component_id: caComp.id,
            score: Number(data.ca_score),
          },
          {
            result_id: savedResult.id,
            assessment_component_id: examComp.id,
            score: Number(data.exam_score),
          },
        ], { onConflict: 'result_id,assessment_component_id' });

        recordAuditLog('SAVE_RESULT', 'results', savedResult.id, {
          student_id: studentObj?.student_id || data.student_id,
          term_id: data.term_id,
          total_score: total,
          status: data.status,
        });

        const createdRes: ResultRecord = {
          ...savedResult,
          student: studentObj,
          scores: [
            { id: `sc-${savedResult.id}-1`, result_id: savedResult.id, assessment_component_id: caComp.id, score: data.ca_score },
            { id: `sc-${savedResult.id}-2`, result_id: savedResult.id, assessment_component_id: examComp.id, score: data.exam_score },
          ],
        } as unknown as ResultRecord;

        // Keep local cache synced
        const existingIdx = mockResults.findIndex(r => r.id === savedResult.id || (r.student_id === studentDbId && r.subject_id === data.subject_id && r.term_id === data.term_id));
        if (existingIdx >= 0) {
          mockResults[existingIdx] = createdRes;
        } else {
          mockResults.unshift(createdRes);
        }

        return createdRes;
      }
    } catch (err) {
      console.error('Error saving result to Supabase:', err);
    }
  }

  // In-memory fallback
  const student = mockStudents.find(s => s.id === data.student_id || s.student_id === data.student_id);
  const subject = mockSubjects.find(s => s.id === data.subject_id);
  const classItem = mockClasses.find(c => c.id === data.class_id);

  const existingIndex = mockResults.findIndex(r =>
    (r.student_id === data.student_id || r.student_id === student?.id) &&
    r.subject_id === data.subject_id &&
    r.term_id === data.term_id
  );

  const resultRecord: ResultRecord = {
    id: existingIndex >= 0 ? mockResults[existingIndex].id : `res-${Date.now()}`,
    student_id: student?.id || data.student_id,
    subject_id: data.subject_id,
    class_id: data.class_id,
    term_id: data.term_id,
    status: data.status,
    total_score: total,
    grade: evalResult.grade,
    remarks: evalResult.remark,
    student: student || mockStudents[0],
    subject,
    class: classItem,
    scores: [
      { id: `sc-${Date.now()}-1`, result_id: '', assessment_component_id: '44444444-4444-4444-4444-444444444441', score: data.ca_score, component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: `sc-${Date.now()}-2`, result_id: '', assessment_component_id: '44444444-4444-4444-4444-444444444442', score: data.exam_score, component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
    published_at: data.status === 'published' ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    mockResults[existingIndex] = resultRecord;
  } else {
    mockResults.unshift(resultRecord);
  }

  recordAuditLog(existingIndex >= 0 ? 'UPDATE_RESULT' : 'CREATE_RESULT', 'results', resultRecord.id, {
    student_id: student?.student_id || data.student_id,
    subject: subject?.name,
    total_score: total,
    grade: evalResult.grade,
    status: data.status,
  });

  return resultRecord;
}

export async function publishResultBatch(resultIds: string[], reason: string = 'Authorized publication') {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('results')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('id', resultIds);

      if (!error) {
        recordAuditLog('PUBLISH_RESULTS_BATCH', 'results', null, {
          count: resultIds.length,
          reason,
          result_ids: resultIds,
        });

        // Also update local mock if present
        mockResults.forEach(r => {
          if (resultIds.includes(r.id)) {
            r.status = 'published';
            r.published_at = new Date().toISOString();
          }
        });

        return { count: resultIds.length };
      }
    } catch (err) {
      console.error('Error publishing in Supabase:', err);
    }
  }

  let count = 0;
  for (const id of resultIds) {
    const res = mockResults.find(r => r.id === id);
    if (res) {
      res.status = 'published';
      res.published_at = new Date().toISOString();
      count++;
    }
  }

  recordAuditLog('PUBLISH_RESULTS_BATCH', 'results', null, {
    count,
    reason,
    result_ids: resultIds,
  });

  return { count };
}

export function recordAuditLog(
  action: string,
  entity_type: string,
  entity_id: string | null,
  change_summary: Record<string, unknown>
) {
  const newLog: AuditLog = {
    id: `aud-${Date.now()}`,
    action,
    entity_type,
    entity_id: entity_id || undefined,
    change_summary,
    created_at: new Date().toISOString(),
    actor_email: 'admin@greenfieldcollege.edu',
  };
  mockAuditLogs.unshift(newLog);
  return newLog;
}

export async function getAdminAuditLogs() {
  return [...mockAuditLogs];
}

export async function getAdminStaff(): Promise<StaffRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['teacher', 'administrator'])
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p) => {
          const existingMock = mockStaff.find(m => m.id === p.id || m.email?.toLowerCase() === p.email?.toLowerCase());
          return {
            id: p.id,
            email: p.email || (existingMock?.email || ''),
            display_name: p.display_name,
            role: p.role as 'administrator' | 'teacher',
            department: existingMock?.department || (p.role === 'administrator' ? 'Administration' : 'Academic Faculty'),
            assigned_subject: existingMock?.assigned_subject || 'General Curriculum',
            assigned_class: existingMock?.assigned_class || 'All Classes',
            created_at: p.created_at || new Date().toISOString(),
            status: 'active',
          };
        });
      }
    } catch {
      // fallback
    }
  }

  return [...mockStaff];
}

export async function addAdminTeacher(data: {
  full_name: string;
  email: string;
  department: string;
  assigned_subject?: string;
  assigned_class?: string;
}): Promise<StaffRecord> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const newId = `t-${Date.now()}`;

  const newStaff: StaffRecord = {
    id: newId,
    email: normalizedEmail,
    display_name: data.full_name.trim(),
    role: 'teacher',
    department: data.department.trim(),
    assigned_subject: data.assigned_subject,
    assigned_class: data.assigned_class,
    created_at: new Date().toISOString(),
    status: 'active',
  };

  const existingIndex = mockStaff.findIndex(s => s.email.toLowerCase() === normalizedEmail);
  if (existingIndex >= 0) {
    mockStaff[existingIndex] = newStaff;
  } else {
    mockStaff.push(newStaff);
  }

  recordAuditLog('REGISTER_TEACHER', 'staff', newStaff.id, {
    teacher_name: newStaff.display_name,
    email: newStaff.email,
    department: newStaff.department,
    role: 'teacher',
  });

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('profiles').upsert({
        id: newStaff.id,
        role: 'teacher',
        display_name: newStaff.display_name,
        email: newStaff.email,
        created_at: newStaff.created_at,
        updated_at: newStaff.created_at,
      });
    } catch {
      // Continue with local
    }
  }

  return newStaff;
}
