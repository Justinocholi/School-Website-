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
  StaffRecord,
  Announcement,
} from '@/types/database.types';
import { evaluateGrade } from '@/lib/grading/grading-engine';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CA_COMPONENT_ID = '44444444-4444-4444-4444-444444444441';
const EXAM_COMPONENT_ID = '44444444-4444-4444-4444-444444444442';

const DEFAULT_TEACHER_METADATA: Record<
  string,
  { department: string; assigned_class: string; assigned_subject: string }
> = {
  'david.adeleke@greenfieldcollege.edu': {
    department: 'Junior Secondary (Form Teacher)',
    assigned_class: 'JSS 1A',
    assigned_subject: 'General Curriculum',
  },
  'grace.danjuma@greenfieldcollege.edu': {
    department: 'Junior Secondary (Form Teacher)',
    assigned_class: 'JSS 2A',
    assigned_subject: 'General Curriculum',
  },
  'samuel.osei@greenfieldcollege.edu': {
    department: 'Senior Secondary (Form Teacher)',
    assigned_class: 'SS 1 Science',
    assigned_subject: 'General Curriculum',
  },
};

function isUuid(value?: string | null): boolean {
  return Boolean(value && UUID_REGEX.test(value.trim()));
}

function normalizeResultRecord(raw: any): ResultRecord {
  return {
    ...raw,
    total_score: Number(raw.total_score ?? 0),
    scores: Array.isArray(raw.scores)
      ? raw.scores.map((s: any) => ({
          ...s,
          score: Number(s.score ?? 0),
          component: s.component
            ? {
                ...s.component,
                maximum_score: Number(s.component.maximum_score ?? 0),
              }
            : undefined,
        }))
      : [],
  };
}

export async function getAdminOverviewStats(classFilter?: string) {
  const supabase = createAdminClient();

  let targetClassId: string | undefined;
  if (classFilter) {
    if (isUuid(classFilter)) {
      targetClassId = classFilter.trim();
    } else {
      const { data: cls } = await supabase
        .from('classes')
        .select('id')
        .ilike('name', classFilter.trim())
        .maybeSingle();
      targetClassId = cls?.id;
    }
  }

  let studentQ = supabase.from('students').select('*', { count: 'exact', head: true });
  let pendingResultQ = supabase
    .from('results')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review');
  let publishedResultQ = supabase
    .from('results')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (classFilter) {
    if (targetClassId) {
      studentQ = studentQ.eq('class_id', targetClassId);
      pendingResultQ = pendingResultQ.eq('class_id', targetClassId);
      publishedResultQ = publishedResultQ.eq('class_id', targetClassId);
    } else {
      return {
        totalStudents: 0,
        totalClasses: 1,
        totalSubjects: 0,
        pendingResults: 0,
        publishedResults: 0,
        recentImports: [] as ImportJob[],
        recentActivity: [] as AuditLog[],
      };
    }
  }

  const [
    { count: studentCount },
    { count: classCount },
    { count: subjectCount },
    { count: pendingResultCount },
    { count: publishedResultCount },
    { data: recentImportsData },
    recentActivity,
  ] = await Promise.all([
    studentQ,
    supabase.from('classes').select('*', { count: 'exact', head: true }),
    supabase.from('subjects').select('*', { count: 'exact', head: true }),
    pendingResultQ,
    publishedResultQ,
    supabase
      .from('import_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    getAdminAuditLogs(5),
  ]);

  return {
    totalStudents: studentCount ?? 0,
    totalClasses: classFilter ? 1 : (classCount ?? 0),
    totalSubjects: subjectCount ?? 0,
    pendingResults: pendingResultCount ?? 0,
    publishedResults: publishedResultCount ?? 0,
    recentImports: (recentImportsData as ImportJob[]) || [],
    recentActivity,
  };
}

export async function getAdminStudents(
  query?: string,
  classId?: string,
  status?: string
): Promise<StudentRecord[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('students')
    .select('*, class:classes(id, name, level, status, created_at)')
    .order('student_id', { ascending: true });

  if (error) {
    throw new Error(`Failed to load students: ${error.message}`);
  }

  let list = (data as unknown as StudentRecord[]) || [];

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.student_id.toLowerCase().includes(q) ||
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q) ||
        (s.other_names && s.other_names.toLowerCase().includes(q))
    );
  }

  if (classId && classId.trim()) {
    const cLower = classId.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.class_id === classId ||
        s.class?.id === classId ||
        s.class?.name?.toLowerCase() === cLower
    );
  }

  if (status && status.trim()) {
    list = list.filter((s) => s.status === status.trim());
  }

  return list;
}

export async function getAdminStudentById(
  studentIdOrId: string
): Promise<StudentRecord | null> {
  const supabase = createAdminClient();
  const trimmed = studentIdOrId.trim();
  if (!trimmed) return null;

  let query = supabase
    .from('students')
    .select('*, class:classes(id, name, level, status, created_at)');

  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.ilike('student_id', trimmed.toUpperCase());
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as unknown as StudentRecord;
}

