'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  UserCheck,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { loginAdmin, AdminAuthResult } from '@/app/actions/admin-auth';

const initialState: AdminAuthResult = {
  success: false,
  message: '',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

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
    <div className="py-12 lg:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
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

        {/* Teacher Registration Callout */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950 shadow-xs">
          <div>
            <span className="font-bold text-xs block text-emerald-900">New Academic Staff Member?</span>
            <span className="text-[11px] text-emerald-700">Register your faculty account to access your personal marking dashboard.</span>
          </div>
          <Link href="/staff-register" className="shrink-0 w-full sm:w-auto">
            <Button size="sm" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold gap-1.5 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Register as Teacher &rarr;</span>
            </Button>
          </Link>
        </div>

        {/* Multi-Account Role Credentials Helper */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" /> Available Staff Accounts
            </span>
            <span className="text-[11px] text-slate-400">Click to autofill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Administrator Account */}
            <button
              type="button"
              onClick={() => setCredentials('admin@greenfieldcollege.edu', 'Admin@2026')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('admin')
                  ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500'
                  : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Administrator</span>
                <Badge variant="success" className="text-[9px] px-1.5 py-0">Full Access</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">admin@greenfieldcollege.edu</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Password: Admin@2026</p>
            </button>

            {/* Teacher 1 Account */}
            <button
              type="button"
              onClick={() => setCredentials('david.adeleke@greenfieldcollege.edu', 'Teacher@2026')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('david')
                  ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500'
                  : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Mr. David Adeleke</span>
                <Badge variant="info" className="text-[9px] px-1.5 py-0">Maths Staff</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">david.adeleke@greenfieldcollege.edu</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Password: Teacher@2026</p>
            </button>

            {/* Teacher 2 Account */}
            <button
              type="button"
              onClick={() => setCredentials('grace.danjuma@greenfieldcollege.edu', 'Teacher@2026')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('grace')
                  ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500'
                  : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Mrs. Grace Danjuma</span>
                <Badge variant="info" className="text-[9px] px-1.5 py-0">English Staff</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">grace.danjuma@greenfieldcollege.edu</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Password: Teacher@2026</p>
            </button>

            {/* Teacher 3 Account */}
            <button
              type="button"
              onClick={() => setCredentials('samuel.osei@greenfieldcollege.edu', 'Teacher@2026')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                email.includes('samuel')
                  ? 'border-emerald-500 bg-emerald-950/60 ring-1 ring-emerald-500'
                  : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Mr. Samuel Osei</span>
                <Badge variant="info" className="text-[9px] px-1.5 py-0">Sciences Staff</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">samuel.osei@greenfieldcollege.edu</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Password: Teacher@2026</p>
            </button>
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
                    placeholder="e.g. admin or david.adeleke@greenfieldcollege.edu"
                    required
                    className="font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
