import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Layers,
  BookOpen,
  UserCheck,
  Calendar,
  FileCheck2,
  PenTool,
  Send,
  History,
  Settings,
  ExternalLink,
  Megaphone,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAuthenticatedAdmin, logoutAdmin } from '@/app/actions/admin-auth';
import { getAdminSessions, getAdminTerms } from '@/lib/admin/admin-service';

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

  const navSections = [
    {
      title: isAdmin
        ? 'Management'
        : `Class Management (${staff.assigned_class || 'Form Class'})`,
      items: [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        ...(isAdmin
          ? [
              { name: 'Staff & Teachers', href: '/admin/staff', icon: UserCheck },
              {
                name: 'Announcements',
                href: '/admin/announcements',
                icon: Megaphone,
              },
            ]
          : []),
        {
          name: isAdmin
            ? 'All Students'
            : `Students (${staff.assigned_class || 'Class'})`,
          href: '/admin/students',
          icon: Users,
        },
        {
          name: 'Import Students',
          href: '/admin/students/import',
          icon: FileSpreadsheet,
        },
        {
          name: isAdmin
            ? 'Classes'
            : `My Class (${staff.assigned_class || 'Class'})`,
          href: '/admin/classes',
          icon: Layers,
        },
        { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
        ...(isAdmin
          ? [
              {
                name: 'Sessions & Terms',
                href: '/admin/academic-sessions',
                icon: Calendar,
              },
            ]
          : []),
      ],
    },
    {
      title: 'Academic Results',
      items: [
        {
          name: isAdmin
            ? 'All Results'
            : `Class Results (${staff.assigned_class || 'Class'})`,
          href: '/admin/results',
          icon: FileCheck2,
        },
        { name: 'Manual Entry', href: '/admin/results/entry', icon: PenTool },
        {
          name: 'Import Results',
          href: '/admin/results/import',
          icon: FileSpreadsheet,
        },
        ...(isAdmin
          ? [
              {
                name: 'Review & Publish',
                href: '/admin/results/review',
                icon: Send,
              },
            ]
          : []),
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'System & Governance',
            items: [
              { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
              {
                name: 'Settings & Grading',
                href: '/admin/settings',
                icon: Settings,
              },
            ],
          },
        ]
      : []),
  ];

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
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#001f3f] text-slate-200 flex flex-col shrink-0 border-r border-[#003366]">
        <div className="p-5 border-b border-[#003366] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0">
            <img
              src="/assets/logo.png"
              alt="Teacher Home Secondary School Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-bold text-white text-sm leading-tight block font-display">
              Teacher Home
            </span>
            <span className="text-[10px] text-[#66b2ff] font-semibold uppercase tracking-wider block mt-0.5">
              {isAdmin
                ? 'Admin Portal'
                : `Form Teacher • ${staff.assigned_class || 'Class'}`}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="text-[11px] font-bold text-[#66b2ff]/70 uppercase tracking-wider px-3 mb-2">
                {sec.title}
              </p>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-[#003366] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#66b2ff] shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="p-4 border-t border-[#003366] text-xs space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-slate-300 hover:text-white px-2 py-1.5 rounded transition-colors"
          >
            <span>Public School Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#66b2ff]" />
          </Link>
          <Link
            href="/student-login"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-slate-300 hover:text-white px-2 py-1.5 rounded transition-colors"
          >
            <span>Student Result Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#66b2ff]" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#cce5ff] h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#003366]">
              Academic Session:
            </span>
            <Badge variant="success">
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

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#003366] block leading-tight">
                {staff.display_name}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {staff.email}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#990033] text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
