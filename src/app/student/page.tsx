import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  GraduationCap,
  FileCheck2,
  Bell,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';
import { getAuthenticatedStudent, getStudentDashboardData } from '@/lib/student/student-service';
import { getAdminTerms } from '@/lib/admin/admin-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Student Dashboard',
  description: 'View your student profile, academic session, announcements, and published results.',
};

export default async function StudentDashboardPage() {
  const student = await getAuthenticatedStudent();
  if (!student) return null;

  const [dashboardData, terms] = await Promise.all([
    getStudentDashboardData(student.id),
    getAdminTerms(),
  ]);

  const activeTerm = terms.find((t) => t.is_active) || terms[0];
  const activeTermName = activeTerm ? activeTerm.name : 'First Term';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-amber-400" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026/2027 Academic Session &bull; {activeTermName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {student.first_name}!
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Here is your academic dashboard. You can inspect your published continuous assessments, examination scores, and print official terminal report cards.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/student/results">
              <Button size="sm" className="bg-amber-400 text-gray-950 hover:bg-amber-500 font-bold">
                <FileCheck2 className="w-4 h-4 mr-1.5" />
                Check Published Results
              </Button>
            </Link>
            <Link href="/student/profile">
              <Button size="sm" variant="outline" className="border-emerald-600 text-white hover:bg-emerald-800">
                View Student Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admission ID</p>
              <h3 className="text-lg font-bold font-mono text-gray-900">{student.student_id}</h3>
              <p className="text-xs text-emerald-700 font-medium">{student.status.toUpperCase()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Class</p>
              <h3 className="text-lg font-bold text-gray-900">{student.class_name}</h3>
              <p className="text-xs text-gray-500">Secondary Division</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Published Results</p>
              <h3 className="text-lg font-bold text-gray-900">{dashboardData.resultsCount} Subjects</h3>
              <p className="text-xs text-amber-700 font-medium">{activeTermName} 2026/2027</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</p>
              <h3 className="text-lg font-bold text-gray-900">{activeTermName}</h3>
              <p className="text-xs text-gray-500">Session 2026/2027</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: Recent Results & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Published Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Published Term Results</h2>
              <p className="text-xs text-gray-500">{activeTermName}, 2026/2027 Academic Session</p>
            </div>
            <Link href="/student/results">
              <Button variant="outline" size="sm" className="text-xs font-medium">
                View All Results &rarr;
              </Button>
            </Link>
          </div>

          <Card className="border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-gray-600 text-xs uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Remark</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {dashboardData.recentResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                        No examination results published for your portal account yet.
                      </td>
                    </tr>
                  ) : (
                    dashboardData.recentResults.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-gray-900">
                          {item.subject?.name || 'Subject'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-600">
                          {item.term?.name || activeTermName}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-800">
                          {item.total_score}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge variant={item.grade === 'A' ? 'success' : item.grade === 'B' ? 'info' : 'warning'}>
                            {item.grade}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-gray-600">
                          {item.remarks}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/student/results/${item.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs text-emerald-700 hover:text-emerald-900">
                              Breakdown
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Official Report Card format available</span>
              <Link href="/student/results">
                <Button size="sm" className="bg-emerald-800 text-white hover:bg-emerald-900 text-xs">
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print Terminal Report Card
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Student Bulletins */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              Notices & Bulletins
            </h2>
            <Link href="/student/announcements" className="text-xs text-emerald-700 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData.announcements.map((a) => (
              <Card key={a.id} className="border-gray-200 hover:border-emerald-300 transition-colors">
                <CardContent className="p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3 text-emerald-700" />
                    <span>{new Date(a.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{a.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{a.summary}</p>
                </CardContent>
              </Card>
            ))}

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Security Reminder</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Ensure you log out after viewing your results, especially when using a shared computer in the school computer laboratory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
