import { getAdminAnnouncements } from '@/lib/admin/admin-service';
import type { PublicAnnouncementItem } from '@/components/public/TeacherHomeWebsite';

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  Admissions: '/assets/news-admissions.jpg',
  Achievements: '/assets/news-achievement.jpg',
  Events: '/assets/news-cultural.jpg',
  Announcements: '/assets/news-ict-lab.jpg',
  Academic: '/assets/news-waec.jpg',
  Academics: '/assets/news-waec.jpg',
  Examinations: '/assets/news-waec.jpg',
  Sports: '/assets/news-sports.jpg',
  General: '/assets/school-hero 2.jpg',
};

export async function getLivePublicAnnouncementItems(): Promise<
  PublicAnnouncementItem[]
> {
  try {
    const records = await getAdminAnnouncements({
      status: 'published',
      targetAudience: 'public',
    });

    return records.map((rec) => {
      const dateStr =
        (rec.published_at || rec.created_at || '').slice(0, 10) || '2026-10-15';
      let dateDisplay = 'Oct 2026';
      try {
        const d = new Date(rec.published_at || rec.created_at);
        if (!Number.isNaN(d.getTime())) {
          dateDisplay = d.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
        }
      } catch {
        // fallback
      }

      const paragraphs = (rec.body || rec.summary || '')
        .split(/\n\s*\n|\r\n\s*\r\n|\n/)
        .map((p: string) => p.trim())
        .filter(Boolean);

      return {
        slug: rec.slug,
        title: rec.title,
        category: rec.category || 'Announcements',
        date: dateStr,
        dateDisplay,
        image:
          CATEGORY_IMAGE_MAP[rec.category] || '/assets/news-admissions.jpg',
        excerpt: rec.summary || paragraphs[0] || rec.title,
        body: paragraphs.length > 0 ? paragraphs : [rec.summary || rec.title],
      };
    });
  } catch {
    return [];
  }
}
