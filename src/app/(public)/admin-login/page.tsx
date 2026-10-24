'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, GraduationCap, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { loginAdmin, AdminAuthResult } from '@/app/actions/admin-auth';

const initialState: AdminAuthResult = {
  success: false,
  message: '',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState
  );

  const [email, setEmail] = useState('admin@greenfieldcollege.edu');
  const [password, setPassword] = useState('Admin@2026');

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state, router]);

  const setCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f9fe]">
      <Navbar />
      <main className="flex-1 py-12 lg:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
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
              Staff &amp; Administrator Portal
            </h1>
            <p className="text-sm text-slate-600">
              Sign in to manage student records, grading configuration,
              examination scores, and academic sessions for Teacher Home
              Secondary School.
            </p>
          </div>

          {/* Multi-Account Role Credentials Helper */}
          <div className="bg-[#001f3f] text-white border border-[#003366] rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-[#003366] pb-2">
              <span className="text-xs font-bold text-[#66b2ff] flex items-center gap-1.5 uppercase tracking-wider">
                <UserCheck className="w-4 h-4" /> Available Staff Accounts
              </span>
              <span className="text-[11px] text-slate-300">
                Click to autofill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Administrator Account */}
              <button
                type="button"
                onClick={() =>
                  setCredentials('admin@greenfieldcollege.edu', 'Admin@2026')
                }
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email.includes('admin')
                    ? 'border-[#66b2ff] bg-[#003366] ring-1 ring-[#66b2ff]'
                    : 'border-[#003366] bg-[#002851]/80 hover:border-[#66b2ff]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">
                    School Admin
                  </span>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">
                    Full Governance
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 truncate">
                  admin@greenfieldcollege.edu
                </p>
                <p className="text-[10px] text-[#66b2ff] font-mono mt-0.5">
                  Password: Admin@2026
                </p>
              </button>

              {/* Teacher 1 Account */}
              <button
                type="button"
                onClick={() =>
                  setCredentials(
                    'david.adeleke@greenfieldcollege.edu',
                    'Teacher@2026'
                  )
                }
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email.includes('david')
                    ? 'border-[#66b2ff] bg-[#003366] ring-1 ring-[#66b2ff]'
                    : 'border-[#003366] bg-[#002851]/80 hover:border-[#66b2ff]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">
                    Mr. David Adeleke
                  </span>
                  <Badge variant="info" className="text-[9px] px-1.5 py-0">
                    JSS 1A
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-300 font-medium mt-1 truncate">
                  Form Teacher &bull; JSS 1A
                </p>
                <p className="text-[10px] text-[#66b2ff] font-mono mt-0.5">
                  Password: Teacher@2026
                </p>
              </button>

              {/* Teacher 2 Account */}
              <button
                type="button"
                onClick={() =>
                  setCredentials(
                    'grace.danjuma@greenfieldcollege.edu',
                    'Teacher@2026'
                  )
                }
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email.includes('grace')
                    ? 'border-[#66b2ff] bg-[#003366] ring-1 ring-[#66b2ff]'
                    : 'border-[#003366] bg-[#002851]/80 hover:border-[#66b2ff]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">
                    Mrs. Grace Danjuma
                  </span>
                  <Badge variant="info" className="text-[9px] px-1.5 py-0">
                    JSS 2A
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-300 font-medium mt-1 truncate">
                  Form Teacher &bull; JSS 2A
                </p>
                <p className="text-[10px] text-[#66b2ff] font-mono mt-0.5">
                  Password: Teacher@2026
                </p>
              </button>

              {/* Teacher 3 Account */}
              <button
                type="button"
                onClick={() =>
                  setCredentials(
                    'samuel.osei@greenfieldcollege.edu',
                    'Teacher@2026'
                  )
                }
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email.includes('samuel')
                    ? 'border-[#66b2ff] bg-[#003366] ring-1 ring-[#66b2ff]'
                    : 'border-[#003366] bg-[#002851]/80 hover:border-[#66b2ff]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">
                    Mr. Samuel Osei
                  </span>
                  <Badge variant="info" className="text-[9px] px-1.5 py-0">
                    SS 1 Science
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-300 font-medium mt-1 truncate">
                  Form Teacher &bull; SS 1
                </p>
                <p className="text-[10px] text-[#66b2ff] font-mono mt-0.5">
                  Password: Teacher@2026
                </p>
              </button>
            </div>
          </div>

          <Card className="border-[#cce5ff] shadow-lg bg-white">
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
                  <label className="block text-xs font-semibold text-[#003366]">
                    Staff Email / Username{' '}
                    <span className="text-[#990033]">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="email"
                      type="text"
                      placeholder="e.g. admin or staff email"
                      required
                      className="font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {state.errors?.email && (
                    <p className="text-xs text-rose-600">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#003366]">
                    Password <span className="text-[#990033]">*</span>
                  </label>
                  <Input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {state.errors?.password && (
                    <p className="text-xs text-rose-600">
                      {state.errors.password[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#003366] hover:bg-[#001f3f] text-white font-semibold py-2.5 rounded-lg transition-colors gap-2"
                >
                  {isPending ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Staff Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Portal Switch Links */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-xs text-slate-600">
              Are you a student or parent checking a terminal report card?
            </p>
            <Link
              href="/student-login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#990033] hover:text-[#7a0029] underline underline-offset-4"
            >
              <GraduationCap className="w-4 h-4" />
              Switch to Student Result Portal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
