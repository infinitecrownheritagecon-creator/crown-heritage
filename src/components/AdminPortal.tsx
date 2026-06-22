import React, { useState } from 'react';
import { Student, Course, Result, Fee, Application, Notice, ActivityLog } from '../types';
import { calculateGradeAndPoints, logAction } from '../seed';

interface AdminPortalProps {
  onBack: () => void;
  students: Student[];
  courses: Course[];
  results: Result[];
  fees: Fee[];
  applications: Application[];
  notices: Notice[];
  activityLogs: ActivityLog[];
  onSetStudents: (students: Student[]) => void;
  onSetCourses: (courses: Course[]) => void;
  onSetResults: (results: Result[]) => void;
  onSetFees: (fees: Fee[]) => void;
  onSetApplications: (applications: Application[]) => void;
  onSetNotices: (notices: Notice[]) => void;
  onSetLoggedInAdmin: (status: boolean) => void;
  loggedInAdmin: boolean;
  onLogout: () => void;
  onAddToast: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const DEPARTMENTS = ['Nursing', 'Medical Lab Science', 'Public Health', 'Pharmacy Tech', 'Physiotherapy', 'Health Information Management'];
const SESSIONS = ['2024/2025', '2025/2026', '2026/2027'];
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

export default function AdminPortal({
  onBack,
  students,
  courses,
  results,
  fees,
  applications,
  notices,
  activityLogs,
  onSetStudents,
  onSetCourses,
  onSetResults,
  onSetFees,
  onSetApplications,
  onSetNotices,
  onSetLoggedInAdmin,
  loggedInAdmin,
  onLogout,
  onAddToast
}: AdminPortalProps) {
  // Login fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'applications' | 'courses' | 'results' | 'fees' | 'notices'>('overview');

  // Search & Filtering states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // Student Form states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormMatric, setStudentFormMatric] = useState('');
  const [studentFormSurname, setStudentFormSurname] = useState('');
  const [studentFormDept, setStudentFormDept] = useState(DEPARTMENTS[0]);
  const [studentFormLevel, setStudentFormLevel] = useState('100');
  const [studentFormProg, setStudentFormProg] = useState('');
  const [studentFormGender, setStudentFormGender] = useState('Female');
  const [studentFormDob, setStudentFormDob] = useState('');
  const [studentFormPhone, setStudentFormPhone] = useState('');
  const [studentFormEmail, setStudentFormEmail] = useState('');
  const [studentFormState, setStudentFormState] = useState('');
  const [studentFormLga, setStudentFormLga] = useState('');
  const [studentFormPhoto, setStudentFormPhoto] = useState('');

  // Tables sorting
  const [sortField, setSortField] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Application detail viewing
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Course Form States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormCode, setCourseFormCode] = useState('');
  const [courseFormTitle, setCourseFormTitle] = useState('');
  const [courseFormUnits, setCourseFormUnits] = useState(3);
  const [courseFormDept, setCourseFormDept] = useState(DEPARTMENTS[0]);
  const [courseFormLevel, setCourseFormLevel] = useState('100');
  const [courseFormSemester, setCourseFormSemester] = useState<'First' | 'Second'>('First');

  // Results Management State
  const [resDeptFilter, setResDeptFilter] = useState(DEPARTMENTS[0]);
  const [resLevelFilter, setResLevelFilter] = useState('100');
  const [resSemesterFilter, setResSemesterFilter] = useState<'First' | 'Second'>('First');
  const [selectedResultStudent, setSelectedResultStudent] = useState('');
  const [scoreInputs, setScoreInputs] = useState<Record<string, number>>({}); // courseCode -> score (0-100)
  const [bulkResultMode, setBulkResultMode] = useState(false);
  const [bulkCourseCode, setBulkCourseCode] = useState('');
  const [bulkScores, setBulkScores] = useState<Record<string, number>>({}); // matricNo -> score

  // Fees Management State
  const [feeStudentSelect, setFeeStudentSelect] = useState('');
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [feeFormSession, setFeeFormSession] = useState(SESSIONS[0]);
  const [feeFormSemester, setFeeFormSemester] = useState<'First' | 'Second'>('First');
  const [feeFormDesc, setFeeFormDesc] = useState('');
  const [feeFormAmount, setFeeFormAmount] = useState(0);
  const [feeFormStatus, setFeeFormStatus] = useState<'Paid' | 'Unpaid' | 'Partial'>('Unpaid');
  const [feeFormDate, setFeeFormDate] = useState('');

