'use client';

import React, { useActionState } from 'react';
import { createSubjectAction } from '@/app/actions/admin-academics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { PlusCircle } from 'lucide-react';

export function CreateSubjectForm() {
  const [state, formAction, isPending] = useActionState(createSubjectAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Success' : 'Error'}
        >
          {state.message}
        </Alert>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">Subject Name</label>
        <Input name="name" placeholder="e.g. Further Mathematics" required />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">Subject Code (Unique)</label>
        <Input name="code" placeholder="e.g. FMT" required className="uppercase font-mono" />
      </div>

      <Button
        type="submit"
        isLoading={isPending}
        className="text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
      >
        <PlusCircle className="w-3.5 h-3.5 mr-1" />
        Add Academic Subject
      </Button>
    </form>
  );
}
