'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createStudentAction, AdminStudentActionState } from '@/app/actions/admin-student';
import { ClassRecord } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const initialState: AdminStudentActionState = {
  success: false,
  message: '',
};

export function CreateStudentForm({ classes }: { classes: ClassRecord[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStudentAction, initialState);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/admin/students');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Success' : 'Validation Error'}
        >
          {state.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Student ID / Admission Number <span className="text-rose-500">*</span>
          </label>
          <Input
            name="student_id"
            placeholder="e.g. GFS010"
            required
            className="uppercase font-mono"
          />
          {state.errors?.student_id && (
            <p className="text-xs text-rose-600">{state.errors.student_id[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Assigned Class <span className="text-rose-500">*</span>
          </label>
          <select
            name="class_id"
            required
            defaultValue=""
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          >
            <option value="" disabled>Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
          {state.errors?.class_id && (
            <p className="text-xs text-rose-600">{state.errors.class_id[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            First Name <span className="text-rose-500">*</span>
          </label>
          <Input name="first_name" placeholder="e.g. Kelechi" required />
          {state.errors?.first_name && (
            <p className="text-xs text-rose-600">{state.errors.first_name[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Surname / Last Name <span className="text-rose-500">*</span>
          </label>
          <Input name="last_name" placeholder="e.g. Okoro" required />
          {state.errors?.last_name && (
            <p className="text-xs text-rose-600">{state.errors.last_name[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Other Names (Optional)
          </label>
          <Input name="other_names" placeholder="e.g. Brian" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-xs">
        <label className="block text-xs font-semibold text-gray-700">
          Admission Date
        </label>
        <Input name="admission_date" type="date" defaultValue="2026-09-01" />
      </div>

      <div className="pt-4 flex items-center gap-3">
        <Button
          type="submit"
          isLoading={isPending}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Student Record
        </Button>
        <Link href="/admin/students">
          <Button variant="outline" size="sm" type="button" className="text-xs">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