export async function addAdminStudent(data: {
  student_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  class_id?: string;
  admission_date?: string;
  password?: string;
  updateIfExists?: boolean;
}): Promise<StudentRecord> {
  const supabase = createAdminClient();
  const normId = data.student_id.trim().toUpperCase();
  const firstName = data.first_name.trim();
  const lastName = data.last_name.trim();
  const otherNames = data.other_names?.trim() || null;
  const fullName = `${firstName} ${lastName}`.trim();
  const internalEmail = `${normId.toLowerCase()}@student.greenfieldcollege.edu`;
  const studentPassword = data.password?.trim() || 'Student@2026';

  // Resolve class_id (accept UUID or class name)
  let resolvedClassId: string | null = null;
  if (data.class_id && data.class_id.trim()) {
    if (isUuid(data.class_id)) {
      resolvedClassId = data.class_id.trim();
    } else {
      const { data: cls } = await supabase
        .from('classes')
        .select('id')
        .ilike('name', data.class_id.trim())
        .maybeSingle();
      resolvedClassId = cls?.id || null;
    }
  }

  // Check if student already exists in public.students
  const { data: existingStudent } = await supabase
    .from('students')
    .select('id, user_id, student_id')
    .ilike('student_id', normId)
    .maybeSingle();

  if (existingStudent && !data.updateIfExists) {
    throw new Error(`Student ID ${normId} already exists in the school database.`);
  }

  // Provision or update Supabase Auth user for this student
  let authUserId: string | null = existingStudent?.user_id || null;

  try {
    if (authUserId) {
      await supabase.auth.admin.updateUserById(authUserId, {
        email: internalEmail,
        password: studentPassword,
        email_confirm: true,
        user_metadata: {
          display_name: fullName,
          role: 'student',
          student_id: normId,
        },
      });
    } else {
      const { data: createdAuth, error: authErr } =
        await supabase.auth.admin.createUser({
          email: internalEmail,
          password: studentPassword,
          email_confirm: true,
          user_metadata: {
            display_name: fullName,
            role: 'student',
            student_id: normId,
          },
        });

      if (!authErr && createdAuth.user) {
        authUserId = createdAuth.user.id;
      } else if (authErr) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', internalEmail)
          .maybeSingle();

        if (existingProfile?.id) {
          const existingAuthId = String(existingProfile.id);
          authUserId = existingAuthId;
          await supabase.auth.admin.updateUserById(existingAuthId, {
            password: studentPassword,
            email_confirm: true,
            user_metadata: {
              display_name: fullName,
              role: 'student',
              student_id: normId,
            },
          });
        }
      }
    }

    if (authUserId) {
      await supabase.from('profiles').upsert({
        id: authUserId,
        role: 'student',
        display_name: fullName,
        email: internalEmail,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Student auth provisioning notice:', err);
  }

  let savedStudent: any;

  if (existingStudent && data.updateIfExists) {
    const { data: updated, error: updateErr } = await supabase
      .from('students')
      .update({
        user_id: authUserId,
        first_name: firstName,
        last_name: lastName,
        other_names: otherNames,
        class_id: resolvedClassId,
        admission_date:
          data.admission_date || new Date().toISOString().split('T')[0],
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingStudent.id)
      .select('*, class:classes(id, name, level, status, created_at)')
      .single();

    if (updateErr || !updated) {
      throw new Error(updateErr?.message || 'Failed to update student in Supabase.');
    }
    savedStudent = updated;
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from('students')
      .insert({
        user_id: authUserId,
        student_id: normId,
        first_name: firstName,
        last_name: lastName,
        other_names: otherNames,
        class_id: resolvedClassId,
        admission_date:
          data.admission_date || new Date().toISOString().split('T')[0],
        status: 'active',
      })
      .select('*, class:classes(id, name, level, status, created_at)')
      .single();

    if (insertErr || !inserted) {
      throw new Error(insertErr?.message || 'Failed to create student in Supabase.');
    }
    savedStudent = inserted;
  }

  await recordAuditLog(
    existingStudent ? 'UPDATE_STUDENT' : 'CREATE_STUDENT',
    'students',
    savedStudent.id,
    {
      student_id: savedStudent.student_id,
      name: `${savedStudent.first_name} ${savedStudent.last_name}`,
      class: savedStudent.class?.name || null,
    }
  );

  return savedStudent as unknown as StudentRecord;
}

export async function getAdminClasses(): Promise<ClassRecord[]> {
  const supabase = createAdminClient();

  const [{ data: classes, error }, { data: students }] = await Promise.all([
    supabase.from('classes').select('*').order('name'),
    supabase.from('students').select('class_id').eq('status', 'active'),
  ]);

  if (error) {
    throw new Error(`Failed to fetch classes: ${error.message}`);
  }

  const counts = new Map<string, number>();
  for (const s of students || []) {
    if (s.class_id) {
      counts.set(s.class_id, (counts.get(s.class_id) || 0) + 1);
    }
  }

  return ((classes as ClassRecord[]) || []).map((c) => ({
    ...c,
    student_count: counts.get(c.id) ?? 0,
  }));
}

export async function addAdminClass(data: {
  name: string;
  level: string;
}): Promise<ClassRecord> {
  const supabase = createAdminClient();
  const cleanName = data.name.trim();
  const cleanLevel = data.level.trim();

  const { data: existing } = await supabase
    .from('classes')
    .select('id')
    .ilike('name', cleanName)
    .maybeSingle();

  if (existing) {
    throw new Error(`Class "${cleanName}" already exists.`);
  }

  const { data: inserted, error } = await supabase
    .from('classes')
    .insert({
      name: cleanName,
      level: cleanLevel,
      status: 'active',
    })
    .select('*')
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Failed to create class.');
  }

  await recordAuditLog('CREATE_CLASS', 'classes', inserted.id, {
    name: inserted.name,
    level: inserted.level,
  });

  return { ...(inserted as ClassRecord), student_count: 0 };
}

export async function getAdminSubjects(): Promise<SubjectRecord[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch subjects: ${error.message}`);
  }

  return (data as SubjectRecord[]) || [];
}

export async function addAdminSubject(data: {
  name: string;
  code: string;
}): Promise<SubjectRecord> {
  const supabase = createAdminClient();
  const cleanName = data.name.trim();
  const cleanCode = data.code.trim().toUpperCase();

  const { data: existing } = await supabase
    .from('subjects')
    .select('id')
    .ilike('code', cleanCode)
    .maybeSingle();

  if (existing) {
    throw new Error(`Subject code "${cleanCode}" already exists.`);
  }

  const { data: inserted, error } = await supabase
    .from('subjects')
    .insert({
      name: cleanName,
      code: cleanCode,
      status: 'active',
    })
    .select('*')
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Failed to create subject.');
  }

  await recordAuditLog('CREATE_SUBJECT', 'subjects', inserted.id, {
    name: inserted.name,
    code: inserted.code,
  });

  return inserted as SubjectRecord;
}

export async function getAdminSessions(): Promise<AcademicSession[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('academic_sessions')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch academic sessions: ${error.message}`);
  }

  return (data as AcademicSession[]) || [];
}

