'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminStudentById } from '@/lib/admin/admin-service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  student_id: z
    .string()
    .min(3, 'Please enter your unique Student ID (e.g. GFS001)'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type StudentAuthResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  redirectUrl?: string;
};

export async function loginStudent(
  prevState: StudentAuthResult | null,
  formData: FormData
): Promise<StudentAuthResult> {
  const studentIdRaw = formData.get('student_id') as string;
  const passwordRaw = formData.get('password') as string;

  const parsed = loginSchema.safeParse({
    student_id: studentIdRaw?.trim().toUpperCase(),
    password: passwordRaw,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid input. Please check the fields.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const studentId = parsed.data.student_id;
  const password = parsed.data.password;
  const internalEmail = `${studentId.toLowerCase()}@student.greenfieldcollege.edu`;

  try {
    // 1. Verify student exists in Supabase public.students
    const studentRecord = await getAdminStudentById(studentId);
    if (!studentRecord) {
      return {
        success: false,
        message:
          'Invalid Student ID or password. Please verify your credentials or contact the school ICT desk.',
      };
    }

    if (studentRecord.status !== 'active') {
      return {
        success: false,
        message:
          'Your student account is currently inactive. Please contact the school administrative office.',
      };
    }

    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();

    // Sign out any prior session so another student's session never leaks
    await supabase.auth.signOut();

    // 2. Attempt standard Supabase Auth sign-in
    let { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: internalEmail,
        password,
      });

    // 3. If the student exists in public.students (e.g. newly imported) but their Auth user
    // hasn't been synced yet and they are signing in with the default school password,
    // provision/sync their Supabase Auth user and sign them in.
    if ((authError || !authData.user) && password === 'Student@2026') {
      const fullName = `${studentRecord.first_name} ${studentRecord.last_name}`.trim();
      let userId = studentRecord.user_id || null;

      if (!userId) {
        const { data: usersList } = await supabaseAdmin.auth.admin.listUsers({
          perPage: 1000,
        });
        const existingAuth = usersList?.users?.find(
          (u) => u.email?.toLowerCase() === internalEmail
        );
        if (existingAuth) {
          userId = existingAuth.id;
        }
      }

      if (userId) {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          email: internalEmail,
          password,
          email_confirm: true,
          user_metadata: {
            display_name: fullName,
            role: 'student',
            student_id: studentRecord.student_id,
          },
        });
      } else {
        const { data: created } = await supabaseAdmin.auth.admin.createUser({
          email: internalEmail,
          password,
          email_confirm: true,
          user_metadata: {
            display_name: fullName,
            role: 'student',
            student_id: studentRecord.student_id,
          },
        });
        userId = created.user?.id || null;
      }

      if (userId) {
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          role: 'student',
          display_name: fullName,
          email: internalEmail,
          updated_at: new Date().toISOString(),
        });
        await supabaseAdmin
          .from('students')
          .update({ user_id: userId })
          .eq('id', studentRecord.id);

        const retry = await supabase.auth.signInWithPassword({
          email: internalEmail,
          password,
        });
        authData = retry.data;
        authError = retry.error;
      }
    }

    if (authError || !authData.user) {
      return {
        success: false,
        message:
          'Invalid Student ID or password. Please verify your credentials or contact the school ICT desk.',
      };
    }

    // 4. Bind the exact student UUID in an httpOnly cookie and clear any legacy demo cookies
    const cookieStore = await cookies();
    cookieStore.delete('demo_student_session');
    cookieStore.set('student_portal_uid', studentRecord.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return {
      success: true,
      message: `Welcome, ${studentRecord.first_name}! Entering student portal...`,
      redirectUrl: '/student',
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Authentication service error';
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function logoutStudent() {
  const cookieStore = await cookies();
  cookieStore.delete('student_portal_uid');
  cookieStore.delete('demo_student_session');

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore signout errors
  }

  redirect('/student-login');
}
