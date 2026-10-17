'use client';

import React, { useActionState } from 'react';
import { submitAdmissionsEnquiry, EnquiryState } from '@/app/actions/admissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Send, CheckCircle2 } from 'lucide-react';

const initialState: EnquiryState = {
  success: false,
  message: '',
};

export function AdmissionsForm() {
  const [state, formAction, isPending] = useActionState(submitAdmissionsEnquiry, initialState);

  if (state.success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900">Enquiry Received!</h3>
        <p className="text-emerald-700 max-w-md mx-auto text-sm leading-relaxed">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" id="enquiry">
      {state.message && !state.success && (
        <Alert variant="destructive" title="Submission Error">
          {state.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Parent / Guardian Full Name <span className="text-rose-500">*</span>
          </label>
          <Input
            name="parent_name"
            placeholder="e.g. Chief Adeleke Johnson"
            required
            aria-describedby="parent-error"
          />
          {state.errors?.parent_name && (
            <p className="text-xs text-rose-600">{state.errors.parent_name[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Prospective Student Name <span className="text-rose-500">*</span>
          </label>
          <Input
            name="student_name"
            placeholder="e.g. Samuel Johnson"
            required
          />
          {state.errors?.student_name && (
            <p className="text-xs text-rose-600">{state.errors.student_name[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <Input
            name="email"
            type="email"
            placeholder="parent@example.com"
            required
          />
          {state.errors?.email && (
            <p className="text-xs text-rose-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Telephone Number <span className="text-rose-500">*</span>
          </label>
          <Input
            name="phone"
            type="tel"
            placeholder="+234 (0) 803 123 4567"
            required
          />
          {state.errors?.phone && (
            <p className="text-xs text-rose-600">{state.errors.phone[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Target Class for Admission <span className="text-rose-500">*</span>
        </label>
        <select
          name="target_class"
          required
          defaultValue=""
          className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
        >
          <option value="" disabled>Select target class</option>
          <option value="JSS 1">Junior Secondary School 1 (JSS 1)</option>
          <option value="JSS 2">Junior Secondary School 2 (JSS 2 Transfer)</option>
          <option value="JSS 3">Junior Secondary School 3 (JSS 3 Transfer)</option>
          <option value="SS 1 Science">Senior Secondary 1 (SS 1 Science)</option>
          <option value="SS 1 Arts">Senior Secondary 1 (SS 1 Arts)</option>
          <option value="SS 1 Commercial">Senior Secondary 1 (SS 1 Commercial)</option>
          <option value="SS 2">Senior Secondary 2 (Transfer)</option>
        </select>
        {state.errors?.target_class && (
          <p className="text-xs text-rose-600">{state.errors.target_class[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Additional Notes / Questions (Optional)
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="Any special inquiries regarding boarding facilities, scholarships, or entrance dates..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
        />
      </div>

      <Button
        type="submit"
        isLoading={isPending}
        className="w-full justify-center bg-emerald-800 hover:bg-emerald-900 text-white font-semibold h-11"
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Admissions Enquiry
      </Button>
    </form>
  );
}