export async function addAdminSession(data: {
  name: string;
  start_date?: string;
  end_date?: string;
  set_active?: boolean;
}): Promise<AcademicSession> {
  const supabase = createAdminClient();
  const cleanName = data.name.trim();
  if (!cleanName) {
    throw new Error('Academic session name is required (e.g. 2027/2028).');
  }

  const { data: existing } = await supabase
    .from('academic_sessions')
    .select('id')
    .ilike('name', cleanName)
    .maybeSingle();

  if (existing) {
    throw new Error(`Academic session "${cleanName}" already exists.`);
  }

  const startYearMatch = cleanName.match(/^(\d{4})/);
  const baseYear = startYearMatch ? parseInt(startYearMatch[1], 10) : new Date().getFullYear();
  const startDate = data.start_date?.trim() || `${baseYear}-09-01`;
  const endDate = data.end_date?.trim() || `${baseYear + 1}-07-31`;

  const { data: inserted, error } = await supabase
    .from('academic_sessions')
    .insert({
      name: cleanName,
      start_date: startDate,
      end_date: endDate,
      is_active: false,
    })
    .select('*')
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Failed to create academic session.');
  }

  // Automatically provision the 3 standard terms for this academic session
  const defaultTerms = [
    {
      academic_session_id: inserted.id,
      name: 'First Term',
      sequence_number: 1,
      start_date: `${baseYear}-09-01`,
      end_date: `${baseYear}-12-18`,
      is_active: false,
    },
    {
      academic_session_id: inserted.id,
      name: 'Second Term',
      sequence_number: 2,
      start_date: `${baseYear + 1}-01-10`,
      end_date: `${baseYear + 1}-04-15`,
      is_active: false,
    },
    {
      academic_session_id: inserted.id,
      name: 'Third Term',
      sequence_number: 3,
      start_date: `${baseYear + 1}-04-28`,
      end_date: `${baseYear + 1}-07-31`,
      is_active: false,
    },
  ];

  const { error: termErr } = await supabase.from('terms').insert(defaultTerms);
  if (termErr) {
    throw new Error(`Session created, but failed to generate terms: ${termErr.message}`);
  }

  if (data.set_active) {
    await setActiveAdminSession(inserted.id);
    inserted.is_active = true;
  }

  await recordAuditLog('CREATE_SESSION', 'academic_sessions', inserted.id, {
    name: inserted.name,
    start_date: inserted.start_date,
    end_date: inserted.end_date,
    set_active: Boolean(data.set_active),
  });

  return inserted as AcademicSession;
}

export async function setActiveAdminSession(sessionId: string) {
  const supabase = createAdminClient();
  const trimmed = sessionId.trim();

  let sessionQuery = supabase.from('academic_sessions').select('*');
  if (isUuid(trimmed)) {
    sessionQuery = sessionQuery.eq('id', trimmed);
  } else {
    sessionQuery = sessionQuery.ilike('name', trimmed);
  }

  const { data: targetSession } = await sessionQuery.maybeSingle();
  if (!targetSession) {
    throw new Error('Academic session not found.');
  }

  const { error: deactErr } = await supabase
    .from('academic_sessions')
    .update({ is_active: false })
    .neq('id', targetSession.id);

  if (deactErr) {
    throw new Error(`Failed to update sessions: ${deactErr.message}`);
  }

  const { error: actErr } = await supabase
    .from('academic_sessions')
    .update({ is_active: true })
    .eq('id', targetSession.id);

  if (actErr) {
    throw new Error(`Failed to activate session: ${actErr.message}`);
  }

  // Ensure a term within this session is active (default to First Term)
  const { data: sessionTerms } = await supabase
    .from('terms')
    .select('*')
    .eq('academic_session_id', targetSession.id)
    .order('sequence_number', { ascending: true });

  let activeTermId: string | null = null;
  if (sessionTerms && sessionTerms.length > 0) {
    const alreadyActive = sessionTerms.find((t) => t.is_active);
    const chosenTerm = alreadyActive || sessionTerms[0];
    activeTermId = chosenTerm.id;

    await supabase
      .from('terms')
      .update({ is_active: false })
      .neq('id', chosenTerm.id);

    await supabase
      .from('terms')
      .update({ is_active: true })
      .eq('id', chosenTerm.id);
  }

  await supabase
    .from('school_settings')
    .update({
      current_session_id: targetSession.id,
      ...(activeTermId ? { current_term_id: activeTermId } : {}),
      updated_at: new Date().toISOString(),
    })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  await recordAuditLog('SET_ACTIVE_SESSION', 'academic_sessions', targetSession.id, {
    session_name: targetSession.name,
    active_term_id: activeTermId,
  });

  return { success: true, activeSessionId: targetSession.id, activeTermId };
}

