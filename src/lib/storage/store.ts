import fs from 'fs';
import path from 'path';
import {
  StudentRecord,
  ClassRecord,
  SubjectRecord,
  AcademicSession,
  TermRecord,
  ResultRecord,
  AuditLog,
  StaffRecord,
} from '@/types/database.types';

export interface PersistentStoreData {
  students: StudentRecord[];
  classes: ClassRecord[];
  subjects: SubjectRecord[];
  sessions: AcademicSession[];
  terms: TermRecord[];
  activeTermId: string;
  results: ResultRecord[];
  staff: StaffRecord[];
  auditLogs: AuditLog[];
}

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'school-store.json');

const INITIAL_CLASSES: ClassRecord[] = [
  { id: '77777777-7777-7777-7777-777777777771', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: new Date().toISOString(), student_count: 24 },
  { id: '77777777-7777-7777-7777-777777777772', name: 'JSS 1B', level: 'JSS 1', status: 'active', created_at: new Date().toISOString(), student_count: 22 },
  { id: '77777777-7777-7777-7777-777777777773', name: 'JSS 2A', level: 'JSS 2', status: 'active', created_at: new Date().toISOString(), student_count: 26 },
  { id: '77777777-7777-7777-7777-777777777774', name: 'JSS 3A', level: 'JSS 3', status: 'active', created_at: new Date().toISOString(), student_count: 20 },
  { id: '77777777-7777-7777-7777-777777777775', name: 'SS 1 Science', level: 'SS 1', status: 'active', created_at: new Date().toISOString(), student_count: 28 },
  { id: '77777777-7777-7777-7777-777777777776', name: 'SS 2 Science', level: 'SS 2', status: 'active', created_at: new Date().toISOString(), student_count: 25 },
];

const INITIAL_SUBJECTS: SubjectRecord[] = [
  { id: '88888888-8888-8888-8888-888888888881', name: 'Mathematics', code: 'MTH', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888882', name: 'English Language', code: 'ENG', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888883', name: 'Basic Science', code: 'BSC', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888884', name: 'Civic Education', code: 'CVE', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888885', name: 'Physics', code: 'PHY', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888886', name: 'Chemistry', code: 'CHM', status: 'active', created_at: new Date().toISOString() },
  { id: '88888888-8888-8888-8888-888888888887', name: 'Biology', code: 'BIO', status: 'active', created_at: new Date().toISOString() },
];

const INITIAL_SESSIONS: AcademicSession[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: '2026/2027', start_date: '2026-09-07', end_date: '2027-07-20', is_active: true, created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222222', name: '2025/2026', start_date: '2025-09-08', end_date: '2026-07-22', is_active: false, created_at: new Date().toISOString() },
];

const INITIAL_TERMS: TermRecord[] = [
  { id: '33333333-3333-3333-3333-333333333331', academic_session_id: '11111111-1111-1111-1111-111111111111', name: 'First Term', sequence_number: 1, is_active: true, created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333332', academic_session_id: '11111111-1111-1111-1111-111111111111', name: 'Second Term', sequence_number: 2, is_active: false, created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333333', academic_session_id: '11111111-1111-1111-1111-111111111111', name: 'Third Term', sequence_number: 3, is_active: false, created_at: new Date().toISOString() },
];

const INITIAL_STAFF: StaffRecord[] = [
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
    department: 'Junior Secondary (Form Teacher)',
    assigned_subject: 'General Curriculum',
    assigned_class: 'JSS 1A',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000012',
    email: 'grace.danjuma@greenfieldcollege.edu',
    display_name: 'Mrs. Grace Danjuma',
    role: 'teacher',
    department: 'Junior Secondary (Form Teacher)',
    assigned_subject: 'General Curriculum',
    assigned_class: 'JSS 2A',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000013',
    email: 'samuel.osei@greenfieldcollege.edu',
    display_name: 'Mr. Samuel Osei',
    role: 'teacher',
    department: 'Senior Secondary (Form Teacher)',
    assigned_subject: 'General Curriculum',
    assigned_class: 'SS 1 Science',
    created_at: '2026-09-01T08:00:00Z',
    status: 'active',
  },
];

