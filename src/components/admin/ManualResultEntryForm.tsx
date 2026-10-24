'use client';

import React, { useState, useActionState } from 'react';
import { saveSingleResultAction } from '@/app/actions/admin-results';
import {
  StudentRecord,
  ClassRecord,
  SubjectRecord,
  TermRecord,
} from '@/types/database.types';
import {
  evaluateGrade,
  calculateTotalScore,
} from '@/lib/grading/grading-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PenTool } from 'lucide-react';

interface ManualResultEntryFormProps {
  students: StudentRecord[];
  classes: ClassRecord[];
  subjects: SubjectRecord[];
  terms: TermRecord[];
  userRole?: 'administrator' | 'teacher';
  assignedClass?: string;
}

export function ManualResultEntryForm({
  students,
  classes,
  subjects,
  terms,
  userRole = 'administrator',
  assignedClass,
}: ManualResultEntryFormProps) {
  const isTeacher = userRole === 'teacher';
  const [state, formAction, isPending] = useActionState(
    saveSingleResultAction,
    null
  );

  // If teacher has assigned class, filter students strictly to their class
  const teacherClassObj = assignedClass
    ? classes.find(
        (c) => c.name.toLowerCase() === assignedClass.toLowerCase()
      ) || classes[0]
    : undefined;

  const scopedStudents = assignedClass
    ? students.filter(
        (s) =>
          s.class?.name?.toLowerCase() === assignedClass.toLowerCase() ||
          s.class_id === teacherClassObj?.id
      )
    : students;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    scopedStudents[0]?.student_id || ''
  );
  const [selectedClassId, setSelectedClassId] = useState<string>(
    scopedStudents[0]?.class_id ||
      scopedStudents[0]?.class?.id ||
      classes[0]?.id ||
      ''
  );
  const [caScore, setCaScore] = useState<number>(25);
  const [examScore, setExamScore] = useState<number>(60);

  const handleStudentChange = (newStudentId: string) => {
    setSelectedStudentId(newStudentId);
    const matchedStudent = scopedStudents.find(
      (s) => s.student_id === newStudentId || s.id === newStudentId
    );
    if (matchedStudent) {
      const studentClassId =
        matchedStudent.class_id || matchedStudent.class?.id;
      if (studentClassId) {
        setSelectedClassId(studentClassId);
      }
    }
  };

  const total = calculateTotalScore([caScore, examScore]);
  const gradeEval = evaluateGrade(total);

  return (
    <form action={formAction} className="space-y-6">
      {assignedClass && isTeacher && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <span className="font-bold">Form Teacher Scope:</span>
            <span>
              Recording marks solely for students in{' '}
              <strong className="text-emerald-900">{assignedClass}</strong>.
            </span>
          </div>
          <Badge variant="info" className="text-[10px]">
            Class Locked
          </Badge>
        </div>
      )}

      {state && (
        <Alert
          variant={state.success ? 'success' : 'destructive'}
          title={state.success ? 'Result Saved' : 'Validation Error'}
        >
          {state.message}
        </Alert>
      )}

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Student {assignedClass ? `(${assignedClass})` : ''}{' '}
            <span className="text-rose-500">*</span>
          </label>
          <select
            name="student_id"
            required
            value={selectedStudentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
          >
            {scopedStudents.length === 0 ? (
              <option value="">
                No scholars enrolled in {assignedClass || 'this class'}
              </option>
            ) : (
              scopedStudents.map((s) => (
                <option key={s.id} value={s.student_id}>
                  {s.student_id} - {s.first_name} {s.last_name} (
                  {s.class?.name || assignedClass || 'Class'})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Academic Subject <span className="text-rose-500">*</span>
          </label>
          <select
            name="subject_id"
            required
            defaultValue={subjects[0]?.id || ''}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} ({sub.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Class Allocated <span className="text-rose-500">*</span>
          </label>
          {isTeacher && assignedClass && teacherClassObj ? (
            <div>
              <input type="hidden" name="class_id" value={teacherClassObj.id} />
              <div className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-slate-100 px-3 py-2 text-xs font-bold text-gray-700">
                <span>
                  {assignedClass} ({teacherClassObj.level})
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Your Form Class
                </Badge>
              </div>
            </div>
          ) : (
            <select
              name="class_id"
              required
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Academic Term <span className="text-rose-500">*</span>
          </label>
          <select
            name="term_id"
            required
            defaultValue={
              terms.find((t) => t.is_active)?.id || terms[0]?.id || ''
            }
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
          >
            {terms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} {t.is_active ? '— (Current Active Term)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks & Live Calculation Strip */}
      <div className="p-5 rounded-xl border border-gray-200 bg-slate-50 space-y-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Score Components & Live Assessment Grading
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Continuous Assessment (Max: 30){' '}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              name="ca_score"
              type="number"
              step="0.5"
              min="0"
              max="30"
              required
              value={caScore}
              onChange={(e) => setCaScore(parseFloat(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Examination Score (Max: 70){' '}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              name="exam_score"
              type="number"
              step="0.5"
              min="0"
              max="70"
              required
              value={examScore}
              onChange={(e) => setExamScore(parseFloat(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        {/* Live Evaluation Preview */}
        <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-medium">
            <div>
              <span className="text-gray-500 block">Total Score:</span>
              <span className="text-xl font-bold font-mono text-emerald-800">
                {total} / 100
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Computed Grade:</span>
              <Badge
                variant={
                  gradeEval.grade === 'A'
                    ? 'success'
                    : gradeEval.grade === 'B'
                      ? 'info'
                      : 'warning'
                }
                className="text-sm font-bold"
              >
                {gradeEval.grade}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500 block">Remark:</span>
              <span className="font-semibold text-gray-900">
                {gradeEval.remark}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-700">
              Workflow Status:
            </label>
            <select
              name="status"
              defaultValue={isTeacher ? 'pending_review' : 'published'}
              className="h-9 rounded-md border border-gray-300 bg-white px-2.5 text-xs font-semibold text-emerald-800"
            >
              {!isTeacher && (
                <option value="published">
                  Publish Immediately (Visible to Student)
                </option>
              )}
              <option value="pending_review">
                Submit for Review (Pending Admin Approval)
              </option>
              <option value="draft">Save as Draft (Private)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isPending}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs"
        >
          <PenTool className="w-3.5 h-3.5 mr-1.5" />
          Save Student Result
        </Button>
      </div>
    </form>
  );
}
