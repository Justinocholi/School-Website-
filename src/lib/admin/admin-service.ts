import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  StudentRecord,
  ClassRecord,
  SubjectRecord,
  AcademicSession,
  TermRecord,
  ResultRecord,
  GradingScale,
  AuditLog,
  ImportJob,
  SchoolSettings,
} from '@/types/database.types';
import { evaluateGrade } from '@/lib/grading/grading-engine';

// In-memory persistent state for local development when Supabase database is not yet hooked up
let mockClasses: ClassRecord[] = [
  { id: 'cls-1', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: new Date().toISOString(), student_count: 24 },
  { id: 'cls-2', name: 'JSS 1B', level: 'JSS 1', status: 'active', created_at: new Date().toISOString(), student_count: 22 },
  { id: 'cls-3', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: new Date().toISOString(), student_count: 26 },
  { id: 'cls-4', name: 'JSS 3A', level: 'JSS 3', status: 'active', created_at: new Date().toISOString(), student_count: 20 },
  { id: 'cls-5', name: 'SS 1 Science', level: 'SS 1', status: 'active', created_at: new Date().toISOString(), student_count: 28 },
  { id: 'cls-6', name: 'SS 2 Science', level: 'SS 2', status: 'active', created_at: new Date().toISOString(), student_count: 25 },
];

let mockSubjects: SubjectRecord[] = [
  { id: 'sub-1', name: 'Mathematics', code: 'MTH', status: 'active', created_at: new Date().toISOString() },
  { id: 'sub-2', name: 'English Language', code: 'ENG', status: 'active', created_at: new Date().toISOString() },
  { id: 'sub-3', name: 'Basic Science', code: 'BSC', status: 'active', created_at: new Date().toISOString() },
  { id: 'sub-4', name: 'Civic Education', code: 'CVE', status: 'active', created_at: new Date().toISOString() },
  { id: 'sub-5', name: 'Physics', code: 'PHY', status: 'active', created_at: new Date().toISOString() },
  { id: 'sub-6', name: 'Chemistry', code: 'CHM', status: 'active', created_at: new Date().toISOString() },
  { id: 'sub-7', name: 'Biology', code: 'BIO', status: 'active', created_at: new Date().toISOString() },
];

let mockSessions: AcademicSession[] = [
  { id: 'ses-1', name: '2026/2027', start_date: '2026-09-07', end_date: '2027-07-20', is_active: true, created_at: new Date().toISOString() },
  { id: 'ses-2', name: '2025/2026', start_date: '2025-09-08', end_date: '2026-07-22', is_active: false, created_at: new Date().toISOString() },
];

let mockTerms: TermRecord[] = [
  { id: 'trm-1', academic_session_id: 'ses-1', name: 'First Term', sequence_number: 1, is_active: true, created_at: new Date().toISOString() },
  { id: 'trm-2', academic_session_id: 'ses-1', name: 'Second Term', sequence_number: 2, is_active: false, created_at: new Date().toISOString() },
  { id: 'trm-3', academic_session_id: 'ses-1', name: 'Third Term', sequence_number: 3, is_active: false, created_at: new Date().toISOString() },
];

let mockStudents: StudentRecord[] = [
  {
    id: 'std-1',
    student_id: 'GFS001',
    first_name: 'Daniel',
    last_name: 'Okafor',
    class_id: 'cls-3',
    admission_date: '2025-09-08',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: 'cls-3', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
  },
  {
    id: 'std-2',
    student_id: 'GFS002',
    first_name: 'Sarah',
    last_name: 'Adamu',
    class_id: 'cls-3',
    admission_date: '2025-09-08',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: 'cls-3', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: '' },
  },
  {
    id: 'std-3',
    student_id: 'GFS003',
    first_name: 'Emeka',
    last_name: 'Chukwu',
    class_id: 'cls-5',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: 'cls-5', name: 'SS 1 Science', level: 'SS 1', status: 'active', created_at: '' },
  },
  {
    id: 'std-4',
    student_id: 'GFS004',
    first_name: 'Amina',
    last_name: 'Bello',
    class_id: 'cls-1',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: 'cls-1', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: '' },
  },
];

