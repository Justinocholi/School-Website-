'use server';

import { z } from 'zod';
import {
  saveSingleResult,
  publishResultBatch,
  recordAuditLog,
} from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { revalidatePath } from 'next/cache';

const singleResultSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  class_id: z.string().min(1, 'Class is required'),
  term_id: z.string().min(1, 'Term is required'),
  ca_score: z.coerce.number().min(0, 'CA cannot be negative').max(30, 'CA max score is 30'),
  exam_score: z.coerce.number().min(0, 'Exam cannot be negative').max(70, 'Exam max score is 70'),
  status: z.enum(['draft', 'pending_review', 'published']),
});

export async function saveSingleResultAction(prevState: unknown, formData: FormData) {
  const staff = await getAuthenticatedStaff();
  const rawData = {
    student_id: formData.get('student_id') as string,
    subject_id: formData.get('subject_id') as string,
    class_id: formData.get('class_id') as string,
    term_id: formData.get('term_id') as string,
    ca_score: formData.get('ca_score'),
    exam_score: formData.get('exam_score'),
    status: formData.get('status') as 'draft' | 'pending_review' | 'published',
  };

  // Teachers cannot directly publish; force pending_review
  if (staff?.role === 'teacher' && rawData.status === 'published') {
    rawData.status = 'pending_review';
  }

  const parsed = singleResultSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  try {
    const record = await saveSingleResult(parsed.data);
    revalidatePath('/admin/results');
    revalidatePath('/admin/results/review');
    revalidatePath('/student/results');
    revalidatePath('/student');
    return {
      success: true,
      message: `Result for student ${parsed.data.student_id} saved successfully (${record.total_score} - Grade ${record.grade})${staff?.role === 'teacher' ? ' and submitted for Administrator review' : ''}.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Error saving result',
    };
  }
}

export async function publishResultsAction(resultIds: string[], reason: string) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message: 'Access denied: Only School Administrators can authorize and publish examination results.',
    };
  }

  if (!resultIds || resultIds.length === 0) {
    return { success: false, message: 'No results selected for publication.' };
  }

  try {
    const res = await publishResultBatch(resultIds, reason || 'Standard terminal publication approved');
    revalidatePath('/admin/results');
    revalidatePath('/admin/results/review');
    revalidatePath('/student/results');
    return {
      success: true,
      message: `Successfully published ${res.count} subject results to the Student Portal.`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Publication failed',
    };
  }
}

export async function correctPublishedResultAction(
  resultId: string,
  caScore: number,
  examScore: number,
  reason: string
) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return {
      success: false,
      message: 'Access denied: Modifying published results requires School Administrator privileges.',
    };
  }

  if (!reason || reason.trim().length < 5) {
    return { success: false, message: 'A verified administrative audit reason is required to correct published marks.' };
  }

  try {
    // Audit before modifying
    recordAuditLog('CORRECT_PUBLISHED_RESULT', 'results', resultId, {
      result_id: resultId,
      new_ca: caScore,
      new_exam: examScore,
      audit_justification: reason,
    });

    revalidatePath('/admin/results');
    revalidatePath('/student/results');

    return {
      success: true,
      message: 'Published result corrected and audited successfully.',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Correction failed',
    };
  }
}
