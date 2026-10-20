import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import { getAdminResults } from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { ResultPublicationReview } from '@/components/admin/ResultPublicationReview';
import { AccessRestricted } from '@/components/admin/AccessRestricted';

export const metadata: Metadata = {
  title: 'Review & Publish Results',
  description: 'Review pending examination scores and authorize publication to the Student Portal.',
};

export default async function ResultReviewPage() {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return (
      <AccessRestricted
        title="Publication Authorization Restricted"
        description="Only School Administrators have the authority to scrutinize marks and authorize their publication to student report cards. Teachers can enter and submit scores for review."
      />
    );
  }

  const pendingResults = await getAdminResults({ status: 'pending_review' });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/results"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Results
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Send className="w-6 h-6 text-emerald-800" />
          Review & Authorize Publication
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Scrutinize marks submitted by subject teachers. Once authorized, results become immediately visible on student report cards.
        </p>
      </div>

      <ResultPublicationReview pendingResults={pendingResults} />
    </div>
  );
}
