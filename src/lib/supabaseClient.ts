import { createClient } from '@supabase/supabase-js';
import { Student, Course, Result, Fee, Application, Notice, ActivityLog, CourseRegistration } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== ''
  );
};

// Lazy initialization of Supabase client to prevent crash in unconfigured state
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const SUPABASE_SQL_SCHEMA = `-- PostgreSQL Schema for Crown Heritage College of Health
-- Paste this script directly in the Supabase SQL Editor to define all required tables.

-- 1. Create APPLICATIONS Table
CREATE TABLE IF NOT EXISTS applications (
  application_no TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  dob TEXT NOT NULL,
  gender TEXT NOT NULL,
  state_of_origin TEXT NOT NULL,
  lga TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  programme TEXT NOT NULL,
  olevel_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  passport_photo TEXT,
  next_of_kin_name TEXT,
  next_of_kin_relationship TEXT,
  next_of_kin_phone TEXT,
  date_applied TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
);

-- 2. Create STUDENTS Table
CREATE TABLE IF NOT EXISTS students (
  matric_no TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  programme TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  state_of_origin TEXT NOT NULL,
  lga TEXT NOT NULL,
  passport_photo TEXT,
  status TEXT NOT NULL DEFAULT 'Active'
);

-- 3. Create COURSES Table
CREATE TABLE IF NOT EXISTS courses (
  code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  units INTEGER NOT NULL DEFAULT 2,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  semester TEXT NOT NULL
);

-- 4. Create RESULTS Table
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  student_matric TEXT NOT NULL REFERENCES students(matric_no) ON DELETE CASCADE,
  course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  points NUMERIC NOT NULL DEFAULT 0.0,
  remark TEXT NOT NULL DEFAULT 'Pass'
);

-- 5. Create FEES Table
CREATE TABLE IF NOT EXISTS fees (
  id TEXT PRIMARY KEY,
  student_matric TEXT NOT NULL REFERENCES students(matric_no) ON DELETE CASCADE,
  academic_session TEXT NOT NULL,
  semester TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unpaid',
  date_paid TEXT
);

-- 6. Create NOTICES Table
CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General'
);

-- 7. Create ACTIVITY_LOGS Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info'
);

-- 8. Create REGISTRATIONS Table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  student_matric TEXT NOT NULL REFERENCES students(matric_no) ON DELETE CASCADE,
  course_code TEXT NOT NULL REFERENCES courses(code) ON DELETE CASCADE,
  semester TEXT NOT NULL,
  academic_session TEXT NOT NULL,
  date_registered TEXT NOT NULL
);

-- Configure permissive policies for pre-auth deployment / easier sandbox testing
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON applications FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON students FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON courses FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON results FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON results FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON fees FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON fees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON fees FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON notices FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON notices FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON activity_logs FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON registrations FOR UPDATE USING (true);
`;

// Helper conversion functions because database keys use underscores (standard pg)
// and React interfaces use camelCase
export const mapDbToStudent = (db: any): Student => ({
  matricNo: db.matric_no,
  name: db.name,
  surname: db.surname,
  department: db.department,
  level: db.level,
  programme: db.programme,
  gender: db.gender,
  dob: db.dob,
  phone: db.phone,
  email: db.email,
  address: db.address,
  stateOfOrigin: db.state_of_origin,
  lga: db.lga,
  passportPhoto: db.passport_photo || '',
  status: db.status as 'Active' | 'Inactive',
});

export const mapStudentToDb = (st: Student) => ({
  matric_no: st.matricNo,
  name: st.name,
  surname: st.surname,
  department: st.department,
  level: st.level,
  programme: st.programme,
  gender: st.gender,
  dob: st.dob,
  phone: st.phone,
  email: st.email,
  address: st.address,
  state_of_origin: st.stateOfOrigin,
  lga: st.lga,
  passport_photo: st.passportPhoto || null,
  status: st.status,
});

export const mapDbToCourse = (db: any): Course => ({
  code: db.code,
  title: db.title,
  units: Number(db.units),
  department: db.department,
  level: db.level,
  semester: db.semester as 'First' | 'Second',
});

export const mapCourseToDb = (co: Course) => ({
  code: co.code,
  title: co.title,
  units: co.units,
  department: co.department,
  level: co.level,
  semester: co.semester,
});

