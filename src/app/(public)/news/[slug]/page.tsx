import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Share2, Tag, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const newsDatabase: Record<string, {
  title: string;
  date: string;
  category: string;
  author: string;
  content: string[];
}> = {
  'resumption-date-2026-2027': {
    title: 'First Term 2026/2027 Resumption & Academic Calendar Guidelines',
    date: 'September 7, 2026',
    category: 'Academic',
    author: 'Office of the Principal',
    content: [
      'We are delighted to welcome all returning scholars and newly enrolled students to Greenfield International College for the commencement of the 2026/2027 academic session.',
      'Boarding students are required to report to their designated hostels on Sunday, September 6th, 2026, between 10:00 AM and 4:00 PM. Housemasters and medical staff will be on ground to verify clearances and inspect student kits.',
      'Day students are expected on campus promptly by 7:30 AM on Monday, September 7th, 2026, for the inaugural session assembly.',
      'Students are reminded that full compliance with the official school uniform, haircut standards, and textbooks is compulsory. We wish all our students an inspiring and fruitful academic year ahead.',
    ],
  },
  'admissions-open-2026-2027': {
    title: 'Admissions Open for JSS 1 and Senior Secondary Transfers (2026/2027)',
    date: 'August 28, 2026',
    category: 'Admissions',
    author: 'Admissions Directorate',
    content: [
      'Greenfield International College is pleased to announce that applications for admission into Junior Secondary School (JSS 1, 2) and Senior Secondary School (SS 1) are ongoing.',
      'Prospective parents are encouraged to complete the online enquiry form on our website or visit the admissions office on campus to purchase the registration dossier.',
      'The entrance examination assesses foundational competence in Mathematics, English Language, and Quantitative Reasoning.',
      'Selected candidates will be invited for an interactive interview with the admissions committee.',
    ],
  },
  'annual-science-fair-robotics-exhibition': {
    title: 'Annual Science Fair & Robotics Exhibition Announced for October',
    date: 'August 15, 2026',
    category: 'Events',
    author: 'STEM Department',
    content: [
      'The annual Greenfield Science & Innovation Fair will take place from October 14th to 16th, 2026, at the College Multi-Purpose Auditorium.',
      'Scholars across all grade levels will display project prototypes covering robotics, renewable energy solutions, environmental sustainability, and algorithmic modeling.',
      'Parents and educational stakeholders are cordially invited to attend the grand exhibition on the final day.',
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(newsDatabase).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = newsDatabase[slug];
  if (!article) {
    return { title: 'Announcement Not Found' };
  }
  return {
    title: article.title,
    description: article.content[0],
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = newsDatabase[slug];

  if (!article) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto px-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Announcement Not Found</h1>
        <p className="text-sm text-gray-600">The requested announcement could not be found or has been archived.</p>
        <Link href="/news">
          <Button variant="primary">Return to News Bulletin</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Announcements
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="info">{article.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">Issued by: {article.author}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-8 prose prose-emerald max-w-none space-y-5 text-gray-700 leading-relaxed text-base sm:text-lg">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Link href="/news">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Button>
          </Link>
          <Link href="/student-login">
            <Button size="sm" className="bg-emerald-800 text-white hover:bg-emerald-900">
              Go to Student Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
