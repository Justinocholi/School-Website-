import { describe, it, expect, beforeEach } from 'vitest';
import {
  addAdminStudent,
  getAdminStudents,
  deleteAdminStudent,
  saveSingleResult,
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
import { findStoreStudent, getStoreResults } from '@/lib/storage/store';

describe('User Scenarios: Student Persistence, Identity Isolation, Term Switching & Teacher Management', () => {
  it('Scenario 1: Creates a new student and verifies independent identity', async () => {
    const studentId = 'GFS088';
    const newStudent = await addAdminStudent({
      student_id: studentId,
      first_name: 'Kelechi',
      last_name: 'Okoro',
      other_names: 'Brian',
      class_id: '77777777-7777-7777-7777-777777777771', // JSS 1A
      admission_date: '2026-09-01',
    });

    expect(newStudent.student_id).toBe('GFS088');
    expect(newStudent.first_name).toBe('Kelechi');
    expect(newStudent.last_name).toBe('Okoro');

    // Retrieve from store
    const stored = findStoreStudent('GFS088');
    expect(stored).toBeDefined();
    expect(stored?.first_name).toBe('Kelechi');
    expect(stored?.last_name).toBe('Okoro');
    expect(stored?.class?.name).toBe('JSS 1A');

    // Verify student dashboard data is initially 0 (NOT Daniel Okafor's results)
    const dashboardData = await getStudentDashboardData('GFS088');
    expect(dashboardData.resultsCount).toBe(0);
    expect(dashboardData.recentResults.length).toBe(0);
  });

  it('Scenario 2: Saves a 2nd Term result and verifies it reflects in 2nd Term queries', async () => {
    const secondTermId = '33333333-3333-3333-3333-333333333332'; // Second Term
    const mathSubjectId = '88888888-8888-8888-8888-888888888881'; // Mathematics
    const jss1AClassId = '77777777-7777-7777-7777-777777777771';

    // Save 2nd Term result for Kelechi Okoro (GFS088)
    const saved = await saveSingleResult({
      student_id: 'GFS088',
      subject_id: mathSubjectId,
      class_id: jss1AClassId,
      term_id: secondTermId,
      ca_score: 28,
      exam_score: 62,
      status: 'published',
    });

    expect(saved.total_score).toBe(90);
    expect(saved.grade).toBe('A');
    expect(saved.status).toBe('published');
    expect(saved.term_id).toBe(secondTermId);

    // Verify admin results for 2nd Term return this record
    const adminTermResults = await getAdminResults({ termId: secondTermId });
    const foundInAdmin = adminTermResults.find(
      r => r.student?.student_id === 'GFS088' || r.student_id === 'GFS088'
    );
    expect(foundInAdmin).toBeDefined();
    expect(foundInAdmin?.total_score).toBe(90);

    // Verify student published results for 2nd Term return this record
    const studentResults = await getStudentPublishedResults('GFS088', secondTermId);
    expect(studentResults.results.length).toBe(1);
    expect(studentResults.results[0].total_score).toBe(90);
    expect(studentResults.results[0].grade).toBe('A');
    expect(studentResults.performance.averageScore).toBe(90);

    // Verify 1st Term results for Kelechi are 0 (no cross-term leakage)
    const firstTermId = '33333333-3333-3333-3333-333333333331';
    const firstTermResults = await getStudentPublishedResults('GFS088', firstTermId);
    expect(firstTermResults.results.length).toBe(0);
  });

  it('Scenario 3: Switches active academic term and verifies term persistence', async () => {
    const secondTermId = '33333333-3333-3333-3333-333333333332';
    await setActiveAdminTerm(secondTermId);

    const terms = await getAdminTerms();
    const activeTerm = terms.find(t => t.is_active);
    expect(activeTerm).toBeDefined();
    expect(activeTerm?.id).toBe(secondTermId);
    expect(activeTerm?.name).toBe('Second Term');
  });

  it('Scenario 4: Admin creates a new class teacher with assigned form class and password', async () => {
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

    // Retrieve staff list
    const staffList = await getAdminStaff();
    const foundTeacher = staffList.find(s => s.email === 'blessing.nwosu@greenfieldcollege.edu');
    expect(foundTeacher).toBeDefined();
    expect(foundTeacher?.display_name).toBe('Mrs. Blessing Nwosu');
    expect(foundTeacher?.assigned_class).toBe('JSS 1B');
    expect(foundTeacher?.role).toBe('teacher');
  });

  it('Scenario 5: Admin deletes students, subjects, teachers, and results with full integrity', async () => {
    // 1. Student deletion & cascade result deletion
    const testStudentId = 'GFS999';
    await addAdminStudent({
      student_id: testStudentId,
      first_name: 'Temporary',
      last_name: 'Student',
      class_id: '77777777-7777-7777-7777-777777777771',
    });
    expect(findStoreStudent(testStudentId)).toBeDefined();

    // Add a result for this temporary student
    const tempResult = await saveSingleResult({
      student_id: testStudentId,
      subject_id: '88888888-8888-8888-8888-888888888881',
      class_id: '77777777-7777-7777-7777-777777777771',
      term_id: '33333333-3333-3333-3333-333333333331',
      ca_score: 20,
      exam_score: 50,
      status: 'draft',
    });
    expect(tempResult).toBeDefined();

    // Delete the student
    const deleteStudentSuccess = await deleteAdminStudent(testStudentId);
    expect(deleteStudentSuccess).toBe(true);
    expect(findStoreStudent(testStudentId)).toBeUndefined();

    // Verify cascade: result for this student is also purged
    const remainingResults = getStoreResults().filter(r => r.student_id === testStudentId);
    expect(remainingResults.length).toBe(0);

    // 2. Subject creation & deletion
    const newSubject = await addAdminSubject({
      name: 'Physical Health Education',
      code: 'PHE202',
    });
    const subjectsBefore = await getAdminSubjects();
    expect(subjectsBefore.some(s => s.code === 'PHE202')).toBe(true);

    const deleteSubjectSuccess = await deleteAdminSubject(newSubject.id);
    expect(deleteSubjectSuccess).toBe(true);
    const subjectsAfter = await getAdminSubjects();
    expect(subjectsAfter.some(s => s.code === 'PHE202')).toBe(false);

    // 3. Teacher deletion & Admin protection
    const tempTeacher = await addAdminTeacher({
      full_name: 'Temp Teacher',
      email: 'temp.teacher@greenfieldcollege.edu',
      department: 'Science',
      assigned_class: 'JSS 2A',
      assigned_subject: 'Basic Science',
      password: 'TempPassword123',
    });
    expect(tempTeacher).toBeDefined();

    const deleteTeacherSuccess = await deleteAdminStaff(tempTeacher.id);
    expect(deleteTeacherSuccess).toBe(true);
    const staffAfter = await getAdminStaff();
    expect(staffAfter.some(s => s.email === 'temp.teacher@greenfieldcollege.edu')).toBe(false);

    // Verify admin protection against self-deletion
    await expect(deleteAdminStaff('admin@greenfieldcollege.edu')).rejects.toThrow(
      'Administrative governance policy prevents deleting the primary Administrator account.'
    );

    // 4. Result deletion
    const resToDelete = await saveSingleResult({
      student_id: 'GFS088',
      subject_id: '88888888-8888-8888-8888-888888888882', // English
      class_id: '77777777-7777-7777-7777-777777777771',
      term_id: '33333333-3333-3333-3333-333333333331',
      ca_score: 25,
      exam_score: 55,
      status: 'draft',
    });
    expect(resToDelete).toBeDefined();

    const deleteResultSuccess = await deleteAdminResult(resToDelete.id);
    expect(deleteResultSuccess).toBe(true);
    const adminResultsAfter = await getAdminResults();
    expect(adminResultsAfter.some(r => r.id === resToDelete.id)).toBe(false);
  });
});
