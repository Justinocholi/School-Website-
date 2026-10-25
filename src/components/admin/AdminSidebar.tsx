'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Menu,
  X,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  isAdmin: boolean;
  assignedClass: string | null;
  displayName: string;
}

export function AdminSidebar({
  isAdmin,
  assignedClass,
  displayName,
}: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navSections = [
    {
      title: isAdmin
        ? 'Management'
        : `Class Management (${assignedClass || 'Form Class'})`,
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
            : `Students (${assignedClass || 'Class'})`,
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
            : `My Class (${assignedClass || 'Class'})`,
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
            : `Class Results (${assignedClass || 'Class'})`,
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

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-5 border-b border-[#003366] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
                : `Form Teacher • ${assignedClass || 'Class'}`}
            </span>
          </div>
        </div>

        {/* Close button inside mobile drawer */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#003366] transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <p className="text-[11px] font-bold text-[#66b2ff]/70 uppercase tracking-wider px-3 mb-2">
              {sec.title}
            </p>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#003366] text-white font-bold shadow-xs'
                      : 'text-slate-200 hover:text-white hover:bg-[#003366]/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#66b2ff]' : 'text-[#66b2ff]/80'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Quick External Links */}
      <div className="p-4 border-t border-[#003366] text-xs space-y-2">
        <Link
          href="/"
          target="_blank"
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
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Toggle Bar (Sticky at top on mobile) */}
      <div className="md:hidden bg-[#001f3f] text-white px-4 py-3 flex items-center justify-between border-b border-[#003366] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-[#003366] text-white hover:bg-[#004a99] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#66b2ff]"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/assets/logo.png"
                alt="Teacher Home Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-xs block leading-tight font-display">
                Teacher Home
              </span>
              <span className="text-[9px] text-[#66b2ff] uppercase tracking-wider block">
                {isAdmin ? 'Admin Portal' : 'Class Portal'}
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-300 truncate max-w-[140px]">
          {displayName}
        </span>
      </div>

      {/* Desktop Sidebar (hidden on mobile, fixed w-64 on desktop) */}
      <aside className="hidden md:flex md:w-64 bg-[#001f3f] text-slate-200 flex-col shrink-0 border-r border-[#003366] min-h-screen sticky top-0 h-screen">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer (visible only when mobileOpen is true) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Menu */}
          <div className="relative w-72 max-w-[85vw] bg-[#001f3f] text-slate-200 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
}
