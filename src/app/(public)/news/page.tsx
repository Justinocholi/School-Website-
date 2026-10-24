import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminAnnouncements } from '@/lib/admin/admin-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News & Announcements',
  description:
    'Stay updated with the latest news, academic notifications, and events from Greenfield International College.',
};

export default async function NewsPage() {
  const announcements = await getAdminAnnouncements({
    targetAudience: 'public',
    status: 'published',
  });

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="info" className="mb-3">
            School Bulletin
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            News &amp; Official Announcements
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Keep track of term schedules, academic milestones, student achievements, and community events.
          </p>
        </div>

        {/* News Grid */}
        {announcements.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-sm text-gray-500">
            No public announcements have been posted at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col justify-between hover:shadow-md transition-all border-gray-200"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <Badge
                      variant={
                        item.category === 'Academic'
                          ? 'success'
                          : item.category === 'Admissions'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {item.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(
                        item.published_at || item.created_at
                      ).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 hover:text-emerald-800 transition-colors">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.summary}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold text-sm inline-flex items-center gap-1"
                  >
                    Read Full Notice <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
