import React from 'react';
import { Metadata } from 'next';
import { getAuthenticatedStudent } from '@/lib/student/student-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordChangeForm } from '@/components/student/PasswordChangeForm';
import { KeyRound, ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account & Security',
  description: 'Manage your password, login credentials, and session security.',
};

export default async function StudentAccountPage() {
  const student = await getAuthenticatedStudent();
  if (!student) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Account & Security
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your password and review access security protocols for Student ID <span className="font-mono font-bold text-gray-800">{student.student_id}</span>.
        </p>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-gray-100 py-5">
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-800" />
            Change Student Portal Password
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <PasswordChangeForm />
        </CardContent>
      </Card>

      <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 text-xs text-gray-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Security Recommendations</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed">
          <li>Choose a strong password containing a combination of uppercase letters, numbers, and symbols.</li>
          <li>Never use your first name, surname, or birth date as your password.</li>
          <li>Never share your credentials with peers or leave your portal session unattended.</li>
        </ul>
      </div>
    </div>
  );
}
