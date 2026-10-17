import React from 'react';
import { Metadata } from 'next';
import { CheckCircle2, FileCheck, Calendar, HelpCircle, PhoneCall, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdmissionsForm } from '@/components/public/AdmissionsForm';

export const metadata: Metadata = {
  title: 'Admissions & Enrolment',
  description: 'Learn about the admissions process, entry requirements, scholarship opportunities, and submit an online admissions enquiry.',
};

export default function AdmissionsPage() {
  const steps = [
    {
      step: '01',
      title: 'Submit Online Enquiry or Application',
      desc: 'Complete the enquiry form below or purchase an application dossier at the school administrative desk.',
    },
    {
      step: '02',
      title: 'Entrance Examination',
      desc: 'Candidates undertake a diagnostic entrance assessment testing core Mathematics, English, and General Aptitude.',
    },
    {
      step: '03',
      title: 'Interactive Student & Parent Interview',
      desc: 'A friendly interview with our pastoral care and academic panel to assess learning alignment and interests.',
    },
    {
      step: '04',
      title: 'Offer of Provisional Admission',
      desc: 'Successful candidates receive an official admission letter with registration guidelines and orientation dates.',
    },
  ];

  const faqs = [
    {
      q: 'When does the admission process begin?',
      a: 'Admissions for the upcoming academic session commence in February and remain open through August. Transfer admissions are processed on a rolling basis subject to vacancy.',
    },
    {
      q: 'Do you offer boarding facilities?',
      a: 'Yes, Greenfield College offers state-of-the-art boarding hostels with 24/7 security, dedicated housemasters, and structured prep periods.',
    },
    {
      q: 'How are terminal results accessed after enrolment?',
      a: 'Every admitted student is assigned a unique Student ID (e.g., GFS001) that grants full access to our online Student Result Portal for checking published term report cards.',
    },
    {
      q: 'Are academic scholarships available?',
      a: 'Merit-based tuition scholarships are awarded to top-performing candidates in our annual national entrance examination.',
    },
  ];

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="warning" className="mb-3">
            2026/2027 Admissions Open
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Join Our Community of Achievers
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            We welcome ambitious scholars seeking an enriching educational environment. Follow our straightforward four-step admissions journey.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Admissions Procedure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-6 relative shadow-sm space-y-3">
                <span className="text-3xl font-black text-emerald-800/20 block">{s.step}</span>
                <h3 className="font-bold text-gray-900 text-base">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Form & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Submit an Admissions Enquiry</h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill out the form below to receive our full prospectus and entrance schedule.
              </p>
            </div>
            <AdmissionsForm />
          </div>

          {/* Requirements & Contact Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                  <FileCheck className="w-5 h-5 text-emerald-700" />
                  Documentation Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Recent passport photograph (2 copies)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Certified photocopy of Birth Certificate / National ID</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Previous school academic transcript or report sheet</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Medical fitness certificate & immunization records</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm">Need Direct Admissions Assistance?</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Our admissions officers are available Mondays through Fridays to answer questions or arrange private campus tours.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-900 space-y-1">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>+234 (0) 803 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>admissions@greenfieldcollege.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-900">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
                <h3 className="font-bold text-gray-900 text-base">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