const INITIAL_STUDENTS: StudentRecord[] = [
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
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    student_id: 'GFS005',
    first_name: 'Chinedu',
    last_name: 'Eze',
    class_id: '77777777-7777-7777-7777-777777777771',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777771', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: '' },
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    student_id: 'GFS006',
    first_name: 'Fatima',
    last_name: 'Aliyu',
    class_id: '77777777-7777-7777-7777-777777777771',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777771', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: '' },
  },
  {
    id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    student_id: 'GFS007',
    first_name: 'Tunde',
    last_name: 'Bakare',
    class_id: '77777777-7777-7777-7777-777777777771',
    admission_date: '2026-09-01',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: { id: '77777777-7777-7777-7777-777777777771', name: 'JSS 1A', level: 'JSS 1', status: 'active', created_at: '' },
  },
];

const INITIAL_RESULTS: ResultRecord[] = [
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
    student: INITIAL_STUDENTS[0],
    subject: INITIAL_SUBJECTS[0],
    class: INITIAL_CLASSES[2],
    scores: [
      { id: 'sc-1', result_id: 'c0000000-0000-0000-0000-000000000001', assessment_component_id: '44444444-4444-4444-4444-444444444441', score: 27, component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-2', result_id: 'c0000000-0000-0000-0000-000000000001', assessment_component_id: '44444444-4444-4444-4444-444444444442', score: 60, component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
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
    student: INITIAL_STUDENTS[0],
    subject: INITIAL_SUBJECTS[1],
    class: INITIAL_CLASSES[2],
    scores: [
      { id: 'sc-3', result_id: 'c0000000-0000-0000-0000-000000000002', assessment_component_id: '44444444-4444-4444-4444-444444444441', score: 26, component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-4', result_id: 'c0000000-0000-0000-0000-000000000002', assessment_component_id: '44444444-4444-4444-4444-444444444442', score: 56, component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
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
    student: INITIAL_STUDENTS[0],
    subject: INITIAL_SUBJECTS[2],
    class: INITIAL_CLASSES[2],
    scores: [
      { id: 'sc-5', result_id: 'c0000000-0000-0000-0000-000000000003', assessment_component_id: '44444444-4444-4444-4444-444444444441', score: 24.5, component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-6', result_id: 'c0000000-0000-0000-0000-000000000003', assessment_component_id: '44444444-4444-4444-4444-444444444442', score: 54, component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
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
    student: INITIAL_STUDENTS[0],
    subject: INITIAL_SUBJECTS[3],
    class: INITIAL_CLASSES[2],
    scores: [
      { id: 'sc-7', result_id: 'c0000000-0000-0000-0000-000000000004', assessment_component_id: '44444444-4444-4444-4444-444444444441', score: 23, component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: 'sc-8', result_id: 'c0000000-0000-0000-0000-000000000004', assessment_component_id: '44444444-4444-4444-4444-444444444442', score: 48, component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  },
];

function getInitialStore(): PersistentStoreData {
  return {
    students: INITIAL_STUDENTS,
    classes: INITIAL_CLASSES,
    subjects: INITIAL_SUBJECTS,
    sessions: INITIAL_SESSIONS,
    terms: INITIAL_TERMS,
    activeTermId: '33333333-3333-3333-3333-333333333331',
    results: INITIAL_RESULTS,
    staff: INITIAL_STAFF,
    auditLogs: [],
  };
}

export function readStore(): PersistentStoreData {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const initial = getInitialStore();
      writeStore(initial);
      return initial;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const data = JSON.parse(raw) as PersistentStoreData;
    // Guarantee required arrays exist
    if (!data.students) data.students = INITIAL_STUDENTS;
    if (!data.classes) data.classes = INITIAL_CLASSES;
    if (!data.subjects) data.subjects = INITIAL_SUBJECTS;
    if (!data.sessions) data.sessions = INITIAL_SESSIONS;
    if (!data.terms) data.terms = INITIAL_TERMS;
    if (!data.activeTermId) data.activeTermId = '33333333-3333-3333-3333-333333333331';
    if (!data.results) data.results = INITIAL_RESULTS;
    if (!data.staff) data.staff = INITIAL_STAFF;
    if (!data.auditLogs) data.auditLogs = [];
    return data;
  } catch (err) {
    console.error('Error reading local school store, resetting to initial defaults:', err);
    return getInitialStore();
  }
}

export function writeStore(data: PersistentStoreData): void {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local school store:', err);
  }
}

// Student Helpers
export function getStoreStudents(): StudentRecord[] {
  return readStore().students;
}

export function findStoreStudent(studentIdOrId: string): StudentRecord | undefined {
  const norm = studentIdOrId.trim().toUpperCase();
  const students = getStoreStudents();
  return students.find(s => s.id === studentIdOrId || s.student_id.toUpperCase() === norm);
}

export function saveStoreStudent(student: StudentRecord): void {
  const store = readStore();
  const existingIdx = store.students.findIndex(
    s => s.id === student.id || s.student_id.toUpperCase() === student.student_id.toUpperCase()
  );
  if (existingIdx >= 0) {
    store.students[existingIdx] = student;
  } else {
    store.students.unshift(student);
  }
  writeStore(store);
}

// Staff / Teacher Helpers
export function getStoreStaff(): StaffRecord[] {
  return readStore().staff;
}

export function saveStoreStaff(staffMember: StaffRecord): void {
  const store = readStore();
  const existingIdx = store.staff.findIndex(
    s => s.id === staffMember.id || s.email.toLowerCase() === staffMember.email.toLowerCase()
  );
  if (existingIdx >= 0) {
    store.staff[existingIdx] = staffMember;
  } else {
    store.staff.push(staffMember);
  }
  writeStore(store);
}

// Result Helpers
export function getStoreResults(): ResultRecord[] {
  return readStore().results;
}

export function saveStoreResult(result: ResultRecord): void {
  const store = readStore();
  const existingIdx = store.results.findIndex(
    r => (r.id === result.id) ||
         (r.student_id === result.student_id && r.subject_id === result.subject_id && r.term_id === result.term_id)
  );
  if (existingIdx >= 0) {
    store.results[existingIdx] = result;
  } else {
    store.results.unshift(result);
  }
  writeStore(store);
}

export function publishStoreResults(resultIds: string[]): number {
  const store = readStore();
  let count = 0;
  store.results = store.results.map(r => {
    if (resultIds.includes(r.id)) {
      count++;
      return {
        ...r,
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    return r;
  });
  writeStore(store);
  return count;
}

// Term & Academic Session Helpers
export function getStoreTerms(): TermRecord[] {
  const store = readStore();
  return store.terms.map(t => ({
    ...t,
    is_active: t.id === store.activeTermId,
  }));
}

export function setStoreActiveTerm(termId: string): void {
  const store = readStore();
  store.activeTermId = termId;
  store.terms = store.terms.map(t => ({
    ...t,
    is_active: t.id === termId,
  }));
  writeStore(store);
}

export function getStoreActiveTermId(): string {
  return readStore().activeTermId;
}

export function getStoreClasses(): ClassRecord[] {
  return readStore().classes;
}

export function saveStoreClass(c: ClassRecord): void {
  const store = readStore();
  const idx = store.classes.findIndex(item => item.id === c.id || item.name.toLowerCase() === c.name.toLowerCase());
  if (idx >= 0) {
    store.classes[idx] = c;
  } else {
    store.classes.push(c);
  }
  writeStore(store);
}

export function getStoreSubjects(): SubjectRecord[] {
  return readStore().subjects;
}

export function saveStoreSubject(s: SubjectRecord): void {
  const store = readStore();
  const idx = store.subjects.findIndex(item => item.id === s.id || item.code.toLowerCase() === s.code.toLowerCase());
  if (idx >= 0) {
    store.subjects[idx] = s;
  } else {
    store.subjects.push(s);
  }
  writeStore(store);
}

export function getStoreSessions(): AcademicSession[] {
  return readStore().sessions;
}
