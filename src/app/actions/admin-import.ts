'use server';

import {
  parseSpreadsheet,
  validateStudentImport,
  validateSubjectResultImport,
  executeStudentImport,
  executeResultImport,
  StudentImportRow,
  SubjectResultImportRow,
} from '@/lib/import/import-service';
import { revalidatePath } from 'next/cache';

export async function uploadAndValidateStudentFile(
  formData: FormData,
  mode: 'create_only' | 'update_existing'
) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No spreadsheet file was provided for validation.');
  }

  const buffer = await file.arrayBuffer();
  const rawRows = parseSpreadsheet(buffer);
  return await validateStudentImport(rawRows, mode);
}

export async function executeStudentImportAction(
  validRows: StudentImportRow[],
  mode: 'create_only' | 'update_existing'
) {
  const result = await executeStudentImport(validRows, mode);
  revalidatePath('/admin/students');
  return result;
}

export async function uploadAndValidateResultFile(
  formData: FormData,
  maxCa: number = 30,
  maxExam: number = 70
) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No spreadsheet file was provided for validation.');
  }

  const buffer = await file.arrayBuffer();
  const rawRows = parseSpreadsheet(buffer);
  return await validateSubjectResultImport(rawRows, maxCa, maxExam);
}

import { getAuthenticatedStaff } from '@/app/actions/admin-auth';

export async function executeResultImportAction(
  validRows: SubjectResultImportRow[],
  params: {
    subjectId: string;
    classId: string;
    termId: string;
    status: 'draft' | 'pending_review' | 'published';
  }
) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role === 'teacher' && params.status === 'published') {
    params.status = 'pending_review';
  }

  const result = await executeResultImport(validRows, params);
  revalidatePath('/admin/results');
  revalidatePath('/admin/results/review');
  return result;
}
