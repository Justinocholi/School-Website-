import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Filter,
  Eye,
  Edit,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { getAdminStudents, getAdminClasses } from '@/lib/admin/admin-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { deleteStudentAction } from '@/app/actions/admin-student';

export const metadata: Metadata = {
  title: 'Student Management',
  description: 'Manage student records, admission IDs, classes, and account credentials.',
};

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; classId?: string; status?: string }>;
}) {
  const { q, classId, status } = await searchParams;
  const { getAuthenticatedStaff } = await import('@/app/actions/admin-auth');
  const staff = await getAuthenticatedStaff();
  const isAdmin = staff?.role === 'administrator';

  const effectiveClassId = !isAdmin && staff?.assigned_class ? staff.assigned_class : classId;

  const [students, classes] = await Promise.all([
    getAdminStudents(q, effectiveClassId, status),
    getAdminClasses(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isAdmin ? 'Student Roster Management' : `Class Roster — ${staff?.assigned_class || 'Form Class'}`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isAdmin
              ? 'View, filter, edit, and manage enrolled scholars and their portal accounts.'
              : `Enrolled scholars in ${staff?.assigned_class}. As Form Teacher, you compile assessments and report cards for these scholars.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/students/import">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              Bulk Import
            </Button>
          </Link>
          <Link href="/admin/students/new">
            <Button size="sm" className="text-xs gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white">
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Input
                name="q"
                defaultValue={q || ''}
                placeholder="Search by Student ID, first name or surname..."
                className="text-xs"
              />
            </div>

            <div className="sm:col-span-4">
              {!isAdmin && staff?.assigned_class ? (
                <div>
                  <input type="hidden" name="classId" value={effectiveClassId} />
                  <div className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-slate-100 px-3 py-2 text-xs font-bold text-gray-700">
                    <span>{staff.assigned_class}</span>
                    <Badge variant="outline" className="text-[10px]">Form Class Locked</Badge>
                  </div>
                </div>
              ) : (
                <select
                  name="classId"
                  defaultValue={classId || ''}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                >
                  <option value="">All Classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" variant="secondary" size="md" className="w-full text-xs">
                Filter
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-50 text-gray-600 text-xs uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Student ID</th>
                <th className="py-3 px-4 font-semibold">Full Name</th>
                <th className="py-3 px-4 font-semibold">Class</th>
                <th className="py-3 px-4 font-semibold">Admission Date</th>
                <th className="py-3 px-4 text-center font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                    No student records found matching the specified criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {s.student_id}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">
                      {s.first_name} {s.last_name} {s.other_names ? `(${s.other_names})` : ''}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {s.class?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {s.admission_date || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={s.status === 'active' ? 'success' : 'destructive'} className="text-[10px]">
                        {s.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link href={`/admin/students/${s.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-600 hover:text-emerald-800">
                            Edit
                          </Button>
                        </Link>
                        {isAdmin && (
                          <DeleteConfirmButton
                            itemId={s.id}
                            itemName={`${s.first_name} ${s.last_name}`}
                            itemType="student"
                            onDelete={deleteStudentAction}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {students.length} student records</span>
          <span>Verified records</span>
        </div>
      </Card>
    </div>
  );
}
