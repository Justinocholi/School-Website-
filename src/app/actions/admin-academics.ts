'use server';

import { z } from 'zod';
import {
  addAdminClass,
  addAdminSubject,
  setActiveAdminTerm,
} from '@/lib/admin/admin-service';
import { revalidatePath } from 'next/cache';

const classSchema = z.object({
  name: z.string().min(2, 'Class name is required (e.g. JSS 1A, SS 2 Science)'),
  level: z.string().min(1, 'Level is required (e.g. JSS 1, SS 2)'),
});

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required (e.g. Mathematics)'),
  code: z.string().min(2, 'Subject code is required (e.g. MTH)'),
});

export async function createClassAction(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const level = formData.get('level') as string;

  const parsed = classSchema.safeParse({ name, level });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    await addAdminClass(parsed.data);
    revalidatePath('/admin/classes');
    return { success: true, message: `Class ${parsed.data.name} created successfully.` };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Error creating class' };
  }
}

export async function createSubjectAction(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  const parsed = subjectSchema.safeParse({ name, code });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    await addAdminSubject(parsed.data);
    revalidatePath('/admin/subjects');
    return { success: true, message: `Subject ${parsed.data.name} (${parsed.data.code}) created successfully.` };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Error creating subject' };
  }
}

export async function setActiveTermAction(formData: FormData): Promise<void> {
  const termId = formData.get('termId') as string;
  if (!termId) return;
  try {
    await setActiveAdminTerm(termId);
    revalidatePath('/admin/academic-sessions');
    revalidatePath('/admin/results');
    revalidatePath('/admin/results/entry');
    revalidatePath('/student/results');
    revalidatePath('/student');
  } catch (err: unknown) {
    console.error('Error in setActiveTermAction:', err);
  }
}

