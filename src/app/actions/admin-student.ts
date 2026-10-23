'use server';

import { z } from 'zod';
import { addAdminStudent } from '@/lib/admin/admin-service';
import { redirect } from 'next/navigation';

const studentSchema = z.object({
  student_id: z.string().min(3, 'Student ID must be at least 3 characters'),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  other_names: z.string().optional(),
  class_id: z.string().min(1, 'Please select an assigned class'),
  admission_date: z.string().optional(),
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
    await addAdminStudent(parsed.data);
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/students');
    revalidatePath('/admin');
    return {
      success: true,
      message: `Student ${parsed.data.student_id} successfully created.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create student';
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function deleteStudentAction(studentId: string): Promise<{ success: boolean; message: string }> {
  const { getAuthenticatedStaff } = await import('@/app/actions/admin-auth');
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message: 'Access denied: Only School Administrators can delete student accounts.',
    };
  }

  try {
    const { deleteAdminStudent } = await import('@/lib/admin/admin-service');
    await deleteAdminStudent(studentId);
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/students');
    revalidatePath('/admin');
    revalidatePath('/admin/results');
    return {
      success: true,
      message: `Student account ${studentId} has been successfully deleted.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to delete student',
    };
  }
}

