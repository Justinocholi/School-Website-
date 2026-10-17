import { NextResponse } from 'next/server';
import { generateStudentTemplate } from '@/lib/import/import-service';

export async function GET() {
  const buffer = generateStudentTemplate();

  return new Response(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Disposition': 'attachment; filename="greenfield_students_template.xlsx"',
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
}
