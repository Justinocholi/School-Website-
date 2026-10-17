import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-amber-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  Greenfield College
                </span>
                <span className="block text-xs font-medium text-emerald-400 tracking-wider uppercase">
                  Excellence & Integrity
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nurturing intellectual curiosity, moral character, and academic excellence in an inclusive and inspiring learning environment.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-md w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited Educational Institution</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Our School
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-emerald-400 transition-colors">
                  Curriculum & Subjects
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-emerald-400 transition-colors">
                  Admissions Process
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-emerald-400 transition-colors">
                  News & Announcements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact & Campus Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Portals */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Online Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/student-login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5">
                  <span>→</span> Student Result Checker
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  Staff & Administrator Portal
                </Link>
              </li>
              <li>
                <Link href="/admissions#enquiry" className="hover:text-emerald-400 transition-colors">
                  Admissions Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact & Hours
            </h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>15 Heritage Boulevard, Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+234 (0) 803 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>info@greenfieldcollege.edu</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1 text-xs">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Fri: 7:30 AM – 4:00 PM</p>
                  <p>Administrative Office: 8:00 AM – 3:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Greenfield International College. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Secure Student Information & Result Management System</span>
            <span>Data Protected (NDPA Compliant)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
