# Greenfield College — Integrated School Website & Student Result Management System

A production-grade, responsive school web portal integrated with a Student Information Management System (SIMS) and online result-checking engine. Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL with Row Level Security (RLS), and SheetJS.

---

## 🌟 Key Functional Areas

### 1. Public School Website
- **Home (`/`)**: Hero section, admissions call to actions, key institutional statistics, core pillars, latest news bulletin, and quick result-checker banner.
- **About (`/about`)**: School heritage, mission, vision, core values, and executive leadership profiles.
- **Academics (`/academics`)**: Junior Secondary (JSS 1–3) and Senior Secondary (SS 1–3) course offerings, departmental subject pathways (Sciences, Arts, Commercial), and 100-point evaluation system.
- **Admissions (`/admissions`)**: Admissions procedures, required documentation, frequently asked questions, and interactive admissions enquiry form with server-side validation.
- **News & Bulletins (`/news`, `/news/[slug]`)**: School notices, events, and dynamic announcements.
- **Contact (`/contact`)**: Campus address, interactive message form, telephone lines, and office hours.
- **Student Login (`/student-login`)**: Unique Student ID (e.g. `GFS001`) portal authentication.

### 2. Student Portal (`/student`)
- **Dashboard (`/student`)**: Active session indicator, current class, published results overview, and internal school notices.
- **Terminal Results (`/student/results`)**: Session and term selector, breakdown of Continuous Assessment (CA / 30) and Examination (Exam / 70), computed letter grades (A–F), GPA, and remarks.
- **Printable Report Card**: Pixel-perfect browser print/save PDF report card (`@media print`) featuring institutional letterhead, motto, grading key, and tutor/principal signature blocks.
- **Subject Result Details (`/student/results/[resultId]`)**: Detailed score component audit with server-enforced cross-student access prevention.
- **Student Profile (`/student/profile`)**: Official student ID, assigned class, admission date, and account status.
- **Account & Security (`/student/account`)**: Secure password update workflow prohibiting students from using their first name as a password.

### 3. Administrator & Staff Dashboard (`/admin`)
- **Executive Overview (`/admin`)**: Real-time counters for active students, classes, subjects, pending review results, published results, recent imports, and audit log stream.
- **Student Management (`/admin/students`, `/admin/students/new`)**: Search by ID or name, filter by class and status, single student registration, and credential management.
- **Class Management (`/admin/classes`)**: Class levels (JSS 1 through SS 3), student counts, and class creation.
- **Subject Management (`/admin/subjects`)**: Subject codes (e.g. `MTH`, `ENG`, `PHY`) and course catalog.
- **Academic Calendar (`/admin/academic-sessions`)**: Session creation (e.g. `2026/2027`), terms configuration, and active evaluation period switching with historical record retention.
- **Academic Results (`/admin/results`, `/admin/results/entry`)**: Manual score entry with real-time grade calculations, filterable results overview.
- **Result Review & Publication (`/admin/results/review`)**: Multi-record approval workflow, audit reason requirement, and publication to the Student Portal.
- **Audit Logs (`/admin/audit-logs`)**: Immutable tracking of student creation, mark updates, bulk imports, and result publications.
- **Grading & Settings (`/admin/settings`)**: Configurable 100-point grading scales, component score weights, and institutional profile metadata.

### 4. Bulk Spreadsheet Import Engine
- **Downloadable Templates**: Pre-formatted Excel (`.xlsx`) templates for student roster and subject marks with pre-filled student rosters (`/api/templates/students`, `/api/templates/results`).
- **Validation Engine**: Server-side validation of file format, headers, required fields, class matching, duplicate student IDs, and score bounds (CA 0–30, Exam 0–70).
- **Interactive Preview**: Live validation preview displaying valid records and row-by-row error diagnostics.
- **Import Modes**: "Create New Only" versus "Update Existing Records".

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js 20.x or 22.x
- npm or pnpm

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SCHOOL_NAME="Greenfield International College"
NEXT_PUBLIC_SCHOOL_PHONE="+234 (0) 803 123 4567"
NEXT_PUBLIC_SCHOOL_EMAIL="info@greenfieldcollege.edu"
```

> **Note on Local Evaluation**: If running without an external Supabase instance, the application operates with its built-in fallback data provider and pre-seeded test records so you can test all features immediately.

### 3. Database Migration & Seeding
In your Supabase project SQL Editor or via Supabase CLI, run the scripts in order:
1. `supabase/migrations/20261017000000_initial_schema.sql` (Creates tables, triggers, indexes, and Row Level Security policies)
2. `supabase/seed.sql` (Seeds academic sessions, classes, subjects, grading rules, and sample announcements)

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Run the test suite covering grading logic, spreadsheet validation, and security access boundaries:
```bash
npm test
```
The automated test suite verifies:
- **Grading Engine (`grading-engine.test.ts`)**: Score boundaries, letter grades (A–F), custom scales, score summing, and GPA calculations.
- **Cross-Student Access Control (`student-access-control.test.ts`)**: Prevents cross-student data leakage and blocks access to unauthorized or unpublished results.
- **Bulk Import Engine (`import-service.test.ts`)**: Spreadsheet header validation, duplicate ID detection within files, score bounds (CA max 30, Exam max 70), and template generation.

---

## 🔐 Creating the First Administrator Securely

To provision the initial administrator account:
1. In the Supabase Dashboard, go to **Authentication -> Users** and create an administrative user (e.g. `admin@greenfieldcollege.edu`).
2. Run the following SQL query in the Supabase SQL Editor to assign the administrator role:
```sql
INSERT INTO public.profiles (id, role, display_name, email)
VALUES (
    'USER_UUID_FROM_AUTH_USERS',
    'administrator',
    'School Administrator',
    'admin@greenfieldcollege.edu'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'administrator';
```
3. The administrator can now access the staff portal at `/admin`.

---

## 🔑 Demo Evaluation Credentials

| Portal | Identifier | Password | Role |
|---|---|---|---|
| **Student Portal** (`/student-login`) | `GFS001` | `Student@2026` | Student (Daniel Okafor, JSS 2A) |
| **Student Portal** (`/student-login`) | `GFS002` | `Student@2026` | Student (Sarah Adamu, JSS 2A) |
| **Staff Dashboard** (`/admin`) | Direct Access | System Authenticated | School Administrator |

---

## 📦 Production Build & Verification

To verify the production build:
```bash
npm run build
npm run start
```
All routes support Partial Prerendering and dynamic on-demand server rendering where appropriate.
