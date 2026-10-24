import React from 'react';
import { TeacherHomeWebsite } from '@/components/public/TeacherHomeWebsite';
import { getLivePublicAnnouncementItems } from '@/lib/public/public-announcements';

export const dynamic = 'force-dynamic';

export default async function PortalGuidePage() {
  const liveAnnouncements = await getLivePublicAnnouncementItems();
  return (
    <TeacherHomeWebsite
      initialPage="portal"
      liveAnnouncements={liveAnnouncements}
    />
  );
}
