import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  getAuthenticatedStudent,
  getStudentPublishedResults,
} from '@/lib/student/student-service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PrintReportCardButton } from '@/components/student/PrintReportCardButton';
import {
  FileCheck2,
  GraduationCap,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terminal Results',
  description:
    'View your official published examination and continuous assessment marks across academic sessions and terms.',
};

export default async function StudentResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ term?: string; session?: string }>;
}) {
  const student = await getAuthenticatedStudent();
  if (!student) return null;

  const { term: selectedTermParam, session: selectedSessionParam } =
    await searchParams;

  const {
    results,
    performance,
    terms,
    sessions,
    selectedTermId,
    selectedSessionId,
  } = await getStudentPublishedResults(
    student.id,
    selectedTermParam,
    selectedSessionParam
  );

  const currentTerm = terms.find((t) => t.id === selectedTermId) || terms[0];
  const currentSession =
    sessions.find((s) => s.id === selectedSessionId) ||
    sessions.find((s) => s.id === currentTerm?.academic_session_id) ||
    sessions.find((s) => s.is_active) ||
    sessions[0];

  const termsForCurrentSession = terms
    .filter((t) => t.academic_session_id === currentSession?.id)
    .sort((a, b) => a.sequence_number - b.sequence_number);

  const displayedTerms =
    termsForCurrentSession.length > 0 ? termsForCurrentSession : terms;

  return (
    <div className="space-y-8">
      {/* Header and Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Official Academic Result Sheet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Terminal Academic Results
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Select any academic session and term below to view your published continuous assessments and examination scores.
          </p>
        </div>

        {results.length > 0 && <PrintReportCardButton />}
      </div>

      {/* Session & Term Selector Bar (Hidden during print) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs print:hidden space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Session Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Academic Session:
            </span>
            <div className="flex flex-wrap gap-2">
              {sessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/student/results?session=${s.id}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    s.id === currentSession?.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s.name} {s.is_active ? '• Current' : ''}
                </Link>
              ))}
            </div>
          </div>

          {/* Term Selector for the Selected Session */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Term:
            </span>
            <div className="flex flex-wrap gap-2">
              {displayedTerms.map((t) => (
                <Link
                  key={t.id}
                  href={`/student/results?session=${currentSession?.id || ''}&term=${t.id}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    t.id === selectedTermId
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* When results are NOT published for the term */}
      {results.length === 0 ? (
        <Card className="border-gray-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Results Not Yet Published
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            The examination and assessment scores for{' '}
            <span className="font-semibold text-gray-900">
              {currentTerm?.name} ({currentSession?.name || '2026/2027'})
            </span>{' '}
            have not been released by the school administration or are currently undergoing academic review.
          </p>
          <div className="pt-2">
            <Link href="/student">
              <Button variant="outline" size="sm">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* Performance Summary Cards (Screen View) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase">
                Subjects Evaluated
              </p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">
                {performance.totalSubjects}
              </h4>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                {performance.passedSubjects} Passed
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase">
                Total Marks Obtained
              </p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">
                {performance.totalScore}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                out of {performance.totalSubjects * 100}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase">
                Term Average Score
              </p>
              <h4 className="text-2xl font-bold text-emerald-800 mt-1">
                {performance.averageScore}%
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Aggregate Percentage
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase">
                Terminal GPA
              </p>
              <h4 className="text-2xl font-bold text-amber-600 mt-1">
                {performance.gpa} / 5.0
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Grade Point Average
              </p>
            </div>
          </div>

          {/* Official Printable Report Card Container */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0">
            {/* Report Card Header (Prominent on Print) */}
            <div className="border-b-2 border-emerald-900 pb-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                      Greenfield International College
                    </h2>
                    <p className="text-xs font-medium text-emerald-800 uppercase tracking-wider">
                      Knowledge &bull; Integrity &bull; Excellence
                    </p>
                    <p className="text-[11px] text-gray-500">
                      15 Heritage Boulevard, Victoria Island, Lagos &bull; info@greenfieldcollege.edu
                    </p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <Badge variant="success" className="text-xs">
                    OFFICIAL REPORT CARD
                  </Badge>
                  <p className="text-xs font-bold text-gray-700 mt-1">
                    {currentSession?.name || '2026/2027'} &bull;{' '}
                    {currentTerm?.name}
                  </p>
                </div>
              </div>

              {/* Student Metadata Strip */}
              <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Student Name:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {student.full_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Admission Number:</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {student.student_id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Class Level:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {student.class_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Term / Session:</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {currentTerm?.name}, {currentSession?.name || '2026/2027'}
                  </span>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-emerald-950 text-white text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Subject</th>
                    <th className="py-3 px-4 text-center font-semibold">
                      CA (30)
                    </th>
                    <th className="py-3 px-4 text-center font-semibold">
                      Exam (70)
                    </th>
                    <th className="py-3 px-4 text-center font-semibold">
                      Total (100)
                    </th>
                    <th className="py-3 px-4 text-center font-semibold">
                      Grade
                    </th>
                    <th className="py-3 px-4 font-semibold">Remarks</th>
                    <th className="py-3 px-4 text-right font-semibold print:hidden">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((r) => {
                    const caScore =
                      r.scores?.find((s) => s.component?.code === 'ca')
                        ?.score ?? '-';
                    const examScore =
                      r.scores?.find((s) => s.component?.code === 'exam')
                        ?.score ?? '-';

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {r.subject?.name}
                          <span className="text-xs text-gray-400 font-mono ml-1.5">
                            ({r.subject?.code})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-gray-700">
                          {caScore}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-gray-700">
                          {examScore}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800 text-base">
                          {r.total_score}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                              r.grade === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.grade === 'B'
                                  ? 'bg-blue-100 text-blue-800'
                                  : r.grade === 'C'
                                    ? 'bg-amber-100 text-amber-800'
                                    : r.grade === 'F'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {r.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-gray-600">
                          {r.remarks}
                        </td>
                        <td className="py-3 px-4 text-right print:hidden">
                          <Link href={`/student/results/${r.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-emerald-700 hover:text-emerald-900"
                            >
                              Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Terminal Aggregate & Remarks Box */}
            <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 uppercase">
                  Grading Key
                </h4>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-600">
                  <div>A : 75 - 100 (Distinction)</div>
                  <div>B : 65 - 74 (Very Good)</div>
                  <div>C : 50 - 64 (Credit)</div>
                  <div>D : 45 - 49 (Pass)</div>
                  <div>E : 40 - 44 (Weak Pass)</div>
                  <div>F : 0 - 39 (Fail)</div>
                </div>
              </div>

              <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>Terminal Average:</span>
                  <span className="text-emerald-800 text-base">
                    {performance.averageScore}%
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <span className="text-gray-500 block mb-1">
                    Principal’s Recommendation:
                  </span>
                  <p className="italic text-gray-700">
                    {performance.averageScore >= 75
                      ? 'Exceptional academic accomplishment. Commended for consistency and rigor.'
                      : performance.averageScore >= 60
                        ? 'A commendable performance. Encouraged to strive for higher distinction in all subjects.'
                        : 'Fair effort. Additional focus recommended in continuous assessments.'}
                  </p>
                </div>
                <div className="pt-4 flex justify-between items-end text-[11px] text-gray-500">
                  <div>
                    <div className="w-32 border-b border-gray-400 mb-1" />
                    <span>Form Tutor&apos;s Signature</span>
                  </div>
                  <div>
                    <div className="w-32 border-b border-gray-400 mb-1" />
                    <span>Principal&apos;s Official Stamp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