let mockResults: ResultRecord[] = [
  {
    id: 'res-1',
    student_id: 'std-1',
    subject_id: 'sub-1',
    term_id: 'trm-1',
    class_id: 'cls-3',
    status: 'published',
    total_score: 87.0,
    grade: 'A',
    remarks: 'Distinction',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: mockStudents[0],
    subject: mockSubjects[0],
    class: mockClasses[2],
    scores: [
      { id: 'sc-1', result_id: 'res-1', assessment_component_id: 'ca', score: 27, component: { id: 'ca', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-2', result_id: 'res-1', assessment_component_id: 'exam', score: 60, component: { id: 'exam', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'res-2',
    student_id: 'std-2',
    subject_id: 'sub-1',
    term_id: 'trm-1',
    class_id: 'cls-3',
    status: 'pending_review',
    total_score: 74.5,
    grade: 'B',
    remarks: 'Very Good',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: mockStudents[1],
    subject: mockSubjects[0],
    class: mockClasses[2],
    scores: [
      { id: 'sc-3', result_id: 'res-2', assessment_component_id: 'ca', score: 24.5, component: { id: 'ca', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-4', result_id: 'res-2', assessment_component_id: 'exam', score: 50, component: { id: 'exam', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
];

let mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    action: 'PUBLISH_RESULTS',
    entity_type: 'results',
    entity_id: 'res-1',
    change_summary: { subject: 'Mathematics', term: 'First Term', status: 'published' },
    created_at: new Date().toISOString(),
    actor_email: 'principal@greenfieldcollege.edu',
  },
  {
    id: 'aud-2',
    action: 'IMPORT_STUDENTS',
    entity_type: 'import_jobs',
    entity_id: 'job-1',
    change_summary: { file_name: 'jss2_students_2026.xlsx', total_rows: 25, successful: 25 },
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
  {
    id: 'job-2',
    import_type: 'results_subject',
    status: 'completed',
    file_name: 'mathematics_first_term_jss2a.xlsx',
    total_rows: 26,
    successful_rows: 26,
    failed_rows: 0,
    created_rows: 26,
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

  // Record audit log
  recordAuditLog('CREATE_STUDENT', 'students', newStudent.id, {
    student_id: newStudent.student_id,
    name: `${newStudent.first_name} ${newStudent.last_name}`,
    class: assignedClass?.name,
  });

  return newStudent;
}

export async function getAdminClasses() {
  return [...mockClasses];
}

export async function addAdminClass(data: { name: string; level: string }) {
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

export async function getAdminSubjects() {
  return [...mockSubjects];
}

export async function addAdminSubject(data: { name: string; code: string }) {
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

export async function getAdminSessions() {
  return [...mockSessions];
}

export async function getAdminTerms() {
  return [...mockTerms];
}

export async function getAdminResults(filters?: { termId?: string; classId?: string; subjectId?: string; status?: string }) {
  let list = [...mockResults];
  if (filters?.termId) list = list.filter(r => r.term_id === filters.termId);
  if (filters?.classId) list = list.filter(r => r.class_id === filters.classId);
  if (filters?.subjectId) list = list.filter(r => r.subject_id === filters.subjectId);
  if (filters?.status) list = list.filter(r => r.status === filters.status);
  return list;
}

export async function saveSingleResult(data: {
  student_id: string; // student DB id or Admission number
  subject_id: string;
  class_id: string;
  term_id: string;
  ca_score: number;
  exam_score: number;
  status: 'draft' | 'pending_review' | 'published';
}) {
  const student = mockStudents.find(s => s.id === data.student_id || s.student_id === data.student_id);
  if (!student) throw new Error('Student not found');

  const subject = mockSubjects.find(s => s.id === data.subject_id);
  const classItem = mockClasses.find(c => c.id === data.class_id);
  const total = Number(data.ca_score) + Number(data.exam_score);
  const evalResult = evaluateGrade(total);

  // Check existing result
  const existingIndex = mockResults.findIndex(r =>
    r.student_id === student.id && r.subject_id === data.subject_id && r.term_id === data.term_id
  );

  const resultRecord: ResultRecord = {
    id: existingIndex >= 0 ? mockResults[existingIndex].id : `res-${Date.now()}`,
    student_id: student.id,
    subject_id: data.subject_id,
    class_id: data.class_id,
    term_id: data.term_id,
    status: data.status,
    total_score: total,
    grade: evalResult.grade,
    remarks: evalResult.remark,
    student,
    subject,
    class: classItem,
    scores: [
      { id: `sc-${Date.now()}-1`, result_id: '', assessment_component_id: 'ca', score: data.ca_score, component: { id: 'ca', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: `sc-${Date.now()}-2`, result_id: '', assessment_component_id: 'exam', score: data.exam_score, component: { id: 'exam', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    mockResults[existingIndex] = resultRecord;
    recordAuditLog('UPDATE_RESULT', 'results', resultRecord.id, {
      student_id: student.student_id,
      subject: subject?.name,
      total_score: total,
      grade: evalResult.grade,
      status: data.status,
    });
  } else {
    mockResults.push(resultRecord);
    recordAuditLog('CREATE_RESULT', 'results', resultRecord.id, {
      student_id: student.student_id,
      subject: subject?.name,
      total_score: total,
      grade: evalResult.grade,
      status: data.status,
    });
  }

  return resultRecord;
}

export async function publishResultBatch(resultIds: string[], reason: string = 'Authorized publication') {
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

  return { success: true, count };
}

export function recordAuditLog(action: string, entity_type: string, entity_id: string | null, summary: Record<string, unknown>) {
  mockAuditLogs.unshift({
    id: `aud-${Date.now()}`,
    action,
    entity_type,
    entity_id,
    change_summary: summary,
    created_at: new Date().toISOString(),
    actor_email: 'admin@greenfieldcollege.edu',
  });
}

export async function getAdminAuditLogs() {
  return [...mockAuditLogs];
}

export async function getAdminImportJobs() {
  return [...mockImportJobs];
}
