import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  UserCheck,
  Building,
  GraduationCap,
  Shield,
  PlusCircle,
  Clock,
  BookOpen,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { getAdminStaff, getAdminClasses, getAdminSubjects } from '@/lib/admin/admin-service';
import { getAuthenticatedStaff, deleteStaffAction } from '@/app/actions/admin-auth';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TeacherRegisterForm } from '@/components/admin/TeacherRegisterForm';
import { AccessRestricted } from '@/components/admin/AccessRestricted';

export const metadata: Metadata = {
  title: 'Faculty & Staff Management',
  description: 'Manage registered academic staff members, subject specializations, and teacher portal accounts.',
};

export default async function AdminStaffPage() {
  const staff = await getAuthenticatedStaff();

  if (staff?.role !== 'administrator') {
    return (
      <AccessRestricted
        title="Faculty Management Restricted"
        description="The school-wide academic staff directory and teacher onboarding system is restricted to School Administrators. Teachers can record marks and manage their assigned student classes."
      />
    );
  }

  const [staffList, classes, subjects] = await Promise.all([
    getAdminStaff(),
    getAdminClasses(),
    getAdminSubjects(),
  ]);

  const teacherCount = staffList.filter((s) => s.role === 'teacher').length;
  const departments = Array.from(new Set(staffList.map((s) => s.department).filter(Boolean)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-800" />
            Class & Form Teachers Roster
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Directory of assigned form teachers and portal accounts. As administrator, you have full authority to onboard or remove faculty accounts.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-gray-200 shadow-xs">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Active Teachers
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{teacherCount} Faculty</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-xs">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Departments
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{departments.length} Units</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-xs">
          <CardContent className="p-5 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Portal Access Status
              </p>
              <h3 className="text-2xl font-bold text-emerald-700">All Authorized</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Two-Column Layout: Staff Table & Onboarding Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Staff Table */}
        <div className="lg:col-span-8">
          <Card className="border-gray-200 overflow-hidden shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span>Registered Faculty Directory ({staffList.length})</span>
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Role-Based Access Control Active
              </Badge>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-gray-600 uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Faculty Member</th>
                    <th className="py-3 px-4 font-semibold">Designated Form Class</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 text-center font-semibold">Portal Role</th>
                    <th className="py-3 px-4 text-center font-semibold">Status</th>
                    <th className="py-3 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {staffList.map((member) => {
                    const initials = member.display_name
                      .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '')
                      .split(' ')
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'ST';

                    return (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">
                                {member.display_name}
                              </span>
                              <span className="text-[11px] text-gray-500 font-mono">
                                {member.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-800 text-xs px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                            {member.role === 'administrator' ? 'All Classes (School-wide)' : `Form Teacher • ${member.assigned_class || 'Class'}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">
                          {member.department || (member.role === 'administrator' ? 'Governance' : 'Academic Faculty')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge
                            variant={member.role === 'administrator' ? 'default' : 'info'}
                            className="text-[10px]"
                          >
                            {member.role === 'administrator' ? 'Administrator' : 'Class Teacher'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge variant="success" className="text-[10px]">
                            ACTIVE
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {member.role === 'administrator' ? (
                            <span className="text-[11px] text-gray-400 italic">Protected</span>
                          ) : (
                            <DeleteConfirmButton
                              itemId={member.id}
                              itemName={member.display_name}
                              itemType="teacher"
                              onDelete={deleteStaffAction}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Teacher Onboarding Form for Admin */}
        <div className="lg:col-span-4">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 px-1">
              <PlusCircle className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-gray-800">Onboard Form Teacher</h3>
            </div>
            <p className="text-xs text-gray-500 px-1">
              Create an account for a class teacher to compile, upload, and manage terminal results specifically for their designated class arm.
            </p>
            <TeacherRegisterForm classes={classes} subjects={subjects} fromAdmin={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
