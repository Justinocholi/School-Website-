'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const staffLoginSchema = z.object({
  email: z.string().min(2, 'Please enter your staff email or username'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type AdminAuthResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  redirectUrl?: string;
};

export interface StaffAuthContext {
  id: string;
  email: string;
  display_name: string;
  role: 'administrator' | 'teacher';
  department?: string;
}

export type AdminAuthContext = StaffAuthContext;

export async function loginAdmin(
  prevState: AdminAuthResult | null,
  formData: FormData
): Promise<AdminAuthResult> {
  const emailOrUser = formData.get('email') as string;
  const password = formData.get('password') as string;

  const parsed = staffLoginSchema.safeParse({
    email: emailOrUser?.trim(),
    password,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid input. Please verify all fields.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  let email = parsed.data.email.toLowerCase();

  // Support intuitive username shortcuts for teachers and admin
  if (email === 'admin') {
    email = 'admin@greenfieldcollege.edu';
  } else if (email === 'teacher' || email === 'teacher1' || email === 'david') {
    email = 'david.adeleke@greenfieldcollege.edu';
  } else if (email === 'teacher2' || email === 'grace') {
    email = 'grace.danjuma@greenfieldcollege.edu';
  } else if (email === 'teacher3' || email === 'samuel') {
    email = 'samuel.osei@greenfieldcollege.edu';
  }

  try {
    const supabase = await createClient();

    // 1. Attempt standard Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: parsed.data.password,
    });

    if (!authError && authData.user) {
      // Check user role in public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', authData.user.id)
        .single();

      if (!profile || (profile.role !== 'administrator' && profile.role !== 'teacher')) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: 'Access denied: This portal is restricted to authorized academic staff and administrators.',
        };
      }

      const roleLabel = profile.role === 'administrator' ? 'Administrator' : 'Academic Staff';
      return {
        success: true,
        message: `${roleLabel} authentication verified. Entering Staff Portal...`,
        redirectUrl: '/admin',
      };
    }

    // 2. Demo / Fallback Staff credentials
    if (
      (email === 'admin@greenfieldcollege.edu' || email === 'admin') &&
      parsed.data.password === 'Admin@2026'
    ) {
      const cookieStore = await cookies();
      cookieStore.set(
        'demo_staff_session',
        JSON.stringify({
          id: 'a0000000-0000-0000-0000-000000000001',
          email: 'admin@greenfieldcollege.edu',
          display_name: 'School Administrator',
          role: 'administrator',
          department: 'Executive Governance',
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        }
      );

      return {
        success: true,
        message: 'Administrator credentials accepted. Redirecting...',
        redirectUrl: '/admin',
      };
    }

    // Fallback Teacher 1: David Adeleke
    if (
      (email === 'david.adeleke@greenfieldcollege.edu' || email === 'teacher') &&
      parsed.data.password === 'Teacher@2026'
    ) {
      const cookieStore = await cookies();
      cookieStore.set(
        'demo_staff_session',
        JSON.stringify({
          id: 'a0000000-0000-0000-0000-000000000011',
          email: 'david.adeleke@greenfieldcollege.edu',
          display_name: 'Mr. David Adeleke',
          role: 'teacher',
          department: 'Mathematics & Sciences',
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        }
      );

      return {
        success: true,
        message: 'Teacher credentials verified. Entering Staff Portal...',
        redirectUrl: '/admin',
      };
    }

    // Fallback Teacher 2: Grace Danjuma
    if (
      email === 'grace.danjuma@greenfieldcollege.edu' &&
      parsed.data.password === 'Teacher@2026'
    ) {
      const cookieStore = await cookies();
      cookieStore.set(
        'demo_staff_session',
        JSON.stringify({
          id: 'a0000000-0000-0000-0000-000000000012',
          email: 'grace.danjuma@greenfieldcollege.edu',
          display_name: 'Mrs. Grace Danjuma',
          role: 'teacher',
          department: 'Languages & Humanities',
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        }
      );

      return {
        success: true,
        message: 'Teacher credentials verified. Entering Staff Portal...',
        redirectUrl: '/admin',
      };
    }

    // Fallback Teacher 3: Samuel Osei
    if (
      email === 'samuel.osei@greenfieldcollege.edu' &&
      parsed.data.password === 'Teacher@2026'
    ) {
      const cookieStore = await cookies();
      cookieStore.set(
        'demo_staff_session',
        JSON.stringify({
          id: 'a0000000-0000-0000-0000-000000000013',
          email: 'samuel.osei@greenfieldcollege.edu',
          display_name: 'Mr. Samuel Osei',
          role: 'teacher',
          department: 'Basic Sciences & Computing',
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        }
      );

      return {
        success: true,
        message: 'Teacher credentials verified. Entering Staff Portal...',
        redirectUrl: '/admin',
      };
    }

    return {
      success: false,
      message: 'Invalid staff credentials. Please check your email and password.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Authentication service error';
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('demo_staff_session');
  cookieStore.delete('demo_admin_session');

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore signout errors
  }

  redirect('/admin-login');
}

export async function getAuthenticatedStaff(): Promise<StaffAuthContext | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', user.id)
        .single();

      if (profile && (profile.role === 'administrator' || profile.role === 'teacher')) {
        return {
          id: user.id,
          email: user.email || '',
          display_name: profile.display_name,
          role: profile.role,
        };
      }
    }
  } catch {
    // Continue to fallback check
  }

  // Fallback to demo cookie session
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('demo_staff_session') || cookieStore.get('demo_admin_session');
    if (cookie?.value) {
      const parsed = JSON.parse(cookie.value);
      if (parsed.role === 'administrator' || parsed.role === 'teacher') {
        return parsed as StaffAuthContext;
      }
    }
  } catch {
    // Invalid cookie
  }

  return null;
}

export const getAuthenticatedAdmin = getAuthenticatedStaff;
