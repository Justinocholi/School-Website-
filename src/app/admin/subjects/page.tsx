import React from 'react';
import { Metadata } from 'next';
import { BookOpen, PlusCircle } from 'lucide-react';
import { getAdminSubjects } from '@/lib/admin/admin-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateSubjectForm } from '@/components/admin/CreateSubjectForm';

export const metadata: Metadata = {
  title: 'Subject Management',
  description: 'Manage curriculum subjects, departmental courses, and codes.',
};

export default async function AdminSubjectsPage() {
  const subjects = await getAdminSubjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-800" />
          Academic Curriculum Subjects
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Define subject codes and manage accredited courses taught at Greenfield College.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Subjects Table */}
        <div className="lg:col-span-8">
          <Card className="border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-50 text-gray-600 text-xs uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Subject Code</th>
                    <th className="py-3 px-4 font-semibold">Subject Title</th>
                    <th className="py-3 px-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {subjects.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                        {s.code}
                      </td>
                      <td className="py-3.5 px-4 text-gray-900 font-semibold">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success" className="text-[10px]">
                          {s.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Add Subject Form Card */}
        <div className="lg:col-span-4">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-800" />
                Add New Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <CreateSubjectForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
