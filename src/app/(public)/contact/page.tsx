'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="success" className="mb-3">
            Get in Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Contact Greenfield College
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Have questions regarding admissions, academics, or our student result portal? Our administrative team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Opening Hours */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-gray-200">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Campus Information</h2>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Campus Address</p>
                      <p>15 Heritage Boulevard, Victoria Island, Lagos, Nigeria</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Telephone Lines</p>
                      <p>+234 (0) 803 123 4567</p>
                      <p>+234 (0) 802 987 6543</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Enquiries</p>
                      <p>info@greenfieldcollege.edu</p>
                      <p>admissions@greenfieldcollege.edu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Office Working Hours</p>
                      <p>Monday – Friday: 7:30 AM – 4:00 PM</p>
                      <p className="text-xs text-gray-500">Closed on weekends and public holidays.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-slate-900 text-white rounded-xl p-6 space-y-3">
              <h3 className="font-bold text-base text-amber-400">Student Result Checking Inquiries?</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                If you are a student or parent experiencing difficulty checking terminal results or accessing your Student ID credentials, please contact the IT / Records desk directly at records@greenfieldcollege.edu.
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Direct Message</h2>
              <p className="text-sm text-gray-600 mt-1">
                We will reply to your registered email address promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-900">Message Delivered</h3>
                <p className="text-sm text-emerald-700 max-w-md mx-auto">
                  Thank you for reaching out to Greenfield International College. A member of our administrative staff will respond shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input required placeholder="e.g. Dr. Ngozi Balogun" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <Input type="email" required placeholder="ngozi@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Subject / Reason for Contact <span className="text-rose-500">*</span>
                  </label>
                  <Input required placeholder="e.g. Campus Visit Schedule / Result Inquiries" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full justify-center bg-emerald-800 hover:bg-emerald-900 text-white font-semibold h-11"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
