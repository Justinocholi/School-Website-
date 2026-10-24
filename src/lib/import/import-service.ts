import * as XLSX from 'xlsx';
import {
  getAdminClasses,
  getAdminStudents,
  addAdminStudent,
  saveSingleResult,
  recordAuditLog,
} from '@/lib/admin/admin-service';
import { validateComponentScore, evaluateGrade } from '@/lib/grading/grading-engine';

export interface RowValidationError {
  row: number;
  identifier: string;
  field: string;
  message: string;
}

export interface StudentImportRow {
  student_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  class_name: string;
  admission_date?: string;
  status?: string;
}

export interface SubjectResultImportRow {
  student_id: string;
  ca_score: number;
  exam_score: number;
}

/**
 * Generates downloadable student template in XLSX format
 */
export function generateStudentTemplate(): Uint8Array {
  const headers = [
    {
      student_id: 'GFS001',
      first_name: 'Daniel',
      last_name: 'Okafor',
      other_names: 'Chukwuebuka',
      class_name: 'JSS 2A',
      admission_date: '2026-09-01',
      status: 'active',
    },
    {
      student_id: 'GFS002',
      first_name: 'Sarah',
      last_name: 'Adamu',
      other_names: 'Zainab',
      class_name: 'JSS 2A',
      admission_date: '2026-09-01',
      status: 'active',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(headers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return new Uint8Array(buf);
}

/**
 * Generates subject-based marks template with existing students pre-filled
 */
export function generateSubjectResultTemplate(
  subjectCode: string,
  students: Array<{ student_id: string; full_name: string }>
): Uint8Array {
  const rows = students.map((s) => ({
    student_id: s.student_id,
    student_name: s.full_name,
    ca_score: 25,
    exam_score: 60,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [
    { student_id: 'GFS001', student_name: 'Daniel Okafor', ca_score: 25, exam_score: 60 },
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${subjectCode}_Marks`);

  const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return new Uint8Array(buf);
}

/**
 * Parses uploaded spreadsheet buffer (.xlsx or .csv)
 */
export function parseSpreadsheet(buffer: ArrayBuffer): Record<string, unknown>[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  if (!worksheet) return [];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: '',
    raw: false,
  });

  return rawRows;
}

/**
 * Validates student spreadsheet rows against business rules
 */
export async function validateStudentImport(
  rows: Record<string, unknown>[],
  mode: 'create_only' | 'update_existing' = 'create_only'
): Promise<{
  valid: StudentImportRow[];
  errors: RowValidationError[];
  summary: { total: number; validCount: number; errorCount: number };
}> {
  const classes = await getAdminClasses();
  const existingStudents = await getAdminStudents();
  const existingStudentIds = new Set(existingStudents.map((s) => s.student_id.toUpperCase()));
  const seenInFile = new Set<string>();

  const valid: StudentImportRow[] = [];
  const errors: RowValidationError[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2; // Accounting for 1-indexed row header
    const studentId = String(row.student_id || row['Student ID'] || row['STUDENT_ID'] || '').trim().toUpperCase();
    const firstName = String(row.first_name || row['First Name'] || row['FIRST_NAME'] || '').trim();
    const lastName = String(row.last_name || row['Last Name'] || row['LAST_NAME'] || '').trim();
    const otherNames = String(row.other_names || row['Other Names'] || '').trim();
    const className = String(row.class_name || row['Class'] || row['CLASS_NAME'] || '').trim();
    const admissionDate = String(row.admission_date || row['Admission Date'] || '').trim();
    const status = String(row.status || 'active').trim().toLowerCase();

    // 1. Mandatory fields
    if (!studentId) {
      errors.push({ row: rowNum, identifier: 'UNKNOWN', field: 'student_id', message: 'Missing Student ID' });
      return;
    }
    if (!firstName) {
      errors.push({ row: rowNum, identifier: studentId, field: 'first_name', message: 'Missing First Name' });
      return;
    }
    if (!lastName) {
      errors.push({ row: rowNum, identifier: studentId, field: 'last_name', message: 'Missing Last Name' });
      return;
    }

    // 2. Duplicates within file
    if (seenInFile.has(studentId)) {
      errors.push({ row: rowNum, identifier: studentId, field: 'student_id', message: `Duplicate Student ID in spreadsheet (${studentId})` });
      return;
    }
    seenInFile.add(studentId);

    // 3. Existing record checks
    if (mode === 'create_only' && existingStudentIds.has(studentId)) {
      errors.push({ row: rowNum, identifier: studentId, field: 'student_id', message: `Student ID already exists in school database (${studentId}). Switch to "Update Existing" mode to edit.` });
      return;
    }

    // 4. Class verification
    if (className) {
      const classMatch = classes.find((c) => c.name.toLowerCase() === className.toLowerCase());
      if (!classMatch) {
        errors.push({ row: rowNum, identifier: studentId, field: 'class_name', message: `Class "${className}" does not exist in school records.` });
        return;
      }
    }

    valid.push({
      student_id: studentId,
      first_name: firstName,
      last_name: lastName,
      other_names: otherNames || undefined,
      class_name: className,
      admission_date: admissionDate || undefined,
      status: status || 'active',
    });
  });

  return {
    valid,
    errors,
    summary: {
      total: rows.length,
      validCount: valid.length,
      errorCount: errors.length,
    },
  };
}

/**
 * Validates subject-based results spreadsheet rows
 */
export async function validateSubjectResultImport(
  rows: Record<string, unknown>[],
  maxCa: number = 30,
  maxExam: number = 70
): Promise<{
  valid: SubjectResultImportRow[];
  errors: RowValidationError[];
  summary: { total: number; validCount: number; errorCount: number };
}> {
  const students = await getAdminStudents();
  const studentMap = new Map(students.map((s) => [s.student_id.toUpperCase(), s]));
  const seenInFile = new Set<string>();

  const valid: SubjectResultImportRow[] = [];
  const errors: RowValidationError[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2;
    const studentId = String(row.student_id || row['Student ID'] || row['STUDENT_ID'] || '').trim().toUpperCase();
    const caRaw = row.ca_score !== undefined ? String(row.ca_score) : (row['CA'] || row['ca']);
    const examRaw = row.exam_score !== undefined ? String(row.exam_score) : (row['Exam'] || row['exam']);

    if (!studentId) {
      errors.push({ row: rowNum, identifier: 'UNKNOWN', field: 'student_id', message: 'Missing Student ID' });
      return;
    }

    if (seenInFile.has(studentId)) {
      errors.push({ row: rowNum, identifier: studentId, field: 'student_id', message: `Duplicate Student ID in file (${studentId})` });
      return;
    }
    seenInFile.add(studentId);

    if (!studentMap.has(studentId)) {
      errors.push({ row: rowNum, identifier: studentId, field: 'student_id', message: `Student ID "${studentId}" is not enrolled in this class or school database.` });
      return;
    }

    const ca = parseFloat(String(caRaw));
    const exam = parseFloat(String(examRaw));

    const caCheck = validateComponentScore(ca, maxCa, 'CA');
    if (!caCheck.isValid) {
      errors.push({ row: rowNum, identifier: studentId, field: 'ca_score', message: caCheck.error || 'Invalid CA score' });
      return;
    }

    const examCheck = validateComponentScore(exam, maxExam, 'Exam');
    if (!examCheck.isValid) {
      errors.push({ row: rowNum, identifier: studentId, field: 'exam_score', message: examCheck.error || 'Invalid Exam score' });
      return;
    }

    valid.push({
      student_id: studentId,
      ca_score: ca,
      exam_score: exam,
    });
  });

  return {
    valid,
    errors,
    summary: {
      total: rows.length,
      validCount: valid.length,
      errorCount: errors.length,
    },
  };
}

/**
 * Commits verified student import records safely
 */
export async function executeStudentImport(
  validRows: StudentImportRow[],
  mode: 'create_only' | 'update_existing'
): Promise<{ created: number; updated: number; failed: number }> {
  const classes = await getAdminClasses();
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const row of validRows) {
    try {
      const assignedClass = classes.find(
        (c) => c.name.toLowerCase() === row.class_name.toLowerCase()
      );

      await addAdminStudent({
        student_id: row.student_id,
        first_name: row.first_name,
        last_name: row.last_name,
        other_names: row.other_names,
        class_id: assignedClass?.id,
        admission_date: row.admission_date,
        updateIfExists: mode === 'update_existing',
      });
      if (mode === 'update_existing') {
        updated++;
      } else {
        created++;
      }
    } catch {
      failed++;
    }
  }

  await recordAuditLog('BULK_IMPORT_STUDENTS', 'import_jobs', null, {
    total: validRows.length,
    created,
    updated,
    failed,
    mode,
  });

  return { created, updated, failed };
}

/**
 * Commits verified subject result import records safely
 */
export async function executeResultImport(
  validRows: SubjectResultImportRow[],
  params: {
    subjectId: string;
    classId: string;
    termId: string;
    status: 'draft' | 'pending_review' | 'published';
  }
): Promise<{ created: number; updated: number; failed: number }> {
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const row of validRows) {
    try {
      await saveSingleResult({
        student_id: row.student_id,
        subject_id: params.subjectId,
        class_id: params.classId,
        term_id: params.termId,
        ca_score: row.ca_score,
        exam_score: row.exam_score,
        status: params.status,
      });
      created++;
    } catch {
      failed++;
    }
  }

  recordAuditLog('BULK_IMPORT_RESULTS', 'import_jobs', null, {
    total: validRows.length,
    created,
    subject_id: params.subjectId,
    class_id: params.classId,
    term_id: params.termId,
    status: params.status,
  });

  return { created, updated, failed };
}
