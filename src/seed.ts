import { Student, Course, Result, Fee, Application, Notice, ActivityLog } from './types';

// Helper to calculate grade and point based on score
export function calculateGradeAndPoints(score: number): { grade: string; points: number; remark: 'Pass' | 'Fail' } {
  if (score >= 70) return { grade: 'A', points: 5, remark: 'Pass' };
  if (score >= 60) return { grade: 'B', points: 4, remark: 'Pass' };
  if (score >= 50) return { grade: 'C', points: 3, remark: 'Pass' };
  if (score >= 45) return { grade: 'D', points: 2, remark: 'Pass' };
  if (score >= 40) return { grade: 'E', points: 1, remark: 'Pass' };
  return { grade: 'F', points: 0, remark: 'Fail' };
}

// Sample base64 passport avatars (using safe tiny inline representations)
const samplePassportBase64 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231F2937'/><text x='50L' y='50L' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-size='12' font-family='sans-serif'>PASSPORT</text></svg>";

const sampleStudents: Student[] = [
  {
    matricNo: 'CHCH/2024/001',
    name: 'Adaeze Okafor',
    surname: 'Okafor',
    department: 'Nursing',
    level: '100',
    programme: 'Nursing Science',
    gender: 'Female',
    dob: '2005-04-12',
    phone: '+234 812 345 6789',
    email: 'adaeze.okafor@crownheritage.edu.ng',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    stateOfOrigin: 'Anambra',
    lga: 'Nnewi North',
    passportPhoto: '',
    status: 'Active'
  },
  {
    matricNo: 'CHCH/2024/002',
    name: 'Emeka Nwosu',
    surname: 'Nwosu',
    department: 'Medical Lab Science',
    level: '100',
    programme: 'Medical Laboratory Science',
    gender: 'Male',
    dob: '2004-09-22',
    phone: '+234 803 987 6543',
    email: 'emeka.nwosu@crownheritage.edu.ng',
    address: '42 Garki Road, Abuja',
    stateOfOrigin: 'Enugu',
    lga: 'Udi',
    passportPhoto: '',
    status: 'Active'
  },
  {
    matricNo: 'CHCH/2024/003',
    name: 'Fatima Aliyu',
    surname: 'Aliyu',
    department: 'Public Health',
    level: '200',
    programme: 'Public Health Technology',
    gender: 'Female',
    dob: '2003-11-05',
    phone: '+234 705 111 2233',
    email: 'fatima.aliyu@crownheritage.edu.ng',
    address: '108 Kano Road, Kaduna',
    stateOfOrigin: 'Kano',
    lga: 'Nasarawa',
    passportPhoto: '',
    status: 'Active'
  }
];

const sampleCourses: Course[] = [
  { code: 'NSG101', title: 'Anatomy and Physiology I', units: 3, department: 'Nursing', level: '100', semester: 'First' },
  { code: 'NSG102', title: 'Introduction to Nursing', units: 2, department: 'Nursing', level: '100', semester: 'First' },
  { code: 'NSG103', title: 'Basic Biochemistry', units: 3, department: 'Nursing', level: '100', semester: 'First' },
  { code: 'NSG104', title: 'Medical Terminology', units: 2, department: 'Nursing', level: '100', semester: 'First' },
  { code: 'GST101', title: 'Communication in English', units: 2, department: 'Nursing', level: '100', semester: 'First' },
  // MLS courses
  { code: 'MLS101', title: 'Introduction to Medical Lab Science', units: 3, department: 'Medical Lab Science', level: '100', semester: 'First' },
  { code: 'MLS102', title: 'General Biology for MLS', units: 2, department: 'Medical Lab Science', level: '100', semester: 'First' },
  // Public Health courses
  { code: 'PBH201', title: 'Introduction to Epidemiology', units: 3, department: 'Public Health', level: '100', semester: 'First' },
  { code: 'PBH202', title: 'Biostatistics in Health Care', units: 3, department: 'Public Health', level: '100', semester: 'First' }
];

const sampleResults: Result[] = [
  { id: 'CHCH/2024/001_NSG101_First_100', studentMatric: 'CHCH/2024/001', courseCode: 'NSG101', semester: 'First', level: '100', score: 72, grade: 'A', points: 5, remark: 'Pass' },
  { id: 'CHCH/2024/001_NSG102_First_100', studentMatric: 'CHCH/2024/001', courseCode: 'NSG102', semester: 'First', level: '100', score: 65, grade: 'B', points: 4, remark: 'Pass' },
  { id: 'CHCH/2024/001_NSG103_First_100', studentMatric: 'CHCH/2024/001', courseCode: 'NSG103', semester: 'First', level: '100', score: 58, grade: 'C', points: 3, remark: 'Pass' },
  { id: 'CHCH/2024/001_NSG104_First_100', studentMatric: 'CHCH/2024/001', courseCode: 'NSG104', semester: 'First', level: '100', score: 48, grade: 'D', points: 2, remark: 'Pass' },
  { id: 'CHCH/2024/001_GST101_First_100', studentMatric: 'CHCH/2024/001', courseCode: 'GST101', semester: 'First', level: '100', score: 81, grade: 'A', points: 5, remark: 'Pass' }
];