export async function deleteAdminSession(sessionId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const trimmed = sessionId.trim();

  let query = supabase.from('academic_sessions').select('*');
  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.ilike('name', trimmed);
  }

  const { data: session } = await query.maybeSingle();
  if (!session) {
    return false;
  }

  const { count } = await supabase
    .from('academic_sessions')
    .select('id', { count: 'exact', head: true });

  if ((count ?? 0) <= 1) {
    throw new Error('Cannot delete the only remaining academic session.');
  }

  const { data: sessionTerms } = await supabase
    .from('terms')
    .select('id')
    .eq('academic_session_id', session.id);

  const termIds = (sessionTerms || []).map((t) => t.id);
  if (termIds.length > 0) {
    await supabase.from('results').delete().in('term_id', termIds);
    await supabase.from('terms').delete().in('id', termIds);
  }

  const { error } = await supabase
    .from('academic_sessions')
    .delete()
    .eq('id', session.id);

  if (error) {
    throw new Error(`Failed to delete session: ${error.message}`);
  }

  if (session.is_active) {
    const { data: remaining } = await supabase
      .from('academic_sessions')
      .select('id')
      .order('start_date', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (remaining?.id) {
      await setActiveAdminSession(remaining.id);
    }
  }

  await recordAuditLog('DELETE_SESSION', 'academic_sessions', session.id, {
    name: session.name,
  });

  return true;
}

export async function getAdminTerms(sessionId?: string): Promise<TermRecord[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from('terms')
    .select('*, session:academic_sessions(*)')
    .order('sequence_number', { ascending: true });

  if (sessionId && isUuid(sessionId)) {
    query = query.eq('academic_session_id', sessionId.trim());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch academic terms: ${error.message}`);
  }

  return (data as unknown as TermRecord[]) || [];
}

export async function setActiveAdminTerm(termId: string) {
  const supabase = createAdminClient();

  const { data: targetTerm } = await supabase
    .from('terms')
    .select('id, academic_session_id, name')
    .eq('id', termId)
    .maybeSingle();

  const { error: deactivateErr } = await supabase
    .from('terms')
    .update({ is_active: false })
    .neq('id', termId);

  if (deactivateErr) {
    throw new Error(`Failed to update terms: ${deactivateErr.message}`);
  }

  const { error: activateErr } = await supabase
    .from('terms')
    .update({ is_active: true })
    .eq('id', termId);

  if (activateErr) {
    throw new Error(`Failed to activate term: ${activateErr.message}`);
  }

  // Synchronize parent session as active session
  if (targetTerm?.academic_session_id) {
    await supabase
      .from('academic_sessions')
      .update({ is_active: false })
      .neq('id', targetTerm.academic_session_id);

    await supabase
      .from('academic_sessions')
      .update({ is_active: true })
      .eq('id', targetTerm.academic_session_id);
  }

  await supabase
    .from('school_settings')
    .update({
      current_term_id: termId,
      ...(targetTerm?.academic_session_id
        ? { current_session_id: targetTerm.academic_session_id }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  await recordAuditLog('SET_ACTIVE_TERM', 'terms', termId, {
    active_term_id: termId,
    academic_session_id: targetTerm?.academic_session_id || null,
  });

  return { success: true };
}

export async function getAdminResults(filters?: {
  sessionId?: string;
  termId?: string;
  classId?: string;
  subjectId?: string;
  status?: string;
  studentId?: string;
}): Promise<ResultRecord[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('results')
    .select(
      `
      id, student_id, subject_id, class_id, term_id, status, total_score, grade, remarks, published_at, created_at, updated_at,
      student:students(id, user_id, student_id, first_name, last_name, other_names, class_id, admission_date, status, created_at, updated_at),
      subject:subjects(id, name, code, status, created_at),
      class:classes(id, name, level, status, created_at),
      term:terms(id, name, sequence_number, is_active, academic_session_id, session:academic_sessions(id, name, is_active)),
      scores:result_scores(id, result_id, score, assessment_component_id, component:assessment_components(id, name, code, maximum_score, sequence_number, is_active))
    `
    )
    .order('created_at', { ascending: false });

  if (filters?.termId && isUuid(filters.termId)) {
    query = query.eq('term_id', filters.termId.trim());
  }
  if (filters?.subjectId && isUuid(filters.subjectId)) {
    query = query.eq('subject_id', filters.subjectId.trim());
  }
  if (filters?.status && filters.status.trim()) {
    query = query.eq('status', filters.status.trim());
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch results: ${error.message}`);
  }

  let list = ((data as any[]) || []).map(normalizeResultRecord);

  if (filters?.sessionId && isUuid(filters.sessionId)) {
    const sessTrim = filters.sessionId.trim();
    list = list.filter((r) => r.term?.academic_session_id === sessTrim);
  }

  if (filters?.classId && filters.classId.trim()) {
    const cTrim = filters.classId.trim();
    const cLower = cTrim.toLowerCase();
    list = list.filter(
      (r) =>
        r.class_id === cTrim ||
        r.class?.id === cTrim ||
        r.class?.name?.toLowerCase() === cLower ||
        r.student?.class_id === cTrim
    );
  }

  if (filters?.studentId && filters.studentId.trim()) {
    const sTrim = filters.studentId.trim();
    const sUpper = sTrim.toUpperCase();
    list = list.filter(
      (r) =>
        r.student_id === sTrim ||
        r.student?.id === sTrim ||
        r.student?.student_id?.toUpperCase() === sUpper
    );
  }

  return list;
}

