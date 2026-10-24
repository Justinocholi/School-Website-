import { describe, it, expect, afterAll } from 'vitest';
import {
  addAdminStudent,
  getAdminStudentById,
  deleteAdminStudent,
  saveSingleResult,
  publishResultBatch,
  getAdminResults,
  deleteAdminResult,
  getAdminTerms,
  setActiveAdminTerm,
  addAdminTeacher,
  getAdminStaff,
  deleteAdminStaff,
  addAdminSubject,
  getAdminSubjects,
  deleteAdminSubject,
} from '@/lib/admin/admin-service';
import {
  getStudentDashboardData,
  getStudentPublishedResults,
} from '@/lib/student/student-service';

describe('Supabase End-to-End Scenarios: Student Creation, Review & Publication, Term Switching, Teacher Onboarding & Deletions', () => {
  const testStudentCode = 'GFS888';
  const firstTermId = '33333333-3333-3333-3333-333333333331';
  const secondTermId = '33333333-3333-3333-3333-333333333332';
  const mathSubjectId = '88888888-8888-8888-8888-888888888881';
  const englishSubjectId = '88888888-8888-8888-8888-888888888882';
  const jss1AClassId = '77777777-7777-7777-7777-777777777771';

  afterAll(async () => {
    await Promise.allSettled([
      setActiveAdminTerm(firstTermId),
      deleteAdminStudent(testStudentCode),
      deleteAdminStudent('GFS999'),
      deleteAdminSubject('PHE202'),
      deleteAdminStaff('blessing.nwosu@greenfieldcollege.edu'),
      deleteAdminStaff('temp.teacher@greenfieldcollege.edu'),
    ]);
  });

  it('Scenario 1: Creates a new student in Supabase and verifies independent dashboard identity', async () => {
    await deleteAdminStudent(testStudentCode);

    const newStudent = await addAdminStudent({
      student_id: testStudentCode,
      first_name: 'Kelechi',
      last_name: 'Okoro',
      other_names: 'Brian',
      class_id: jss1AClassId,
      admission_date: '2026-09-01',
    });

    expect(newStudent.student_id).toBe(testStudentCode);
    expect(newStudent.first_name).toBe('Kelechi');
    expect(newStudent.last_name).toBe('Okoro');

    // Retrieve directly from Supabase
    const stored = await getAdminStudentById(testStudentCode);
    expect(stored).not.toBeNull();
    expect(stored?.first_name).toBe('Kelechi');
    expect(stored?.last_name).toBe('Okoro');
    expect(stored?.class?.name).toBe('JSS 1A');

    // Verify student dashboard data is initially 0 (NOT Daniel Okafor's results)
    const dashboardData = await getStudentDashboardData(stored!.id);
    expect(dashboardData.resultsCount).toBe(0);
    expect(dashboardData.recentResults.length).toBe(0);
  });

  it('Scenario 2: Submits a pending result for the new student, publishes it, and verifies it reflects on the student dashboard', async () => {
    // 1. Save as pending_review
    const pendingRecord = await saveSingleResult({
      student_id: testStudentCode,
      subject_id: mathSubjectId,
      class_id: jss1AClassId,
      term_id: secondTermId,
      ca_score: 28,
      exam_score: 62,
      status: 'pending_review',
    });

    expect(pendingRecord.total_score).toBe(90);
    expect(pendingRecord.grade).toBe('A');
    expect(pendingRecord.status).toBe('pending_review');

    // While pending_review, student dashboard should still show 0 published results
    const beforePublish = await getStudentDashboardData(testStudentCode);
    expect(beforePublish.resultsCount).toBe(0);

    // 2. Admin reviews and publishes the result batch
    const pubRes = await publishResultBatch(
      [pendingRecord.id],
      'Board approved'
    );
    expect(pubRes.count).toBe(1);

    // 3. Verify student dashboard now reflects the published result!
    const afterPublish = await getStudentDashboardData(testStudentCode);
    expect(afterPublish.resultsCount).toBe(1);
    expect(afterPublish.recentResults[0].total_score).toBe(90);
    expect(afterPublish.recentResults[0].grade).toBe('A');

    // 4. Verify student published results page returns this record (even without explicit term param!)
    const autoTermResults = await getStudentPublishedResults(testStudentCode);
    expect(autoTermResults.results.length).toBe(1);
    expect(autoTermResults.results[0].total_score).toBe(90);
    expect(autoTermResults.performance.averageScore).toBe(90);

    // 5. Verify 1st Term results for Kelechi are 0 (no cross-term leakage)
    const firstTermResults = await getStudentPublishedResults(
      testStudentCode,
      firstTermId
    );
    expect(firstTermResults.results.length).toBe(0);
  });

  it('Scenario 3: Switches active academic term in Supabase and verifies term persistence', async () => {
    await setActiveAdminTerm(secondTermId);

    const terms = await getAdminTerms();
    const activeTerm = terms.find((t) => t.is_active);
    expect(activeTerm).toBeDefined();
    expect(activeTerm?.id).toBe(secondTermId);
    expect(activeTerm?.name).toBe('Second Term');

    // Restore First Term
    await setActiveAdminTerm(firstTermId);
  });

  it('Scenario 4: Admin creates a new class teacher in Supabase with assigned form class', async () => {
    const teacherData = {
      full_name: 'Mrs. Blessing Nwosu',
      email: 'blessing.nwosu@greenfieldcollege.edu',
      department: 'Junior Secondary (Form Teacher)',
      assigned_class: 'JSS 1B',
      assigned_subject: 'General Curriculum',
      password: 'Teacher@2026',
    };

    const newTeacher = await addAdminTeacher(teacherData);
    expect(newTeacher.display_name).toBe('Mrs. Blessing Nwosu');
    expect(newTeacher.assigned_class).toBe('JSS 1B');

    const staffList = await getAdminStaff();
    const foundTeacher = staffList.find(
      (s) => s.email === 'blessing.nwosu@greenfieldcollege.edu'
    );
    expect(foundTeacher).toBeDefined();
    expect(foundTeacher?.display_name).toBe('Mrs. Blessing Nwosu');
    expect(foundTeacher?.assigned_class).toBe('JSS 1B');
    expect(foundTeacher?.role).toBe('teacher');
  });

  it('Scenario 5: Admin deletes students, subjects, teachers, and results in Supabase with full integrity', async () => {
    // 1. Student deletion & cascade result deletion
    const tempStudentCode = 'GFS999';
    await deleteAdminStudent(tempStudentCode);

    const createdTemp = await addAdminStudent({
      student_id: tempStudentCode,
      first_name: 'Temporary',
      last_name: 'Student',
      class_id: jss1AClassId,
    });
    expect(await getAdminStudentById(tempStudentCode)).not.toBeNull();

    const tempResult = await saveSingleResult({
      student_id: tempStudentCode,
      subject_id: mathSubjectId,
      class_id: jss1AClassId,
      term_id: firstTermId,
      ca_score: 20,
      exam_score: 50,
      status: 'draft',
    });
    expect(tempResult.id).toBeDefined();

    const deleteStudentSuccess = await deleteAdminStudent(tempStudentCode);
    expect(deleteStudentSuccess).toBe(true);
    expect(await getAdminStudentById(tempStudentCode)).toBeNull();

    // Verify cascade: result for this student is also purged in Supabase
    const remainingResults = await getAdminResults({
      studentId: createdTemp.id,
    });
    expect(remainingResults.length).toBe(0);

    // 2. Subject creation & deletion
    await deleteAdminSubject('PHE202');
    const newSubject = await addAdminSubject({
      name: 'Physical Health Education',
      code: 'PHE202',
    });
    const subjectsBefore = await getAdminSubjects();
    expect(subjectsBefore.some((s) => s.code === 'PHE202')).toBe(true);

    const deleteSubjectSuccess = await deleteAdminSubject(newSubject.id);
    expect(deleteSubjectSuccess).toBe(true);
    const subjectsAfter = await getAdminSubjects();
    expect(subjectsAfter.some((s) => s.code === 'PHE202')).toBe(false);

    // 3. Teacher deletion & Admin protection
    const tempTeacher = await addAdminTeacher({
      full_name: 'Temp Teacher',
      email: 'temp.teacher@greenfieldcollege.edu',
      department: 'Science',
      assigned_class: 'JSS 2A',
      assigned_subject: 'Basic Science',
      password: 'TempPassword123',
    });
    expect(tempTeacher.id).toBeDefined();

    const deleteTeacherSuccess = await deleteAdminStaff(tempTeacher.id);
    expect(deleteTeacherSuccess).toBe(true);
    const staffAfter = await getAdminStaff();
    expect(
      staffAfter.some((s) => s.email === 'temp.teacher@greenfieldcollege.edu')
    ).toBe(false);

    // Verify admin protection against self-deletion
    await expect(
      deleteAdminStaff('admin@greenfieldcollege.edu')
    ).rejects.toThrow(
      'Administrative governance policy prevents deleting the primary Administrator account.'
    );

    // 4. Result deletion
    const resToDelete = await saveSingleResult({
      student_id: testStudentCode,
      subject_id: englishSubjectId,
      class_id: jss1AClassId,
      term_id: firstTermId,
      ca_score: 25,
      exam_score: 55,
      status: 'draft',
    });
    expect(resToDelete.id).toBeDefined();

    const deleteResultSuccess = await deleteAdminResult(resToDelete.id);
    expect(deleteResultSuccess).toBe(true);
    const adminResultsAfter = await getAdminResults({
      studentId: testStudentCode,
    });
    expect(adminResultsAfter.some((r) => r.id === resToDelete.id)).toBe(false);
  });
});