export const mapDbToResult = (db: any): Result => ({
  id: db.id,
  studentMatric: db.student_matric,
  courseCode: db.course_code,
  semester: db.semester as 'First' | 'Second',
  level: db.level,
  score: Number(db.score),
  grade: db.grade,
  points: Number(db.points),
  remark: db.remark as 'Pass' | 'Fail',
});

export const mapResultToDb = (re: Result) => ({
  id: re.id,
  student_matric: re.studentMatric,
  course_code: re.courseCode,
  semester: re.semester,
  level: re.level,
  score: re.score,
  grade: re.grade,
  points: re.points,
  remark: re.remark,
});

export const mapDbToFee = (db: any): Fee => ({
  id: db.id,
  studentMatric: db.student_matric,
  academicSession: db.academic_session,
  semester: db.semester as 'First' | 'Second',
  description: db.description,
  amount: Number(db.amount),
  status: db.status as 'Paid' | 'Unpaid' | 'Partial',
  datePaid: db.date_paid || undefined,
});

export const mapFeeToDb = (fe: Fee) => ({
  id: fe.id,
  student_matric: fe.studentMatric,
  academic_session: fe.academicSession,
  semester: fe.semester,
  description: fe.description,
  amount: fe.amount,
  status: fe.status,
  date_paid: fe.datePaid || null,
});

export const mapDbToApplication = (db: any): Application => ({
  applicationNo: db.application_no,
  fullName: db.full_name,
  dob: db.dob,
  gender: db.gender,
  stateOfOrigin: db.state_of_origin,
  lga: db.lga,
  phone: db.phone,
  email: db.email,
  address: db.address,
  programme: db.programme,
  olevelResults: typeof db.olevel_results === 'string' ? JSON.parse(db.olevel_results) : db.olevel_results,
  passportPhoto: db.passport_photo || '',
  nextOfKinName: db.next_of_kin_name || '',
  nextOfKinRelationship: db.next_of_kin_relationship || '',
  nextOfKinPhone: db.next_of_kin_phone || '',
  dateApplied: db.date_applied,
  status: db.status as 'Pending' | 'Admitted' | 'Rejected',
});

export const mapApplicationToDb = (ap: Application) => ({
  application_no: ap.applicationNo,
  full_name: ap.fullName,
  dob: ap.dob,
  gender: ap.gender,
  state_of_origin: ap.stateOfOrigin,
  lga: ap.lga,
  phone: ap.phone,
  email: ap.email,
  address: ap.address,
  programme: ap.programme,
  olevel_results: ap.olevelResults,
  passport_photo: ap.passportPhoto || null,
  next_of_kin_name: ap.nextOfKinName || null,
  next_of_kin_relationship: ap.nextOfKinRelationship || null,
  next_of_kin_phone: ap.nextOfKinPhone || null,
  date_applied: ap.dateApplied,
  status: ap.status,
});

export const mapDbToNotice = (db: any): Notice => ({
  id: db.id,
  title: db.title,
  content: db.content,
  date: db.date,
  category: db.category as 'General' | 'Academic' | 'Fees' | 'Emergency',
});

export const mapNoticeToDb = (no: Notice) => ({
  id: no.id,
  title: no.title,
  content: no.content,
  date: no.date,
  category: no.category,
});

export const mapDbToActivityLog = (db: any): ActivityLog => ({
  id: db.id,
  timestamp: db.timestamp,
  message: db.message,
  type: db.type as 'info' | 'success' | 'warning',
});

export const mapActivityLogToDb = (ac: ActivityLog) => ({
  id: ac.id,
  timestamp: ac.timestamp,
  message: ac.message,
  type: ac.type,
});

export const mapDbToCourseRegistration = (db: any): CourseRegistration => ({
  id: db.id,
  studentMatric: db.student_matric,
  courseCode: db.course_code,
  semester: db.semester as 'First' | 'Second',
  academicSession: db.academic_session,
  dateRegistered: db.date_registered,
});

export const mapCourseRegistrationToDb = (cr: CourseRegistration) => ({
  id: cr.id,
  student_matric: cr.studentMatric,
  course_code: cr.courseCode,
  semester: cr.semester,
  academic_session: cr.academicSession,
  date_registered: cr.dateRegistered,
});

// Database interaction wrappers: Safe select/upsert for all tables