export async function saveSingleResult(data: {
  student_id: string; // Student UUID or Admission Number (e.g. GFS001)
  subject_id: string;
  class_id: string;
  term_id: string;
  ca_score: number;
  exam_score: number;
  status: 'draft' | 'pending_review' | 'published';
}): Promise<ResultRecord> {
  const supabase = createAdminClient();
  const total = Number(data.ca_score) + Number(data.exam_score);
  const evalResult = evaluateGrade(total);

  // 1. Resolve student in Supabase by UUID or Admission ID
  const student = await getAdminStudentById(data.student_id);
  if (!student) {
    throw new Error(
      `Student "${data.student_id}" was not found in the school database.`
    );
  }

  // 2. Resolve class_id (prefer student's enrolled class if valid, or resolve provided class_id)
  let resolvedClassId = student.class_id || null;
  if (data.class_id && data.class_id.trim()) {
    if (isUuid(data.class_id)) {
      resolvedClassId = student.class_id || data.class_id.trim();
    } else {
      const { data: cls } = await supabase
        .from('classes')
        .select('id')
        .ilike('name', data.class_id.trim())
        .maybeSingle();
      if (cls?.id) {
        resolvedClassId = cls.id;
      }
    }
  }

  if (!resolvedClassId) {
    const { data: firstClass } = await supabase
      .from('classes')
      .select('id')
      .limit(1)
      .single();
    resolvedClassId = firstClass?.id || null;
  }

  if (!resolvedClassId) {
    throw new Error('Unable to resolve a valid class for this result.');
  }

  // 3. Check if result already exists for (student.id, subject_id, term_id)
  const { data: existing } = await supabase
    .from('results')
    .select('id, published_at, created_at')
    .eq('student_id', student.id)
    .eq('subject_id', data.subject_id)
    .eq('term_id', data.term_id)
    .maybeSingle();

  const nowIso = new Date().toISOString();
  const publishedAt =
    data.status === 'published'
      ? existing?.published_at || nowIso
      : null;

  // 4. Upsert into public.results
  const { data: upserted, error: upsertErr } = await supabase
    .from('results')
    .upsert(
      {
        ...(existing?.id ? { id: existing.id } : {}),
        student_id: student.id,
        subject_id: data.subject_id,
        class_id: resolvedClassId,
        term_id: data.term_id,
        status: data.status,
        total_score: total,
        grade: evalResult.grade,
        remarks: evalResult.remark,
        published_at: publishedAt,
        updated_at: nowIso,
      },
      { onConflict: 'student_id,subject_id,term_id' }
    )
    .select('id')
    .single();

  if (upsertErr || !upserted) {
    throw new Error(upsertErr?.message || 'Failed to save result to Supabase.');
  }

  // 5. Upsert CA and Exam scores into public.result_scores
  const { error: scoresErr } = await supabase.from('result_scores').upsert(
    [
      {
        result_id: upserted.id,
        assessment_component_id: CA_COMPONENT_ID,
        score: Number(data.ca_score),
      },
      {
        result_id: upserted.id,
        assessment_component_id: EXAM_COMPONENT_ID,
        score: Number(data.exam_score),
      },
    ],
    { onConflict: 'result_id,assessment_component_id' }
  );

  if (scoresErr) {
    throw new Error(`Failed to save component scores: ${scoresErr.message}`);
  }

  // 6. Fetch complete enriched ResultRecord
  const { data: fullResult, error: fetchErr } = await supabase
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
    .eq('id', upserted.id)
    .single();

  if (fetchErr || !fullResult) {
    throw new Error(fetchErr?.message || 'Failed to load saved result.');
  }

  const normalized = normalizeResultRecord(fullResult);

  await recordAuditLog(
    existing ? 'UPDATE_RESULT' : 'CREATE_RESULT',
    'results',
    normalized.id,
    {
      student_id: student.student_id,
      student_name: `${student.first_name} ${student.last_name}`,
      subject: normalized.subject?.name,
      term_id: data.term_id,
      total_score: total,
      grade: evalResult.grade,
      status: data.status,
    }
  );

  return normalized;
}

export async function publishResultBatch(
  resultIds: string[],
  reason: string = 'Authorized publication'
) {
  const supabase = createAdminClient();
  const validIds = resultIds.filter((id) => isUuid(id));

  if (validIds.length === 0) {
    return { count: 0 };
  }

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('results')
    .update({
      status: 'published',
      published_at: nowIso,
      updated_at: nowIso,
    })
    .in('id', validIds)
    .select('id');

  if (error) {
    throw new Error(`Failed to publish results: ${error.message}`);
  }

  const count = data?.length ?? 0;

  await recordAuditLog('PUBLISH_RESULTS_BATCH', 'results', null, {
    count,
    reason,
    result_ids: validIds,
  });

  return { count };
}

export async function recordAuditLog(
  action: string,
  entity_type: string,
  entity_id: string | null,
  change_summary: Record<string, unknown>
): Promise<AuditLog | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        action,
        entity_type,
        entity_id: entity_id || null,
        change_summary,
      })
      .select('*')
      .single();

    if (error || !data) return null;
    return {
      ...(data as AuditLog),
      actor_email: 'admin@greenfieldcollege.edu',
    };
  } catch {
    return null;
  }
}

export async function getAdminAuditLogs(limit: number = 50): Promise<AuditLog[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as AuditLog[]).map((log) => ({
    ...log,
    actor_email: log.actor_email || 'admin@greenfieldcollege.edu',
  }));
}

