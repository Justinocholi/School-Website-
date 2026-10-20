import React from 'react';
import { Metadata } from 'next';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { getAdminSessions, getAdminTerms } from '@/lib/admin/admin-service';
import { setActiveTermAction } from '@/app/actions/admin-academics';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { AccessRestricted } from '@/components/admin/AccessRestricted';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Academic Sessions & Terms',
  description: 'Manage academic calendar sessions and active term periods.',
};

export default async function AdminSessionsPage() {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return (
      <AccessRestricted
        title="Calendar & Session Management Restricted"
        description="Configuring calendar sessions and changing the active academic term is reserved for School Administrators."
      />
    );
  }

  const sessions = await getAdminSessions();
  const terms = await getAdminTerms();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-800" />
          Academic Sessions & Terms
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure calendar sessions, set the active evaluation period, and maintain historical results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Sessions Card */}
        <Card className="border-gray-200 shadow-xs">
          <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>Academic Sessions</span>
              <Badge variant="info">Historical Records Preserved</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {sessions.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{s.name}</h3>
                    <p className="text-xs text-gray-500">
                      {s.start_date || 'Sep 2026'} – {s.end_date || 'Jul 2027'}
                    </p>
                  </div>
                  <div>
                    {s.is_active ? (
                      <Badge variant="success" className="text-xs">
                        Current Active Session
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Archived / Closed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms Card */}
        <Card className="border-gray-200 shadow-xs">
          <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>Terminal Periods (2026/2027)</span>
              <Badge variant="warning">Term Status</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {terms.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{t.name}</h3>
                    <p className="text-xs text-gray-500">Sequence #{t.sequence_number}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.is_active ? (
                      <Badge variant="success" className="text-xs">
                        Active Examination Period
                      </Badge>
                    ) : (
                      <form action={setActiveTermAction}>
                        <input type="hidden" name="termId" value={t.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="text-xs text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 border-emerald-200"
                        >
                          Set as Active Term
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
