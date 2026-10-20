import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AccessRestrictedProps {
  title?: string;
  description?: string;
}

export function AccessRestricted({
  title = 'Administrator Privilege Required',
  description = 'This section is restricted to School Administrators. Academic Staff accounts are focused on recording continuous assessment marks, managing student rosters, and submitting terminal examination scores for administrative approval.',
}: AccessRestrictedProps) {
  return (
    <Card className="max-w-xl mx-auto my-12 border-amber-200 bg-amber-50/50 shadow-sm text-center">
      <CardContent className="p-8 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        <div className="pt-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Staff Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
