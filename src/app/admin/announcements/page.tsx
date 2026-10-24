import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  Globe,
  GraduationCap,
  Megaphone,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getAdminAnnouncements } from '@/lib/admin/admin-service';
import {
  deleteAnnouncementAction,
  toggleAnnouncementStatusAction,
} from '@/app/actions/admin-academics';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { AccessRestricted } from '@/components/admin/AccessRestricted';
import { CreateAnnouncementForm } from '@/components/admin/CreateAnnouncementForm';
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'School & Student Announcements Management',
  description: 'Publish and manage official announcements across the public school website and student dashboard.',
};

export default async function AdminAnnouncementsPage() {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return (
      <AccessRestricted
        title="Announcements Governance Restricted"
        description="Publishing and managing school-wide announcements on the public website and student portal is reserved for School Administrators."
      />
    );
  }

  const announcements = await getAdminAnnouncements();

  const audienceLabel = (aud: string) => {
    if (aud === 'students') return 'Student Portal Only';
    if (aud === 'public') return 'Public Website Only';
    return 'Everyone (Website + Student Portal)';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-emerald-800" />
            School & Student Announcements
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Control the announcements and bulletins displayed on the public school website and every student’s portal dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/news" target="_blank">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              Public News Page
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
          <Link href="/student/announcements" target="_blank">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              Student Bulletin
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left (Existing Announcements), Right (Post New Announcement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Published & Draft Bulletins ({announcements.length})</span>
                <Badge variant="info">Live Sync with Supabase</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {announcements.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No announcements have been posted yet. Use the form to publish your first school bulletin.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 space-y-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="info" className="text-[11px]">
                            {item.category}
                          </Badge>
                          <Badge
                            variant={
                              item.target_audience === 'all'
                                ? 'success'
                                : item.target_audience === 'students'
                                  ? 'warning'
                                  : 'default'
                            }
                            className="text-[11px]"
                          >
                            {audienceLabel(item.target_audience)}
                          </Badge>
                          <Badge
                            variant={
                              item.status === 'published' ? 'success' : 'outline'
                            }
                            className="text-[10px]"
                          >
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>

                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          {new Date(
                            item.published_at || item.created_at
                          ).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
                        <Link
                          href={`/news/${item.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
                        >
                          Read Full Article <ExternalLink className="w-3 h-3" />
                        </Link>

                        <div className="flex items-center gap-2">
                          <form action={toggleAnnouncementStatusAction}>
                            <input
                              type="hidden"
                              name="announcementId"
                              value={item.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value={
                                item.status === 'published'
                                  ? 'draft'
                                  : 'published'
                              }
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-2.5 gap-1"
                            >
                              {item.status === 'published' ? (
                                <>
                                  <EyeOff className="w-3 h-3" /> Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" /> Publish
                                </>
                              )}
                            </Button>
                          </form>

                          <DeleteConfirmButton
                            itemId={item.id}
                            itemName={item.title}
                            itemType="announcement"
                            onDelete={deleteAnnouncementAction}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Create New Announcement */}
        <div className="lg:col-span-5">
          <Card className="border-gray-200 shadow-xs sticky top-24">
            <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-800" />
                Post New Announcement
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Broadcast official notices to the school homepage, news bulletin, and student portal dashboard.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <CreateAnnouncementForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
