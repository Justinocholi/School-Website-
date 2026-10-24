'use server';

import { z } from 'zod';
import {
  addAdminStudent,
  deleteAdminStudent,
  updateAdminStudent,
} from '@/lib/admin/admin-service';
import { revalidatePath } from 'next/cache';

const studentSchema = z.object({
  student_id: z.string().min(3, 'Student ID must be at least 3 characters'),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  other_names: z.string().optional(),
  class_id: z.string().min(1, 'Please select an assigned class'),
  admission_date: z.string().optional(),
  password: z
    .string()
    .min(6, 'Portal password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
});

export type AdminStudentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createStudentAction(
  prevState: AdminStudentActionState | null,
  formData: FormData
): Promise<AdminStudentActionState> {
  const rawData = {
    student_id: (formData.get('student_id') as string)?.trim().toUpperCase(),
    first_name: (formData.get('first_name') as string)?.trim(),
    last_name: (formData.get('last_name') as string)?.trim(),
    other_names: (formData.get('other_names') as string)?.trim(),
    class_id: formData.get('class_id') as string,
    admission_date: (formData.get('admission_date') as string) || undefined,
    password: ((formData.get('password') as string) || '').trim(),
  };

  const parsed = studentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const portalPassword = parsed.data.password || 'Student@2026';
    const created = await addAdminStudent({
      ...parsed.data,
      password: portalPassword,
    });

    revalidatePath('/admin/students');
    revalidatePath('/admin/results/entry');
    revalidatePath('/admin/classes');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Student ${created.first_name} ${created.last_name} (${created.student_id}) created in Supabase. Portal Login ID: ${created.student_id} | Password: ${portalPassword}`,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to create student';
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function updateStudentAction(
  prevState: AdminStudentActionState | null,
  formData: FormData
): Promise<AdminStudentActionState> {
  const studentId = ((formData.get('student_uuid') as string) || '').trim();
  const firstName = ((formData.get('first_name') as string) || '').trim();
  const lastName = ((formData.get('last_name') as string) || '').trim();
  const otherNames = ((formData.get('other_names') as string) || '').trim();
  const classId = ((formData.get('class_id') as string) || '').trim();
  const status = ((formData.get('status') as string) || 'active') as
    | 'active'
    | 'inactive'
    | 'graduated'
    | 'suspended';
  const newPassword = ((formData.get('new_password') as string) || '').trim();

  if (!studentId || !firstName || !lastName) {
    return {
      success: false,
      message: 'First name and surname are required.',
    };
  }

  if (newPassword && newPassword.length < 6) {
    return {
      success: false,
      message: 'New password must be at least 6 characters.',
    };
  }

  try {
    const updated = await updateAdminStudent(studentId, {
      first_name: firstName,
      last_name: lastName,
      other_names: otherNames,
      class_id: classId,
      status,
      new_password: newPassword || undefined,
    });

    revalidatePath('/admin/students');
    revalidatePath(`/admin/students/${updated.id}`);
    revalidatePath('/admin/classes');
    revalidatePath('/student');
    revalidatePath('/student/profile');

    return {
      success: true,
      message: `Updated ${updated.first_name} ${updated.last_name} (${updated.student_id})${newPassword ? ` and reset portal password to "${newPassword}"` : ''}.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to update student profile.',
    };
  }
}

export async function deleteStudentAction(
  studentId: string
): Promise<{ success: boolean; message: string }> {
  const { getAuthenticatedStaff } = await import('@/app/actions/admin-auth');
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can delete student accounts.',
    };
  }

  try {
    await deleteAdminStudent(studentId);
    revalidatePath('/admin/students');
    revalidatePath('/admin/results/entry');
    revalidatePath('/admin/classes');
    revalidatePath('/admin');
    revalidatePath('/admin/results');
    return {
      success: true,
      message: `Student account ${studentId} has been permanently deleted.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to delete student',
    };
  }
}
