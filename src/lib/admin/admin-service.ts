import { createClient } from '@/lib/supabase/server';
import {
  StudentRecord,
  ClassRecord,
  SubjectRecord,
  AcademicSession,
  TermRecord,
  ResultRecord,
  AuditLog,
  ImportJob,
  StaffRecord,
} from '@/types/database.types';
import { evaluateGrade } from '@/lib/grading/grading-engine';
import {
  getStoreStudents,
  findStoreStudent,
  saveStoreStudent,
  getStoreStaff,
  saveStoreStaff,
  getStoreResults,
  saveStoreResult,
  publishStoreResults,
  getStoreTerms,
  setStoreActiveTerm,
  getStoreClasses,
  saveStoreClass,
  getStoreSubjects,
  saveStoreSubject,
  getStoreSessions,
  getStoreActiveTermId,
  deleteStoreStudent,
  deleteStoreSubject,
  deleteStoreStaff,
  deleteStoreClass,
  deleteStoreResult,
} from '@/lib/storage/store';

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

export async function getAdminOverviewStats(classFilter?: string) {
  let students = getStoreStudents();
  let results = getStoreResults();
  let classes = getStoreClasses();
  let subjects = getStoreSubjects();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let studentQ = supabase.from('students').select('*', { count: 'exact', head: true });
      let pendingResultQ = supabase.from('results').select('*', { count: 'exact', head: true }).eq('status', 'pending_review');
      let publishedResultQ = supabase.from('results').select('*', { count: 'exact', head: true }).eq('status', 'published');

      if (classFilter) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(classFilter);
        let targetClassId: string | undefined = isUuid ? classFilter : undefined;
        if (!targetClassId) {
          const { data: cls } = await supabase.from('classes').select('id').ilike('name', classFilter).maybeSingle();
          targetClassId = cls?.id;
        }
        if (targetClassId) {
          studentQ = studentQ.eq('class_id', targetClassId);
          pendingResultQ = pendingResultQ.eq('class_id', targetClassId);
          publishedResultQ = publishedResultQ.eq('class_id', targetClassId);
        }
      }

      const [{ count: studentCount }, { count: classCount }, { count: subjectCount }, { count: pendingResultCount }, { count: publishedResultCount }] = await Promise.all([
        studentQ,
        supabase.from('classes').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true }),
        pendingResultQ,
        publishedResultQ,
      ]);

      if (studentCount !== null && studentCount > 0) {
        return {
          totalStudents: studentCount,
          totalClasses: classFilter ? 1 : (classCount || classes.length),
          totalSubjects: subjectCount || subjects.length,
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

  if (classFilter) {
    const cfLower = classFilter.toLowerCase();
    students = students.filter(s => s.class?.name.toLowerCase() === cfLower || s.class_id === classFilter || s.class?.id === classFilter);
    results = results.filter(r => r.class?.name.toLowerCase() === cfLower || r.class_id === classFilter || r.class?.id === classFilter);
  }

  return {
    totalStudents: students.length,
    totalClasses: classFilter ? 1 : classes.length,
    totalSubjects: subjects.length,
    pendingResults: results.filter(r => r.status === 'pending_review').length,
    publishedResults: results.filter(r => r.status === 'published').length,
    recentImports: mockImportJobs.slice(0, 5),
    recentActivity: mockAuditLogs.slice(0, 5),
  };
}

export async function getAdminStudents(query?: string, classId?: string, status?: string): Promise<StudentRecord[]> {
  let list = [...getStoreStudents()];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      let q = supabase
        .from('students')
        .select('*, class:classes(id, name, level)')
        .order('student_id');

      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        const dbStudents = data as unknown as StudentRecord[];
        for (const s of dbStudents) {
          if (!list.some(item => item.student_id.toUpperCase() === s.student_id.toUpperCase())) {
            list.push(s);
          }
        }
      }
    } catch {
      // fallback to store
    }
  }

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(s =>
      s.student_id.toLowerCase().includes(q) ||
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q)
    );
  }
  if (classId) {
    const cLower = classId.toLowerCase();
    list = list.filter(s => s.class_id === classId || s.class?.id === classId || s.class?.name.toLowerCase() === cLower);
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
}): Promise<StudentRecord> {
  const normId = data.student_id.toUpperCase().trim();
  const classes = getStoreClasses();
  const assignedClass = classes.find(c => c.id === data.class_id || c.name.toLowerCase() === data.class_id?.toLowerCase());

  const existing = findStoreStudent(normId);
  if (existing) {
    throw new Error(`Student ID ${normId} already exists`);
  }

  const newStudent: StudentRecord = {
    id: `std-${Date.now()}`,
    student_id: normId,
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    other_names: data.other_names?.trim(),
    class_id: assignedClass?.id || data.class_id,
    admission_date: data.admission_date || new Date().toISOString().split('T')[0],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: assignedClass,
  };

  saveStoreStudent(newStudent);

  // Attempt Supabase insert
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('students').insert({
        student_id: newStudent.student_id,
        first_name: newStudent.first_name,
        last_name: newStudent.last_name,
        other_names: newStudent.other_names || null,
        class_id: newStudent.class_id || null,
        admission_date: newStudent.admission_date || null,
        status: 'active',
      });
    } catch {
      // Supabase RLS / offline gracefully handled
    }
  }

  recordAuditLog('CREATE_STUDENT', 'students', newStudent.id, {
    student_id: newStudent.student_id,
    name: `${newStudent.first_name} ${newStudent.last_name}`,
    class: assignedClass?.name,
  });

  return newStudent;
}

