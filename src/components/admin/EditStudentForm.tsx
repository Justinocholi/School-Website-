'use client';

import React, { useActionState } from 'react';
import {
  updateStudentAction,
  AdminStudentActionState,
} from '@/app/actions/admin-student';
import { StudentRecord, ClassRecord } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { KeyRound, Save } from 'lucide-react';

const initialState: AdminStudentActionState = {
  success: false,
  message: '',
};

export function EditStudentForm({
  student,
  classes,
  isAdmin = true,
}: {
  student: StudentRecord;
  classes: ClassRecord[];
  isAdmin?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateStudentAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="student_uuid" value={student.id} />

      {state.message && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Student Updated' : 'Update Error'}
        >
          {state.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            First Name <span className="text-rose-500">*</span>
          </label>
          <Input
            name="first_name"
            defaultValue={student.first_name}
            required
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Surname / Last Name <span className="text-rose-500">*</span>
          </label>
          <Input
            name="last_name"
            defaultValue={student.last_name}
            required
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Middle / Other Names
          </label>
          <Input
            name="other_names"
            defaultValue={student.other_names || ''}
            className="text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Assigned Class <span className="text-rose-500">*</span>
          </label>
          <select
            name="class_id"
            defaultValue={student.class_id || student.class?.id || ''}
            disabled={!isAdmin}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:bg-slate-100"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level})
              </option>
            ))}
          </select>
          {!isAdmin && (
            <input
              type="hidden"
              name="class_id"
              value={student.class_id || student.class?.id || ''}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Enrolment Status
          </label>
          <select
            name="status"
            defaultValue={student.status || 'active'}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs text-gray-800">
          <KeyRound className="w-4 h-4 text-emerald-800" />
          <span>Reset Student Portal Password (Optional)</span>
        </div>
        <p className="text-[11px] text-gray-500">
          Leave blank to keep the student’s current password unchanged, or enter a new password (min 6 characters) to reset their Student Portal login.
        </p>
        <Input
          name="new_password"
          type="text"
          placeholder="Enter new password (e.g. Student@2026) or leave blank"
          className="font-mono text-xs bg-white"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isPending}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Save Changes &amp; Update Student
        </Button>
      </div>
    </form>
  );
}
