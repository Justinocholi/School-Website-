import React from 'react';
import { TeacherHomeWebsite } from '@/components/public/TeacherHomeWebsite';
import { getLivePublicAnnouncementItems } from '@/lib/public/public-announcements';

export const dynamic = 'force-dynamic';

export default async function ManagementPage() {
  const liveAnnouncements = await getLivePublicAnnouncementItems();
  return (
    <TeacherHomeWebsite
      initialPage="management"
      liveAnnouncements={liveAnnouncements}
    />
  );
}
