'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
  assigned_class?: string;
  assigned_subject?: string;
}

export type AdminAuthContext = StaffAuthContext;

const DEFAULT_STAFF_DEFAULTS: Record<
  string,
  {
    id: string;
    display_name: string;
    role: 'administrator' | 'teacher';
    department: string;
    assigned_class?: string;
    assigned_subject?: string;
    defaultPassword: string;
  }
> = {
  'admin@greenfieldcollege.edu': {
    id: 'a0000000-0000-0000-0000-000000000001',
    display_name: 'School Administrator',
    role: 'administrator',
    department: 'Executive Governance',
    defaultPassword: 'Admin@2026',
  },
  'david.adeleke@greenfieldcollege.edu': {
    id: 'a0000000-0000-0000-0000-000000000011',
    display_name: 'Mr. David Adeleke',
    role: 'teacher',
    department: 'Junior Secondary (Form Teacher)',
    assigned_class: 'JSS 1A',
    assigned_subject: 'General Curriculum',
    defaultPassword: 'Teacher@2026',
  },
  'grace.danjuma@greenfieldcollege.edu': {
    id: 'a0000000-0000-0000-0000-000000000012',
    display_name: 'Mrs. Grace Danjuma',
    role: 'teacher',
    department: 'Junior Secondary (Form Teacher)',
    assigned_class: 'JSS 2A',
    assigned_subject: 'General Curriculum',
    defaultPassword: 'Teacher@2026',
  },
  'samuel.osei@greenfieldcollege.edu': {
    id: 'a0000000-0000-0000-0000-000000000013',
    display_name: 'Mr. Samuel Osei',
    role: 'teacher',
    department: 'Senior Secondary (Form Teacher)',
    assigned_class: 'SS 1 Science',
    assigned_subject: 'General Curriculum',
    defaultPassword: 'Teacher@2026',
  },
};

async function resolveStaffContextById(
  userId: string
): Promise<StaffAuthContext | null> {
  const supabaseAdmin = createAdminClient();

  const [{ data: profile }, { data: authUserRes }] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('id, role, display_name, email')
      .eq('id', userId)
      .maybeSingle(),
    supabaseAdmin.auth.admin.getUserById(userId),
  ]);

  if (!profile || (profile.role !== 'administrator' && profile.role !== 'teacher')) {
    return null;
  }

  const authUser = authUserRes?.user;
  const meta = authUser?.user_metadata || {};
  const emailLower = (profile.email || authUser?.email || '').toLowerCase();
  const seeded = DEFAULT_STAFF_DEFAULTS[emailLower];

  return {
    id: profile.id,
    email: profile.email || authUser?.email || '',
    display_name: profile.display_name || meta.display_name || 'Staff Member',
    role: profile.role,
    department:
      meta.department ||
      seeded?.department ||
      (profile.role === 'administrator'
        ? 'Executive Governance'
        : 'Academic Faculty'),
    assigned_class: meta.assigned_class || seeded?.assigned_class,
    assigned_subject: meta.assigned_subject || seeded?.assigned_subject,
  };
}

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

  // Support username shortcuts for convenience
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
    const supabaseAdmin = createAdminClient();

    // If user entered a username prefix (e.g. "blessing.nwosu") without "@", resolve from profiles
    if (!email.includes('@')) {
      const { data: matchedProfile } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .in('role', ['administrator', 'teacher'])
        .or(`email.ilike.${email}@%,display_name.ilike.%${email}%`)
        .limit(1)
        .maybeSingle();

      if (matchedProfile?.email) {
        email = matchedProfile.email.toLowerCase();
      }
    }

    // Sign out any prior session before authenticating
    await supabase.auth.signOut();

    let { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password: parsed.data.password,
      });

    // If this is one of the seeded staff accounts whose password in auth.users hasn't been synced yet
    const seededStaff = DEFAULT_STAFF_DEFAULTS[email];
    if (
      (authError || !authData.user) &&
      seededStaff &&
      parsed.data.password === seededStaff.defaultPassword
    ) {
      await supabaseAdmin.auth.admin.updateUserById(seededStaff.id, {
        email,
        password: seededStaff.defaultPassword,
        email_confirm: true,
        user_metadata: {
          display_name: seededStaff.display_name,
          role: seededStaff.role,
          department: seededStaff.department,
          assigned_class: seededStaff.assigned_class,
          assigned_subject: seededStaff.assigned_subject,
        },
      });
      await supabaseAdmin.from('profiles').upsert({
        id: seededStaff.id,
        role: seededStaff.role,
        display_name: seededStaff.display_name,
        email,
        updated_at: new Date().toISOString(),
      });

      const retry = await supabase.auth.signInWithPassword({
        email,
        password: parsed.data.password,
      });
      authData = retry.data;
      authError = retry.error;
    }

    if (authError || !authData.user) {
      return {
        success: false,
        message:
          'Invalid staff credentials. Please check your email and password.',
      };
    }

    const staffContext = await resolveStaffContextById(authData.user.id);
    if (!staffContext) {
      await supabase.auth.signOut();
      return {
        success: false,
        message:
          'Access denied: This portal is restricted to authorized academic staff and administrators.',
      };
    }

    const cookieStore = await cookies();
    cookieStore.delete('demo_staff_session');
    cookieStore.delete('demo_admin_session');
    cookieStore.delete('registered_teachers_registry');
    cookieStore.set('staff_portal_uid', staffContext.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    const roleLabel =
      staffContext.role === 'administrator'
        ? 'Administrator'
        : `Class Teacher (${staffContext.assigned_class || 'Staff'})`;

    return {
      success: true,
      message: `${roleLabel} authentication verified. Entering Staff Portal...`,
      redirectUrl: '/admin',
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

const teacherRegisterSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters long'),
  email: z.string().email('Please enter a valid official staff email'),
  department: z.string().optional(),
  assigned_subject: z.string().optional(),
  assigned_class: z
    .string()
    .min(1, 'Please select the assigned class for this class teacher'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirm_password: z.string().min(6, 'Please confirm your password'),
  from_admin: z.string().optional(),
});

export type TeacherRegisterResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  redirectUrl?: string;
};

