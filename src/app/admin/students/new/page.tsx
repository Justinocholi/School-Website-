import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { getAdminClasses } from '@/lib/admin/admin-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateStudentForm } from '@/components/admin/CreateStudentForm';

export const metadata: Metadata = {
  title: 'Add New Student',
  description: 'Manually register a new student record into the school system.',
};

export default async function NewStudentPage() {
  const classes = await getAdminClasses();

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
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-800" />
            Register New Student
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Ensure the Student ID matches the official admission number on the student&apos;s physical file.
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <CreateStudentForm classes={classes} />
        </CardContent>
      </Card>
    </div>
  );
}