export async function getAdminStaff(): Promise<StaffRecord[]> {
  const supabase = createAdminClient();

  const [{ data: profiles, error }, { data: authUsersData }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .in('role', ['teacher', 'administrator'])
      .order('created_at', { ascending: true }),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (error) {
    throw new Error(`Failed to load staff profiles: ${error.message}`);
  }

  const authMap = new Map<string, any>();
  for (const u of authUsersData?.users || []) {
    authMap.set(u.id, u);
  }

  return ((profiles as any[]) || []).map((p) => {
    const authUser = authMap.get(p.id);
    const meta = authUser?.user_metadata || {};
    const emailLower = (p.email || authUser?.email || '').toLowerCase();
    const fallbackMeta = DEFAULT_TEACHER_METADATA[emailLower];

    const isAdmin = p.role === 'administrator';
    return {
      id: p.id,
      email: p.email || authUser?.email || '',
      display_name: p.display_name || meta.display_name || 'Staff Member',
      role: p.role as 'administrator' | 'teacher',
      department:
        meta.department ||
        fallbackMeta?.department ||
        (isAdmin ? 'Executive Governance' : 'Academic Faculty'),
      assigned_subject:
        meta.assigned_subject ||
        fallbackMeta?.assigned_subject ||
        'General Curriculum',
      assigned_class:
        meta.assigned_class ||
        fallbackMeta?.assigned_class ||
        (isAdmin ? 'All Classes' : 'JSS 1A'),
      created_at: p.created_at || new Date().toISOString(),
      status: 'active',
    };
  });
}

export async function addAdminTeacher(data: {
  full_name: string;
  email: string;
  department: string;
  assigned_subject?: string;
  assigned_class?: string;
  password?: string;
}): Promise<StaffRecord> {
  const supabase = createAdminClient();
  const normalizedEmail = data.email.toLowerCase().trim();
  const displayName = data.full_name.trim();
  const department =
    data.department.trim() ||
    `Class Teacher (${data.assigned_class || 'JSS 1A'})`;
  const assignedSubject = data.assigned_subject?.trim() || 'General Curriculum';
  const assignedClass = data.assigned_class?.trim() || 'JSS 1A';
  const teacherPassword = data.password || 'Teacher@2026';

  let userId: string | null = null;

  // Check if profile or auth user already exists for this email
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .ilike('email', normalizedEmail)
    .maybeSingle();

  if (existingProfile?.id) {
    userId = existingProfile.id;
  } else {
    const { data: usersList } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    const matched = usersList?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );
    if (matched) {
      userId = matched.id;
    }
  }

  if (userId) {
    const { error: updateAuthErr } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email: normalizedEmail,
        password: teacherPassword,
        email_confirm: true,
        user_metadata: {
          display_name: displayName,
          role: 'teacher',
          department,
          assigned_class: assignedClass,
          assigned_subject: assignedSubject,
        },
      }
    );
    if (updateAuthErr) {
      throw new Error(`Failed to update teacher auth account: ${updateAuthErr.message}`);
    }
  } else {
    const { data: createdAuth, error: createAuthErr } =
      await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: teacherPassword,
        email_confirm: true,
        user_metadata: {
          display_name: displayName,
          role: 'teacher',
          department,
          assigned_class: assignedClass,
          assigned_subject: assignedSubject,
        },
      });

    if (createAuthErr || !createdAuth.user) {
      throw new Error(
        createAuthErr?.message || 'Failed to create teacher auth account.'
      );
    }
    userId = createdAuth.user.id;
  }

  const nowIso = new Date().toISOString();
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    role: 'teacher',
    display_name: displayName,
    email: normalizedEmail,
    updated_at: nowIso,
  });

  if (profileErr) {
    throw new Error(`Failed to save teacher profile: ${profileErr.message}`);
  }

  const newStaff: StaffRecord = {
    id: userId,
    email: normalizedEmail,
    display_name: displayName,
    role: 'teacher',
    department,
    assigned_subject: assignedSubject,
    assigned_class: assignedClass,
    created_at: nowIso,
    status: 'active',
  };

  await recordAuditLog('REGISTER_TEACHER', 'staff', newStaff.id, {
    teacher_name: newStaff.display_name,
    email: newStaff.email,
    department: newStaff.department,
    assigned_class: newStaff.assigned_class,
    role: 'teacher',
  });

  return newStaff;
}

export async function deleteAdminStudent(
  studentIdOrId: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const student = await getAdminStudentById(studentIdOrId);
  if (!student) {
    return false;
  }

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', student.id);

  if (error) {
    throw new Error(`Failed to delete student: ${error.message}`);
  }

  if (student.user_id) {
    try {
      await supabase.from('profiles').delete().eq('id', student.user_id);
      await supabase.auth.admin.deleteUser(student.user_id);
    } catch {
      // Auth user may already be removed
    }
  }

  await recordAuditLog('DELETE_STUDENT', 'students', student.id, {
    student_id: student.student_id,
    name: `${student.first_name} ${student.last_name}`,
  });

  return true;
}

export async function deleteAdminSubject(subjectId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const trimmed = subjectId.trim();

  let query = supabase.from('subjects').select('*');
  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.ilike('code', trimmed);
  }

  const { data: subject } = await query.maybeSingle();
  if (!subject) {
    return false;
  }

  // Delete dependent results and class_subjects first (results.subject_id has ON DELETE RESTRICT)
  await supabase.from('results').delete().eq('subject_id', subject.id);
  await supabase.from('class_subjects').delete().eq('subject_id', subject.id);

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', subject.id);

  if (error) {
    throw new Error(`Failed to delete subject: ${error.message}`);
  }

  await recordAuditLog('DELETE_SUBJECT', 'subjects', subject.id, {
    name: subject.name,
    code: subject.code,
  });

  return true;
}

export async function deleteAdminStaff(staffId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const trimmed = staffId.trim();

  if (trimmed.toLowerCase() === 'admin@greenfieldcollege.edu') {
    throw new Error(
      'Administrative governance policy prevents deleting the primary Administrator account.'
    );
  }

  let query = supabase.from('profiles').select('*');
  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.ilike('email', trimmed);
  }

  const { data: member } = await query.maybeSingle();

  if (member?.role === 'administrator') {
    throw new Error(
      'Administrative governance policy prevents deleting the primary Administrator account.'
    );
  }

  if (!member) {
    return false;
  }

  const { error: profErr } = await supabase
    .from('profiles')
    .delete()
    .eq('id', member.id);

  if (profErr) {
    throw new Error(`Failed to delete staff profile: ${profErr.message}`);
  }

  try {
    await supabase.auth.admin.deleteUser(member.id);
  } catch {
    // Auth user may already be removed
  }

  await recordAuditLog('DELETE_STAFF', 'staff', member.id, {
    name: member.display_name,
    email: member.email,
    role: member.role,
  });

  return true;
}

