'use client';

import React, { useActionState } from 'react';
import { createClassAction } from '@/app/actions/admin-academics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { PlusCircle } from 'lucide-react';

export function CreateClassForm() {
  const [state, formAction, isPending] = useActionState(createClassAction, null);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Class Name</label>
          <Input name="name" placeholder="e.g. JSS 3B" required />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Class Level</label>
          <select
            name="level"
            required
            defaultValue="JSS 3"
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          >
            <option value="JSS 1">JSS 1</option>
            <option value="JSS 2">JSS 2</option>
            <option value="JSS 3">JSS 3</option>
            <option value="SS 1">SS 1</option>
            <option value="SS 2">SS 2</option>
            <option value="SS 3">SS 3</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isPending}
        className="text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-semibold"
      >
        <PlusCircle className="w-3.5 h-3.5 mr-1" />
        Add Class Room
      </Button>
    </form>
  );
}
