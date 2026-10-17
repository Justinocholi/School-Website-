import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight, Bell, Tag, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'News & Announcements',
  description: 'Stay updated with the latest news, academic notifications, and events from Greenfield International College.',
};

const allNews = [
  {
    id: '1',
    title: 'First Term 2026/2027 Resumption & Academic Calendar Guidelines',
    slug: 'resumption-date-2026-2027',
    date: 'September 7, 2026',
    category: 'Academic',
    summary: 'Detailed schedule for boarding students check-in, academic orientation, and commencement of classroom lectures for the First Term.',
  },
  {
    id: '2',
    title: 'Admissions Open for JSS 1 and Senior Secondary Transfers (2026/2027)',
    slug: 'admissions-open-2026-2027',
    date: 'August 28, 2026',
    category: 'Admissions',
    summary: 'Greenfield International College is now accepting applications for prospective scholars into Junior and Senior Secondary classes.',
  },
  {
    id: '3',
    title: 'Annual Science Fair & Robotics Exhibition Announced for October',
    slug: 'annual-science-fair-robotics-exhibition',
    date: 'August 15, 2026',
    category: 'Events',
    summary: 'Scholars will present projects covering sustainable energy, artificial intelligence models, and automated agriculture.',
  },
  {
    id: '4',
    title: 'Student Online Result Portal Upgrade Notice',
    slug: 'student-online-result-portal-upgrade',
    date: 'July 24, 2026',
    category: 'Portal',
    summary: 'Our Student Information Management System has been upgraded with automated report card generation, instant grading breakdowns, and enhanced security.',
  },
  {
    id: '5',
    title: 'Greenfield Scholars Clinch First Place in National Mathematics Olympiad',
    slug: 'national-mathematics-olympiad-victory',
    date: 'July 10, 2026',
    category: 'Achievements',
    summary: 'Congratulations to our senior secondary team for an outstanding performance in the national finals held in Abuja.',
  },
];

export default function NewsPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="info" className="mb-3">
            School Bulletin
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            News & Official Announcements
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Keep track of term schedules, academic milestones, student achievements, and community events.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:shadow-md transition-all border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Badge variant={item.category === 'Academic' ? 'success' : item.category === 'Admissions' ? 'warning' : 'info'}>
                    {item.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
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
      </div>
    </div>
  );
}
