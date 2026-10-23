export type UserRole = 'student' | 'teacher' | 'administrator';
export type RecordStatus = 'active' | 'inactive' | 'archived' | 'graduated' | 'suspended';
export type ResultStatus = 'draft' | 'pending_review' | 'published' | 'correction_requested';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StaffRecord {
  id: string;
  email: string;
  display_name: string;
  role: 'administrator' | 'teacher';
  department?: string;
  assigned_subject?: string;
  assigned_class?: string;
  password?: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface ClassRecord {
  id: string;
  name: string;
  level: string;
  status: RecordStatus;
  created_at: string;
  student_count?: number;
}

export interface SubjectRecord {
  id: string;
  name: string;
  code: string;
  status: RecordStatus;
  created_at: string;
}

export interface ClassSubjectRecord {
  id: string;
  class_id: string;
  subject_id: string;
  created_at: string;
}

export interface StudentRecord {
  id: string;
  user_id?: string | null;
  student_id: string;
  first_name: string;
  last_name: string;
  other_names?: string | null;
  class_id?: string | null;
  admission_date?: string | null;
  status: RecordStatus;
  created_at: string;
  updated_at: string;
  class?: ClassRecord | null;
  profile?: Profile | null;
}

export interface AcademicSession {
  id: string;
  name: string;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TermRecord {
  id: string;
  academic_session_id: string;
  name: string;
  sequence_number: number;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  created_at: string;
  session?: AcademicSession | null;
}

export interface AssessmentComponent {
  id: string;
  name: string;
  code: string;
  maximum_score: number;
  sequence_number: number;
  is_active: boolean;
  created_at: string;
}

export interface GradingRule {
  grade: string;
  min_score: number;
  max_score: number;
  remark: string;
  gpa_point: number;
}

export interface GradingScale {
  id: string;
  name: string;
  version: number;
  is_active: boolean;
  rules: GradingRule[];
  created_at: string;
}

export interface ResultScore {
  id: string;
  result_id: string;
  assessment_component_id: string;
  score: number;
  component?: AssessmentComponent;
}

export interface ResultRecord {
  id: string;
  student_id: string;
  subject_id: string;
  term_id: string;
  class_id: string;
  status: ResultStatus;
  total_score: number;
  grade: string;
  remarks: string;
  created_by?: string | null;
  updated_by?: string | null;
  published_by?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  student?: StudentRecord;
  subject?: SubjectRecord;
  term?: TermRecord;
  class?: ClassRecord;
  scores?: ResultScore[];
}

export interface ImportJob {
  id: string;
  import_type: 'students' | 'results_subject' | 'results_class';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploaded_by?: string | null;
  file_name: string;
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  created_rows: number;
  updated_rows: number;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export interface ImportError {
  id: string;
  import_job_id: string;
  row_number: number;
  record_identifier?: string | null;
  error_code: string;
  error_message: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  target_audience: 'public' | 'students' | 'all';
  status: 'draft' | 'published';
  published_at?: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  change_summary?: Record<string, unknown> | null;
  created_at: string;
  actor_email?: string;
}

export interface SchoolSettings {
  id: string;
  school_name: string;
  school_motto: string;
  logo_url?: string | null;
  email: string;
  phone: string;
  address: string;
  current_session_id?: string | null;
  current_term_id?: string | null;
  default_grading_scale_id?: string | null;
  admissions_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdmissionsEnquiry {
  id: string;
  parent_name: string;
  student_name: string;
  email: string;
  phone: string;
  target_class: string;
  message?: string | null;
  status: 'pending' | 'reviewed' | 'contacted';
  created_at: string;
}
