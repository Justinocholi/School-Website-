'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, UserCheck, ShieldAlert, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { loginStudent, StudentAuthResult } from '@/app/actions/student-auth';

const initialState: StudentAuthResult = {
  success: false,
  message: '',
};

export default function StudentLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginStudent, initialState);

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  return (
    <div className="py-12 lg:py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-800 text-amber-400 items-center justify-center font-bold shadow-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Student Portal Sign In
          </h1>
          <p className="text-sm text-gray-600">
            Enter your unique Student ID and password to access your terminal results and academic records.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5 shadow-sm">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Test Student Credentials:</span>
            <p className="mt-0.5 text-amber-800">
              Student ID: <code className="font-mono font-bold bg-amber-100 px-1 rounded">GFS001</code> &bull; Password: <code className="font-mono font-bold bg-amber-100 px-1 rounded">Student@2026</code>
            </p>
          </div>
        </div>

        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {state.message && (
              <Alert
                variant={state.success ? 'success' : 'destructive'}
                title={state.success ? 'Success' : 'Sign In Notice'}
              >
                {state.message}
              </Alert>
            )}

            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Student ID / Admission Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    name="student_id"
                    placeholder="e.g. GFS001"
                    required
                    autoCapitalize="characters"
                    className="uppercase font-medium"
                    defaultValue="GFS001"
                  />
                </div>
                {state.errors?.student_id && (
                  <p className="text-xs text-rose-600">{state.errors.student_id[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                </div>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  defaultValue="Student@2026"
                />
                {state.errors?.password && (
                  <p className="text-xs text-rose-600">{state.errors.password[0]}</p>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isPending}
                className="w-full justify-center bg-emerald-800 hover:bg-emerald-900 text-white font-semibold h-11"
              >
                Sign In to Portal
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security & Password Help Notice */}
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Secure Access & Privacy Policy</span>
          </div>
          <p className="leading-relaxed">
            Students must keep their login credentials confidential. Never use your first name as your password. If you forgot your password or are activating for the first time, visit the administrative records desk or email <span className="text-emerald-700 font-medium">records@greenfieldcollege.edu</span>.
          </p>
        </div>

        <div className="text-center pt-2">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-emerald-800 font-medium underline">
            Are you a teacher or school administrator? Access Staff Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
