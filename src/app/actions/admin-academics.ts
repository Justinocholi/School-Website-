'use server';

import { z } from 'zod';
import {
  addAdminClass,
  addAdminSubject,
  setActiveAdminTerm,
  addAdminSession,
  setActiveAdminSession,
  deleteAdminSession,
  addAdminAnnouncement,
  updateAnnouncementStatus,
  deleteAdminAnnouncement,
  deleteAdminSubject,
  deleteAdminClass,
} from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { revalidatePath } from 'next/cache';

const classSchema = z.object({
  name: z.string().min(2, 'Class name is required (e.g. JSS 1A, SS 2 Science)'),
  level: z.string().min(1, 'Level is required (e.g. JSS 1, SS 2)'),
});

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required (e.g. Mathematics)'),
  code: z.string().min(2, 'Subject code is required (e.g. MTH)'),
});

const sessionSchema = z.object({
  name: z
    .string()
    .min(4, 'Session name is required (e.g. 2027/2028)')
    .regex(/^\d{4}\/\d{4}$/, 'Session format must be YYYY/YYYY (e.g. 2027/2028)'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  set_active: z.boolean().optional(),
});

const announcementSchema = z.object({
  title: z.string().min(4, 'Announcement title is required (minimum 4 characters)'),
  summary: z.string().min(10, 'Brief summary is required (minimum 10 characters)'),
  body: z.string().min(10, 'Full announcement content is required'),
  category: z.string().min(2, 'Category is required'),
  target_audience: z.enum(['all', 'public', 'students']),
  status: z.enum(['published', 'draft']).default('published'),
});

function revalidateCalendarPaths() {
  revalidatePath('/');
  revalidatePath('/admissions');
  revalidatePath('/admin');
  revalidatePath('/admin/academic-sessions');
  revalidatePath('/admin/results');
  revalidatePath('/admin/results/entry');
  revalidatePath('/admin/results/import');
  revalidatePath('/student');
  revalidatePath('/student/results');
}

function revalidateAnnouncementPaths() {
  revalidatePath('/');
  revalidatePath('/news');
  revalidatePath('/student');
  revalidatePath('/student/announcements');
  revalidatePath('/admin');
  revalidatePath('/admin/announcements');
}

export async function createClassAction(prevState: unknown, formData: FormData) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message: 'Access denied: Only School Administrators can create new classes.',
    };
  }

  const name = formData.get('name') as string;
  const level = formData.get('level') as string;

  const parsed = classSchema.safeParse({ name, level });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    await addAdminClass(parsed.data);
    revalidatePath('/admin/classes');
    return {
      success: true,
      message: `Class ${parsed.data.name} created successfully.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Error creating class',
    };
  }
}

export async function createSubjectAction(prevState: unknown, formData: FormData) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message: 'Access denied: Only School Administrators can create new subjects.',
    };
  }

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  const parsed = subjectSchema.safeParse({ name, code });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    await addAdminSubject(parsed.data);
    revalidatePath('/admin/subjects');
    return {
      success: true,
      message: `Subject ${parsed.data.name} (${parsed.data.code}) created successfully.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Error creating subject',
    };
  }
}

export async function createSessionAction(prevState: unknown, formData: FormData) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can add academic sessions.',
    };
  }

  const name = ((formData.get('name') as string) || '').trim();
  const start_date = ((formData.get('start_date') as string) || '').trim();
  const end_date = ((formData.get('end_date') as string) || '').trim();
  const set_active = formData.get('set_active') === 'on' || formData.get('set_active') === 'true';

  const parsed = sessionSchema.safeParse({
    name,
    start_date: start_date || undefined,
    end_date: end_date || undefined,
    set_active,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const created = await addAdminSession(parsed.data);
    revalidateCalendarPaths();
    return {
      success: true,
      message: `Academic Session ${created.name} created with First, Second, and Third Terms${set_active ? ' and set as the current active session' : ''}.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to create academic session',
    };
  }
}

export async function setActiveSessionAction(formData: FormData): Promise<void> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return;
  }

  const sessionId = formData.get('sessionId') as string;
  if (!sessionId) return;

  try {
    await setActiveAdminSession(sessionId);
    revalidateCalendarPaths();
  } catch (err: unknown) {
    console.error('Error in setActiveSessionAction:', err);
  }
}

export async function deleteSessionAction(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can delete academic sessions.',
    };
  }

  try {
    await deleteAdminSession(sessionId);
    revalidateCalendarPaths();
    return {
      success: true,
      message: 'Academic session and its associated terms removed.',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to delete academic session',
    };
  }
}

export async function setActiveTermAction(formData: FormData): Promise<void> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return;
  }

  const termId = formData.get('termId') as string;
  if (!termId) return;
  try {
    await setActiveAdminTerm(termId);
    revalidateCalendarPaths();
  } catch (err: unknown) {
    console.error('Error in setActiveTermAction:', err);
  }
}

export async function deleteSubjectAction(
  subjectId: string
): Promise<{ success: boolean; message: string }> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can delete curriculum subjects.',
    };
  }

  try {
    await deleteAdminSubject(subjectId);
    revalidatePath('/admin/subjects');
    revalidatePath('/admin/results/entry');
    return { success: true, message: 'Subject deleted successfully.' };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to delete subject',
    };
  }
}

export async function deleteClassAction(
  classId: string
): Promise<{ success: boolean; message: string }> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can delete class divisions.',
    };
  }

  try {
    await deleteAdminClass(classId);
    revalidatePath('/admin/classes');
    revalidatePath('/admin/results/entry');
    return { success: true, message: 'Class deleted successfully.' };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to delete class',
    };
  }
}

export async function createAnnouncementAction(
  prevState: unknown,
  formData: FormData
) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can publish announcements.',
    };
  }

  const rawData = {
    title: ((formData.get('title') as string) || '').trim(),
    summary: ((formData.get('summary') as string) || '').trim(),
    body: ((formData.get('body') as string) || '').trim(),
    category: ((formData.get('category') as string) || 'General').trim(),
    target_audience: ((formData.get('target_audience') as string) || 'all') as
      | 'all'
      | 'public'
      | 'students',
    status: ((formData.get('status') as string) || 'published') as
      | 'published'
      | 'draft',
  };

  const parsed = announcementSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const created = await addAdminAnnouncement(parsed.data);
    revalidateAnnouncementPaths();
    return {
      success: true,
      message: `Announcement "${created.title}" published successfully.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to publish announcement',
    };
  }
}

export async function toggleAnnouncementStatusAction(formData: FormData): Promise<void> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return;
  }

  const announcementId = formData.get('announcementId') as string;
  const newStatus = formData.get('status') as 'published' | 'draft';
  if (!announcementId || !newStatus) return;

  try {
    await updateAnnouncementStatus(announcementId, newStatus);
    revalidateAnnouncementPaths();
  } catch (err: unknown) {
    console.error('Error toggling announcement status:', err);
  }
}

export async function deleteAnnouncementAction(
  announcementId: string
): Promise<{ success: boolean; message: string }> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can delete announcements.',
    };
  }

  try {
    await deleteAdminAnnouncement(announcementId);
    revalidateAnnouncementPaths();
    return {
      success: true,
      message: 'Announcement deleted successfully.',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to delete announcement',
    };
  }
}
