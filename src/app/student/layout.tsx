import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  LayoutDashboard,
  FileCheck2,
  User,
  Bell,
  KeyRound,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getAuthenticatedStudent } from '@/lib/student/student-service';
import { logoutStudent } from '@/app/actions/student-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect('/student-login');
  }

  const navItems = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'Terminal Results', href: '/student/results', icon: FileCheck2 },
    { name: 'My Profile', href: '/student/profile', icon: User },
    { name: 'Announcements', href: '/student/announcements', icon: Bell },
    { name: 'Account & Security', href: '/student/account', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* School Branding */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-sm sm:text-base leading-none block">
                    Greenfield College
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                    Student Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Student Info Pill & Signout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {student.full_name}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ID: {student.student_id} &bull; {student.class_name}
                </span>
              </div>
              <Badge variant="success" className="hidden md:inline-flex">
                Active Student
              </Badge>
              <form action={logoutStudent}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 border-gray-200"
                >
                  <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Secondary Subnav for Quick Navigation */}
        <div className="border-t border-gray-100 bg-white overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-12">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors shrink-0"
                >
                  <Icon className="w-4 h-4 text-emerald-700" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Student Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Portal Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Greenfield International College &bull; Student Information & Result System</span>
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Student Session</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
