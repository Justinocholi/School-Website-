import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { BulkStudentImportClient } from '@/components/admin/BulkStudentImportClient';

export const metadata: Metadata = {
  title: 'Bulk Student Import',
  description: 'Upload and ingest batches of student records from Excel and CSV files.',
};

export default function BulkStudentImportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Roster
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
          Bulk Student Roster Import
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Import large numbers of students safely with automated schema validation, duplicate detection, and recoverable rollbacks.
        </p>
      </div>

      <BulkStudentImportClient />
    </div>
  );
}
