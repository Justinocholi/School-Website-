import React from 'react';
import { TeacherHomeWebsite } from '@/components/public/TeacherHomeWebsite';
import { getLivePublicAnnouncementItems } from '@/lib/public/public-announcements';

export const dynamic = 'force-dynamic';

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const liveAnnouncements = await getLivePublicAnnouncementItems();
  return (
    <TeacherHomeWebsite
      initialPage="bulletin-detail"
      initialSlug={slug}
      liveAnnouncements={liveAnnouncements}
    />
  );
}
