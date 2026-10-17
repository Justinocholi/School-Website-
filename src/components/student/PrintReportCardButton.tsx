'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintReportCardButton({ label = 'Print / Save Report Card (PDF)' }: { label?: string }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      onClick={handlePrint}
      variant="primary"
      size="md"
      className="gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold print:hidden shadow-sm"
    >
      <Printer className="w-4 h-4 text-amber-400" />
      <span>{label}</span>
    </Button>
  );
}
