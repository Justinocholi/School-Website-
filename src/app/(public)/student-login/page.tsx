'use client';

import React, { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { loginStudent, StudentAuthResult } from '@/app/actions/student-auth';

const initialState: StudentAuthResult = {
  success: false,
  message: '',
};

export default function StudentLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginStudent,
    initialState
  );

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f9fe]">
      <Navbar />
      <main className="flex-1 py-12 lg:py-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-white p-2 items-center justify-center shadow-md border border-[#e9f5ff]">
              <img
                src="/assets/logo.png"
                alt="Teacher Home Secondary School Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003366] tracking-tight font-display">
              Student Result Portal
            </h1>
            <p className="text-sm text-slate-600">
              Enter your unique Student ID and password to access your terminal
              results and academic records at Teacher Home Secondary School.
            </p>
          </div>

          {/* Demo Credentials Helper Pill */}
          <div className="bg-[#e9f5ff] border border-[#cce5ff] rounded-xl p-3.5 text-xs text-[#003366] flex items-start gap-2.5 shadow-sm">
            <HelpCircle className="w-4 h-4 text-[#990033] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Test Student Credentials:</span>
              <p className="mt-0.5 text-[#003366]">
                Student ID:{' '}
                <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#cce5ff]">
                  GFS001
                </code>{' '}
                &bull; Password:{' '}
                <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#cce5ff]">
                  Student@2026
                </code>
              </p>
            </div>
          </div>

          <Card className="border-[#cce5ff] shadow-lg bg-white">
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
                  <label className="block text-xs font-semibold text-[#003366]">
                    Student ID / Admission Number{' '}
                    <span className="text-[#990033]">*</span>
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
                    <p className="text-xs text-rose-600">
                      {state.errors.student_id[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#003366]">
                      Password / PIN <span className="text-[#990033]">*</span>
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
                    <p className="text-xs text-rose-600">
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  isLoading={isPending}
                  className="w-full justify-center bg-[#990033] hover:bg-[#7a0029] text-white font-semibold h-11"
                >
                  Sign In to Student Portal
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security & Password Help Notice */}
          <div className="bg-white border border-[#cce5ff] rounded-xl p-4 text-xs text-slate-600 space-y-2 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#003366]">
              <Lock className="w-3.5 h-3.5 text-[#990033]" />
              <span>Secure Access &amp; Privacy Policy</span>
            </div>
            <p className="leading-relaxed">
              Students must keep their login credentials confidential. If you
              forgot your password or need assistance accessing your result,
              visit the school office in Peace Community, Lokoja or email{' '}
              <a
                href="mailto:info@teacherhomeschool.com"
                className="text-[#004a99] font-semibold underline"
              >
                info@teacherhomeschool.com
              </a>
              .
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/admin-login"
              className="text-xs text-[#003366] hover:text-[#990033] font-semibold underline"
            >
              Are you a form teacher or school administrator? Access Staff
              Portal &rarr;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
