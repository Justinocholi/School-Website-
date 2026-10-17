import React from 'react';
import { Metadata } from 'next';
import { BookOpen, Layers, Check, FileText, Award, FlaskConical, Calculator, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Academics & Curriculum',
  description: 'Explore the class levels, academic subjects, grading system, and curriculum at Greenfield International College.',
};

export default function AcademicsPage() {
  const levels = [
    {
      level: 'Junior Secondary School (JSS 1 – JSS 3)',
      desc: 'Building foundational competence across broad sciences, humanities, languages, and technical skills.',
      subjects: [
        'English Language',
        'Mathematics',
        'Basic Science & Technology',
        'Civic Education',
        'Social Studies',
        'Information & Communication Tech (ICT)',
        'Agricultural Science',
        'Business Studies',
        'Cultural & Creative Arts',
        'French',
      ],
      qualification: 'Basic Education Certificate Examination (BECE)',
    },
    {
      level: 'Senior Secondary School (SS 1 – SS 3)',
      desc: 'Specialized subject pathways preparing students for tertiary institutions, competitive college entrance, and professional careers.',
      pathways: [
        {
          name: 'Science & STEM Pathway',
          subjects: ['Mathematics & Further Maths', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Technical Drawing', 'Computer Studies'],
        },
        {
          name: 'Arts & Humanities Pathway',
          subjects: ['English Language & Literature', 'General Mathematics', 'Government', 'History', 'CRS / IRS', 'Civic Education', 'Economics'],
        },
        {
          name: 'Commercial & Business Pathway',
          subjects: ['Financial Accounting', 'Commerce', 'Economics', 'Marketing', 'Mathematics', 'English Language', 'Civic Education'],
        },
      ],
      qualification: 'West African Senior School Certificate (WASSCE) & NECO SSCE',
    },
  ];

  const assessmentModel = [
    { component: 'Continuous Assessment (CA)', weight: '30%', desc: 'Comprises weekly quizzes, project-based assignments, midterm assessments, and laboratory practicals.' },
    { component: 'Terminal Examination', weight: '70%', desc: 'Comprehensive end-of-term standardized evaluation testing mastery of curriculum topics.' },
    { component: 'Total Term Score', weight: '100%', desc: 'Combined aggregate score evaluated against our verified institutional grading scale (A to F).' },
  ];

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="success" className="mb-3">
            Academic Excellence
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Comprehensive Curriculum & Academic Rigour
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Our curriculum blends the Nigerian National Curriculum with international best practices to nurture analytical thinkers, creative innovators, and ethical problem solvers.
          </p>
        </div>

        {/* Assessment & Grading Standards Overview */}
        <div className="bg-emerald-950 text-white rounded-2xl p-8 lg:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Evaluation Standards
              </span>
              <h2 className="text-2xl font-bold mt-1">Assessment & Grading System</h2>
            </div>
            <Badge variant="warning" className="w-fit">Standard 100-Point Grading Scale</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessmentModel.map((item) => (
              <div key={item.component} className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-5 space-y-2">
                <div className="text-amber-400 font-extrabold text-2xl">{item.weight}</div>
                <div className="font-semibold text-white">{item.component}</div>
                <p className="text-xs text-emerald-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Levels */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Academic Stages & Subject Offerings</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              A structured progression designed to discover each student’s unique talents and build discipline.
            </p>
          </div>

          <div className="space-y-8">
            {/* JSS */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl text-emerald-900">{levels[0].level}</CardTitle>
                  <Badge variant="info">Target: {levels[0].qualification}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{levels[0].desc}</p>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Core Subjects</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {levels[0].subjects?.map((sub) => (
                    <div key={sub} className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{sub}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SSS */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl text-emerald-900">{levels[1].level}</CardTitle>
                  <Badge variant="success">Target: {levels[1].qualification}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{levels[1].desc}</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Departmental Subject Pathways</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {levels[1].pathways?.map((path) => (
                    <div key={path.name} className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
                      <div className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
                        {path.name}
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {path.subjects.map((s) => (
                          <li key={s} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
