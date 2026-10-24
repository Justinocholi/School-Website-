import React from 'react';
import { Metadata } from 'next';
import { Bell, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminAnnouncements } from '@/lib/admin/admin-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Student Announcements',
  description:
    'Official notifications, academic schedules, and reminders for enrolled students.',
};

export default async function StudentAnnouncementsPage() {
  const announcements = await getAdminAnnouncements({
    targetAudience: 'students',
    status: 'published',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <Bell className="w-3.5 h-3.5" />
          <span>Internal Student Notices</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          School Bulletins &amp; Announcements
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Stay informed regarding important academic dates, examination guidelines, and extracurricular schedules issued by the school administration.
        </p>
      </div>

      {announcements.length === 0 ? (
        <Card className="border-gray-200 p-8 text-center text-sm text-gray-500">
          No active student announcements at this time.
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id} className="border-gray-200 shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Badge variant="info">{a.category}</Badge>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    {new Date(
                      a.published_at || a.created_at
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{a.title}</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {a.body || a.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
