import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import {
  getAdminClasses,
  getAdminSubjects,
  getAdminTerms,
} from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { BulkResultImportClient } from '@/components/admin/BulkResultImportClient';

export const metadata: Metadata = {
  title: 'Bulk Result Import',
  description: 'Upload and process spreadsheets containing student Continuous Assessment and Examination marks.',
};

export default async function BulkResultImportPage() {
  const [classes, subjects, terms, staff] = await Promise.all([
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

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
          Bulk Academic Marks Ingestion {assignedClass ? `(${assignedClass})` : ''}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {assignedClass
            ? `Upload continuous assessment and examination spreadsheets directly for your assigned class arm (${assignedClass}).`
            : 'Import assessment scores from Excel or CSV files with automated scoring, maximum marks validation, and draft/review controls.'}
        </p>
      </div>

      <BulkResultImportClient
        classes={classes}
        subjects={subjects}
        terms={terms}
        userRole={staff?.role || 'administrator'}
        assignedClass={assignedClass}
      />
    </div>
  );
}
