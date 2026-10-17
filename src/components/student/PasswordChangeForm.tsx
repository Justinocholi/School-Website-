'use client';

import React, { useActionState } from 'react';
import { updateStudentPassword, PasswordUpdateResult } from '@/app/actions/update-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

const initialState: PasswordUpdateResult = {
  success: false,
  message: '',
};

export function PasswordChangeForm() {
  const [state, formAction, isPending] = useActionState(updateStudentPassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Password Updated' : 'Security Notice'}
        >
          {state.message}
        </Alert>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Current Password <span className="text-rose-500">*</span>
        </label>
        <Input
          name="current_password"
          type="password"
          required
          placeholder="••••••••••••"
        />
        {state.errors?.current_password && (
          <p className="text-xs text-rose-600">{state.errors.current_password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          New Password (min 8 characters) <span className="text-rose-500">*</span>
        </label>
        <Input
          name="new_password"
          type="password"
          required
          placeholder="••••••••••••"
        />
        {state.errors?.new_password && (
          <p className="text-xs text-rose-600">{state.errors.new_password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Confirm New Password <span className="text-rose-500">*</span>
        </label>
        <Input
          name="confirm_password"
          type="password"
          required
          placeholder="••••••••••••"
        />
        {state.errors?.confirm_password && (
          <p className="text-xs text-rose-600">{state.errors.confirm_password[0]}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isPending}
          className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
        >
          <KeyRound className="w-4 h-4 mr-1.5" />
          Update Account Password
        </Button>
      </div>
    </form>
  );
}
