'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Send,
} from 'lucide-react';
import { ClassRecord, SubjectRecord, TermRecord } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import {
  uploadAndValidateResultFile,
  executeResultImportAction,
} from '@/app/actions/admin-import';
import type {
  SubjectResultImportRow,
  RowValidationError,
} from '@/lib/import/import-service';
import { evaluateGrade } from '@/lib/grading/grading-engine';

interface BulkResultImportClientProps {
  classes: ClassRecord[];
  subjects: SubjectRecord[];
  terms: TermRecord[];
}

export function BulkResultImportClient({
  classes,
  subjects,
  terms,
}: BulkResultImportClientProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<string>(terms[0]?.id || '');

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

  const [previewData, setPreviewData] = useState<{
    valid: SubjectResultImportRow[];
    errors: RowValidationError[];
    summary: { total: number; validCount: number; errorCount: number };
  } | null>(null);

  const [resultSummary, setResultSummary] = useState<{
    created: number;
    updated: number;
    failed: number;
  } | null>(null);

  const currentSubjectObj = subjects.find((s) => s.id === selectedSubject);

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
      const validation = await uploadAndValidateResultFile(formData, 30, 70);
      setPreviewData(validation);
    } catch (err: unknown) {
      alert(`Error parsing spreadsheet: ${err instanceof Error ? err.message : 'Invalid file'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommit = async (status: 'draft' | 'pending_review' | 'published') => {
    if (!previewData || previewData.valid.length === 0) return;
    setIsCommitting(true);
    try {
      const res = await executeResultImportAction(previewData.valid, {
        subjectId: selectedSubject,
        classId: selectedClass,
        termId: selectedTerm,
        status,
      });
      setResultSummary(res);
    } catch (err: unknown) {
      alert(`Import error: ${err instanceof Error ? err.message : 'Failed to save results'}`);
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
      {/* Scope Selectors */}
      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-900">1. Target Result Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-xs text-gray-900 font-medium"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-xs text-gray-900 font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Term Period</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-xs text-gray-900 font-medium"
              >
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (2026/2027)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Download template with enrolled students pre-filled for {currentSubjectObj?.name || 'Subject'}:
            </span>
            <a
              href={`/api/templates/results?subject=${currentSubjectObj?.code || 'MTH'}`}
              download
            >
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                Download Pre-filled Template (.xlsx)
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Upload & Validation */}
      {!resultSummary && (
        <Card className="border-gray-200">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">2. Upload Completed Marks File</h3>
                <p className="text-xs text-gray-500">
                  Spreadsheet columns: student_id, ca_score (0-30), exam_score (0-70).
                </p>
              </div>
            </div>

            <div className="pt-2">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            <Button
              onClick={handleValidate}
              disabled={!file || isParsing}
              isLoading={isParsing}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
            >
              Validate & Preview Marks
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {previewData && !resultSummary && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">3. Validated Marks Preview</h3>
              <p className="text-xs text-gray-500">
                Total scores and letter grades calculated automatically according to school grading configuration.
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

          {previewData.errors.length > 0 && (
            <Alert variant="destructive" title="Mark Discrepancies Detected">
              <div className="space-y-1 mt-1 text-xs">
                {previewData.errors.map((err, i) => (
                  <div key={i}>
                    <span className="font-mono font-bold">Row {err.row} ({err.identifier}):</span> {err.message}
                  </div>
                ))}
              </div>
            </Alert>
          )}

          {previewData.valid.length > 0 && (
            <Card className="border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 sticky top-0 text-gray-600 uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Student ID</th>
                      <th className="py-2.5 px-3 text-center">CA (30)</th>
                      <th className="py-2.5 px-3 text-center">Exam (70)</th>
                      <th className="py-2.5 px-3 text-center font-bold">Total (100)</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {previewData.valid.map((r, i) => {
                      const total = r.ca_score + r.exam_score;
                      const evalR = evaluateGrade(total);
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-bold text-emerald-800">{r.student_id}</td>
                          <td className="py-2 px-3 text-center font-mono">{r.ca_score}</td>
                          <td className="py-2 px-3 text-center font-mono">{r.exam_score}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-800">{total}</td>
                          <td className="py-2 px-3 text-center">
                            <Badge variant={evalR.grade === 'A' ? 'success' : evalR.grade === 'B' ? 'info' : 'warning'} className="text-[10px]">
                              {evalR.grade}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-gray-600 text-[11px]">{evalR.remark}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => handleCommit('pending_review')}
              disabled={previewData.valid.length === 0 || isCommitting}
              isLoading={isCommitting}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Save as Pending Review ({previewData.valid.length} Records)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCommit('draft')}
              disabled={previewData.valid.length === 0 || isCommitting}
              className="text-xs"
            >
              Save as Draft
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Completion */}
      {resultSummary && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950">Bulk Result Ingestion Successful</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              {resultSummary.created} subject result records saved and queued for publication approval.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <Link href="/admin/results/review">
                <Button size="sm" className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs">
                  Review & Publish Results
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={handleReset} className="text-xs">
                Import Another Subject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