export async function getAdminClasses(): Promise<ClassRecord[]> {
  let list = [...getStoreClasses()];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from('classes').select('*').order('name');
      if (!error && data && data.length > 0) {
        return data as ClassRecord[];
      }
    } catch {}
  }
  return list;
}

export async function addAdminClass(data: { name: string; level: string }): Promise<ClassRecord> {
  const existing = getStoreClasses().find(c => c.name.toLowerCase() === data.name.toLowerCase());
  if (existing) {
    throw new Error(`Class name "${data.name}" already exists`);
  }

  const newClass: ClassRecord = {
    id: `cls-${Date.now()}`,
    name: data.name.trim(),
    level: data.level.trim(),
    status: 'active',
    student_count: 0,
    created_at: new Date().toISOString(),
  };

  saveStoreClass(newClass);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('classes').insert({ name: newClass.name, level: newClass.level, status: 'active' });
    } catch {}
  }

  recordAuditLog('CREATE_CLASS', 'classes', newClass.id, { name: newClass.name, level: newClass.level });
  return newClass;
}

export async function getAdminSubjects(): Promise<SubjectRecord[]> {
  let list = [...getStoreSubjects()];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from('subjects').select('*').order('name');
      if (!error && data && data.length > 0) {
        return data as SubjectRecord[];
      }
    } catch {}
  }
  return list;
}

export async function addAdminSubject(data: { name: string; code: string }): Promise<SubjectRecord> {
  const existing = getStoreSubjects().find(s => s.code.toLowerCase() === data.code.toLowerCase());
  if (existing) {
    throw new Error(`Subject code "${data.code}" already exists`);
  }

  const newSubject: SubjectRecord = {
    id: `sub-${Date.now()}`,
    name: data.name.trim(),
    code: data.code.toUpperCase().trim(),
    status: 'active',
    created_at: new Date().toISOString(),
  };

  saveStoreSubject(newSubject);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('subjects').insert({ name: newSubject.name, code: newSubject.code, status: 'active' });
    } catch {}
  }

  recordAuditLog('CREATE_SUBJECT', 'subjects', newSubject.id, { name: newSubject.name, code: newSubject.code });
  return newSubject;
}

export async function getAdminSessions(): Promise<AcademicSession[]> {
  let list = [...getStoreSessions()];
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from('academic_sessions').select('*').order('start_date', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as AcademicSession[];
      }
    } catch {}
  }
  return list;
}

export async function getAdminTerms(): Promise<TermRecord[]> {
  const storeTerms = getStoreTerms();
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from('terms').select('*').order('sequence_number');
      if (!error && data && data.length > 0) {
        const activeTermId = getStoreActiveTermId();
        return (data as TermRecord[]).map(t => ({
          ...t,
          is_active: t.id === activeTermId || (activeTermId ? t.id === activeTermId : t.is_active),
        }));
      }
    } catch {}
  }
  return storeTerms;
}

export async function setActiveAdminTerm(termId: string) {
  setStoreActiveTerm(termId);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('terms').update({ is_active: false }).neq('id', termId);
      await supabase.from('terms').update({ is_active: true }).eq('id', termId);
      await supabase.from('school_settings').update({ current_term_id: termId }).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.error('Supabase active term update failed:', err);
    }
  }

  recordAuditLog('SET_ACTIVE_TERM', 'terms', termId, { active_term_id: termId });
  return { success: true };
}

