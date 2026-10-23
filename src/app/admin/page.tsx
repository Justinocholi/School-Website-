import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Layers,
  BookOpen,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  History,
  ArrowRight,
  PlusCircle,
  FileCheck2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { getAdminOverviewStats } from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Staff Dashboard Overview',
  description: 'Executive management overview of students, classes, subjects, result publication, and imports.',
};

export default async function AdminOverviewPage() {
  const staff = await getAuthenticatedStaff();
  const isAdmin = staff?.role === 'administrator';
  const stats = await getAdminOverviewStats(!isAdmin && staff?.assigned_class ? staff.assigned_class : undefined);

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isAdmin ? 'Administrator Overview' : `Class Dashboard — ${staff?.assigned_class || 'Form Class'}`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isAdmin
              ? 'Institutional governance, student records, examination results, and operations monitoring.'
              : `Welcome, ${staff?.display_name || 'Class Teacher'} • Form Teacher for ${staff?.assigned_class || 'your class'}. Manage student records, record continuous assessments, and compile exam marks.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/students/import">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Import Students
            </Button>
          </Link>
          <Link href="/admin/results/import">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Import Results
            </Button>
          </Link>
          <Link href="/admin/results/entry">
            <Button size="sm" className="gap-1.5 text-xs bg-emerald-800 hover:bg-emerald-900 text-white">
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              Enter Marks
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {isAdmin ? 'Active Students' : `Class Scholars`}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {isAdmin ? 'Total Classes' : 'Assigned Class'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {isAdmin ? stats.totalClasses : (staff?.assigned_class || 'JSS 1A')}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Subjects</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {isAdmin ? 'Awaiting Review' : 'Pending Review'}
              </p>
              <h3 className="text-2xl font-bold text-amber-700">{stats.pendingResults}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {isAdmin ? 'Published Results' : 'Published Marks'}
              </p>
              <h3 className="text-2xl font-bold text-emerald-800">{stats.publishedResults}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Alert Notice if items pending */}
      {stats.pendingResults > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-sm">
              <span className="font-bold">Results Awaiting Publication:</span> There are {stats.pendingResults} imported/draft subject results pending academic review and approval.
            </div>
          </div>
          {isAdmin ? (
            <Link href="/admin/results/review">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs whitespace-nowrap">
                Review & Publish Now
              </Button>
            </Link>
          ) : (
            <Link href="/admin/results">
              <Button size="sm" variant="outline" className="text-amber-800 border-amber-300 hover:bg-amber-100 font-semibold text-xs whitespace-nowrap">
                View All Results
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Two Column Section: Recent Import Jobs & Recent Audit Activity (or Teacher Guidelines) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Imports */}
        <Card className="border-gray-200">
          <CardHeader className="py-4 px-6 border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Recent Spreadsheet Import Jobs
            </CardTitle>
            <Link href="/admin/students/import" className="text-xs text-emerald-700 hover:underline font-medium">
              New Import &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {stats.recentImports.map((job) => (
                <div key={job.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-900 block truncate max-w-xs">
                      {job.file_name}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Type: {job.import_type === 'students' ? 'Students Roster' : 'Subject Results'} &bull; {job.total_rows} rows
                    </span>
                  </div>
                  <Badge variant="success" className="text-xs">
                    {job.successful_rows} Passed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Activity for Admin / Staff Guidelines for Teachers */}
        {isAdmin ? (
          <Card className="border-gray-200">
            <CardHeader className="py-4 px-6 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700" />
                Administrative Audit Log
              </CardTitle>
              <Link href="/admin/audit-logs" className="text-xs text-emerald-700 hover:underline font-medium">
                View All Logs &rarr;
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {stats.recentActivity.map((log) => (
                  <div key={log.id} className="p-4 space-y-1 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      Actor: {log.actor_email || 'admin'} &bull; Entity: {log.entity_type}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200">
            <CardHeader className="py-4 px-6 border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                Academic Staff Guidelines & Workflow
              </CardTitle>
              <Link href="/admin/results/entry" className="text-xs text-emerald-700 hover:underline font-medium">
                Enter Marks &rarr;
              </Link>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-gray-600">
              <div className="p-3 rounded-lg bg-slate-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-800 block text-xs">Continuous Assessment (CA) — 30 Marks Max</span>
                <p className="text-[11px] text-gray-500">
                  Record test, homework, and quiz scores up to 30.0 marks per student per subject.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-800 block text-xs">Terminal Examination — 70 Marks Max</span>
                <p className="text-[11px] text-gray-500">
                  Standardized end-of-term examination score up to 70.0 marks.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 space-y-1 text-emerald-950">
                <span className="font-bold block text-xs">Approval Workflow</span>
                <p className="text-[11px] text-emerald-900">
                  Scores saved by academic staff are automatically marked as <strong>Pending Review</strong>. School Administrators will review and authorize publication to the student portal.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
