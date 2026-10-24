import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Eye,
} from 'lucide-react';
import { getAdminSessions, getAdminTerms } from '@/lib/admin/admin-service';
import {
  setActiveTermAction,
  setActiveSessionAction,
  deleteSessionAction,
} from '@/app/actions/admin-academics';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { AccessRestricted } from '@/components/admin/AccessRestricted';
import { CreateSessionForm } from '@/components/admin/CreateSessionForm';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Academic Sessions & Terms',
  description: 'Manage academic calendar sessions, advance to new school sessions, and switch active term periods.',
};

export default async function AdminSessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return (
      <AccessRestricted
        title="Calendar & Session Management Restricted"
        description="Configuring calendar sessions and changing the active academic term is reserved for School Administrators."
      />
    );
  }

  const { session: viewedSessionParam } = await searchParams;
  const [sessions, allTerms] = await Promise.all([
    getAdminSessions(),
    getAdminTerms(),
  ]);

  const activeSession = sessions.find((s) => s.is_active) || sessions[0];
  const activeTerm = allTerms.find((t) => t.is_active) || allTerms[0];

  const viewedSession =
    (viewedSessionParam && sessions.find((s) => s.id === viewedSessionParam)) ||
    activeSession;

  const viewedSessionTerms = allTerms
    .filter((t) => t.academic_session_id === viewedSession?.id)
    .sort((a, b) => a.sequence_number - b.sequence_number);

  // Suggest next academic session name based on latest session (e.g. 2026/2027 -> 2027/2028)
  let suggestedNextSession = '2027/2028';
  const latestYears = sessions
    .map((s) => {
      const m = s.name.match(/^(\d{4})\/(\d{4})$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((y) => y > 0);
  if (latestYears.length > 0) {
    const maxStartYear = Math.max(...latestYears);
    suggestedNextSession = `${maxStartYear + 1}/${maxStartYear + 2}`;
  }

  return (
    <div className="space-y-8">
      {/* Header & Current Active Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-800" />
            Academic Sessions & Terminal Calendar
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Add new academic sessions after completing all 3 terms, switch the active school session or term at any time, and inspect historical records.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold tracking-wider">
              Current School Calendar
            </span>
            <span className="font-bold">
              {activeSession?.name || '2026/2027'} &bull;{' '}
              <span className="text-amber-300">
                {activeTerm?.name || 'First Term'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Sessions List + Terms for Selected Session), Right (Create New Session Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Academic Sessions Card */}
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>School Academic Sessions ({sessions.length})</span>
                <Badge variant="info">Historical Records Preserved</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {sessions.map((s) => {
                  const isViewed = viewedSession?.id === s.id;
                  const sTerms = allTerms.filter(
                    (t) => t.academic_session_id === s.id
                  );
                  return (
                    <div
                      key={s.id}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isViewed ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-bold text-gray-900 text-base">
                            {s.name} Academic Session
                          </h3>
                          {s.is_active ? (
                            <Badge variant="success" className="text-xs">
                              Current Active Session
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Archived / Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Calendar Period: {s.start_date || 'Sep'} to{' '}
                          {s.end_date || 'Jul'} &bull; {sTerms.length} Terms Configured
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/academic-sessions?session=${s.id}`}>
                          <Button
                            type="button"
                            variant={isViewed ? 'secondary' : 'ghost'}
                            size="sm"
                            className="text-xs gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {isViewed ? 'Viewing Terms' : 'View Terms'}
                          </Button>
                        </Link>

                        <Link href={`/admin/results?sessionId=${s.id}`}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            View Results
                          </Button>
                        </Link>

                        {!s.is_active && (
                          <form action={setActiveSessionAction}>
                            <input type="hidden" name="sessionId" value={s.id} />
                            <Button
                              type="submit"
                              size="sm"
                              className="text-xs bg-emerald-800 hover:bg-emerald-900 text-white"
                            >
                              Switch to Session
                            </Button>
                          </form>
                        )}

                        {sessions.length > 1 && !s.is_active && (
                          <DeleteConfirmButton
                            itemId={s.id}
                            itemName={`${s.name} Academic Session`}
                            itemType="session"
                            onDelete={deleteSessionAction}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Terms Card for the Viewed Session */}
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-base font-bold flex flex-wrap items-center justify-between gap-2">
                <span>
                  Terminal Periods — {viewedSession?.name || '2026/2027'} Session
                </span>
                <div className="flex items-center gap-2">
                  {sessions.length > 1 && (
                    <div className="flex items-center gap-1">
                      {sessions.map((s) => (
                        <Link
                          key={s.id}
                          href={`/admin/academic-sessions?session=${s.id}`}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            viewedSession?.id === s.id
                              ? 'bg-emerald-800 text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  <Badge variant="warning">3 Terms</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {viewedSessionTerms.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {t.name}
                        </h3>
                        <span className="text-xs font-mono text-gray-500">
                          ({viewedSession?.name})
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Sequence #{t.sequence_number}{' '}
                        {t.start_date && t.end_date
                          ? `• ${t.start_date} to ${t.end_date}`
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/results?termId=${t.id}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-gray-600 hover:text-emerald-800"
                        >
                          Results
                        </Button>
                      </Link>
                      {t.is_active ? (
                        <Badge variant="success" className="text-xs py-1 px-2.5">
                          Active Examination Period
                        </Badge>
                      ) : (
                        <form action={setActiveTermAction}>
                          <input type="hidden" name="termId" value={t.id} />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50 border-emerald-200 font-semibold"
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

        {/* Right Column: Add New Session Form */}
        <div className="lg:col-span-4">
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-base font-bold text-gray-900">
                Advance to New Academic Session
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                After completing 1st, 2nd, and 3rd Terms, create the next school session here.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <CreateSessionForm suggestedNextSession={suggestedNextSession} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