export async function getAdminResults(filters?: { termId?: string; classId?: string; subjectId?: string; status?: string }): Promise<ResultRecord[]> {
  let list = [...getStoreResults()];

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

      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        const dbResults = data as unknown as ResultRecord[];
        for (const r of dbResults) {
          if (!list.some(item => item.id === r.id)) {
            list.unshift(r);
          }
        }
      }
    } catch {}
  }

  if (filters?.termId) {
    list = list.filter(r => r.term_id === filters.termId);
  }
  if (filters?.classId) {
    const cLower = filters.classId.toLowerCase();
    list = list.filter(r => r.class_id === filters.classId || r.class?.id === filters.classId || r.class?.name.toLowerCase() === cLower);
  }
  if (filters?.subjectId) {
    list = list.filter(r => r.subject_id === filters.subjectId);
  }
  if (filters?.status) {
    list = list.filter(r => r.status === filters.status);
  }
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

  // Look up student from store
  const student = findStoreStudent(data.student_id);
  const subjects = getStoreSubjects();
  const subject = subjects.find(s => s.id === data.subject_id);
  const classes = getStoreClasses();
  const classItem = classes.find(c => c.id === data.class_id || c.name.toLowerCase() === data.class_id.toLowerCase());

  // Check if result already exists for this student, subject, and term
  const existingResults = getStoreResults();
  const existing = existingResults.find(r =>
    (r.student_id === data.student_id || r.student_id === student?.id || r.student?.student_id.toUpperCase() === data.student_id.toUpperCase()) &&
    r.subject_id === data.subject_id &&
    r.term_id === data.term_id
  );

  const resultId = existing ? existing.id : `c-${Date.now()}`;

  const studentObj: StudentRecord = student || {
    id: data.student_id,
    student_id: data.student_id.toUpperCase(),
    first_name: 'Student',
    last_name: data.student_id.toUpperCase(),
    class_id: data.class_id,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class: classItem,
  };

  const resultRecord: ResultRecord = {
    id: resultId,
    student_id: studentObj.id,
    subject_id: data.subject_id,
    class_id: classItem?.id || data.class_id,
    term_id: data.term_id,
    status: data.status,
    total_score: total,
    grade: evalResult.grade,
    remarks: evalResult.remark,
    published_at: data.status === 'published' ? new Date().toISOString() : null,
    created_at: existing ? existing.created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: studentObj,
    subject: subject || { id: data.subject_id, name: 'Subject', code: 'SUB', status: 'active', created_at: '' },
    class: classItem || { id: data.class_id, name: 'Class', level: 'General', status: 'active', created_at: '' },
    scores: [
      { id: `sc-${resultId}-1`, result_id: resultId, assessment_component_id: '44444444-4444-4444-4444-444444444441', score: Number(data.ca_score), component: { id: '44444444-4444-4444-4444-444444444441', name: 'CA', code: 'ca', maximum_score: 30, sequence_number: 1, is_active: true, created_at: '' } },
      { id: `sc-${resultId}-2`, result_id: resultId, assessment_component_id: '44444444-4444-4444-4444-444444444442', score: Number(data.exam_score), component: { id: '44444444-4444-4444-4444-444444444442', name: 'Exam', code: 'exam', maximum_score: 70, sequence_number: 2, is_active: true, created_at: '' } },
    ],
  };

  // Save to persistent storage
  saveStoreResult(resultRecord);

  // Attempt Supabase upsert
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('results').upsert({
        id: resultRecord.id,
        student_id: resultRecord.student_id,
        subject_id: resultRecord.subject_id,
        class_id: resultRecord.class_id,
        term_id: resultRecord.term_id,
        total_score: total,
        grade: evalResult.grade,
        remarks: evalResult.remark,
        status: data.status,
        published_at: resultRecord.published_at,
        updated_at: resultRecord.updated_at,
      }, { onConflict: 'student_id,subject_id,term_id' });
    } catch (err) {
      console.error('Supabase results upsert error (handled):', err);
    }
  }

  recordAuditLog(existing ? 'UPDATE_RESULT' : 'CREATE_RESULT', 'results', resultRecord.id, {
    student_id: studentObj.student_id,
    subject: subject?.name,
    term_id: data.term_id,
    total_score: total,
    grade: evalResult.grade,
    status: data.status,
  });

  return resultRecord;
}

export async function publishResultBatch(resultIds: string[], reason: string = 'Authorized publication') {
  const count = publishStoreResults(resultIds);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase
        .from('results')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('id', resultIds);
    } catch (err) {
      console.error('Error publishing in Supabase:', err);
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
  let list = [...getStoreStaff()];

  // Also check cookie registry for dynamically added teachers
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const regCookie = cookieStore.get('registered_teachers_registry');
    if (regCookie?.value) {
      const dynamicList = JSON.parse(regCookie.value);
      for (const t of dynamicList) {
        if (!list.some(item => item.email.toLowerCase() === t.email.toLowerCase())) {
          list.push({
            id: t.id,
            email: t.email,
            display_name: t.display_name,
            role: 'teacher',
            department: t.department || `Class Teacher (${t.assigned_class || 'Class'})`,
            assigned_subject: t.assigned_subject || 'General Curriculum',
            assigned_class: t.assigned_class || 'All Classes',
            created_at: t.created_at || new Date().toISOString(),
            status: 'active',
          });
        }
      }
    }
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['teacher', 'administrator'])
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        for (const p of data) {
          if (!list.some(item => item.id === p.id || item.email.toLowerCase() === p.email?.toLowerCase())) {
            list.push({
              id: p.id,
              email: p.email || '',
              display_name: p.display_name,
              role: p.role as 'administrator' | 'teacher',
              department: p.role === 'administrator' ? 'Administration' : 'Academic Faculty',
              assigned_subject: 'General Curriculum',
              assigned_class: 'All Classes',
              created_at: p.created_at || new Date().toISOString(),
              status: 'active',
            });
          }
        }
      }
    } catch {}
  }

  return list;
}