  // Notices Management State
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeFormTitle, setNoticeFormTitle] = useState('');
  const [noticeFormContent, setNoticeFormContent] = useState('');
  const [noticeFormCategory, setNoticeFormCategory] = useState<'General' | 'Academic' | 'Fees' | 'Emergency'>('General');

  // SORTING HANDLER
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getSortedData = <T extends Record<string, any>>(dataList: T[]): T[] => {
    if (!sortField) return dataList;
    return [...dataList].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  };

  // HANDLERS: ADMIN LOGIN
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username === 'Admin' && password === 'AdminCrown') {
      onSetLoggedInAdmin(true);
      logAction('Administrator logged in from main portal terminal.', 'info');
      onAddToast('Welcome to the Central Administration Portal!', 'success');
    } else {
      setLoginError('Invalid Administrator credit token parameters.');
    }
  };

  // STUDENT CRUD HANDLERS
  const openAddStudent = () => {
    setEditingStudent(null);
    setStudentFormName('');
    setStudentFormMatric('');
    setStudentFormSurname('');
    setStudentFormDept(DEPARTMENTS[0]);
    setStudentFormLevel('100');
    setStudentFormProg('');
    setStudentFormGender('Female');
    setStudentFormDob('');
    setStudentFormPhone('');
    setStudentFormEmail('');
    setStudentFormState('');
    setStudentFormLga('');
    setStudentFormPhoto('');
    setShowStudentModal(true);
  };

  const openEditStudent = (s: Student) => {
    setEditingStudent(s);
    setStudentFormName(s.name);
    setStudentFormMatric(s.matricNo);
    setStudentFormSurname(s.surname);
    setStudentFormDept(s.department);
    setStudentFormLevel(s.level);
    setStudentFormProg(s.programme || '');
    setStudentFormGender(s.gender);
    setStudentFormDob(s.dob);
    setStudentFormPhone(s.phone);
    setStudentFormEmail(s.email);
    setStudentFormState(s.stateOfOrigin);
    setStudentFormLga(s.lga);
    setStudentFormPhoto(s.passportPhoto || '');
    setShowStudentModal(true);
  };

  const handleStudentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormName.trim() || !studentFormMatric.trim() || !studentFormSurname.trim()) {
      alert("Name, Matric Number, and Surname (Portal Password) are required parameters.");
      return;
    }

    if (editingStudent) {
      // Edit
      const updated = students.map(s => {
        if (s.matricNo === editingStudent.matricNo) {
          return {
            ...s,
            name: studentFormName,
            surname: studentFormSurname,
            department: studentFormDept,
            level: studentFormLevel,
            programme: studentFormProg || `${studentFormDept} Technology`,
            gender: studentFormGender,
            dob: studentFormDob,
            phone: studentFormPhone,
            email: studentFormEmail,
            stateOfOrigin: studentFormState,
            lga: studentFormLga,
            passportPhoto: studentFormPhoto
          };
        }
        return s;
      });
      onSetStudents(updated);
      logAction(`Modified student profile record: ${studentFormName} (${studentFormMatric})`, 'info');
      onAddToast("Student profile updated successfully.", "success");
    } else {
      // Add
      if (students.some(s => s.matricNo === studentFormMatric)) {
        alert("Matric Number already exists down in our registry database!");
        return;
      }
      const newStudent: Student = {
        matricNo: studentFormMatric,
        name: studentFormName,
        surname: studentFormSurname,
        department: studentFormDept,
        level: studentFormLevel,
        programme: studentFormProg || `${studentFormDept} Technology`,
        gender: studentFormGender,
        dob: studentFormDob,
        phone: studentFormPhone,
        email: studentFormEmail,
        address: 'Km 4, Idiroko Expressway, Ota',
        stateOfOrigin: studentFormState,
        lga: studentFormLga,
        passportPhoto: studentFormPhoto,
        status: 'Active'
      };
      onSetStudents([...students, newStudent]);
      logAction(`Added new student to registry database: ${studentFormName} (${studentFormMatric})`, 'success');
      onAddToast("New Student created successfully.", "success");
    }
    setShowStudentModal(false);
  };

  const deleteStudent = (matric: string) => {
    if (confirm(`CRITICAL WARNING: Are you sure you want to permanently DELETE student candidate '${matric}' from the portal state database? All progress, fee records, and marks will remain desynced.`)) {
      const filtered = students.filter(s => s.matricNo !== matric);
      onSetStudents(filtered);
      logAction(`Deleted student candidate record with index ${matric}`, 'warning');
      onAddToast("Student record detached.", "warning");
      if (selectedStudentDetail?.matricNo === matric) {
        setSelectedStudentDetail(null);
      }
    }
  };

  // APPLICATION DETAILS & CONVERT
  const handleApproveStatus = (appNo: string, val: 'Admitted' | 'Rejected' | 'Pending') => {
    const updated = applications.map(ap => {
      if (ap.applicationNo === appNo) {
        return { ...ap, status: val };
      }
      return ap;
    });
    onSetApplications(updated);
    logAction(`Updated status of Admission application #${appNo} to [${val}]`, 'info');
    onAddToast(`Application status updated to ${val}.`, 'info');
    if (selectedApp?.applicationNo === appNo) {
      setSelectedApp({ ...selectedApp, status: val });
    }
  };

  const convertAppToStudent = (app: Application) => {
    if (students.some(s => s.email.toLowerCase() === app.email.toLowerCase())) {
      alert("A registered student already bears this email address!");
      return;
    }

    // Generate neat unique Matric Number
    const levelCode = '2025';
    const numPart = String(100 + students.length + 1).slice(-3);
    const matricNo = `CHCH/${levelCode}/${numPart}`;

    const newStudent: Student = {
      matricNo,
      name: app.fullName,
      surname: app.fullName.split(' ')[0] || 'Surname', // default back to first word
      department: app.programme.includes('Nursing') ? 'Nursing' : app.programme.includes('Laboratory') ? 'Medical Lab Science' : 'Public Health',
      level: '100',
      programme: app.programme,
      gender: app.gender,
      dob: app.dob,
      phone: app.phone,
      email: app.email,
      address: app.address,
      stateOfOrigin: app.stateOfOrigin,
      lga: app.lga,
      passportPhoto: app.passportPhoto,
      status: 'Active'
    };

    onSetStudents([...students, newStudent]);

    // Update status to admitted in logs
    const updatedApp = applications.map(ap => {
      if (ap.applicationNo === app.applicationNo) {
        return { ...ap, status: 'Admitted' as const };
      }
      return ap;
    });
    onSetApplications(updatedApp);

    logAction(`Converted Applicant #${app.applicationNo} to Full Matriculated Student (${matricNo})`, 'success');
    onAddToast(`Success! Candidate converted with Matric No: ${matricNo}`, 'success');
    setSelectedApp(null);
  };

  // COURSE FORM AND INTERACTIVE SETUP
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseFormCode('');
    setCourseFormTitle('');
    setCourseFormUnits(3);
    setCourseFormDept(DEPARTMENTS[0]);
    setCourseFormLevel('100');
    setCourseFormSemester('First');
    setShowCourseModal(true);
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormCode.trim() || !courseFormTitle.trim()) {
      alert("Course Code and Title represent required academic inputs!");
      return;
    }

    if (editingCourse) {
      // Edit
      const updated = courses.map(c => {
        if (c.code === editingCourse.code) {
          return {
            ...c,
            code: courseFormCode.toUpperCase(),
            title: courseFormTitle,
            units: courseFormUnits,
            department: courseFormDept,
            level: courseFormLevel,
            semester: courseFormSemester
          };
        }
        return c;
      });
      onSetCourses(updated);
      logAction(`Modified syllabus module details: ${courseFormCode}`, 'info');
      onAddToast("Course parameter updated.", "success");
    } else {
      // Add
      if (courses.some(c => c.code.toLowerCase() === courseFormCode.toLowerCase())) {
        alert("Course Code index already exists!");
        return;
      }
      const newCourse: Course = {
        code: courseFormCode.toUpperCase(),
        title: courseFormTitle,
        units: courseFormUnits,
        department: courseFormDept,
        level: courseFormLevel,
        semester: courseFormSemester
      };
      onSetCourses([...courses, newCourse]);
      logAction(`Pre-loaded course structure module: ${courseFormCode}`, 'success');
      onAddToast("Course configured successfully.", "success");
    }
    setShowCourseModal(false);
  };

  const deleteCourse = (code: string) => {
    if (confirm(`Are you sure you want to delete course module '${code}'?`)) {
      onSetCourses(courses.filter(c => c.code !== code));
      logAction(`Removed course code ${code} from technical curriculum.`, 'warning');
      onAddToast("Course removed.", "warning");
    }
  };

  // RESULTS WRITING & BULK TOGGLE
  const activeSemesterStudents = students.filter(s => 
    s.department === resDeptFilter && s.level === resLevelFilter
  );

  const activeSemesterCourses = courses.filter(c => 
    c.department === resDeptFilter && c.level === resLevelFilter && c.semester === resSemesterFilter
  );

  const handleLoadStudentResults = (matric: string) => {
    setSelectedResultStudent(matric);
    const scores: Record<string, number> = {};
    activeSemesterCourses.forEach(c => {
      const match = results.find(r => 
        r.studentMatric === matric && 
        r.courseCode === c.code && 
        r.semester === resSemesterFilter &&
        r.level === resLevelFilter
      );
      scores[c.code] = match ? match.score : 0;
    });
    setScoreInputs(scores);
  };

  const saveIndividualResults = () => {
    if (!selectedResultStudent) {
      alert("Please select a student record to commit marks.");
      return;
    }

    // copy existing
    let updatedResults = [...results];

    Object.entries(scoreInputs).forEach(([courseCode, scoreVal]) => {
      const score = Math.max(0, Math.min(100, Number(scoreVal)));
      const evalData = calculateGradeAndPoints(score);
      const resId = `${selectedResultStudent}_${courseCode}_${resSemesterFilter}_${resLevelFilter}`;

      // remove old if conflict
      updatedResults = updatedResults.filter(r => r.id !== resId);

      updatedResults.push({
        id: resId,
        studentMatric: selectedResultStudent,
        courseCode,
        semester: resSemesterFilter,
        level: resLevelFilter,
        score,
        grade: evalData.grade,
        points: evalData.points,
        remark: evalData.remark
      });
    });

    onSetResults(updatedResults);
    logAction(`Updated marks profile for candidate ${selectedResultStudent} is saved.`, 'success');
    onAddToast("Grades recorded into study timeline successfully.", "success");
  };

  // Bulk Results Entry Setup
  const loadBulkCourseSetup = (courseCode: string) => {
    setBulkCourseCode(courseCode);
    const bulkS: Record<string, number> = {};
    activeSemesterStudents.forEach(st => {
      const match = results.find(r => 
        r.studentMatric === st.matricNo && 
        r.courseCode === courseCode && 
        r.semester === resSemesterFilter &&
        r.level === resLevelFilter
      );
      bulkS[st.matricNo] = match ? match.score : 0;
    });
    setBulkScores(bulkS);
  };

  const saveBulkResults = () => {
    if (!bulkCourseCode) {
      alert("Please select a course for bulk scores collection.");
      return;
    }

    let updatedResults = [...results];

    Object.entries(bulkScores).forEach(([matricNo, scoreVal]) => {
      const score = Math.max(0, Math.min(100, Number(scoreVal)));
      const evalData = calculateGradeAndPoints(score);
      const resId = `${matricNo}_${bulkCourseCode}_${resSemesterFilter}_${resLevelFilter}`;

      updatedResults = updatedResults.filter(r => r.id !== resId);

      updatedResults.push({
        id: resId,
        studentMatric: matricNo,
        courseCode: bulkCourseCode,
        semester: resSemesterFilter,
        level: resLevelFilter,
        score,
        grade: evalData.grade,
        points: evalData.points,
        remark: evalData.remark
      });
    });

    onSetResults(updatedResults);
    logAction(`Recorded bulk exam scores for Course ${bulkCourseCode} for ${activeSemesterStudents.length} candidates.`, 'success');
    onAddToast(`Bulk results for ${bulkCourseCode} saved.`, 'success');
  };

  // FEES RECORD SYSTEM
  const selectedStudentFees = fees.filter(f => f.studentMatric === feeStudentSelect);

  const openAddFee = () => {
    setEditingFee(null);
    setFeeFormDesc('');
    setFeeFormAmount(85000);
    setFeeFormStatus('Unpaid');
    setFeeFormDate('');
    setShowFeeModal(true);
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudentSelect) {
      alert("Select Student first before recording invoice billing parameters!");
      return;
    }
    if (!feeFormDesc.trim() || feeFormAmount <= 0) {
      alert("Billing Description and non-zero Amount are mandatory!");
      return;
    }

    if (editingFee) {
      // Edit
      const updated = fees.map(f => {
        if (f.id === editingFee.id) {
          return {
            ...f,
            academicSession: feeFormSession,
            semester: feeFormSemester,
            description: feeFormDesc,
            amount: Number(feeFormAmount),
            status: feeFormStatus,
            datePaid: feeFormStatus !== 'Unpaid' ? (feeFormDate || new Date().toISOString().split('T')[0]) : undefined
          };
        }
        return f;
      });
      onSetFees(updated);
      logAction(`Adjusted billing ledger index for: ${feeStudentSelect}`, 'info');
      onAddToast("Ledger invoice configured.", "success");
    } else {
      // Add
      const newFee: Fee = {
        id: 'FE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        studentMatric: feeStudentSelect,
        academicSession: feeFormSession,
        semester: feeFormSemester,
        description: feeFormDesc,
        amount: Number(feeFormAmount),
        status: feeFormStatus,
        datePaid: feeFormStatus !== 'Unpaid' ? (feeFormDate || new Date().toISOString().split('T')[0]) : undefined
      };
      onSetFees([...fees, newFee]);
      logAction(`Registered invoice billing structure for student: ${feeStudentSelect}`, 'success');
      onAddToast("New ledger billing configured.", "success");
    }
    setShowFeeModal(false);
  };

  const handleMarkAsPaid = (feeId: string) => {
    const updated = fees.map(f => {
      if (f.id === feeId) {
        return { 
          ...f, 
          status: 'Paid' as const, 
          datePaid: new Date().toISOString().split('T')[0] 
        };
      }
      return f;
    });
    onSetFees(updated);
    logAction(`Ledger transaction reconciled for node block: ${feeId}`, 'success');
    onAddToast("Invoice reconciled as PAID.", "success");
  };

  const deleteFeeRecord = (feeId: string) => {
    if (confirm("Are you sure you want to dispatch a delete transaction on this billing item?")) {
      onSetFees(fees.filter(f => f.id !== feeId));
      logAction(`Dispatched deletion of invoice metadata block: ${feeId}`, 'warning');
      onAddToast("Invoice cleared.", "warning");
    }
  };

  // NOTICES HANDLERS
  const openAddNotice = () => {
    setEditingNotice(null);
    setNoticeFormTitle('');
    setNoticeFormContent('');
    setNoticeFormCategory('General');
    setShowNoticeModal(true);
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeFormTitle.trim() || !noticeFormContent.trim()) {
      alert("Notice Title and Content require full alphanumeric parameters!");
      return;
    }

    if (editingNotice) {
      // Edit
      const updated = notices.map(n => {
        if (n.id === editingNotice.id) {
          return {
            ...n,
            title: noticeFormTitle,
            content: noticeFormContent,
            category: noticeFormCategory,
            date: new Date().toISOString().split('T')[0]
          };
        }
        return n;
      });
      onSetNotices(updated);
      logAction(`Updated bulletin communication title: ${noticeFormTitle}`, 'info');
      onAddToast("Announcement bulletins synchronized.", "success");
    } else {
      // Add
      const newNotice: Notice = {
        id: 'n_' + Date.now(),
        title: noticeFormTitle,
        content: noticeFormContent,
        category: noticeFormCategory,
        date: new Date().toISOString().split('T')[0]
      };
      onSetNotices([newNotice, ...notices]);
      logAction(`Published announcement bulletin on dashboard network: ${noticeFormTitle}`, 'success');
      onAddToast("Bulletin published to homepage news.", "success");
    }
    setShowNoticeModal(false);
  };

  const deleteNotice = (id: string) => {
    if (confirm("Are you sure you want to dismantle this portal announcement?")) {
      onSetNotices(notices.filter(n => n.id !== id));
      logAction(`Deleted portal bulletin node: ${id}`, 'warning');
      onAddToast("Bulletin detached.", "warning");
    }
  };

  // GOTO LOGIN STAGE IF NOT IN
  if (!loggedInAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="mb-6">
          <button 
            onClick={onBack}
            className="text-sm font-bold text-[#0A1F44] hover:text-[#D4A017] transition-all cursor-pointer"
          >
            ← Back to Homepage
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-[#0A1F44] text-white p-8 text-center border-b border-slate-850">
            <span className="text-3xl">🔑</span>
            <h1 className="text-lg font-poppins font-extrabold tracking-tight mt-3 text-[#D4A017] uppercase">Central Administration</h1>
            <p className="text-slate-400 text-xs mt-1">Authorized Clearance Terminal</p>
          </div>

          <form onSubmit={handleAdminLogin} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-250 text-red-600 text-xs font-semibold rounded-xl">
                ⚠️ {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username token</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password token</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] font-extrabold py-4 rounded-xl text-sm uppercase tracking-wider transition-all cursor-pointer"
            >
              Verify Security Clearance
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CORE LOGGED IN ADMIN LAYOUT
  const studentMatches = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.matricNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const pendingApplicationsCount = applications.filter(a => a.status === 'Pending').length;
  const pendingFeesCount = fees.filter(f => f.status !== 'Paid').length;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Side Control Cabinet */}
      <aside className="w-64 bg-[#0A1F44] text-white flex flex-col shrink-0 border-r border-[#1A2E54]">
        <div className="p-6 border-b border-[#1A2E54] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4A017] rounded-lg flex items-center justify-center text-xl shadow-lg shadow-black/20">
            👑
          </div>
          <div>
            <h1 className="text-sm font-poppins font-bold uppercase tracking-wider text-[#D4A017]">Crown Heritage</h1>
            <p className="text-[10px] opacity-60 font-semibold uppercase">Admin Registrar</p>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto space-y-1">
          <div className="px-6 text-[9px] uppercase tracking-widest text-[#8C9BB4] font-extrabold mb-3">System Hub</div>
          
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">⚙️</span> <span className="text-xs font-semibold">Overview Cabin</span>
          </button>

          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all cursor-pointer ${activeTab === 'students' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">👥</span> <span className="text-xs font-semibold">Students Database</span>
          </button>

          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all relative cursor-pointer ${activeTab === 'applications' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">📝</span> <span className="text-xs font-semibold">Admission Desk</span>
            {pendingApplicationsCount > 0 && (
              <span className="absolute right-4 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingApplicationsCount}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all cursor-pointer ${activeTab === 'courses' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">📚</span> <span className="text-xs font-semibold">Manage Syllabus</span>
          </button>

          <button 
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all cursor-pointer ${activeTab === 'results' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">📋</span> <span className="text-xs font-semibold">Record Marks</span>
          </button>

          <button 
            onClick={() => setActiveTab('fees')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all cursor-pointer ${activeTab === 'fees' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">💳</span> <span className="text-xs font-semibold">Ledger &amp; Invoices</span>
          </button>

          <button 
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center px-6 py-3 text-left transition-all cursor-pointer ${activeTab === 'notices' ? 'bg-[#1A2E54] border-r-4 border-[#D4A017] text-white' : 'text-[#8C9BB4] hover:bg-[#1A2E54]/40 hover:text-white'}`}
          >
            <span className="mr-3">📢</span> <span className="text-xs font-semibold">News Announcements</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#1A2E54]">
          <button 
            onClick={() => {
              if (confirm("Disconnect Admin Session?")) {
                onLogout();
              }
            }}
            className="w-full bg-red-950/40 hover:bg-red-950 text-red-300 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center block"
          >
            🚪 Disconnect Admin
          </button>
        </div>
      </aside>

      {/* Primary content segment */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#D4A017]/10 text-[#D4A017] border border-[#D4A017]/35 text-[10px] font-bold rounded uppercase">Secure Cabin</span>
            <h2 className="text-base font-bold font-poppins text-[#0A1F44] uppercase tracking-wide">
              {activeTab.toUpperCase()} PANEL
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#0A1F44] block">System Registry</span>
              <span className="text-[10px] text-slate-400 font-bold block">Terminal: 127.0.0.1</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0A1F44] text-[#D4A017] flex items-center justify-center font-bold font-mono">A</div>
          </div>
        </header>

        {/* CONTAINER VIEWPORTS */}
        <div className="p-8 flex-1 flex flex-col">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 flex-1 flex flex-col">
              {/* Stat elements */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Matriculated Students</span>
                  <div className="flex justify-between items-end mt-2">
                    <strong className="text-3xl text-[#0A1F44]">{students.length}</strong>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">Active</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Admission Submissions</span>
                  <div className="flex justify-between items-end mt-2">
                    <strong className="text-3xl text-[#D4A017]">{applications.length}</strong>
                    {pendingApplicationsCount > 0 && (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">{pendingApplicationsCount} Pending</span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Departments Listed</span>
                  <div className="flex justify-between items-end mt-2">
                    <strong className="text-3xl text-[#0A1F44]">{DEPARTMENTS.length}</strong>
                    <span className="text-xs text-slate-400">Total Streams</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Due Payments</span>
                  <div className="flex justify-between items-end mt-2">
                    <strong className="text-3xl text-red-600 font-mono">₦{fees.filter(f => f.status !== 'Paid').reduce((ac, f) => ac + f.amount, 0).toLocaleString()}</strong>
                    <span className="text-xs text-slate-400">{pendingFeesCount} invoices</span>
                  </div>
                </div>
              </div>

              {/* Activity log segment */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[300px]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <span className="text-xs font-bold text-[#0A1F44] uppercase tracking-wide">Registry System Log Events</span>
                  <span className="text-[10px] text-slate-400">Latest 25 notifications</span>
                </div>
                <div className="p-6 flex-1 overflow-y-auto font-mono text-xs text-slate-600 space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 border-b border-dashed border-slate-100 pb-2">
                      <span className="text-[10px] text-slate-400 font-semibold">{new Date(log.timestamp).toLocaleString()}</span>
                      <span className={log.type === 'success' ? 'text-green-600 font-bold' : log.type === 'warning' ? 'text-red-500 font-bold' : 'text-blue-600'}>
                        [{log.type.toUpperCase()}]
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS LIST */}
          {activeTab === 'students' && (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Filtering row */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-1/2">
                  <input 
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="🔍 Search Student Database by Name or Matric..."
                    className="w-full text-xs px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4A017]"
                  />
                </div>
                <button 
                  onClick={openAddStudent}
                  className="w-full sm:w-auto bg-[#0A1F44] text-[#D4A017] hover:bg-slate-800 font-bold px-4 py-2.5 text-xs rounded-xl cursor-pointer uppercase tracking-wider"
                >
                  + Add Matric Student
                </button>
              </div>

              {/* Table list */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 bg-slate-50 select-none">
                        <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('matricNo')}>Matric No {sortField === 'matricNo' ? (sortAsc ? '▲' : '▼') : ''}</th>
                        <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('name')}>Student Full Name {sortField === 'name' ? (sortAsc ? '▲' : '▼') : ''}</th>
                        <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('department')}>Department {sortField === 'department' ? (sortAsc ? '▲' : '▼') : ''}</th>
                        <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('level')}>Level {sortField === 'level' ? (sortAsc ? '▲' : '▼') : ''}</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Settings</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {getSortedData(studentMatches).map((s) => (
                        <tr 
                          key={s.matricNo} 
                          className={`border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer ${selectedStudentDetail?.matricNo === s.matricNo ? 'bg-blue-50/40' : ''}`}
                          onClick={() => setSelectedStudentDetail(s)}
                        >
                          <td className="px-6 py-4 font-mono font-bold text-[#0A1F44]">{s.matricNo}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                          <td className="px-6 py-4 text-[#0A1F44] font-medium">{s.department}</td>
                          <td className="px-6 py-4 font-bold">{s.level} Level</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
                          </td>
                          <td className="px-6 py-4 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => openEditStudent(s)} className="p-1 px-2 border rounded-md hover:bg-blue-50 text-blue-600 font-bold text-[10px]">Edit</button>
                            <button onClick={() => deleteStudent(s.matricNo)} className="p-1 px-2 border rounded-md hover:bg-red-50 text-red-500 font-bold text-[10px]">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Details side tray popup */}
                {selectedStudentDetail && (
                  <div className="p-6 border-t border-slate-200 bg-slate-50 grid sm:grid-cols-3 gap-6 relative">
                    <button 
                      onClick={() => setSelectedStudentDetail(null)} 
                      className="absolute top-4 right-4 text-lg font-bold hover:text-red-500"
                    >
                      &times;
                    </button>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Dossier File</span>
                      <strong className="text-[#0A1F44] text-sm">{selectedStudentDetail.name}</strong>
                      <p className="font-mono text-xs">{selectedStudentDetail.matricNo}</p>
                      <p className="text-xs text-slate-500 mt-2">DOB: {selectedStudentDetail.dob || 'None recorded'}</p>
                      <p className="text-xs text-slate-500">Gender: {selectedStudentDetail.gender}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Contact Parameters</span>
                      <p className="text-xs">📞 {selectedStudentDetail.phone}</p>
                      <p className="text-xs">✉ {selectedStudentDetail.email}</p>
                      <p className="text-xs mt-2 text-slate-500">Origin State: {selectedStudentDetail.stateOfOrigin} State</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Curriculum Details</span>
                      <p className="text-xs">Department: {selectedStudentDetail.department}</p>
                      <p className="text-xs font-bold text-[#D4A017]">Programme: {selectedStudentDetail.programme}</p>
                      <p className="text-xs mt-2 text-slate-400">Portal password (Surname): <strong>{selectedStudentDetail.surname.toUpperCase()}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ADMISSION APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <span className="text-xs font-bold text-[#0A1F44] uppercase tracking-wide">All Recieved Online Form Submissions</span>
                  <span className="text-xs font-semibold text-slate-400">Total: {applications.length} filed info packs</span>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium my-auto">
                    <span>📭</span>
                    <p className="mt-2 text-sm">No new student application forms have been logged yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                          <th className="px-6 py-4">Application No</th>
                          <th className="px-6 py-4">Applicant Full Name</th>
                          <th className="px-6 py-4">Programme Applied</th>
                          <th className="px-6 py-4">Date Applied</th>
                          <th className="px-6 py-4 text-center">App State</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {applications.map((ap) => (
                          <tr 
                            key={ap.applicationNo} 
                            className={`border-b border-slate-150 hover:bg-slate-50/50 cursor-pointer ${selectedApp?.applicationNo === ap.applicationNo ? 'bg-blue-50/40' : ''}`}
                            onClick={() => setSelectedApp(ap)}
                          >
                            <td className="px-6 py-4 font-mono font-bold text-[#0A1F44]">{ap.applicationNo}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{ap.fullName}</td>
                            <td className="px-6 py-4 font-bold text-[#D4A017]">{ap.programme}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono">{ap.dateApplied}</td>
                            <td className="px-6 py-4 text-center">
                              <select 
                                value={ap.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleApproveStatus(ap.applicationNo, e.target.value as any)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none ${ap.status === 'Admitted' ? 'bg-green-50 border-green-300 text-green-700' : ap.status === 'Rejected' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-yellow-50 border-yellow-300 text-yellow-800'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Admitted">Admitted</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                              {ap.status === 'Admitted' ? (
                                <button 
                                  onClick={() => convertAppToStudent(ap)}
                                  className="bg-green-600 hover:bg-green-750 text-white font-bold px-3 py-1.5 text-[10px] rounded uppercase select-none cursor-pointer"
                                >
                                  🎓 Convert to Student Record
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Admit first to convert</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Selected Application detail dashboard modal overlay */}
                {selectedApp && (
                  <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-[#0A1F44] uppercase tracking-wider">Verification Checklist for Application #{selectedApp.applicationNo}</h4>
                      <button onClick={() => setSelectedApp(null)} className="text-sm font-bold text-slate-500 hover:text-red-500">&times; Close Preview</button>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-6 text-xs text-slate-700">
                      <div>
                        <strong className="block text-[9px] uppercase text-slate-400">Bio &amp; Contact Info</strong>
                        <p className="font-bold">{selectedApp.fullName}</p>
                        <p>Date of Birth: {selectedApp.dob}</p>
                        <p>State: {selectedApp.stateOfOrigin}</p>
                        <p>Phone: {selectedApp.phone}</p>
                        <p>Email: {selectedApp.email}</p>
                      </div>
                      <div>
                        <strong className="block text-[9px] uppercase text-slate-400">O'Level Qualifications</strong>
                        <table className="w-full text-[10px] mt-1">
                          <tbody>
                            {selectedApp.olevelResults.map((r, i) => (
                              <tr key={i} className="border-b">
                                <td className="py-1">{r.subject}</td>
                                <td className="text-right font-bold text-[#0A1F44]">{r.grade}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <strong className="block text-[9px] uppercase text-slate-400">Next of Kin Details</strong>
                        <p>Name: {selectedApp.nextOfKinName}</p>
                        <p>Relation: {selectedApp.nextOfKinRelationship}</p>
                        <p>Phone: {selectedApp.nextOfKinPhone}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-white border rounded-xl shadow-sm">
                        {selectedApp.passportPhoto ? (
                          <img src={selectedApp.passportPhoto} alt="Passport original" className="w-16 h-16 object-cover border-2 border-[#D4A017] rounded-lg" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 border text-slate-300 text-[10px] flex items-center justify-center rounded-lg">No passport</div>
                        )}
                        <span className="text-[9px] mt-2 text-slate-400">Passport Scanned Document</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CURRICULUM SYLLABUS COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold">Total configuration syllabus modules: {courses.length} courses</span>
                <button 
                  onClick={openAddCourse}
                  className="bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  + Create New Course Module
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4">Course Code</th>
                        <th className="px-6 py-4">Course Title</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4 text-center">Credit Units</th>
                        <th className="px-6 py-4 text-center">Semester / Level</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {courses.map((c) => (
                        <tr key={c.code} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono font-bold text-[#0A1F44]">{c.code}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{c.title}</td>
                          <td className="px-6 py-4 text-slate-600">{c.department}</td>
                          <td className="px-6 py-4 text-center font-bold font-mono">{c.units} Units</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase mr-1">{c.semester}</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{c.level}L</span>
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button 
                              onClick={() => {
                                setEditingCourse(c);
                                setCourseFormCode(c.code);
                                setCourseFormTitle(c.title);
                                setCourseFormUnits(c.units);
                                setCourseFormDept(c.department);
                                setCourseFormLevel(c.level);
                                setCourseFormSemester(c.semester);
                                setShowCourseModal(true);
                              }}
                              className="p-1 px-2 border rounded hover:bg-blue-50 text-blue-600 text-[10px] font-bold"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteCourse(c.code)}
                              className="p-1 px-2 border rounded hover:bg-red-50 text-red-500 text-[10px] font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RECORD STUDENT MARKS/RESULTS */}
          {activeTab === 'results' && (
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Step 1 Filter box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid sm:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Group Department</label>
                  <select 
                    value={resDeptFilter}
                    onChange={(e) => { setResDeptFilter(e.target.value); setSelectedResultStudent(''); }}
                    className="w-full text-xs bg-slate-50 border px-3 py-2 rounded-lg"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Group Level</label>
                  <select 
                    value={resLevelFilter}
                    onChange={(e) => { setResLevelFilter(e.target.value); setSelectedResultStudent(''); }}
                    className="w-full text-xs bg-slate-50 border px-3 py-2 rounded-lg"
                  >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Active Semester</label>
                  <select 
                    value={resSemesterFilter}
                    onChange={(e) => { setResSemesterFilter(e.target.value as any); setSelectedResultStudent(''); }}
                    className="w-full text-xs bg-slate-50 border px-3 py-2 rounded-lg"
                  >
                    <option value="First">First Semester</option>
                    <option value="Second">Second Semester</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setBulkResultMode(!bulkResultMode); setSelectedResultStudent(''); }}
                    className="w-full bg-slate-800 text-[#D4A017] hover:bg-slate-700 text-xs font-bold py-2.5 rounded-lg border border-slate-700"
                  >
                    {bulkResultMode ? 'Single Student View' : 'Group Bulk Course Mode'}
                  </button>
                </div>
              </div>

              {/* Step 2 & 3 Interactive Results Board */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex-grow flex flex-col p-6">
                
                {activeSemesterStudents.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-medium my-auto">
                    <span>👥</span>
                    <p className="mt-2 text-sm">No registered student profiles logged in {resDeptFilter} at {resLevelFilter} Level.</p>
                  </div>
                ) : !bulkResultMode ? (
                  // SINGLE COHORT RESULTS BOARD
                  <div className="grid sm:grid-cols-3 gap-6 flex-1">
                    {/* Left List of students */}
                    <div className="border-r border-slate-100 pr-6 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Double-clic Candidate File</span>
                      {activeSemesterStudents.map(st => (
                        <button 
                          key={st.matricNo}
                          onClick={() => handleLoadStudentResults(st.matricNo)}
                          className={`w-full text-left p-3 text-xs rounded-xl font-medium border flex justify-between items-center cursor-pointer transition-all ${selectedResultStudent === st.matricNo ? 'bg-[#0A1F44] border-[#0A1F44] text-[#D4A017]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                        >
                          <div>
                            <strong>{st.name}</strong>
                            <p className="text-[10px] font-mono opacity-85 mt-0.5">{st.matricNo}</p>
                          </div>
                          <span>→</span>
                        </button>
                      ))}
                    </div>

                    {/* Right Entry Area for student scores */}
                    <div className="sm:col-span-2 flex flex-col justify-between">
                      {selectedResultStudent ? (
                        <div className="space-y-6">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Inputting examination scores profile for:</span>
                            <strong className="text-[#0A1F44] text-sm block mt-1 uppercase">
                              {activeSemesterStudents.find(s => s.matricNo === selectedResultStudent)?.name} ({selectedResultStudent})
                            </strong>
                          </div>

                          {activeSemesterCourses.length === 0 ? (
                            <p className="text-xs text-red-500 font-bold border p-3 rounded bg-red-50">⚠️ No syllabus courses are defined for this filter! Add Courses first.</p>
                          ) : (
                            <div className="space-y-3">
                              {activeSemesterCourses.map(c => (
                                <div key={c.code} className="flex justify-between items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                  <div>
                                    <strong className="text-xs font-mono font-bold text-[#0A1F44]">{c.code}</strong>
                                    <p className="text-[10px] text-slate-500 uppercase">{c.title}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="number" 
                                      min={0}
                                      max={100}
                                      value={scoreInputs[c.code] ?? 0}
                                      onChange={(e) => {
                                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                                        setScoreInputs({ ...scoreInputs, [c.code]: val });
                                      }}
                                      className="w-20 text-center font-bold px-2 py-1 bg-white border border-slate-350 rounded focus:ring-1 focus:ring-[#D4A017]"
                                    />
                                    <span className="text-xs text-slate-400">Points: {calculateGradeAndPoints(scoreInputs[c.code] ?? 0).points} (Grade {calculateGradeAndPoints(scoreInputs[c.code] ?? 0).grade})</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="pt-6 border-t border-slate-100 flex gap-4">
                            <button 
                              onClick={saveIndividualResults}
                              className="bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] font-extrabold text-xs px-6 py-3 rounded-lg uppercase tracking-wider cursor-pointer"
                            >
                              Save Performance transcript Cards
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="my-auto text-center py-12 text-slate-400 font-medium">
                          <span>📦</span>
                          <p className="text-xs mt-2">Select a student record from the left-hand directory to manipulate grades.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // BULK MULTIPLE STUDENT EXAM DIRECTORY ENTRY
                  <div className="space-y-6 flex-grow flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">1. Select Target Course Module for Group Grading</label>
                      <select 
                        value={bulkCourseCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          loadBulkCourseSetup(code);
                        }}
                        className="w-full sm:w-1/2 text-xs bg-slate-50 border px-3 py-2 rounded-lg"
                      >
                        <option value="">-- Choose Course --</option>
                        {activeSemesterCourses.map(c => <option key={c.code} value={c.code}>{c.code} — {c.title}</option>)}
                      </select>
                    </div>

                    {bulkCourseCode ? (
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] my-4 pr-2">
                        {activeSemesterStudents.map(st => (
                          <div key={st.matricNo} className="flex justify-between items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div>
                              <strong className="text-xs uppercase text-[#0A1F44]">{st.name}</strong>
                              <p className="text-[10px] text-slate-400 font-mono">{st.matricNo}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                min={0}
                                max={100}
                                value={bulkScores[st.matricNo] ?? 0}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                                  setBulkScores({ ...bulkScores, [st.matricNo]: val });
                                }}
                                className="w-20 text-center font-bold px-2 py-1 bg-white border border-slate-350 rounded focus:ring-1 focus:ring-[#D4A017]"
                              />
                              <span className="text-xs text-slate-400 font-bold font-mono">
                                ({calculateGradeAndPoints(bulkScores[st.matricNo] ?? 0).grade})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-12 text-slate-400 text-xs">Select a syllabus course above to expand the group grading logs.</p>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                      <button 
                        onClick={saveBulkResults}
                        disabled={!bulkCourseCode}
                        className={`font-semibold text-xs px-6 py-3 rounded-lg uppercase tracking-wider cursor-pointer ${bulkCourseCode ? 'bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017]' : 'bg-slate-100 text-slate-400 border cursor-not-allowed'}`}
                      >
                        Commit Bulk Grades Ledger
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 6: FEES MANAGEMENT */}
          {activeTab === 'fees' && (
            <div className="space-y-6 flex-grow flex flex-col">
              {/* Select target student box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-end justify-between">
                <div className="w-full sm:w-1/2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Select Student Registry File for Billing Audit</label>
                  <select 
                    value={feeStudentSelect}
                    onChange={(e) => setFeeStudentSelect(e.target.value)}
                    className="w-full text-xs bg-slate-50 border px-3 py-2 rounded-lg text-[#0A1F44] font-semibold"
                  >
                    <option value="">-- Click to choose student candidate --</option>
                    {students.map(s => <option key={s.matricNo} value={s.matricNo}>{s.name} ({s.matricNo}) - {s.department}</option>)}
                  </select>
                </div>
                <button 
                  disabled={!feeStudentSelect}
                  onClick={openAddFee}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer uppercase ${feeStudentSelect ? 'bg-[#0A1F44] text-[#D4A017] hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed border'}`}
                >
                  + Add Fee billing Record
                </button>
              </div>

              {/* Fee list */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex-1 flex flex-col p-6">
                {!feeStudentSelect ? (
                  <div className="text-center py-16 text-slate-400 font-medium my-auto">
                    <span>💵</span>
                    <p className="mt-2 text-xs">Please select a student directory file above to audit ledger records.</p>
                  </div>
                ) : selectedStudentFees.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs my-auto">
                    No active billings or invoices found for candidate '{feeStudentSelect}'. Add a billing profile to proceed.
                  </div>
                ) : (
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 bg-slate-50">
                          <th className="px-4 py-3">Session</th>
                          <th className="px-4 py-3">Semester</th>
                          <th className="px-4 py-3">Billing Invoice</th>
                          <th className="px-4 py-3 text-right">Amount (₦)</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {selectedStudentFees.map((f) => (
                          <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="px-4 py-4 font-mono font-bold">{f.academicSession}</td>
                            <td className="px-4 py-4">{f.semester} Semester</td>
                            <td className="px-4 py-4 font-semibold text-[#0A1F44]">{f.description}</td>
                            <td className="px-4 py-4 text-right font-mono font-bold">₦{f.amount.toLocaleString()}</td>
                            <td className="px-4 py-4 text-center">
                              <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-full ${
                                f.status === 'Paid' 
                                  ? 'bg-green-100 text-green-700' 
                                  : f.status === 'Partial' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {f.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center space-x-2">
                              {f.status !== 'Paid' && (
                                <button 
                                  onClick={() => handleMarkAsPaid(f.id)}
                                  className="bg-green-600 hover:bg-green-750 text-white font-bold px-2 py-1 text-[10px] rounded"
                                >
                                  Reconcile PAID
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setEditingFee(f);
                                  setFeeFormSession(f.academicSession);
                                  setFeeFormSemester(f.semester);
                                  setFeeFormDesc(f.description);
                                  setFeeFormAmount(f.amount);
                                  setFeeFormStatus(f.status);
                                  setFeeFormDate(f.datePaid || '');
                                  setShowFeeModal(true);
                                }}
                                className="p-1 px-2 border rounded text-slate-700 text-[10px] hover:bg-slate-100"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteFeeRecord(f.id)}
                                className="p-1 px-2 border rounded hover:bg-red-50 text-red-500 text-[10px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: BULLETINS & ANNOUNCEMENTS */}
          {activeTab === 'notices' && (
            <div className="space-y-6 flex-grow flex flex-col">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold">Total active home bulletins: {notices.length} notices</span>
                <button 
                  onClick={openAddNotice}
                  className="bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  + Add announcement Bulletin
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4">Bulletin Category</th>
                        <th className="px-6 py-4">Title Heading</th>
                        <th className="px-6 py-4">Date Issued</th>
                        <th className="px-6 py-4 text-center">Settings</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-slate-700">
                      {notices.map((n) => (
                        <tr key={n.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-6 py-4 uppercase font-bold text-slate-400">{n.category}</td>
                          <td className="px-6 py-4 font-bold text-[#0A1F44]">{n.title}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{n.date}</td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button 
                              onClick={() => {
                                setEditingNotice(n);
                                setNoticeFormTitle(n.title);
                                setNoticeFormContent(n.content);
                                setNoticeFormCategory(n.category);
                                setShowNoticeModal(true);
                              }}
                              className="p-1 px-2 border rounded hover:bg-blue-50 text-blue-600 font-bold text-[10px]"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => deleteNotice(n.id)}
                              className="p-1 px-2 border rounded hover:bg-red-50 text-red-500 font-bold text-[10px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODALS - DETACHED POPUPS FOR CRUD ACTIONS */}

      {/* 1. Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0A1F44] text-white p-6 flex justify-between items-center">
              <h3 className="text-sm font-poppins font-bold uppercase tracking-wider text-[#D4A017]">{editingStudent ? 'Adjust Student Profile' : 'Matriculate New Candidate'}</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-xl font-bold hover:text-red-500">&times;</button>
            </div>
            
            <form onSubmit={handleStudentFormSubmit} className="p-6 grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">STUDENT FULL NAME</label>
                <input type="text" value={studentFormName} onChange={e => setStudentFormName(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="e.g. Samuel Adekunle" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">MATRIC NUMBER INDEX</label>
                <input type="text" value={studentFormMatric} onChange={e => setStudentFormMatric(e.target.value)} disabled={!!editingStudent} className="w-full p-2 bg-slate-50 border rounded-lg focus:outline-none uppercase" placeholder="e.g. CHCH/2024/005" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">SURNAME PASSWORD TOKEN</label>
                <input type="text" value={studentFormSurname} onChange={e => setStudentFormSurname(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="Used directly for portal entry verification" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">COHORT DEPARTMENT</label>
                <select value={studentFormDept} onChange={e => setStudentFormDept(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">ACADEMIC STUDY LEVEL</label>
                <select value={studentFormLevel} onChange={e => setStudentFormLevel(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">PROGRAMME DESIGNATION</label>
                <input type="text" value={studentFormProg} onChange={e => setStudentFormProg(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="e.g. Pharmacy Technician Science" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">SEX GENDER</label>
                <select value={studentFormGender} onChange={e => setStudentFormGender(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">STATE OF ORIGIN</label>
                <select value={studentFormState} onChange={e => setStudentFormState(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="">-- Choose State --</option>
                  {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2 pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setShowStudentModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A1F44] text-[#D4A017] rounded-lg font-bold">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0A1F44] text-white p-6 flex justify-between items-center">
              <h3 className="text-sm font-poppins font-bold uppercase tracking-wider text-[#D4A017]">{editingCourse ? 'Edit Course Syllabus Class' : 'Create Course Syllabus Class'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-xl font-bold hover:text-red-500">&times;</button>
            </div>
            
            <form onSubmit={handleCourseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">COURSE CODE INDEX</label>
                <input type="text" value={courseFormCode} onChange={e => setCourseFormCode(e.target.value)} disabled={!!editingCourse} className="w-full p-2 bg-slate-50 border rounded-lg uppercase" placeholder="e.g. NSG101" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">COURSE TITLE TITLE</label>
                <input type="text" value={courseFormTitle} onChange={e => setCourseFormTitle(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="e.g. Human Anatomy and Pathology I" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">CREDIT MODULE UNITS VALUE</label>
                <input type="number" min={1} max={6} value={courseFormUnits} onChange={e => setCourseFormUnits(Number(e.target.value))} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">AFFILIATED COLLEGE DEPARTMENT</label>
                <select value={courseFormDept} onChange={e => setCourseFormDept(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">RECOMMENDED TARGET LEVEL</label>
                <select value={courseFormLevel} onChange={e => setCourseFormLevel(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">TARGET SEMESTER STREAM</label>
                <select value={courseFormSemester} onChange={e => setCourseFormSemester(e.target.value as any)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A1F44] text-[#D4A017] rounded-lg font-bold">Register Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Fee Billing Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0A1F44] text-white p-6 flex justify-between items-center">
              <h3 className="text-sm font-poppins font-bold uppercase tracking-wider text-[#D4A017]">{editingFee ? 'Edit Invoice properties' : 'Create Billing Invoice'}</h3>
              <button onClick={() => setShowFeeModal(false)} className="text-xl font-bold hover:text-red-500">&times;</button>
            </div>
            
            <form onSubmit={handleFeeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">ACADEMIC SESSION RANGE</label>
                <select value={feeFormSession} onChange={e => setFeeFormSession(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">STUDY SEMESTER STREAM</label>
                <select value={feeFormSemester} onChange={e => setFeeFormSemester(e.target.value as any)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">BILLING INVOICE TITLE DESCRIPTION</label>
                <input type="text" value={feeFormDesc} onChange={e => setFeeFormDesc(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="e.g. School Fees, Laboratory Practice Fee" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">AMOUNT TO CHARGE (₦)</label>
                <input type="number" min={1} value={feeFormAmount} onChange={e => setFeeFormAmount(Number(e.target.value))} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">PAYMENT RECONCILED STATUS</label>
                <select value={feeFormStatus} onChange={e => setFeeFormStatus(e.target.value as any)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              {feeFormStatus !== 'Unpaid' && (
                <div>
                  <label className="block text-slate-400 font-bold mb-1">DATE OF TRANSACTION SETTLEMENT</label>
                  <input type="date" value={feeFormDate} onChange={e => setFeeFormDate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
              )}

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setShowFeeModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A1F44] text-[#D4A017] rounded-lg font-bold">Process Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Notice Publisher Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0A1F44] text-white p-6 flex justify-between items-center">
              <h3 className="text-sm font-poppins font-bold uppercase tracking-wider text-[#D4A017]">{editingNotice ? 'Edit Bulletin Notification' : 'Compose Bulletin Announcement'}</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-xl font-bold hover:text-red-500">&times;</button>
            </div>
            
            <form onSubmit={handleNoticeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">COMMUNICATION CLASSIFICATION</label>
                <select value={noticeFormCategory} onChange={e => setNoticeFormCategory(e.target.value as any)} className="w-full p-2 bg-slate-50 border rounded-lg">
                  <option value="General">General News</option>
                  <option value="Academic">Academic Schedule</option>
                  <option value="Fees">Fees &amp; Payments</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">BULLETIN TITLE</label>
                <input type="text" value={noticeFormTitle} onChange={e => setNoticeFormTitle(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="Compose eye-snapping outline..." />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">BULLETIN CONTENT TEXT</label>
                <textarea rows={4} value={noticeFormContent} onChange={e => setNoticeFormContent(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" placeholder="Supply the main message context rules here..." />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setShowNoticeModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A1F44] text-[#D4A017] rounded-lg font-bold">Publish Bulletin</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
