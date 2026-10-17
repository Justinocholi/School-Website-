import React from 'react';
import { Metadata } from 'next';
import { Settings, ShieldCheck, Award, Sliders, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_GRADING_RULES } from '@/lib/grading/grading-engine';

export const metadata: Metadata = {
  title: 'School Settings & Grading Configuration',
  description: 'Configure institutional grading rules, assessment maximum marks, and school profile metadata.',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-800" />
          School & Grading Scale Configuration
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Adjust assessment component score weightings, score band boundaries, and institutional details.
        </p>
      </div>

      {/* Assessment Components Breakdown */}
      <Card className="border-gray-200 shadow-xs">
        <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-800" />
              Assessment Components Configuration
            </span>
            <Badge variant="success">Active Component Model</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-gray-700 block uppercase">Continuous Assessment (CA)</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-emerald-800">30</span>
                <span className="text-xs text-gray-500 font-medium">Maximum Marks (30%)</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Includes regular assignments, quizzes, midterm evaluations, and practical laboratory tests.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-gray-700 block uppercase">Terminal Examination</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-emerald-800">70</span>
                <span className="text-xs text-gray-500 font-medium">Maximum Marks (70%)</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                End-of-term standardized comprehensive examination.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grading Scale Table */}
      <Card className="border-gray-200 shadow-xs">
        <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Standard Institutional Grading Scale (Version 1)
            </span>
            <Badge variant="warning">Universal Scale</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-white text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Grade</th>
                  <th className="py-3 px-4 font-semibold">Score Range (%)</th>
                  <th className="py-3 px-4 font-semibold">Official Remark</th>
                  <th className="py-3 px-4 text-center font-semibold">GPA Point</th>
                  <th className="py-3 px-4 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {DEFAULT_GRADING_RULES.map((rule) => (
                  <tr key={rule.grade} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-base text-gray-900">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${
                        rule.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        rule.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        rule.grade === 'C' ? 'bg-amber-100 text-amber-800' :
                        rule.grade === 'F' ? 'bg-rose-100 text-rose-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                      {rule.min_score} – {rule.max_score}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {rule.remark}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-gray-900">
                      {rule.gpa_point.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* School Information Metadata */}
      <Card className="border-gray-200 shadow-xs">
        <CardHeader className="py-4 px-6 border-b border-gray-100 bg-slate-50">
          <CardTitle className="text-base font-bold">
            Institutional Profile & Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">School Legal Name</label>
              <Input defaultValue="Greenfield International College" readOnly className="bg-slate-50 font-medium" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Institutional Motto</label>
              <Input defaultValue="Knowledge, Integrity, and Excellence" readOnly className="bg-slate-50 font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Official Contact Email</label>
              <Input defaultValue="info@greenfieldcollege.edu" readOnly className="bg-slate-50 font-medium" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Official Telephone Line</label>
              <Input defaultValue="+234 (0) 803 123 4567" readOnly className="bg-slate-50 font-medium" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