const sampleFees: Fee[] = [
  { id: 'F001', studentMatric: 'CHCH/2024/001', academicSession: '2024/2025', semester: 'First', description: 'School Fees 2024/2025 First Semester', amount: 85000, status: 'Paid', datePaid: '2024-10-02' },
  { id: 'F002', studentMatric: 'CHCH/2024/001', academicSession: '2024/2025', semester: 'Second', description: 'School Fees 2024/2025 Second Semester', amount: 85000, status: 'Unpaid' },
  { id: 'F003', studentMatric: 'CHCH/2024/002', academicSession: '2024/2025', semester: 'First', description: 'School Fees 2024/2025 First Semester', amount: 80000, status: 'Paid', datePaid: '2024-10-04' },
  { id: 'F004', studentMatric: 'CHCH/2024/003', academicSession: '2024/2025', semester: 'First', description: 'School Fees 2024/2025 First Semester', amount: 90000, status: 'Partial', datePaid: '2024-11-12' }
];

const sampleApplications: Application[] = [
  {
    applicationNo: 'CHCH/2025/1049',
    fullName: 'Grace Chinedu Obi',
    dob: '2006-08-14',
    gender: 'Female',
    stateOfOrigin: 'Imo',
    lga: 'Okigwe',
    phone: '+234 815 555 6677',
    email: 'grace.obi@gmail.com',
    address: '9 Orlu Road, Owerri',
    programme: 'Nursing Science',
    olevelResults: [
      { subject: 'English Language', grade: 'B2' },
      { subject: 'Mathematics', grade: 'C4' },
      { subject: 'Biology', grade: 'A1' },
      { subject: 'Chemistry', grade: 'B3' },
      { subject: 'Physics', grade: 'C5' }
    ],
    passportPhoto: '',
    nextOfKinName: 'Johnson Obi',
    nextOfKinRelationship: 'Father',
    nextOfKinPhone: '+234 803 111 2222',
    dateApplied: '2025-05-15',
    status: 'Pending'
  }
];

const sampleNotices: Notice[] = [
  {
    id: 'n1',
    title: 'Resumption of 2024/2025 Second Semester academic activities',
    content: 'All returning students of Crown Heritage College of Health are hereby noticed that classes for the Second Semester will resume fully on the 1st of July, 2026. Please ensure all registered courses are validated and outstanding second semester elements are cleared.',
    date: '2026-06-15',
    category: 'Academic'
  },
  {
    id: 'n2',
    title: 'School Fees Payment Deadline Expansion',
    content: 'The management has extended the portal clearance deadline to the 15th of July, 2026 to facilitate full portal operations. Students should complete partial payments before the designated exam permit checks.',
    date: '2026-06-18',
    category: 'Fees'
  }
];

const sampleActivityLogs: ActivityLog[] = [
  { id: 'act1', timestamp: '2026-06-22T10:00:00', message: 'College Management Portal initialized successfully.', type: 'success' },
  { id: 'act2', timestamp: '2026-06-22T11:15:20', message: 'Seed database loaded with standard parameters.', type: 'info' }
];

// Seed to LocalStorage if empty
export function initSeedDatabase() {
  if (!localStorage.getItem('chch_students')) {
    localStorage.setItem('chch_students', JSON.stringify(sampleStudents));
  }
  if (!localStorage.getItem('chch_courses')) {
    localStorage.setItem('chch_courses', JSON.stringify(sampleCourses));
  }
  if (!localStorage.getItem('chch_results')) {
    localStorage.setItem('chch_results', JSON.stringify(sampleResults));
  }
  if (!localStorage.getItem('chch_fees')) {
    localStorage.setItem('chch_fees', JSON.stringify(sampleFees));
  }
  if (!localStorage.getItem('chch_applications')) {
    localStorage.setItem('chch_applications', JSON.stringify(sampleApplications));
  }
  if (!localStorage.getItem('chch_notices')) {
    localStorage.setItem('chch_notices', JSON.stringify(sampleNotices));
  }
  if (!localStorage.getItem('chch_activity_logs')) {
    localStorage.setItem('chch_activity_logs', JSON.stringify(sampleActivityLogs));
  }
}

// Global states loaders / savers
export function getLocalStorageData<T>(key: string, defaultVal: T): T {
  const value = localStorage.getItem(key);
  if (!value) return defaultVal;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultVal;
  }
}

export function saveLocalStorageData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Logging helper
export function logAction(message: string, type: 'info' | 'success' | 'warning' = 'info') {
  const logs = getLocalStorageData<ActivityLog[]>('chch_activity_logs', []);
  const newLog: ActivityLog = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    message,
    type
  };
  logs.unshift(newLog);
  if (logs.length > 50) logs.pop(); // keep last 50
  saveLocalStorageData('chch_activity_logs', logs);
}
