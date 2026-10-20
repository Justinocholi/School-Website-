import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileCheck2,
  PlusCircle,
  FileSpreadsheet,
  Send,
  Filter,
} from 'lucide-react';
import {
  getAdminResults,
  getAdminClasses,
  getAdminSubjects,
  getAdminTerms,
} from '@/lib/admin/admin-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Academic Results Management',
  description: 'Manage, search, and monitor student Continuous Assessments and Examination results.',
};

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ termId?: string; classId?: string; subjectId?: string; status?: string }>;
}) {
  const { termId, classId, subjectId, status } = await searchParams;

  const results = await getAdminResults({ termId, classId, subjectId, status });
  const classes = await getAdminClasses();
  const subjects = await getAdminSubjects();
  const terms = await getAdminTerms();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-800" />
            Academic Results Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Browse, filter, audit, and approve terminal examination results across all classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/results/import">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Import Marks
            </Button>
          </Link>
          <Link href="/admin/results/entry">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              Manual Entry
            </Button>
          </Link>
          <Link href="/admin/results/review">
            <Button size="sm" className="text-xs gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold">
              <Send className="w-3.5 h-3.5 text-amber-400" />
              Review & Publish
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Academic Term</label>
              <select
                name="termId"
                defaultValue={termId || ''}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 font-medium"
              >
                <option value="">All Terms</option>
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.is_active ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Class</label>
              <select
                name="classId"
                defaultValue={classId || ''}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 font-medium"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Subject</label>
              <select
                name="subjectId"
                defaultValue={subjectId || ''}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 font-medium"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Status</label>
              <select
                name="status"
                defaultValue={status || ''}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 font-medium"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" variant="secondary" size="md" className="w-full text-xs h-9">
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-50 text-gray-600 uppercase border-b border-gray-200 text-xs">
              <tr>
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Term</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Class</th>
                <th className="py-3 px-4 text-center font-semibold">Total Score</th>
                <th className="py-3 px-4 text-center font-semibold">Grade</th>
                <th className="py-3 px-4 text-center font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 text-xs">
                    No results found matching your filters.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-800 block text-xs">
                        {r.student?.student_id || r.student_id}
                      </span>
                      <span className="text-gray-900 text-xs">
                        {r.student?.first_name} {r.student?.last_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {terms.find((t) => t.id === r.term_id)?.name || 'First Term'}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {r.subject?.name} <span className="text-gray-400 font-mono text-xs">({r.subject?.code})</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {r.class?.name}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800 text-sm">
                      {r.total_score}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={r.grade === 'A' ? 'success' : r.grade === 'B' ? 'info' : 'warning'} className="text-[10px]">
                        {r.grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={r.status === 'published' ? 'success' : 'warning'} className="text-[10px]">
                        {r.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-gray-500">
                      {r.remarks}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
