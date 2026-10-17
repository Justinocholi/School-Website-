import { NextResponse } from 'next/server';
import { generateSubjectResultTemplate } from '@/lib/import/import-service';
import { getAdminStudents } from '@/lib/admin/admin-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectCode = searchParams.get('subject') || 'MTH';

  const students = await getAdminStudents();
  const studentRows = students.map((s) => ({
    student_id: s.student_id,
    full_name: `${s.first_name} ${s.last_name}`,
  }));

  const buffer = generateSubjectResultTemplate(subjectCode, studentRows);

  return new Response(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename="${subjectCode}_Marks_Template.xlsx"`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });
}
