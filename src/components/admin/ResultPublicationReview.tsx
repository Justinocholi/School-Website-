'use client';

import React, { useState } from 'react';
import { ResultRecord } from '@/types/database.types';
import { publishResultsAction } from '@/app/actions/admin-results';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export function ResultPublicationReview({
  pendingResults,
}: {
  pendingResults: ResultRecord[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    pendingResults.map((r) => r.id)
  );
  const [auditReason, setAuditReason] = useState<string>(
    'Final academic board approval and verification'
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingResults.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingResults.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    if (selectedIds.length === 0) return;
    setIsPublishing(true);
    setFeedback(null);
    try {
      const res = await publishResultsAction(selectedIds, auditReason);
      setFeedback(res);
    } catch (err: unknown) {
      setFeedback({
        success: false,
        message: err instanceof Error ? err.message : 'Publication failed',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <Alert
          variant={feedback.success ? 'success' : 'destructive'}
          title={feedback.success ? 'Publication Successful' : 'Action Failed'}
        >
          {feedback.message}
        </Alert>
      )}

      {pendingResults.length === 0 ? (
        <Card className="border-gray-200 p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Pending Results Awaiting Approval</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            All submitted student scores have either been published to the student portal or no new draft results were imported.
          </p>
        </Card>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.length === pendingResults.length && pendingResults.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-700">
                {selectedIds.length} of {pendingResults.length} Selected for Publication
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                placeholder="Audit publication justification..."
                className="h-9 px-3 rounded-lg border border-gray-300 text-xs text-gray-800 w-full sm:w-64"
              />
              <Button
                onClick={handlePublish}
                disabled={selectedIds.length === 0 || isPublishing}
                isLoading={isPublishing}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Publish Selected ({selectedIds.length})
              </Button>
            </div>
          </div>

          {/* Pending Review Table */}
          <Card className="border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-gray-600 uppercase border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3 w-8"></th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {pendingResults.map((r) => {
                    const isChecked = selectedIds.includes(r.id);
                    return (
                      <tr key={r.id} className={isChecked ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectOne(r.id)}
                            className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                          {r.student?.student_id || r.student_id}
                        </td>
                        <td className="py-2.5 px-3 text-gray-900">
                          {r.student?.first_name} {r.student?.last_name}
                        </td>
                        <td className="py-2.5 px-3">
                          {r.subject?.name} ({r.subject?.code})
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">
                          {r.class?.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-800">
                          {r.total_score}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant={r.grade === 'A' ? 'success' : r.grade === 'B' ? 'info' : 'warning'} className="text-[10px]">
                            {r.grade}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant={r.status === 'published' ? 'success' : 'warning'} className="text-[10px]">
                            {r.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
