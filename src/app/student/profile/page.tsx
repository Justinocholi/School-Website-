import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAuthenticatedStudent } from '@/lib/student/student-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck, Calendar, BookOpen, KeyRound, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View your student profile and official admission information.',
};

export default async function StudentProfilePage() {
  const student = await getAuthenticatedStudent();
  if (!student) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Official Student Profile
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Verified academic credentials and class enrolment status on file with Teacher Home Secondary School, Lokoja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="md:col-span-8">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-gray-100 flex flex-row items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-sm">
                {student.first_name[0]}{student.last_name[0]}
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {student.full_name}
                </CardTitle>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  Admission ID: {student.student_id}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                    Student Full Name
                  </span>
                  <span className="font-semibold text-gray-900">{student.full_name}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                    Official Student ID
                  </span>
                  <span className="font-mono font-bold text-emerald-800">{student.student_id}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                    Current Assigned Class
                  </span>
                  <span className="font-semibold text-gray-900">{student.class_name}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                    Enrolment Status
                  </span>
                  <Badge variant="success">{student.status.toUpperCase()}</Badge>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                    Admission Date
                  </span>
                  <span className="font-medium text-gray-700">
                    {student.admission_date
                      ? new Date(student.admission_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'September 2025'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                    Portal Account Email
                  </span>
                  <span className="font-mono text-xs text-gray-600">
                    {student.email || `${student.student_id.toLowerCase()}@student.greenfieldcollege.edu`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Action Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Data Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-gray-600">
              <p className="leading-relaxed">
                In compliance with educational privacy protocols and the Nigeria Data Protection Act (NDPA 2023), non-essential personal records are strictly protected.
              </p>
              <div className="pt-2 border-t border-gray-100">
                <Link href="/student/account">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                      Manage Password
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
