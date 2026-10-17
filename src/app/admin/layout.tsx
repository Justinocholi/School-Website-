import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Layers,
  BookOpen,
  Calendar,
  FileCheck2,
  PenTool,
  Send,
  History,
  Settings,
  Shield,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navSections = [
    {
      title: 'Management',
      items: [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Import Students', href: '/admin/students/import', icon: FileSpreadsheet },
        { name: 'Classes', href: '/admin/classes', icon: Layers },
        { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
        { name: 'Sessions & Terms', href: '/admin/academic-sessions', icon: Calendar },
      ],
    },
    {
      title: 'Academic Results',
      items: [
        { name: 'All Results', href: '/admin/results', icon: FileCheck2 },
        { name: 'Manual Entry', href: '/admin/results/entry', icon: PenTool },
        { name: 'Import Results', href: '/admin/results/import', icon: FileSpreadsheet },
        { name: 'Review & Publish', href: '/admin/results/review', icon: Send },
      ],
    },
    {
      title: 'System & Governance',
      items: [
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
        { name: 'Settings & Grading', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row selection:bg-emerald-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-amber-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base leading-none block">
              Staff Portal
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              School Administrator
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
                {sec.title}
              </p>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="p-4 border-t border-slate-800 text-xs space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-slate-400 hover:text-white px-2 py-1.5 rounded transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/student-login"
            className="flex items-center justify-between text-slate-400 hover:text-white px-2 py-1.5 rounded transition-colors"
          >
            <span>Student Result Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Academic Session:</span>
            <Badge variant="success">2026/2027 (First Term Active)</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-gray-900 block leading-tight">School Administrator</span>
              <span className="text-[11px] text-gray-500">admin@greenfieldcollege.edu</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
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
