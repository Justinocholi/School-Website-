import React from 'react';
import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAuthenticatedAdmin, logoutAdmin } from '@/app/actions/admin-auth';
import { getAdminSessions, getAdminTerms } from '@/lib/admin/admin-service';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await getAuthenticatedAdmin();

  if (!staff) {
    redirect('/admin-login');
  }

  const [sessions, terms] = await Promise.all([
    getAdminSessions(),
    getAdminTerms(),
  ]);

  const activeSession = sessions.find((s) => s.is_active) || sessions[0];
  const activeTerm = terms.find((t) => t.is_active) || terms[0];

  const isAdmin = staff.role === 'administrator';

  // Derive initials
  const initials = staff.display_name
    ? staff.display_name
        .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : isAdmin
      ? 'AD'
      : 'TC';

  return (
    <div className="min-h-screen bg-[#f4f9fe] flex flex-col md:flex-row selection:bg-[#cce5ff]">
      {/* Responsive Sidebar & Mobile Hamburger Drawer */}
      <AdminSidebar
        isAdmin={isAdmin}
        assignedClass={staff.assigned_class || null}
        displayName={staff.display_name || 'Staff User'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#cce5ff] min-h-[4rem] flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 sticky top-0 z-20 shadow-xs gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#003366] hidden sm:inline">
              Session:
            </span>
            <Badge variant="success" className="text-xs">
              {activeSession?.name || '2026/2027'} (
              {activeTerm?.name || 'First Term'})
            </Badge>
            <Badge
              variant={isAdmin ? 'default' : 'info'}
              className="text-[11px] hidden sm:inline-flex"
            >
              {isAdmin
                ? 'Full Admin Access'
                : `Form Teacher (${staff.assigned_class || 'Class'})`}
            </Badge>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#003366] block leading-tight">
                {staff.display_name}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {staff.email}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#990033] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {initials}
            </div>
            <form action={logoutAdmin}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="text-xs text-[#990033] hover:text-[#7a0029] hover:bg-[#fdf2f5] border-[#cce5ff] ml-1"
              >
                <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
