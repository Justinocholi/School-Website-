'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const adminLoginSchema = z.object({
  email: z.string().min(3, 'Please enter your administrator email or username'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type AdminAuthResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  redirectUrl?: string;
};

export interface AdminAuthContext {
  id: string;
  email: string;
  display_name: string;
  role: 'administrator';
}

export async function loginAdmin(
  prevState: AdminAuthResult | null,
  formData: FormData
): Promise<AdminAuthResult> {
  const emailOrUser = formData.get('email') as string;
  const password = formData.get('password') as string;

  const parsed = adminLoginSchema.safeParse({
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
  // Support username shortcut "admin" => "admin@greenfieldcollege.edu"
  if (email === 'admin') {
    email = 'admin@greenfieldcollege.edu';
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

      if (profile && profile.role !== 'administrator') {
        await supabase.auth.signOut();
        return {
          success: false,
          message: 'Access denied: This portal is restricted to authorized school administrators.',
        };
      }

      return {
        success: true,
        message: 'Admin authentication verified. Entering administrative portal...',
        redirectUrl: '/admin',
      };
    }

    // 2. Demo / Fallback Administrator credentials
    if (
      (email === 'admin@greenfieldcollege.edu' || email === 'admin') &&
      parsed.data.password === 'Admin@2026'
    ) {
      const cookieStore = await cookies();
      cookieStore.set(
        'demo_admin_session',
        JSON.stringify({
          id: 'a0000000-0000-0000-0000-000000000001',
          email: 'admin@greenfieldcollege.edu',
          display_name: 'School Administrator',
          role: 'administrator',
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
        message: 'Admin credentials accepted. Redirecting...',
        redirectUrl: '/admin',
      };
    }

    return {
      success: false,
      message: 'Invalid administrator credentials. Please check your email and password.',
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
  cookieStore.delete('demo_admin_session');

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore signout errors
  }

  redirect('/admin-login');
}

export async function getAuthenticatedAdmin(): Promise<AdminAuthContext | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', user.id)
        .single();

      if (profile && profile.role === 'administrator') {
        return {
          id: user.id,
          email: user.email || '',
          display_name: profile.display_name,
          role: 'administrator',
        };
      }
    }
  } catch {
    // Continue to fallback check
  }

  // Fallback to demo cookie session
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('demo_admin_session');
    if (cookie?.value) {
      const parsed = JSON.parse(cookie.value);
      if (parsed.role === 'administrator') {
        return parsed as AdminAuthContext;
      }
    }
  } catch {
    // Invalid cookie
  }

  return null;
}
