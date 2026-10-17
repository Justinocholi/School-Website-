'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Loader2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import {
  uploadAndValidateStudentFile,
  executeStudentImportAction,
} from '@/app/actions/admin-import';
import type {
  StudentImportRow,
  RowValidationError,
} from '@/lib/import/import-service';

export function BulkStudentImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'create_only' | 'update_existing'>('create_only');
  const [isParsing, setIsParsing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

  const [previewData, setPreviewData] = useState<{
    valid: StudentImportRow[];
    errors: RowValidationError[];
    summary: { total: number; validCount: number; errorCount: number };
  } | null>(null);

  const [resultSummary, setResultSummary] = useState<{
    created: number;
    updated: number;
    failed: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewData(null);
      setResultSummary(null);
    }
  };

  const handleValidate = async () => {
    if (!file) return;
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const validation = await uploadAndValidateStudentFile(formData, mode);
      setPreviewData(validation);
    } catch (err: unknown) {
      alert(`Error parsing file: ${err instanceof Error ? err.message : 'Invalid file format'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommit = async () => {
    if (!previewData || previewData.valid.length === 0) return;
    setIsCommitting(true);
    try {
      const res = await executeStudentImportAction(previewData.valid, mode);
      setResultSummary(res);
    } catch (err: unknown) {
      alert(`Import error: ${err instanceof Error ? err.message : 'Transaction failed'}`);
    } finally {
      setIsCommitting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewData(null);
    setResultSummary(null);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Download Template */}
      <Card className="border-gray-200">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">1. Download Official Spreadsheet Template</h3>
              <p className="text-xs text-gray-500">
                Pre-formatted headers: student_id, first_name, last_name, other_names, class_name, admission_date.
              </p>
            </div>
          </div>
          <a href="/api/templates/students" download>
            <Button size="sm" variant="outline" className="text-xs gap-1.5 shrink-0">
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              Download Excel Template (.xlsx)
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Step 2: Upload and Mode Configuration */}
      {!resultSummary && (
        <Card className="border-gray-200">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">2. Upload Student Spreadsheet</h3>
                <p className="text-xs text-gray-500">
                  Select your completed .xlsx or .csv student roster file.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Spreadsheet File (.xlsx, .csv)
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Import Mode
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('create_only')}
                    className={`flex-1 py-2 px-3 text-xs rounded-lg border font-semibold transition-colors ${
                      mode === 'create_only'
                        ? 'bg-emerald-800 text-white border-emerald-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Create New Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('update_existing')}
                    className={`flex-1 py-2 px-3 text-xs rounded-lg border font-semibold transition-colors ${
                      mode === 'update_existing'
                        ? 'bg-emerald-800 text-white border-emerald-900'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Update Existing Records
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleValidate}
                disabled={!file || isParsing}
                isLoading={isParsing}
                className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
              >
                Validate Spreadsheet Records
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Validation Preview */}
      {previewData && !resultSummary && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">3. Validation & Ingestion Preview</h3>
              <p className="text-xs text-gray-500">
                Review verified rows and any detected data inconsistencies before committing to the database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">
                {previewData.summary.validCount} Valid Records
              </Badge>
              {previewData.summary.errorCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {previewData.summary.errorCount} Errors Flagged
                </Badge>
              )}
            </div>
          </div>

          {/* Error Report if any */}
          {previewData.errors.length > 0 && (
            <Alert variant="destructive" title="Row Inconsistencies Detected">
              <div className="space-y-1 mt-1 text-xs">
                {previewData.errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="font-mono font-bold">Row {err.row} ({err.identifier}):</span>
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            </Alert>
          )}

          {/* Valid Records Preview Table */}
          {previewData.valid.length > 0 && (
            <Card className="border-gray-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-700">
                Records Ready for Ingestion ({previewData.valid.length})
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-white sticky top-0 border-b border-gray-200 text-gray-500 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Student ID</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.valid.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{r.student_id}</td>
                        <td className="py-2 px-3">{r.first_name} {r.last_name}</td>
                        <td className="py-2 px-3">{r.class_name}</td>
                        <td className="py-2 px-3">
                          <Badge variant="success" className="text-[10px]">{r.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="pt-2 flex items-center gap-3">
            <Button
              onClick={handleCommit}
              disabled={previewData.valid.length === 0 || isCommitting}
              isLoading={isCommitting}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Commit Import ({previewData.valid.length} Valid Records)
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
              Cancel & Upload New File
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Import Complete Summary */}
      {resultSummary && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950">Bulk Student Import Complete</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              The student records have been written to the database with corresponding audit logs.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-2 text-center">
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-xs text-gray-500 block">Created</span>
                <span className="text-xl font-bold text-emerald-800">{resultSummary.created}</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-xs text-gray-500 block">Updated</span>
                <span className="text-xl font-bold text-blue-800">{resultSummary.updated}</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <span className="text-xs text-gray-500 block">Failed</span>
                <span className="text-xl font-bold text-rose-800">{resultSummary.failed}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link href="/admin/students">
                <Button size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs">
                  View Student Roster
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={handleReset} className="text-xs">
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
