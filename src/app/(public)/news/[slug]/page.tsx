import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAnnouncementBySlug } from '@/lib/admin/admin-service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getAnnouncementBySlug(slug);
  if (!article) {
    return { title: 'Announcement Not Found' };
  }
  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getAnnouncementBySlug(slug);

  if (!article || article.status !== 'published') {
    return (
      <div className="py-20 text-center max-w-xl mx-auto px-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Announcement Not Found
        </h1>
        <p className="text-sm text-gray-600">
          The requested announcement could not be found or has been archived.
        </p>
        <Link href="/news">
          <Button variant="primary">Return to News Bulletin</Button>
        </Link>
      </div>
    );
  }

  const paragraphs = article.body
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

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
                {new Date(
                  article.published_at || article.created_at
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">
                Issued by: Office of the School Administration
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-8 prose prose-emerald max-w-none space-y-5 text-gray-700 leading-relaxed text-base sm:text-lg">
          {paragraphs.map((paragraph, idx) => (
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
            <Button
              size="sm"
              className="bg-emerald-800 text-white hover:bg-emerald-900"
            >
              Go to Student Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