export const fetchSupabaseStudents = async (): Promise<Student[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('students').select('*');
  if (error) {
    console.error('Error fetching students from Supabase:', error);
    throw new Error('Could not pull students from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToStudent);
};

export const fetchSupabaseCourses = async (): Promise<Course[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('courses').select('*');
  if (error) {
    console.error('Error fetching courses from Supabase:', error);
    throw new Error('Could not pull courses from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToCourse);
};

export const fetchSupabaseResults = async (): Promise<Result[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('results').select('*');
  if (error) {
    console.error('Error fetching exam results from Supabase:', error);
    throw new Error('Could not pull results from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToResult);
};

export const fetchSupabaseFees = async (): Promise<Fee[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('fees').select('*');
  if (error) {
    console.error('Error fetching fees from Supabase:', error);
    throw new Error('Could not pull fees from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToFee);
};

export const fetchSupabaseApplications = async (): Promise<Application[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('applications').select('*');
  if (error) {
    console.error('Error fetching applications from Supabase:', error);
    throw new Error('Could not pull applications from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToApplication);
};

export const fetchSupabaseNotices = async (): Promise<Notice[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('notices').select('*');
  if (error) {
    console.error('Error fetching notices from Supabase:', error);
    throw new Error('Could not pull notices from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToNotice);
};

export const fetchSupabaseActivityLogs = async (): Promise<ActivityLog[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('activity_logs').select('*');
  if (error) {
    console.error('Error fetching activity logs from Supabase:', error);
    throw new Error('Could not pull logs from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToActivityLog);
};

export const fetchSupabaseCourseRegistrations = async (): Promise<CourseRegistration[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('registrations').select('*');
  if (error) {
    console.error('Error fetching course registrations from Supabase:', error);
    throw new Error('Could not pull registrations from Supabase', { cause: error });
  }
  return (data || []).map(mapDbToCourseRegistration);
};

// PUSH data to Supabase (Batched/Single upserts)
export const upsertSupabaseStudents = async (records: Student[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapStudentToDb);
  const { error } = await client.from('students').upsert(dbRecords);
  if (error) {
    console.error('Error pushing students to Supabase:', error);
    throw new Error('Could not sync students with Supabase', { cause: error });
  }
};

export const upsertSupabaseCourses = async (records: Course[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapCourseToDb);
  const { error } = await client.from('courses').upsert(dbRecords);
  if (error) {
    console.error('Error pushing courses to Supabase:', error);
    throw new Error('Could not sync courses with Supabase', { cause: error });
  }
};

export const upsertSupabaseResults = async (records: Result[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapResultToDb);
  const { error } = await client.from('results').upsert(dbRecords);
  if (error) {
    console.error('Error pushing results to Supabase:', error);
    throw new Error('Could not sync exam results with Supabase', { cause: error });
  }
};

export const upsertSupabaseFees = async (records: Fee[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapFeeToDb);
  const { error } = await client.from('fees').upsert(dbRecords);
  if (error) {
    console.error('Error pushing fees to Supabase:', error);
    throw new Error('Could not sync fees with Supabase', { cause: error });
  }
};

export const upsertSupabaseApplications = async (records: Application[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapApplicationToDb);
  const { error } = await client.from('applications').upsert(dbRecords);
  if (error) {
    console.error('Error pushing applications to Supabase:', error);
    throw new Error('Could not sync admission applications with Supabase', { cause: error });
  }
};

export const upsertSupabaseNotices = async (records: Notice[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapNoticeToDb);
  const { error } = await client.from('notices').upsert(dbRecords);
  if (error) {
    console.error('Error pushing notices to Supabase:', error);
    throw new Error('Could not sync notices with Supabase', { cause: error });
  }
};

export const upsertSupabaseActivityLogs = async (records: ActivityLog[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapActivityLogToDb);
  const { error } = await client.from('activity_logs').upsert(dbRecords);
  if (error) {
    console.error('Error pushing activity logs to Supabase:', error);
    throw new Error('Could not sync activity logs with Supabase', { cause: error });
  }
};

export const upsertSupabaseCourseRegistrations = async (records: CourseRegistration[]): Promise<void> => {
  const client = getSupabaseClient();
  if (!client || records.length === 0) return;
  const dbRecords = records.map(mapCourseRegistrationToDb);
  const { error } = await client.from('registrations').upsert(dbRecords);
  if (error) {
    console.error('Error pushing course registrations to Supabase:', error);
    throw new Error('Could not sync student registrations with Supabase', { cause: error });
  }
};
