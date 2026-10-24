import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, KeyRound, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getAdminStudentById } from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { deleteStudentAction } from '@/app/actions/admin-student';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Student Details & Credentials',
  description: 'View student information, class allocation, and account credentials.',
};

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [student, staff] = await Promise.all([
    getAdminStudentById(studentId),
    getAuthenticatedStaff(),
  ]);

  if (!student) {
    notFound();
  }

  const isAdmin = staff?.role === 'administrator';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Roster
      </Link>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-gray-100 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center font-bold text-lg">
                {student.first_name[0]}{student.last_name[0]}
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {student.first_name} {student.last_name}
                </CardTitle>
                <p className="text-xs text-gray-500 font-mono">
                  Student ID: {student.student_id}
                </p>
              </div>
            </div>
            <Badge variant={student.status === 'active' ? 'success' : 'destructive'}>
              {student.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Class Enrolment:</span>
              <span className="font-bold text-gray-900 text-sm">{student.class?.name || 'Unassigned'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Admission Date:</span>
              <span className="font-bold text-gray-900 text-sm">{student.admission_date || '2026-09-01'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">System Identifier (UUID):</span>
              <span className="font-mono text-gray-600 truncate block">{student.id}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Portal Auth Email:</span>
              <span className="font-mono text-gray-600 block">{student.student_id.toLowerCase()}@student.greenfieldcollege.edu</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 p-4 rounded-xl bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-gray-800">
              <KeyRound className="w-4 h-4 text-emerald-800" />
              <span>Student Account Security & Reset</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              If the student has forgotten their password or has not yet activated their portal account, an administrator can generate an identity-verified reset token. Passwords are never stored in plain text or visible to staff.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone: Admin Account Deletion */}
      {isAdmin && (
        <Card className="border-rose-200 bg-rose-50/40 shadow-xs">
          <CardHeader className="py-4 border-b border-rose-100">
            <CardTitle className="text-sm font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <span>Administrative Removal & Data Erasure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-rose-950">
                Permanently Delete Student Account
              </p>
              <p className="text-[11px] text-rose-700 mt-0.5 max-w-lg leading-relaxed">
                If {student.first_name} {student.last_name} ({student.student_id}) is no longer enrolled at Greenfield College, you can permanently erase their portal account and recorded assessments. This action cannot be undone.
              </p>
            </div>
            <div className="shrink-0">
              <DeleteConfirmButton
                itemId={student.id}
                itemName={`${student.first_name} ${student.last_name} (${student.student_id})`}
                itemType="student"
                onDelete={deleteStudentAction}
                redirectUrl="/admin/students"
                showLabel
                variant="destructive"
                size="sm"
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
