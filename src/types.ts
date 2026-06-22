/**
 * Types representing the Crown Heritage College of Health application state.
 */

export interface Student {
  matricNo: string;
  name: string;
  surname: string;
  department: string;
  level: string; // "100", "200", "300", "400", "500"
  programme: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  stateOfOrigin: string;
  lga: string;
  passportPhoto: string; // base64 string
  status: 'Active' | 'Inactive';
}

export interface Course {
  code: string; // e.g., "NSG101"
  title: string;
  units: number;
  department: string;
  level: string; // "100", "200", etc.
  semester: 'First' | 'Second';
}

export interface Result {
  id: string; // e.g., `${matricNo}_${courseCode}_${semester}`
  studentMatric: string;
  courseCode: string;
  semester: 'First' | 'Second';
  level: string;
  score: number;
  grade: string;
  points: number;
  remark: 'Pass' | 'Fail';
}

export interface Fee {
  id: string;
  studentMatric: string;
  academicSession: string; // e.g., "2024/2025"
  semester: 'First' | 'Second';
  description: string; // e.g., "School Fees", "Acceptance Fee"
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  datePaid?: string;
}

export interface Application {
  applicationNo: string; // CHCH/2025/XXXX
  fullName: string;
  dob: string;
  gender: string;
  stateOfOrigin: string;
  lga: string;
  phone: string;
  email: string;
  address: string;
  programme: string;
  olevelResults: { subject: string; grade: string }[];
  passportPhoto: string; // base64 string
  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinPhone: string;
  dateApplied: string;
  status: 'Pending' | 'Admitted' | 'Rejected';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Academic' | 'Fees' | 'Emergency';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export interface CourseRegistration {
  id: string; // `${studentMatric}_${courseCode}_${academicSession}_${semester}`
  studentMatric: string;
  courseCode: string;
  semester: 'First' | 'Second';
  academicSession: string;
  dateRegistered: string;
}

