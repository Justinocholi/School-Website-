'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  Mail,
  Lock,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { registerTeacherAction, TeacherRegisterResult } from '@/app/actions/admin-auth';
import { ClassRecord, SubjectRecord } from '@/types/database.types';

const initialState: TeacherRegisterResult = {
  success: false,
  message: '',
};

interface TeacherRegisterFormProps {
  classes?: ClassRecord[];
  subjects?: SubjectRecord[];
  fromAdmin?: boolean;
}

export function TeacherRegisterForm({
  classes = [],
  subjects = [],
  fromAdmin = true,
}: TeacherRegisterFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerTeacherAction, initialState);

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <Card className="border-gray-200 shadow-md">
      <CardContent className="p-6 space-y-5">
        {state.message && (
          <Alert
            variant={state.success ? 'success' : 'destructive'}
            title={state.success ? 'Class Teacher Created' : 'Onboarding Notice'}
          >
            {state.message}
          </Alert>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="from_admin" value="true" />

          {/* Full Name & Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Teacher Name with Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                name="full_name"
                type="text"
                placeholder="e.g. Mr. David Adeleke or Mrs. Grace Danjuma"
                required
                className="font-medium text-xs"
              />
            </div>
            {state.errors?.full_name && (
              <p className="text-xs text-rose-600">{state.errors.full_name[0]}</p>
            )}
          </div>

          {/* Staff Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Staff Official Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                name="email"
                type="email"
                placeholder="e.g. david.adeleke@greenfieldcollege.edu"
                required
                className="font-medium text-xs"
              />
            </div>
            <p className="text-[11px] text-gray-500">
              This email will serve as the teacher&apos;s login username.
            </p>
            {state.errors?.email && (
              <p className="text-xs text-rose-600">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Assigned Form Class (CRITICAL) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Assigned Class / Arm (Form Class) <span className="text-rose-500">*</span>
            </label>
            <select
              name="assigned_class"
              required
              defaultValue={classes[0]?.name || 'JSS 1A'}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-bold"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name} ({cls.level}) — Form Teacher
                </option>
              ))}
            </select>
            <p className="text-[11px] text-emerald-700 font-medium">
              &bull; This teacher will solely manage students and upload/compile results for this class arm.
            </p>
            {state.errors?.assigned_class && (
              <p className="text-xs text-rose-600">{state.errors.assigned_class[0]}</p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Initial Password <span className="text-rose-500">*</span>
              </label>
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="text-xs"
              />
              {state.errors?.password && (
                <p className="text-xs text-rose-600">{state.errors.password[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <Input
                name="confirm_password"
                type="password"
                required
                placeholder="••••••••••••"
                className="text-xs"
              />
              {state.errors?.confirm_password && (
                <p className="text-xs text-rose-600">{state.errors.confirm_password[0]}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 rounded-lg transition-colors gap-2 text-xs"
            >
              {isPending ? (
                <span>Creating Class Teacher Account...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Onboard Class Teacher</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
