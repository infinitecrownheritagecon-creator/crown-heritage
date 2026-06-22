import React, { useState, useEffect } from 'react';
import { 
  initSeedDatabase, 
  getLocalStorageData, 
  saveLocalStorageData, 
  logAction 
} from './seed';
import { 
  Student, 
  Course, 
  Result, 
  Fee, 
  Application, 
  Notice, 
  ActivityLog 
} from './types';

import LandingPage from './components/LandingPage';
import AdmissionForm from './components/AdmissionForm';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';
import Toast from './components/Toast';

export default function App() {
  // Navigation states: 'home' | 'admission' | 'student-login' | 'admin-login'
  const [activeView, setActiveView] = useState<'home' | 'admission' | 'student-login' | 'admin-login'>('home');

  // Core Data Lists
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Security and Session states
  const [loggedInAdmin, setLoggedInAdmin] = useState<boolean>(false);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);

  // Success Modal state for Admission Submission
  const [activeSuccessModal, setActiveSuccessModal] = useState<{ appNo: string; applicantName: string } | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Initialize and seed on startup
  useEffect(() => {
    initSeedDatabase();
    
    // Load from LocalStorage
    const fetchedStudents = getLocalStorageData<Student[]>('chch_students', []);
    const fetchedCourses = getLocalStorageData<Course[]>('chch_courses', []);
    const fetchedResults = getLocalStorageData<Result[]>('chch_results', []);
    const fetchedFees = getLocalStorageData<Fee[]>('chch_fees', []);
    const fetchedApps = getLocalStorageData<Application[]>('chch_applications', []);
    const fetchedNotices = getLocalStorageData<Notice[]>('chch_notices', []);
    const fetchedLogs = getLocalStorageData<ActivityLog[]>('chch_activity_logs', []);
    const adminSession = getLocalStorageData<boolean>('chch_admin_session', false);
    const studentSession = getLocalStorageData<string>('chch_student_session', '');

    setStudents(fetchedStudents);
    setCourses(fetchedCourses);
    setResults(fetchedResults);
    setFees(fetchedFees);
    setApplications(fetchedApps);
    setNotices(fetchedNotices);
    setActivityLogs(fetchedLogs);
    setLoggedInAdmin(adminSession);

    if (studentSession) {
      const match = fetchedStudents.find(s => s.matricNo === studentSession);
      if (match) {
        setLoggedInStudent(match);
        setActiveView('student-login'); // Auto-routing to active panel
      }
    } else if (adminSession) {
      setActiveView('admin-login'); // Auto-routing to active admin panel
    }
  }, []);

  // Sync wrappers to write state directly to Storage
  const handleSetStudents = (updated: Student[]) => {
    setStudents(updated);
    saveLocalStorageData('chch_students', updated);
  };

  const handleSetCourses = (updated: Course[]) => {
    setCourses(updated);
    saveLocalStorageData('chch_courses', updated);
  };

  const handleSetResults = (updated: Result[]) => {
    setResults(updated);
    saveLocalStorageData('chch_results', updated);
  };

  const handleSetFees = (updated: Fee[]) => {
    setFees(updated);
    saveLocalStorageData('chch_fees', updated);
  };

  const handleSetApplications = (updated: Application[]) => {
    setApplications(updated);
    saveLocalStorageData('chch_applications', updated);
  };

  const handleSetNotices = (updated: Notice[]) => {
    setNotices(updated);
    saveLocalStorageData('chch_notices', updated);
  };

  const handleSetAdminLogin = (status: boolean) => {
    setLoggedInAdmin(status);
    saveLocalStorageData('chch_admin_session', status);
    if (!status) {
      localStorage.removeItem('chch_admin_session');
    }
  };

  const handleSetStudentLogin = (studentObj: Student | null) => {
    setLoggedInStudent(studentObj);
    if (studentObj) {
      saveLocalStorageData('chch_student_session', studentObj.matricNo);
    } else {
      localStorage.removeItem('chch_student_session');
    }
  };

  // Toast dispatch handler
  const handleAddToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  // Logout operations
  const handleLogoutAdmin = () => {
    handleSetAdminLogin(false);
    setActiveView('home');
    handleAddToast("Administrator decoupled. Logs safely archived.", "info");
  };

  const handleLogoutStudent = () => {
    handleSetStudentLogin(null);
    setActiveView('home');
    handleAddToast("Logged out safely from candidate portal.", "success");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Dynamic Main view switcher */}
      {activeView === 'home' && (
        <LandingPage 
          onNavigate={(v) => {
            if (v === 'student-login' && loggedInStudent) {
              setActiveView('student-login');
            } else if (v === 'admin-login' && loggedInAdmin) {
              setActiveView('admin-login');
            } else {
              setActiveView(v);
            }
          }}
          notices={notices}
        />
      )}

      {activeView === 'admission' && (
        <AdmissionForm 
          programmes={[
            'Nursing Science',
            'Medical Laboratory Science',
            'Public Health Technology',
            'Pharmacy Technician',
            'Physiotherapy Technology',
            'Health Information Management'
          ]}
          onBack={() => setActiveView('home')}
          onSubmitSuccess={(appNo, appData) => {
            // refresh apps dataset in view
            const updatedApps = getLocalStorageData<Application[]>('chch_applications', []);
            setApplications(updatedApps);
            
            // show success modal popup
            setActiveSuccessModal({ appNo, applicantName: appData.fullName });
            logAction(`Successful admission application received for ${appData.fullName} with number ${appNo}`, 'success');
            setActiveView('home');
          }}
        />
      )}

      {activeView === 'student-login' && (
        <StudentPortal 
          onBack={() => setActiveView('home')}
          students={students}
          courses={courses}
          results={results}
          fees={fees}
          loggedInStudent={loggedInStudent}
          onLoginSuccess={(st) => handleSetStudentLogin(st)}
          onLogout={handleLogoutStudent}
          onAddToast={handleAddToast}
        />
      )}

      {activeView === 'admin-login' && (
        <AdminPortal 
          onBack={() => setActiveView('home')}
          students={students}
          courses={courses}
          results={results}
          fees={fees}
          applications={applications}
          notices={notices}
          activityLogs={activityLogs}
          onSetStudents={handleSetStudents}
          onSetCourses={handleSetCourses}
          onSetResults={handleSetResults}
          onSetFees={handleSetFees}
          onSetApplications={handleSetApplications}
          onSetNotices={handleSetNotices}
          loggedInAdmin={loggedInAdmin}
          onSetLoggedInAdmin={handleSetAdminLogin}
          onLogout={handleLogoutAdmin}
          onAddToast={handleAddToast}
        />
      )}

      {/* SUCCESS POPUP MODAL AFTER ADMISSION FORM SUBMIT */}
      {activeSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#0A1F44] text-white p-6 text-center">
              <span className="text-4xl">🎉</span>
              <h3 className="text-lg font-poppins font-extrabold text-[#D4A017] uppercase tracking-wide mt-3">Application Filed Successfully</h3>
              <p className="text-[10px] text-slate-300 font-bold tracking-wider uppercase mt-1">Registrar Admission Senate</p>
            </div>
            
            <div className="p-8 space-y-4 text-xs sm:text-sm text-slate-700">
              <p>Congratulations, <strong>{activeSuccessModal.applicantName}</strong>!</p>
              <p>Your online admission application file has been validated and committed securely to the college registry database.</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-[#D4A017]/30 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">YOUR UNIQUE APPLICATION NUMBER</span>
                <strong className="text-xl sm:text-2xl font-mono text-[#0A1F44] tracking-widest">{activeSuccessModal.appNo}</strong>
              </div>

              <div className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-lg border leading-relaxed">
                <strong className="text-[#0A1F44]">Academic Instructions:</strong> Please write down or bookmark your Application Number. The Admission Board processes review files within <strong>14 working days</strong>. Search back with this number to check your Admission Clearance Status.
              </div>

              <div className="pt-4 flex">
                <button 
                  onClick={() => setActiveSuccessModal(null)}
                  className="w-full bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  I Have Recorded My Application Number
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast component fallback */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
