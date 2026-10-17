'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, HelpCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { loginAdmin, AdminAuthResult } from '@/app/actions/admin-auth';

const initialState: AdminAuthResult = {
  success: false,
  message: '',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

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
          <div className="inline-flex w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 items-center justify-center font-bold shadow-lg border border-slate-800">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Staff & Administrator Login
          </h1>
          <p className="text-sm text-gray-600">
            Sign in to access student records, grading configuration, examination scores, and academic management.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5 shadow-sm">
          <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Administrator Credentials:</span>
            <p className="mt-0.5 text-emerald-900">
              Email: <code className="font-mono font-bold bg-emerald-100 px-1 rounded">admin@greenfieldcollege.edu</code>
            </p>
            <p className="mt-0.5 text-emerald-900">
              Password: <code className="font-mono font-bold bg-emerald-100 px-1 rounded">Admin@2026</code>
            </p>
          </div>
        </div>

        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {state.message && (
              <Alert
                variant={state.success ? 'success' : 'destructive'}
                title={state.success ? 'Success' : 'Authentication Notice'}
              >
                {state.message}
              </Alert>
            )}

            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Staff Email / Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    name="email"
                    type="text"
                    placeholder="admin@greenfieldcollege.edu"
                    required
                    className="font-medium"
                    defaultValue="admin@greenfieldcollege.edu"
                  />
                </div>
                {state.errors?.email && (
                  <p className="text-xs text-rose-600">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  defaultValue="Admin@2026"
                />
                {state.errors?.password && (
                  <p className="text-xs text-rose-600">{state.errors.password[0]}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors gap-2"
              >
                {isPending ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Enter Staff Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Portal Switch Links */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-xs text-gray-500">
            Are you a student checking your terminal report card?
          </p>
          <Link
            href="/student-login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
          >
            <GraduationCap className="w-4 h-4" />
            Switch to Student Result Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