export async function addAdminTeacher(data: {
  full_name: string;
  email: string;
  department: string;
  assigned_subject?: string;
  assigned_class?: string;
  password?: string;
}): Promise<StaffRecord> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const newId = `t-${Date.now()}`;

  const newStaff: StaffRecord = {
    id: newId,
    email: normalizedEmail,
    display_name: data.full_name.trim(),
    role: 'teacher',
    department: data.department.trim(),
    assigned_subject: data.assigned_subject || 'General Curriculum',
    assigned_class: data.assigned_class || 'JSS 1A',
    password: data.password,
    created_at: new Date().toISOString(),
    status: 'active',
  };

  saveStoreStaff(newStaff);

  recordAuditLog('REGISTER_TEACHER', 'staff', newStaff.id, {
    teacher_name: newStaff.display_name,
    email: newStaff.email,
    department: newStaff.department,
    assigned_class: newStaff.assigned_class,
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
    } catch {}
  }

  return newStaff;
}

export async function deleteAdminStudent(studentIdOrId: string): Promise<boolean> {
  const student = findStoreStudent(studentIdOrId);
  const success = deleteStoreStudent(studentIdOrId);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase
        .from('students')
        .delete()
        .or(`id.eq.${studentIdOrId},student_id.eq.${studentIdOrId.toUpperCase()}`);
    } catch {}
  }

  recordAuditLog('DELETE_STUDENT', 'students', studentIdOrId, {
    student_id: student?.student_id || studentIdOrId,
    name: student ? `${student.first_name} ${student.last_name}` : 'Unknown',
  });

  return success;
}

export async function deleteAdminSubject(subjectId: string): Promise<boolean> {
  const subjects = getStoreSubjects();
  const subject = subjects.find(s => s.id === subjectId || s.code.toLowerCase() === subjectId.toLowerCase());
  const success = deleteStoreSubject(subjectId);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('subjects').delete().eq('id', subjectId);
    } catch {}
  }

  recordAuditLog('DELETE_SUBJECT', 'subjects', subjectId, {
    name: subject?.name,
    code: subject?.code,
  });

  return success;
}

export async function deleteAdminStaff(staffId: string): Promise<boolean> {
  const staffList = getStoreStaff();
  const member = staffList.find(s => s.id === staffId || s.email.toLowerCase() === staffId.toLowerCase());

  // Protect administrator account from accidental self-deletion
  if (member?.role === 'administrator') {
    throw new Error('Administrative governance policy prevents deleting the primary Administrator account.');
  }

  const success = deleteStoreStaff(staffId);

  // Also remove from registered_teachers_registry cookie if present
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const regCookie = cookieStore.get('registered_teachers_registry');
    if (regCookie?.value) {
      let dynamicList = JSON.parse(regCookie.value);
      dynamicList = dynamicList.filter(
        (t: any) => t.id !== staffId && t.email.toLowerCase() !== staffId.toLowerCase()
      );
      cookieStore.set('registered_teachers_registry', JSON.stringify(dynamicList), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('profiles').delete().eq('id', staffId);
    } catch {}
  }

  recordAuditLog('DELETE_STAFF', 'staff', staffId, {
    name: member?.display_name,
    email: member?.email,
    role: member?.role,
  });

  return success;
}

export async function deleteAdminClass(classId: string): Promise<boolean> {
  const classes = getStoreClasses();
  const cls = classes.find(c => c.id === classId || c.name.toLowerCase() === classId.toLowerCase());
  const success = deleteStoreClass(classId);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('classes').delete().eq('id', classId);
    } catch {}
  }

  recordAuditLog('DELETE_CLASS', 'classes', classId, {
    name: cls?.name,
    level: cls?.level,
  });

  return success;
}

export async function deleteAdminResult(resultId: string): Promise<boolean> {
  const results = getStoreResults();
  const result = results.find(r => r.id === resultId);
  const success = deleteStoreResult(resultId);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from('results').delete().eq('id', resultId);
    } catch {}
  }

  recordAuditLog('DELETE_RESULT', 'results', resultId, {
    student_id: result?.student_id,
    subject_id: result?.subject_id,
    term_id: result?.term_id,
  });

  return success;
}