export async function deleteAdminClass(classId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const trimmed = classId.trim();

  let query = supabase.from('classes').select('*');
  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.ilike('name', trimmed);
  }

  const { data: cls } = await query.maybeSingle();
  if (!cls) {
    return false;
  }

  // Remove or unlink dependent rows (results.class_id has ON DELETE RESTRICT)
  await supabase.from('results').delete().eq('class_id', cls.id);
  await supabase.from('class_subjects').delete().eq('class_id', cls.id);
  await supabase
    .from('students')
    .update({ class_id: null })
    .eq('class_id', cls.id);

  const { error } = await supabase.from('classes').delete().eq('id', cls.id);
  if (error) {
    throw new Error(`Failed to delete class: ${error.message}`);
  }

  await recordAuditLog('DELETE_CLASS', 'classes', cls.id, {
    name: cls.name,
    level: cls.level,
  });

  return true;
}

export async function deleteAdminResult(resultId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const trimmed = resultId.trim();
  if (!isUuid(trimmed)) {
    return false;
  }

  const { data: existing } = await supabase
    .from('results')
    .select('id, student_id, subject_id, term_id')
    .eq('id', trimmed)
    .maybeSingle();

  if (!existing) {
    return false;
  }

  const { error } = await supabase
    .from('results')
    .delete()
    .eq('id', existing.id);

  if (error) {
    throw new Error(`Failed to delete result: ${error.message}`);
  }

  await recordAuditLog('DELETE_RESULT', 'results', existing.id, {
    student_id: existing.student_id,
    subject_id: existing.subject_id,
    term_id: existing.term_id,
  });

  return true;
}

const DEFAULT_ANNOUNCEMENTS_SEED = [
  {
    title: 'First Term 2026/2027 Resumption & Academic Calendar Guidelines',
    slug: 'resumption-date-2026-2027',
    summary:
      'Detailed schedule for boarding students check-in, academic orientation, and commencement of classroom lectures for the First Term.',
    body: 'We are delighted to welcome all returning scholars and newly enrolled students to Greenfield International College for the commencement of the 2026/2027 academic session.\n\nBoarding students are required to report to their designated hostels on Sunday, September 6th, 2026, between 10:00 AM and 4:00 PM. Housemasters and medical staff will be on ground to verify clearances and inspect student kits.\n\nDay students are expected on campus promptly by 7:30 AM on Monday, September 7th, 2026, for the inaugural session assembly.\n\nStudents are reminded that full compliance with the official school uniform, haircut standards, and textbooks is compulsory. We wish all our students an inspiring and fruitful academic year ahead.',
    category: 'Academic',
    target_audience: 'all',
    status: 'published',
    published_at: '2026-09-07T08:00:00Z',
  },
  {
    title: 'Admissions Open for JSS 1 and Senior Secondary Transfers (2026/2027)',
    slug: 'admissions-open-2026-2027',
    summary:
      'Greenfield International College is now accepting applications for prospective scholars into Junior and Senior Secondary classes.',
    body: 'Greenfield International College is pleased to announce that applications for admission into Junior Secondary School (JSS 1, 2) and Senior Secondary School (SS 1) are ongoing.\n\nProspective parents are encouraged to complete the online enquiry form on our website or visit the admissions office on campus to purchase the registration dossier.\n\nThe entrance examination assesses foundational competence in Mathematics, English Language, and Quantitative Reasoning.\n\nSelected candidates will be invited for an interactive interview with the admissions committee.',
    category: 'Admissions',
    target_audience: 'all',
    status: 'published',
    published_at: '2026-08-28T08:00:00Z',
  },
  {
    title: 'Annual Science Fair & Robotics Exhibition Announced for October',
    slug: 'annual-science-fair-robotics-exhibition',
    summary:
      'Scholars will present projects covering sustainable energy, artificial intelligence models, and automated agriculture.',
    body: 'The annual Greenfield Science & Innovation Fair will take place from October 14th to 16th, 2026, at the College Multi-Purpose Auditorium.\n\nScholars across all grade levels will display project prototypes covering robotics, renewable energy solutions, environmental sustainability, and algorithmic modeling.\n\nParents and educational stakeholders are cordially invited to attend the grand exhibition on the final day.',
    category: 'Events',
    target_audience: 'all',
    status: 'published',
    published_at: '2026-08-15T08:00:00Z',
  },
  {
    title: 'Continuous Assessment (CA) Timetable & Portal Result Verification',
    slug: 'ca-timetable-portal-verification',
    summary:
      'The schedule for continuous assessment tests has been synchronized with your student portal. Ensure you verify your registered subjects.',
    body: 'The schedule for the mid-term continuous assessment tests has been posted on the departmental notice boards and synchronized with your portal calendar. All students are expected to report punctually.\n\nContinuous Assessment accounts for 30% of your terminal grade, while the Terminal Examination accounts for 70%.',
    category: 'Academic',
    target_audience: 'students',
    status: 'published',
    published_at: '2026-10-12T08:00:00Z',
  },
];

let announcementsSeededCheck = false;

async function ensureDefaultAnnouncementsSeeded() {
  if (announcementsSeededCheck) return;
  announcementsSeededCheck = true;

  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from('announcements')
      .select('id', { count: 'exact', head: true });

    if ((count ?? 0) === 0) {
      await supabase
        .from('announcements')
        .upsert(DEFAULT_ANNOUNCEMENTS_SEED, { onConflict: 'slug' });
    }
  } catch {
    // Non-fatal
  }
}

