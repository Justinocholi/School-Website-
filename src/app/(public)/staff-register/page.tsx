import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Shield, UserCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TeacherRegisterForm } from '@/components/admin/TeacherRegisterForm';
import { getAdminClasses, getAdminSubjects } from '@/lib/admin/admin-service';

export const metadata: Metadata = {
  title: 'Academic Staff & Teacher Registration',
  description: 'Register as an academic staff member to record continuous assessments, upload marks, and manage class rosters.',
};

export default async function StaffRegisterPage() {
  const [classes, subjects] = await Promise.all([
    getAdminClasses(),
    getAdminSubjects(),
  ]);

  return (
    <div className="py-12 lg:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/admin-login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Staff Sign In
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-800 text-amber-400 items-center justify-center font-bold shadow-md">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Teacher & Staff Registration
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Create your academic staff account to manage assigned student classes, record assessments, and submit terminal examination marks.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Marks Entry</span>
              <span className="text-[11px] text-emerald-800">CA & Examination grading</span>
            </div>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Student Roster</span>
              <span className="text-[11px] text-emerald-800">Add & view enrolled scholars</span>
            </div>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Instant Access</span>
              <span className="text-[11px] text-emerald-800">Direct entry to your dashboard</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <TeacherRegisterForm classes={classes} subjects={subjects} />
      </div>
    </div>
  );
}
