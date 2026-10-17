import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const announcements = [
    {
      id: '1',
      title: 'First Term 2026/2027 Resumption & Academic Calendar',
      date: 'Sep 7, 2026',
      category: 'Academic',
      summary: 'Academic activities for the new academic session have commenced. All students must have completed their registration.',
      slug: 'resumption-date-2026-2027',
    },
    {
      id: '2',
      title: 'Admissions Open for JSS 1 and Senior Secondary Transfers',
      date: 'Aug 28, 2026',
      category: 'Admissions',
      summary: 'Applications are now being received for prospective scholars into Junior and Senior Secondary classes.',
      slug: 'admissions-open-2026-2027',
    },
    {
      id: '3',
      title: 'Annual Science Fair & Robotics Exhibition Announced',
      date: 'Aug 15, 2026',
      category: 'Events',
      summary: 'Students across all levels will showcase their STEM inventions and scientific inquiry projects.',
      slug: 'annual-science-fair-robotics-exhibition',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs sm:text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>2026/2027 Academic Session Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Empowering Minds, <br />
              <span className="text-amber-400">Inspiring Excellence</span> & Integrity.
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
              Welcome to Greenfield International College. We combine rigorous academic standards, cutting-edge STEM education, and strong character development to prepare leaders for the future.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link href="/student-login">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold shadow-lg shadow-amber-500/20">
                  <Search className="w-5 h-5 mr-1" />
                  Check Student Results
                </Button>
              </Link>
              <Link href="/admissions">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Admissions Enquiry
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="ghost" className="text-emerald-200 hover:text-white hover:bg-white/5">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Result Checker Box Floating Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Student Academic Results Portal</h3>
                <p className="text-sm text-emerald-200">
                  Published term assessment scores and official terminal report cards are securely available.
                </p>
              </div>
            </div>
            <Link href="/student-login" className="w-full md:w-auto">
              <Button size="md" className="w-full md:w-auto bg-white text-emerald-900 hover:bg-emerald-50 font-semibold">
                Sign In With Student ID
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-gray-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800">100%</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">WAEC & BECE Pass Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-gray-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800">15 : 1</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Student-Teacher Ratio</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-gray-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800">40+</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Experienced Faculty</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-gray-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800">25+</div>
              <div className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Years of Academic Heritage</div>
            </div>
          </div>
        </div>
      </section>

      {/* School Highlights / Pillars */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="success" className="mb-3">
              Why Choose Greenfield
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              A Complete Foundation for Lifelong Success
            </h2>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Our educational philosophy combines intellectual rigor, moral values, technological literacy, and physical wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Rigorous Curriculum</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Carefully balanced National and International curriculums that foster deep understanding and analytical reasoning.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">STEM & Innovation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Equipped science laboratories, robotics clubs, and modern computing suites for hands-on experimentations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Moral Character</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Instilling empathy, discipline, leadership, and ethical integrity as pillars of every scholar’s character.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Nurturing Community</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Supportive mentorship, dedicated guidance counselors, and vibrant co-curricular activities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured News & Announcements */}
      <section className="py-16 lg:py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="warning" className="mb-2">
                Updates & Notices
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Latest News & Announcements
              </h2>
            </div>
            <Link href="/news">
              <Button variant="outline" size="sm" className="gap-1 font-semibold">
                View All News <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <Card key={item.id} className="flex flex-col justify-between hover:border-emerald-300 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <Badge variant="info">{item.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Link href={`/news/${item.slug}`} className="text-emerald-700 hover:text-emerald-800 text-sm font-semibold inline-flex items-center gap-1">
                    Read Announcement <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Begin Your Journey at Greenfield?
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
            Discover our supportive community, outstanding facilities, and academic excellence. Applications for the 2026/2027 academic session are currently in progress.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/admissions">
              <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold">
                Apply for Admission
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Book a Campus Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
