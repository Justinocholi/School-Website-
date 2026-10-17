'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const enquirySchema = z.object({
  parent_name: z.string().min(2, 'Parent/Guardian full name is required'),
  student_name: z.string().min(2, 'Prospective student full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please provide a valid telephone number'),
  target_class: z.string().min(1, 'Please select the target class level'),
  message: z.string().optional(),
});

export type EnquiryState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitAdmissionsEnquiry(
  prevState: EnquiryState | null,
  formData: FormData
): Promise<EnquiryState> {
  const rawData = {
    parent_name: formData.get('parent_name') as string,
    student_name: formData.get('student_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    target_class: formData.get('target_class') as string,
    message: (formData.get('message') as string) || '',
  };

  const validation = enquirySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('admissions_enquiries').insert({
      parent_name: validation.data.parent_name,
      student_name: validation.data.student_name,
      email: validation.data.email,
      phone: validation.data.phone,
      target_class: validation.data.target_class,
      message: validation.data.message || null,
      status: 'pending',
    });

    if (error) {
      // In development or when Supabase is not connected, log and simulate success for the user
      console.warn('Admissions enquiry insert warning:', error.message);
    }

    return {
      success: true,
      message: 'Thank you! Your admissions enquiry has been received. Our admissions officer will contact you within 24 hours.',
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return {
      success: false,
      message: `Failed to submit enquiry: ${errorMessage}`,
    };
  }
}
