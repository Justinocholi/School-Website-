import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileCheck2,
  User,
  Bell,
  KeyRound,
  LogOut,
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
    <div className="min-h-screen bg-[#f4f9fe] flex flex-col selection:bg-[#cce5ff]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#cce5ff] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* School Branding */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#cce5ff] flex items-center justify-center shadow-xs">
                  <img
                    src="/assets/logo.png"
                    alt="Teacher Home Secondary School Crest"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-bold text-[#003366] text-sm sm:text-base leading-none block font-display">
                    Teacher Home Secondary School
                  </span>
                  <span className="text-[10px] text-[#990033] font-bold uppercase tracking-wider">
                    Student Result Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Student Info Pill & Signout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-[#003366] leading-tight">
                  {student.full_name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
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
                  className="text-xs text-[#990033] hover:text-[#7a0029] hover:bg-[#fdf2f5] border-[#cce5ff]"
                >
                  <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Secondary Subnav for Quick Navigation */}
        <div className="border-t border-[#e9f5ff] bg-[#003366] text-white overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-12">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white/90 hover:text-white hover:bg-[#004a99] transition-colors shrink-0"
                >
                  <Icon className="w-4 h-4 text-[#66b2ff]" />
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
      <footer className="bg-[#001f3f] text-slate-300 border-t border-[#003366] py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            &copy; 2026 Teacher Home Secondary School, Lokoja &bull; Student
            Information &amp; Result Portal
          </span>
          <div className="flex items-center gap-2 text-[#66b2ff]">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Student Session</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
