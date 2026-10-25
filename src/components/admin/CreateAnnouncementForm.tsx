'use client';

import React, { useActionState } from 'react';
import { createAnnouncementAction } from '@/app/actions/admin-academics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';

export function CreateAnnouncementForm() {
  const [state, formAction, isPending] = useActionState(
    createAnnouncementAction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Announcement Published' : 'Validation Error'}
        >
          {state.message}
        </Alert>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Announcement Title <span className="text-rose-500">*</span>
        </label>
        <Input
          name="title"
          placeholder="e.g. Second Term Resumption & Examination Timetable"
          required
          className="text-xs font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            name="category"
            defaultValue="Announcements"
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="Announcements">Announcements</option>
            <option value="Academic">Academic</option>
            <option value="Admissions">Admissions</option>
            <option value="Events">Events</option>
            <option value="Achievements">Achievements</option>
            <option value="Examinations">Examinations</option>
            <option value="Sports">Sports</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Visibility / Target Audience <span className="text-rose-500">*</span>
          </label>
          <select
            name="target_audience"
            defaultValue="all"
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">
              Everyone (School Website & Student Portal)
            </option>
            <option value="students">
              Students Only (Student Portal Dashboard)
            </option>
            <option value="public">
              Public Website Only (Homepage & News Page)
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Short Summary (Shown on Cards & Dashboard){' '}
          <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="summary"
          rows={2}
          required
          placeholder="Concise 1-2 sentence summary displayed on the homepage and student dashboard..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Full Announcement Body <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="body"
          rows={5}
          required
          placeholder="Write the full official announcement details here. Use blank lines to separate paragraphs..."
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      <input type="hidden" name="status" value="published" />

      <Button
        type="submit"
        isLoading={isPending}
        className="w-full justify-center bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs h-10"
      >
        <Megaphone className="w-4 h-4 mr-1.5 text-amber-400" />
        Publish Official Announcement
      </Button>
    </form>
  );
}
