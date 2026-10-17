import React from 'react';
import { Metadata } from 'next';
import { Layers, PlusCircle, Users, CheckCircle2 } from 'lucide-react';
import { getAdminClasses } from '@/lib/admin/admin-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateClassForm } from '@/components/admin/CreateClassForm';

export const metadata: Metadata = {
  title: 'Class Management',
  description: 'Manage class names, academic levels, and enrolled student allocations.',
};

export default async function AdminClassesPage() {
  const classes = await getAdminClasses();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-800" />
          Class Structure & Allocations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure class divisions across Junior Secondary and Senior Secondary pathways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Classes Table */}
        <div className="lg:col-span-8">
          <Card className="border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-50 text-gray-600 text-xs uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Class Name</th>
                    <th className="py-3 px-4 font-semibold">Academic Level</th>
                    <th className="py-3 px-4 text-center font-semibold">Enrolled Students</th>
                    <th className="py-3 px-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {classes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {c.level}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-800">
                        {c.student_count || 0} Scholars
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success" className="text-[10px]">
                          {c.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Add Class Form Card */}
        <div className="lg:col-span-4">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="py-4 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-800" />
                Add New Class Room
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <CreateClassForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
