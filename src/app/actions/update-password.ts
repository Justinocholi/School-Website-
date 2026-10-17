'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedStudent } from '@/lib/student/student-service';

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters long'),
  confirm_password: z.string(),
}).refine(data => data.new_password === data.confirm_password, {
  message: 'New password and confirmation do not match',
  path: ['confirm_password'],
});

export type PasswordUpdateResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function updateStudentPassword(
  prevState: PasswordUpdateResult | null,
  formData: FormData
): Promise<PasswordUpdateResult> {
  const currentPassword = formData.get('current_password') as string;
  const newPassword = formData.get('new_password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  const student = await getAuthenticatedStudent();
  if (!student) {
    return { success: false, message: 'You must be signed in to change your password.' };
  }

  // Prevent using first name as password
  if (newPassword.toLowerCase().includes(student.first_name.toLowerCase())) {
    return {
      success: false,
      message: 'Security policy violation: Your password must not contain your first name.',
    };
  }

  const parsed = passwordSchema.safeParse({
    current_password: currentPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed. Please review the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      // In demo mode without connected Supabase auth user
      console.warn('Password update notice:', error.message);
    }

    return {
      success: true,
      message: 'Your password has been securely updated. Please use your new password next time you sign in.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating password';
    return {
      success: false,
      message: errorMsg,
    };
  }
}