export async function getAdminAnnouncements(filters?: {
  targetAudience?: 'all' | 'public' | 'students';
  status?: 'published' | 'draft';
}): Promise<Announcement[]> {
  await ensureDefaultAnnouncementsSeeded();

  const supabase = createAdminClient();
  let query = supabase
    .from('announcements')
    .select('*')
    .order('published_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.targetAudience === 'public') {
    query = query.in('target_audience', ['all', 'public']);
  } else if (filters?.targetAudience === 'students') {
    query = query.in('target_audience', ['all', 'students']);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch announcements: ${error.message}`);
  }

  return (data as Announcement[]) || [];
}

export async function getAnnouncementBySlug(
  slugOrId: string
): Promise<Announcement | null> {
  await ensureDefaultAnnouncementsSeeded();

  const supabase = createAdminClient();
  const trimmed = slugOrId.trim();
  if (!trimmed) return null;

  let query = supabase.from('announcements').select('*');
  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.eq('slug', trimmed);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as Announcement;
}

export async function addAdminAnnouncement(data: {
  title: string;
  summary: string;
  body: string;
  category?: string;
  target_audience?: 'all' | 'public' | 'students';
  status?: 'published' | 'draft';
}): Promise<Announcement> {
  const supabase = createAdminClient();
  const cleanTitle = data.title.trim();
  const cleanSummary = data.summary.trim();
  const cleanBody = data.body.trim();
  const category = data.category?.trim() || 'General';
  const targetAudience = data.target_audience || 'all';
  const status = data.status || 'published';

  const baseSlug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const uniqueSlug = `${baseSlug || 'announcement'}-${Date.now().toString(36)}`;

  const nowIso = new Date().toISOString();
  const { data: inserted, error } = await supabase
    .from('announcements')
    .insert({
      title: cleanTitle,
      slug: uniqueSlug,
      summary: cleanSummary,
      body: cleanBody,
      category,
      target_audience: targetAudience,
      status,
      published_at: nowIso,
    })
    .select('*')
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Failed to publish announcement.');
  }

  await recordAuditLog('CREATE_ANNOUNCEMENT', 'announcements', inserted.id, {
    title: inserted.title,
    category: inserted.category,
    target_audience: inserted.target_audience,
    status: inserted.status,
  });

  return inserted as Announcement;
}

export async function updateAnnouncementStatus(
  announcementId: string,
  status: 'published' | 'draft'
): Promise<Announcement> {
  const supabase = createAdminClient();
  const { data: updated, error } = await supabase
    .from('announcements')
    .update({
      status,
      ...(status === 'published'
        ? { published_at: new Date().toISOString() }
        : {}),
    })
    .eq('id', announcementId.trim())
    .select('*')
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Failed to update announcement status.');
  }

  await recordAuditLog('UPDATE_ANNOUNCEMENT', 'announcements', updated.id, {
    title: updated.title,
    status: updated.status,
  });

  return updated as Announcement;
}

export async function deleteAdminAnnouncement(
  announcementId: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const trimmed = announcementId.trim();

  let query = supabase.from('announcements').select('*');
  if (isUuid(trimmed)) {
    query = query.eq('id', trimmed);
  } else {
    query = query.eq('slug', trimmed);
  }

  const { data: existing } = await query.maybeSingle();
  if (!existing) {
    return false;
  }

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', existing.id);

  if (error) {
    throw new Error(`Failed to delete announcement: ${error.message}`);
  }

  await recordAuditLog('DELETE_ANNOUNCEMENT', 'announcements', existing.id, {
    title: existing.title,
    category: existing.category,
  });

  return true;
}

export async function updateAdminStudent(
  studentIdOrUuid: string,
  data: {
    first_name: string;
    last_name: string;
    other_names?: string;
    class_id?: string;
    status?: 'active' | 'inactive' | 'graduated' | 'suspended';
    new_password?: string;
  }
): Promise<StudentRecord> {
  const supabase = createAdminClient();
  const student = await getAdminStudentById(studentIdOrUuid);
  if (!student) {
    throw new Error('Student record not found.');
  }

  let resolvedClassId = student.class_id || null;
  if (data.class_id && data.class_id.trim()) {
    if (isUuid(data.class_id)) {
      resolvedClassId = data.class_id.trim();
    } else {
      const { data: cls } = await supabase
        .from('classes')
        .select('id')
        .ilike('name', data.class_id.trim())
        .maybeSingle();
      resolvedClassId = cls?.id || resolvedClassId;
    }
  }

  const firstName = data.first_name.trim();
  const lastName = data.last_name.trim();
  const otherNames = data.other_names?.trim() || null;
  const fullName = `${firstName} ${lastName}`.trim();

  if (student.user_id) {
    const authUpdates: Record<string, unknown> = {
      user_metadata: {
        display_name: fullName,
        role: 'student',
        student_id: student.student_id,
      },
    };
    if (data.new_password && data.new_password.trim().length >= 6) {
      authUpdates.password = data.new_password.trim();
      authUpdates.email_confirm = true;
    }
    await supabase.auth.admin.updateUserById(student.user_id, authUpdates);
    await supabase
      .from('profiles')
      .update({ display_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', student.user_id);
  }

  const { data: updated, error } = await supabase
    .from('students')
    .update({
      first_name: firstName,
      last_name: lastName,
      other_names: otherNames,
      class_id: resolvedClassId,
      status: data.status || student.status || 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', student.id)
    .select('*, class:classes(id, name, level, status, created_at)')
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Failed to update student profile.');
  }

  await recordAuditLog('UPDATE_STUDENT', 'students', student.id, {
    student_id: student.student_id,
    name: fullName,
    class: updated.class?.name || null,
    password_reset: Boolean(data.new_password && data.new_password.trim().length >= 6),
  });

  return updated as unknown as StudentRecord;
}

