import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, PenTool } from 'lucide-react';
import {
  getAdminStudents,
  getAdminClasses,
  getAdminSubjects,
  getAdminTerms,
} from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualResultEntryForm } from '@/components/admin/ManualResultEntryForm';

export const metadata: Metadata = {
  title: 'Manual Result Entry',
  description: 'Enter assessment marks manually with live calculation and grading validation.',
};

export default async function ManualResultEntryPage() {
  const [students, classes, subjects, terms, staff] = await Promise.all([
    getAdminStudents(),
    getAdminClasses(),
    getAdminSubjects(),
    getAdminTerms(),
    getAuthenticatedStaff(),
  ]);

  const isAdmin = staff?.role === 'administrator';
  const assignedClass = !isAdmin ? staff?.assigned_class : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/results"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Results Overview
      </Link>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-gray-100 py-5">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-800" />
            Manual Score Recording
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            {assignedClass
              ? `Recording and compiling terminal continuous assessments and examination scores for ${assignedClass}.`
              : 'Calculate continuous assessments and examination scores with real-time grade checks before saving.'}
          </p>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <ManualResultEntryForm
            students={students}
            classes={classes}
            subjects={subjects}
            terms={terms}
            userRole={staff?.role || 'administrator'}
            assignedClass={assignedClass}
          />
        </CardContent>
      </Card>
    </div>
  );
}
