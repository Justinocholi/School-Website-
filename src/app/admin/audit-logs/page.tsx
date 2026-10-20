import React from 'react';
import { Metadata } from 'next';
import { History, Shield, Filter, Clock } from 'lucide-react';
import { getAdminAuditLogs } from '@/lib/admin/admin-service';
import { getAuthenticatedStaff } from '@/app/actions/admin-auth';
import { AccessRestricted } from '@/components/admin/AccessRestricted';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Administrative Audit Logs',
  description: 'Immutable chronological audit record of administrative actions, imports, and result publications.',
};

export default async function AdminAuditLogsPage() {
  const staff = await getAuthenticatedStaff();
  if (staff?.role !== 'administrator') {
    return (
      <AccessRestricted
        title="Audit Log Restricted"
        description="Administrative audit logs are reserved for institutional governance and compliance by School Administrators."
      />
    );
  }

  const logs = await getAdminAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-emerald-800" />
          Administrative Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Chronological, tamper-evident tracking of all student registrations, mark corrections, bulk imports, and result publications.
        </p>
      </div>

      <Card className="border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-gray-600 uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor / User</th>
                <th className="py-3 px-4 font-semibold">Action Performed</th>
                <th className="py-3 px-4 font-semibold">Entity Type</th>
                <th className="py-3 px-4 font-semibold">Change Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(log.created_at).toLocaleString('en-GB')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {log.actor_email || 'admin@greenfieldcollege.edu'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 uppercase text-[11px]">
                    {log.entity_type}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-600 max-w-md truncate">
                    {JSON.stringify(log.change_summary)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
