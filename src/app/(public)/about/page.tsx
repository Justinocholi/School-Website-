import React from 'react';
import { Metadata } from 'next';
import { Target, Compass, Award, Heart, CheckCircle2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'About Our School',
  description: 'Learn about Greenfield International College, our heritage, educational mission, vision, and school leadership.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Integrity',
      desc: 'Doing the right thing consistently, fostering honesty, fairness, and ethical accountability in every interaction.',
    },
    {
      title: 'Excellence',
      desc: 'Relentless dedication to the highest standards of intellectual, artistic, and athletic performance.',
    },
    {
      title: 'Leadership',
      desc: 'Cultivating proactive initiative, service-minded mentorship, and visionary problem-solving skills.',
    },
    {
      title: 'Empathy & Inclusivity',
      desc: 'Celebrating diversity, respecting every voice, and fostering a collaborative, compassionate community.',
    },
  ];

  const leaders = [
    {
      name: 'Dr. (Mrs.) Victoria Adebayo',
      role: 'Principal & Head of School',
      bio: 'Ph.D. in Educational Leadership with over 22 years of visionary experience guiding premier secondary institutions across West Africa.',
    },
    {
      name: 'Mr. Emmanuel Okon',
      role: 'Vice Principal (Academics)',
      bio: 'Master of Science in Curriculum Design, championing STEM integration, faculty development, and international examination benchmarks.',
    },
    {
      name: 'Mrs. Fatima Danjuma',
      role: 'Vice Principal (Student Affairs)',
      bio: 'Specialist in adolescent psychology and pastoral care, ensuring student wellbeing, discipline, and vibrant co-curricular growth.',
    },
  ];

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="success" className="mb-3">
            About Greenfield College
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Nurturing Inquiring Minds, Building Noble Character
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Founded with a passion for holistic education, Greenfield International College has stood as a beacon of scholastic distinction, moral fortitude, and technological leadership for over two decades.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide a stimulating, safe, and world-class educational environment that empowers students of diverse backgrounds to achieve academic mastery, develop sound moral judgment, and become confident, compassionate global leaders.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-white">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the foremost learning institution in Africa recognized internationally for producing scholars of intellectual agility, uncompromising integrity, and transformational leadership.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* School Heritage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Heritage & Story</h2>
          <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>
              Greenfield International College was established with a singular vision: to create an institution where educational brilliance and ethical discipline walk hand in hand. What began with modest classrooms and a dedicated cadre of 12 pioneer educators has flourished into an ultra-modern campus catering to hundreds of aspiring leaders across Junior and Senior Secondary levels.
            </p>
            <p>
              Over the years, our alumni have matriculated into the world’s most prestigious universities and gone on to make meaningful contributions in medicine, software engineering, law, governance, and creative entrepreneurship. Our commitment to transparent, rigorous student assessment is reflected in our integrated Student Information Management System (SIMS), giving parents and scholars direct and secure access to verified academic records.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="info" className="mb-2">Guiding Principles</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {v.title}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="warning" className="mb-2">Administration</Badge>
            <h2 className="text-3xl font-bold text-gray-900">School Leadership</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader) => (
              <Card key={leader.name} className="border-gray-200">
                <CardContent className="p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl mb-4">
                    {leader.name[0]}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    {leader.role}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
