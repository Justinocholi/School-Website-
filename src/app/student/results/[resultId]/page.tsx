import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAuthenticatedStudent,
  getStudentSingleResult,
} from '@/lib/student/student-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CheckCircle, ShieldAlert, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subject Result Details',
  description: 'Detailed score breakdown and assessment audit for a published subject.',
};

export default async function StudentResultDetailPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const student = await getAuthenticatedStudent();
  if (!student) return null;

  const { resultId } = await params;

  // Enforce access control boundary
  const result = await getStudentSingleResult(student.id, resultId);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Result Record Not Found</h2>
        <p className="text-sm text-gray-600">
          This result either does not exist, belongs to another student, or has not been published by the administration.
        </p>
        <div className="pt-2">
          <Link href="/student/results">
            <Button variant="primary">Return to Results</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/student/results"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Results
      </Link>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-gray-100 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {result.subject?.code}
              </span>
              <CardTitle className="text-2xl font-bold text-gray-900 mt-1">
                {result.subject?.name}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Class: {result.class?.name} &bull; Published: {new Date(result.published_at || result.updated_at).toLocaleDateString('en-GB')}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 block uppercase font-medium">Final Grade</span>
              <Badge variant={result.grade === 'A' ? 'success' : result.grade === 'B' ? 'info' : 'warning'} className="text-lg px-3 py-1 font-bold">
                {result.grade}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-xs">
              Score Breakdown Components
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.scores?.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-1">
                  <span className="text-xs text-gray-500 font-medium block">
                    {s.component?.name || 'Assessment Component'}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono text-gray-900">
                      {s.score}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Max: {s.component?.maximum_score || 100}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase">Composite Total Score</span>
              <p className="text-xs text-emerald-700">Combined continuous assessment and examination</p>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-900">
              {result.total_score} <span className="text-sm font-normal text-emerald-700">/ 100</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Teacher’s Subject Remark:</span>
            <p className="text-sm font-medium text-gray-800 italic">
              &ldquo;{result.remarks || 'Satisfactory academic performance.'}&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
