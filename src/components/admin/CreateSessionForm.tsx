'use client';

import React, { useActionState } from 'react';
import { createSessionAction } from '@/app/actions/admin-academics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { PlusCircle, CalendarPlus } from 'lucide-react';

export function CreateSessionForm({
  suggestedNextSession = '2027/2028',
}: {
  suggestedNextSession?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createSessionAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Session Created' : 'Validation Error'}
        >
          {state.message}
        </Alert>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Academic Session Name <span className="text-rose-500">*</span>
        </label>
        <Input
          name="name"
          defaultValue={suggestedNextSession}
          placeholder="e.g. 2027/2028"
          required
          className="font-mono text-sm"
        />
        <p className="text-[11px] text-gray-500">
          Format: YYYY/YYYY. First Term, Second Term, and Third Term are automatically generated for the new session.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">
            Session Start Date
          </label>
          <Input name="start_date" type="date" className="text-xs" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">
            Session End Date
          </label>
          <Input name="end_date" type="date" className="text-xs" />
        </div>
      </div>

      <label className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 cursor-pointer text-xs">
        <input
          type="checkbox"
          name="set_active"
          defaultChecked={true}
          className="mt-0.5 rounded border-emerald-400 text-emerald-800 focus:ring-emerald-600"
        />
        <div>
          <span className="font-bold text-emerald-950 block">
            Move School to This Session Immediately
          </span>
          <span className="text-[11px] text-emerald-800">
            Sets this session and its First Term as the current active session across all dashboards while preserving previous sessions.
          </span>
        </div>
      </label>

      <Button
        type="submit"
        isLoading={isPending}
        className="w-full justify-center bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs h-10"
      >
        <CalendarPlus className="w-4 h-4 mr-1.5 text-amber-400" />
        Create Academic Session & 3 Terms
      </Button>
    </form>
  );
}
