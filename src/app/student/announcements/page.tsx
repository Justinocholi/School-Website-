import React from 'react';
import { Metadata } from 'next';
import { Bell, Calendar, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Student Announcements',
  description: 'Official notifications, academic schedules, and reminders for enrolled students.',
};

const announcements = [
  {
    id: '1',
    title: 'First Term Continuous Assessment (CA) Timetable Released',
    date: 'October 12, 2026',
    category: 'Academics',
    body: 'The schedule for the mid-term continuous assessment tests has been posted on the departmental notice boards and synchronized with your portal calendar. All students are expected to report punctually.',
  },
  {
    id: '2',
    title: 'STEM & Science Laboratory Practical Sessions Protocol',
    date: 'September 20, 2026',
    category: 'STEM',
    body: 'Senior secondary students are reminded that lab coats and closed-toe footwear are mandatory during all physics and chemistry experiments.',
  },
  {
    id: '3',
    title: 'Library Digital Catalog & E-Book Access',
    date: 'September 10, 2026',
    category: 'Library',
    body: 'Students can now access over 1,500 recommended e-textbooks via the school network utilizing their Student ID credentials.',
  },
];

export default function StudentAnnouncementsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <Bell className="w-3.5 h-3.5" />
          <span>Internal Student Notices</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          School Bulletins & Announcements
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Stay informed regarding important academic dates, examination guidelines, and extracurricular schedules.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="border-gray-200 shadow-xs">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Badge variant="info">{a.category}</Badge>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  {a.date}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{a.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