export async function registerTeacherAction(
  prevState: TeacherRegisterResult | null,
  formData: FormData
): Promise<TeacherRegisterResult> {
  const currentAdmin = await getAuthenticatedStaff();
  if (currentAdmin?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access Restricted: Only School Administrators can onboard Class Teachers inside the Admin Portal.',
    };
  }

  const raw = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    department: (formData.get('department') as string) || undefined,
    assigned_subject: (formData.get('assigned_subject') as string) || undefined,
    assigned_class: formData.get('assigned_class') as string,
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
    from_admin: (formData.get('from_admin') as string) || undefined,
  };

  const parsed = teacherRegisterSchema.safeParse({
    full_name: raw.full_name?.trim(),
    email: raw.email?.trim().toLowerCase(),
    department: raw.department?.trim(),
    assigned_subject: raw.assigned_subject?.trim(),
    assigned_class: raw.assigned_class?.trim(),
    password: raw.password,
    confirm_password: raw.confirm_password,
    from_admin: raw.from_admin,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.password !== parsed.data.confirm_password) {
    return {
      success: false,
      message:
        'Passwords do not match. Please verify your password confirmation.',
      errors: {
        confirm_password: ['Passwords do not match'],
      },
    };
  }

  const { full_name, email, assigned_class, password } = parsed.data;
  const department =
    parsed.data.department || `Class Teacher (${assigned_class})`;
  const assigned_subject =
    parsed.data.assigned_subject || 'General Curriculum';

  try {
    const { addAdminTeacher } = await import('@/lib/admin/admin-service');
    await addAdminTeacher({
      full_name,
      email,
      department,
      assigned_subject,
      assigned_class,
      password,
    });

    revalidatePath('/admin/staff');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Class Teacher ${full_name} (${email}) has been assigned to ${assigned_class}. Their account is now active in Supabase.`,
      redirectUrl: '/admin/staff',
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : 'Registration failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('staff_portal_uid');
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
  // 1. Check bound staff UID cookie and verify live in Supabase
  try {
    const cookieStore = await cookies();
    const uidCookie = cookieStore.get('staff_portal_uid');
    if (uidCookie?.value) {
      const staff = await resolveStaffContextById(uidCookie.value);
      if (staff) {
        return staff;
      }
    }
  } catch {
    // Continue to Supabase Auth check
  }

  // 2. Check Supabase Auth session
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const staff = await resolveStaffContextById(user.id);
      if (staff) {
        return staff;
      }
    }
  } catch {
    // Unauthenticated
  }

  return null;
}

export const getAuthenticatedAdmin = getAuthenticatedStaff;

export async function deleteStaffAction(
  staffId: string
): Promise<{ success: boolean; message: string }> {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message:
        'Access denied: Only School Administrators can remove staff accounts.',
    };
  }

  if (staff.id === staffId || staff.email === staffId) {
    return {
      success: false,
      message:
        'Self-deletion restricted: An administrator cannot delete their own active session account.',
    };
  }

  try {
    const { deleteAdminStaff } = await import('@/lib/admin/admin-service');
    await deleteAdminStaff(staffId);
    revalidatePath('/admin/staff');
    revalidatePath('/admin');
    return {
      success: true,
      message: 'Staff member account removed successfully.',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'Failed to remove staff account',
    };
  }
}
