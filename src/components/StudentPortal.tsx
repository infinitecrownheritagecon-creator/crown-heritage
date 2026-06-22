import React, { useState } from 'react';
import { Student, Course, Result, Fee, CourseRegistration } from '../types';
import { calculateGradeAndPoints } from '../seed';

interface StudentPortalProps {
  onBack: () => void;
  students: Student[];
  courses: Course[];
  results: Result[];
  fees: Fee[];
  registrations: CourseRegistration[];
  onSetRegistrations: (regs: CourseRegistration[]) => void;
  activeSession: string;
  activeSemester: 'First' | 'Second';
  onLogout: () => void;
  loggedInStudent: Student | null;
  onLoginSuccess: (student: Student) => void;
  onAddToast: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function StudentPortal({
  onBack,
  students,
  courses,
  results,
  fees,
  registrations,
  onSetRegistrations,
  activeSession,
  activeSemester,
  onLogout,
  loggedInStudent,
  onLoginSuccess,
  onAddToast
}: StudentPortalProps) {
  // Login input state
  const [matricInput, setMatricInput] = useState('');
  const [surnameInput, setSurnameInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'fees' | 'course-reg'>('results');
  const [selectedSemester, setSelectedSemester] = useState('100L_First');

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedMatric = matricInput.trim();
    const trimmedSurname = surnameInput.trim().toLowerCase();

    if (!trimmedMatric || !trimmedSurname) {
      setLoginError('Both Matric Number and Surname are required.');
      return;
    }

    const matched = students.find(s => 
      s.matricNo.toLowerCase() === trimmedMatric.toLowerCase() &&
      s.surname.toLowerCase() === trimmedSurname
    );

    if (matched) {
      onLoginSuccess(matched);
      onAddToast(`Welcome back, ${matched.name}!`, 'success');
    } else {
      setLoginError('Invalid Matric Number or Surname. Check credentials and retry.');
    }
  };

  // If not logged in, show student login form
  if (!loggedInStudent) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        {/* Back link */}
        <div className="mb-6">
          <button 
            onClick={onBack}
            className="text-sm font-bold text-[#0A1F44] hover:text-[#D4A017] transition-all cursor-pointer"
          >
            ← Back to Homepage
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-[#0A1F44] text-white p-8 text-center border-b border-slate-800">
            <span className="text-3xl">👑</span>
            <h1 className="text-xl font-poppins font-extrabold tracking-tight mt-3 text-white uppercase">Student Portal</h1>
            <p className="text-slate-400 text-xs mt-1">Crown Heritage College of Health</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                ⚠️ {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Matriculation Number</label>
              <input 
                type="text" 
                value={matricInput}
                onChange={(e) => setMatricInput(e.target.value)}
                placeholder="e.g. CHCH/2024/001"
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Surname (Used as Password)</label>
              <input 
                type="password" 
                value={surnameInput}
                onChange={(e) => setSurnameInput(e.target.value)}
                placeholder="Enter surname (case-insensitive)"
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] font-extrabold py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-[#0A1F44]/15 transition-all cursor-pointer"
            >
              Secure Portal Login
            </button>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400">
                Forget matric status? Contact College ICT office for authentication credentials.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED-IN STUDENT DASHBOARD
  const myResults = results.filter(r => r.studentMatric === loggedInStudent.matricNo);
  const myFees = fees.filter(f => f.studentMatric === loggedInStudent.matricNo);

  // Semesters list
  const semesterMap: Record<string, { label: string; semester: 'First' | 'Second'; level: string }> = {
    '100L_First': { label: '100 Level - First Semester', semester: 'First', level: '100' },
    '100L_Second': { label: '100 Level - Second Semester', semester: 'Second', level: '100' },
    '200L_First': { label: '200 Level - First Semester', semester: 'First', level: '200' },
    '200L_Second': { label: '200 Level - Second Semester', semester: 'Second', level: '200' },
    '300L_First': { label: '300 Level - First Semester', semester: 'First', level: '300' },
    '300L_Second': { label: '300 Level - Second Semester', semester: 'Second', level: '300' },
    '400L_First': { label: '400 Level - First Semester', semester: 'First', level: '400' },
    '400L_Second': { label: '400 Level - Second Semester', semester: 'Second', level: '400' },
    '500L_First': { label: '500 Level - First Semester', semester: 'First', level: '500' },
    '500L_Second': { label: '500 Level - Second Semester', semester: 'Second', level: '500' }
  };

  // Handle current selected semester result filtering
  const selectedInfo = semesterMap[selectedSemester];
  const currentSemesterResults = myResults.filter(r => 
    r.semester === selectedInfo.semester && r.level === selectedInfo.level
  );

  // GPA calculation helper for active semester
  const computeSemesterGPA = (semResults: Result[]) => {
    let totalUnits = 0;
    let totalPointsAccumulated = 0;

    semResults.forEach(r => {
      const course = courses.find(c => c.code === r.courseCode);
      const units = course ? course.units : 2; // fallback unit
      totalUnits += units;
      totalPointsAccumulated += (r.points * units);
    });

    const gpa = totalUnits > 0 ? (totalPointsAccumulated / totalUnits) : 0;
    return {
      totalUnits,
      totalPointsAccumulated,
      gpa: parseFloat(gpa.toFixed(2))
    };
  };

  const currentGPAStats = computeSemesterGPA(currentSemesterResults);

  // Compute CGPA (All registered results of this student)
  const computeCGPA = (allResults: Result[]) => {
    let totalUnits = 0;
    let totalPointsAccumulated = 0;

    allResults.forEach(r => {
      const course = courses.find(c => c.code === r.courseCode);
      const units = course ? course.units : 2;
      totalUnits += units;
      totalPointsAccumulated += (r.points * units);
    });

    const cgpa = totalUnits > 0 ? (totalPointsAccumulated / totalUnits) : 0;
    return parseFloat(cgpa.toFixed(2));
  };

  const cumulativeCGPA = computeCGPA(myResults);

  // Fees calculation
  const totalFeesRequired = myFees.reduce((acc, f) => acc + f.amount, 0);
  const totalFeesPaid = myFees.reduce((acc, f) => {
    if (f.status === 'Paid') return acc + f.amount;
    if (f.status === 'Partial') return acc + (f.amount * 0.5); // assuming half payment for demo simulation
    return acc;
  }, 0);
  const outstandingBalance = totalFeesRequired - totalFeesPaid;
  const isCleared = outstandingBalance <= 10; // offset check or zero

  const handlePrint = () => {
    window.print();
  };

  const getGradeBg = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-yellow-100 text-yellow-700';
      case 'D': return 'bg-orange-100 text-orange-700';
      case 'E': return 'bg-purple-100 text-purple-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden font-sans print:h-auto print:bg-white print:overflow-visible">
      
      {/* SIDEBAR - Hidden in Print */}
      <aside className="w-full md:w-64 bg-[#0A1F44] text-white flex flex-col shrink-0 print:hidden border-b md:border-b-0 md:border-r border-[#1A2E54]">
        <div className="p-6 border-b border-[#1A2E54] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4A017] rounded-lg flex items-center justify-center text-xl shadow-lg shadow-black/20">
            👑
          </div>
          <div>
            <h1 className="text-sm font-poppins font-bold leading-none uppercase tracking-wider text-[#D4A017]">Crown Heritage</h1>
            <p className="text-[9px] opacity-65 font-medium block mt-1 uppercase">Student Console</p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex-1 py-6 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
          <div className="hidden md:block px-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Portal Tabs</div>
          
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex items-center px-6 py-3 border-r-4 transition-all text-left whitespace-nowrap cursor-pointer flex-1 md:flex-none ${
              activeTab === 'results' 
                ? 'bg-[#1A2E54] border-[#D4A017] text-white font-semibold' 
                : 'border-transparent text-slate-300 hover:bg-[#1A2E54]/50 hover:text-white'
            }`}
          >
            <span className="mr-3 opacity-80 text-base">📊</span>
            <span className="text-sm">My Results</span>
          </button>

          <button 
            onClick={() => setActiveTab('course-reg')}
            className={`flex items-center px-6 py-3 border-r-4 transition-all text-left whitespace-nowrap cursor-pointer flex-1 md:flex-none ${
              activeTab === 'course-reg' 
                ? 'bg-[#1A2E54] border-[#D4A017] text-white font-semibold' 
                : 'border-transparent text-slate-300 hover:bg-[#1A2E54]/50 hover:text-white'
            }`}
          >
            <span className="mr-3 opacity-80 text-base">✏️</span>
            <span className="text-sm">Course Registration</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center px-6 py-3 border-r-4 transition-all text-left whitespace-nowrap cursor-pointer flex-1 md:flex-none ${
              activeTab === 'profile' 
                ? 'bg-[#1A2E54] border-[#D4A017] text-white font-semibold' 
                : 'border-transparent text-slate-300 hover:bg-[#1A2E54]/50 hover:text-white'
            }`}
          >
            <span className="mr-3 opacity-80 text-base">👤</span>
            <span className="text-sm">My Profile</span>
          </button>

          <button 
            onClick={() => setActiveTab('fees')}
            className={`flex items-center px-6 py-3 border-r-4 transition-all text-left whitespace-nowrap cursor-pointer flex-1 md:flex-none ${
              activeTab === 'fees' 
                ? 'bg-[#1A2E54] border-[#D4A017] text-white font-semibold' 
                : 'border-transparent text-slate-300 hover:bg-[#1A2E54]/50 hover:text-white'
            }`}
          >
            <span className="mr-3 opacity-80 text-base">💸</span>
            <span className="text-sm">Fee Status</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#1A2E54] hidden md:block">
          <div className="bg-[#1A2E54] rounded-xl p-4 text-xs">
            <span className="text-[10px] text-[#D4A017] font-bold uppercase block mb-1">Active Study Level</span>
            <p className="text-slate-300">{loggedInStudent.level} Level</p>
            <p className="font-bold text-white mt-1 uppercase text-[10px]">{loggedInStudent.department}</p>
          </div>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to log out from your Student Profile?')) {
                onLogout();
              }
            }}
            className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-red-300 hover:text-red-400 transition-all focus:outline-none cursor-pointer"
          >
            <span>🚪</span> Logout Account
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto print:overflow-visible">
        
        {/* Top Header - Hidden in Print */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sm:px-8 shrink-0 print:hidden shadow-sm">
          <div className="flex items-center">
            <h2 className="text-base font-bold text-[#0A1F44] font-poppins uppercase tracking-tight">
              {activeTab === 'results' ? 'Academic Examination Transcripts' : activeTab === 'course-reg' ? 'Semester Course Registration' : activeTab === 'profile' ? 'Student Digital Dossier' : 'College Finance Account'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-[#0A1F44]">{loggedInStudent.name}</p>
              <p className="text-[10px] text-slate-400 font-bold">{loggedInStudent.matricNo}</p>
            </div>
            {/* Passport element */}
            <div className="w-10 h-10 rounded-full border-2 border-[#D4A017] bg-slate-200 overflow-hidden shrink-0">
              {loggedInStudent.passportPhoto ? (
                <img src={loggedInStudent.passportPhoto} alt="Student avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loggedInStudent.name)}&background=0A1F44&color=fff`} alt="Avatar mock" referrerPolicy="no-referrer" />
              )}
            </div>
            <button 
              onClick={() => { if (confirm('Log out?')) onLogout(); }} 
              className="md:hidden p-2 text-red-500 text-lg"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col print:p-0 print:block">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in print:block">
              <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#0A1F44] to-[#1A2E54] text-white p-6 relative">
                  <div className="absolute top-4 right-4 text-6xl opacity-10">👑</div>
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl border-4 border-[#D4A017] bg-white overflow-hidden relative shrink-0">
                      {loggedInStudent.passportPhoto ? (
                        <img src={loggedInStudent.passportPhoto} alt="Original passport" className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loggedInStudent.name)}&background=0A1F44&color=fff&size=128`} alt="Original passport generator" referrerPolicy="no-referrer"/>
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="px-3 py-1 bg-[#D4A017] text-black text-[10px] font-bold rounded-full uppercase tracking-wider">Active Student</span>
                      <h3 className="text-xl font-poppins font-extrabold mt-2 text-white">{loggedInStudent.name}</h3>
                      <p className="text-xs text-slate-300 font-mono mt-1 font-bold">{loggedInStudent.matricNo}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Surname</span>
                    <strong className="text-sm text-[#0A1F44] uppercase">{loggedInStudent.surname}</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Department / Programme</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.programme || `${loggedInStudent.department} Science`}</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Academic Level</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.level} Level</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Sex / Gender</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.gender}</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Date of Birth</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.dob}</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">State of Origin</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.stateOfOrigin} State</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">LGA of Origin</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.lga || 'Ota'}</strong>
                  </div>
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Phone Contact</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.phone}</strong>
                  </div>
                  <div className="sm:col-span-2 border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                    <strong className="text-sm text-[#0A1F44]">{loggedInStudent.email}</strong>
                  </div>
                  <div className="sm:col-span-2 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Physical Residential Address</span>
                    <strong className="text-sm text-[#0A1F44] leading-relaxed">{loggedInStudent.address || 'Km 4, Idiroko Expressway, Ota.'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESULTS */}
          {activeTab === 'results' && (
            <div className="space-y-6 flex-1 flex flex-col print:block">
              
              {/* Header Box with GPAs - Hidden in Print */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Semester GPA</span>
                  <span className="text-2xl font-bold text-[#0A1F44] mt-2">{currentGPAStats.gpa.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold mt-1 ${currentGPAStats.gpa >= 4.5 ? 'text-green-500' : currentGPAStats.gpa >= 3.5 ? 'text-blue-500' : 'text-slate-400'}`}>
                    Level: {currentGPAStats.gpa >= 4.5 ? 'First Class' : currentGPAStats.gpa >= 3.5 ? 'Second Class Upper' : 'Passing State'}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cumulative CGPA</span>
                  <span className="text-2xl font-bold text-[#D4A017] mt-2">{cumulativeCGPA.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">Full GPA Stream</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Courses</span>
                  <span className="text-2xl font-bold text-[#0A1F44] mt-2">{currentSemesterResults.length}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">This semester</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Fees</span>
                  <span className={`text-2xl font-bold mt-2 ${outstandingBalance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ₦{outstandingBalance.toLocaleString()}
                  </span>
                  <span className={`text-[9px] font-bold uppercase mt-1 ${isCleared ? 'text-green-500' : 'text-red-500'}`}>
                    {isCleared ? 'Cleared' : 'Permit Blocked'}
                  </span>
                </div>
              </div>

              {/* Selector Bar - Hidden in Print */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-xs font-bold text-slate-500 uppercase shrink-0">Choose Semester:</label>
                  <select 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[#0A1F44] font-semibold focus:outline-none"
                  >
                    {Object.entries(semesterMap).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={handlePrint}
                    className="flex-1 sm:flex-none bg-[#0A1F44] hover:bg-slate-800 text-white font-bold px-4 py-2 text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    🖨️ Print Transcript
                  </button>
                </div>
              </div>

              {/* RESULTS TABLE / SHEET */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col print:border-0 print:shadow-none">
                
                {/* Print Letterhead - Only visible during print */}
                <div className="hidden print:block p-8 text-center border-b-2 border-[#0A1F44] mb-8">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <span className="text-5xl">👑</span>
                    <div className="text-left">
                      <h1 className="text-3xl font-poppins font-extrabold text-[#0A1F44] uppercase tracking-tight">Crown Heritage College of Health</h1>
                      <p className="text-sm italic font-semibold text-[#D4A017]">Excellence in Health Education</p>
                      <p className="text-xs text-slate-500 mt-1">Ogun State, Nigeria | info@crownheritage.edu.ng | Portal: portal.crownheritage.edu.ng</p>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 mt-6 border-t pt-4 border-dashed border-slate-300">
                    OFFICIAL SEMESTER EXAMINATION TRANSCRIPT
                  </h2>
                </div>

                {/* Patient / Student Mini-data inside letterhead for print */}
                <div className="hidden print:grid grid-cols-2 gap-4 text-xs mb-6 border p-4 rounded-xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-500 uppercase">Student Name:</span> {loggedInStudent.name}
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase">Matriculation No:</span> {loggedInStudent.matricNo}
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase">Department / Programme:</span> {loggedInStudent.programme || loggedInStudent.department}
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase">Study Level/Semester:</span> {semesterMap[selectedSemester].label}
                  </div>
                </div>

                {/* Table Header inside Results area */}
                <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center print:bg-transparent print:border-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#0A1F44] text-white text-[10px] font-bold rounded-full print:border print:text-black print:bg-transparent uppercase">{selectedInfo.level}L</span>
                    <span className="px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full uppercase print:border print:text-black print:bg-transparent">{selectedInfo.semester} Semester</span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-[#0A1F44]">GPA: </span>
                    <span className="font-mono bg-blue-50 px-2 py-0.5 rounded font-bold text-sm text-[#0A1F44] border print:bg-transparent">{currentGPAStats.gpa.toFixed(2)}</span>
                  </div>
                </div>

                {currentSemesterResults.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <span className="text-3xl block filter grayscale mb-2">📁</span>
                    <p className="text-sm font-medium">No results or grades uploaded for this semester yet.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Please consult your course coordinator if you have completed the exams.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 print:border-slate-300">
                          <th className="px-6 py-4">Course Code</th>
                          <th className="px-6 py-4">Course Title</th>
                          <th className="px-6 py-4 text-center">Credit Units</th>
                          <th className="px-6 py-4 text-center">Score</th>
                          <th className="px-6 py-4 text-center">Grade</th>
                          <th className="px-6 py-4 text-center">Grade Point</th>
                          <th className="px-6 py-4">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {currentSemesterResults.map((r, idx) => {
                          const courseObj = courses.find(c => c.code === r.courseCode);
                          return (
                            <tr key={idx} className="border-b border-slate-100 print:border-slate-300 hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono font-bold text-[#0A1F44]">{r.courseCode}</td>
                              <td className="px-6 py-4 text-slate-600 font-medium">{courseObj?.title || 'Unknown Course'}</td>
                              <td className="px-6 py-4 text-center font-bold font-mono text-slate-700">{courseObj?.units || 2}</td>
                              <td className="px-6 py-4 text-center font-bold text-slate-800">{r.score}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`w-8 h-8 inline-flex items-center justify-center font-bold rounded-lg ${getGradeBg(r.grade)} print:bg-transparent print:text-black print:border`}>
                                  {r.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center font-mono font-bold text-slate-600">{r.points}</td>
                              <td className="px-6 py-4">
                                <span className={`font-bold text-xs uppercase tracking-tight ${r.remark === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                                  {r.remark}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Summary points at end of table */}
                {currentSemesterResults.length > 0 && (
                  <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-600 print:bg-transparent print:border-slate-300">
                    <div className="space-y-1">
                      <p>Total Registered Credit Units: <strong>{currentGPAStats.totalUnits} Units</strong></p>
                      <p>Total Cumulative Credit Points: <strong>{currentGPAStats.totalPointsAccumulated} Points</strong></p>
                    </div>
                    <div className="sm:text-right space-y-1">
                      <p>Semester G.P.A Score: <strong className="text-sm font-mono text-[#0A1F44]">{currentGPAStats.gpa.toFixed(2)} / 5.00</strong></p>
                      <p>Active Cumulative C.G.P.A: <strong className="text-sm font-mono text-[#D4A017]">{cumulativeCGPA.toFixed(2)} / 5.00</strong></p>
                    </div>
                  </div>
                )}

                {/* Print Verification footer (only printed) */}
                <div className="hidden print:block mt-16 pt-12 border-t border-dashed border-slate-300">
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-center w-40">
                      <div className="h-10 border-b border-slate-400 mb-2"></div>
                      <p className="font-bold uppercase text-[9px] text-slate-500">Registrar Signature / Date</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 italic font-mono text-[9px]">Crown Heritage Security Authenticity: Verification ID #CH-SEC-{loggedInStudent.matricNo.split('/').pop()}-2025</p>
                    </div>
                    <div className="text-center w-40">
                      <div className="h-10 border-b border-slate-400 mb-2"></div>
                      <p className="font-bold uppercase text-[9px] text-slate-500">College Seal &amp; Stamp</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: COURSE REGISTRATION */}
          {activeTab === 'course-reg' && (
            <div className="space-y-6 flex-grow animate-fade-in print:block">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F44] font-poppins uppercase">Course Registration Portal</h3>
                    <p className="text-xs text-slate-400 mt-1">Register your required courses for the active academic session</p>
                  </div>
                  <div className="py-1 px-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold text-center">
                    🗓️ Active Session: {activeSession} | {activeSemester} Semester
                  </div>
                </div>
              </div>

              {registrations.filter(r => 
                r.studentMatric === loggedInStudent.matricNo &&
                r.academicSession === activeSession &&
                r.semester === activeSemester
              ).length > 0 ? (
                /* ALREADY REGISTERED: SHOW REGISTRATION SLIP */
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col p-6 print:border-0 print:shadow-none">
                  {/* Print Top Letterhead */}
                  <div className="hidden print:block p-8 text-center border-b-2 border-[#0A1F44] mb-8">
                    <div className="flex justify-center items-center gap-4 mb-3">
                      <span className="text-5xl">👑</span>
                      <div className="text-left">
                        <h1 className="text-3xl font-poppins font-extrabold text-[#0A1F44] uppercase tracking-tight">Crown Heritage College of Health</h1>
                        <p className="text-sm italic font-semibold text-[#D4A017]">Excellence in Health Education</p>
                        <p className="text-xs text-slate-500 mt-1">Ogun State, Nigeria | info@crownheritage.edu.ng | Portal: portal.crownheritage.edu.ng</p>
                      </div>
                    </div>
                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 mt-6 border-t pt-4 border-dashed border-slate-300">
                      OFFICIAL COURSE REGISTRATION SLIP
                    </h2>
                  </div>

                  <div className="flex justify-between items-center pb-4 mb-4 border-b print:hidden">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg shrink-0">
                      ✅ Course Registration Slip Generated
                    </span>
                    <button 
                      onClick={handlePrint}
                      className="bg-[#0A1F44] hover:bg-slate-800 text-white font-bold px-4 py-2 text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      🖨️ Print Registration Slip
                    </button>
                  </div>

                  {/* Student Info Card for Slip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-6 border p-4 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wide block">Student Name:</span> 
                      <strong className="text-slate-800 uppercase">{loggedInStudent.name}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wide block">Matriculation No:</span> 
                      <strong className="text-[#0A1F44] font-mono">{loggedInStudent.matricNo}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wide block">Department &amp; Level:</span> 
                      <strong className="text-slate-800">{loggedInStudent.programme || loggedInStudent.department} Sciences ({loggedInStudent.level} Level)</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wide block">Session &amp; Semester:</span> 
                      <strong className="text-stone-700 uppercase">{activeSession} Session - {activeSemester} Semester</strong>
                    </div>
                  </div>

                  {/* Registered Courses Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                          <th className="px-6 py-4">S/N</th>
                          <th className="px-6 py-4">Course Code</th>
                          <th className="px-6 py-4">Course Title</th>
                          <th className="px-6 py-4 text-center">Credit Units</th>
                          <th className="px-6 py-4 text-center font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {registrations.filter(r => 
                          r.studentMatric === loggedInStudent.matricNo &&
                          r.academicSession === activeSession &&
                          r.semester === activeSemester
                        ).map((reg, index) => {
                          const courseDetails = courses.find(c => c.code === reg.courseCode);
                          return (
                            <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono font-bold text-slate-400">{index + 1}</td>
                              <td className="px-6 py-4 font-mono font-bold text-[#0A1F44]">{reg.courseCode}</td>
                              <td className="px-6 py-4 text-slate-600 font-medium">{courseDetails?.title || 'Unknown Course'}</td>
                              <td className="px-6 py-4 text-center font-bold font-mono text-slate-700">{courseDetails?.units || 2} Units</td>
                              <td className="px-6 py-4 text-center">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">Compulsory</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Units Summary */}
                  <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-600 print:bg-transparent print:border-slate-300 mt-4">
                    <div>
                      <p>Number of Registered Courses: <strong>{registrations.filter(r => r.studentMatric === loggedInStudent.matricNo && r.academicSession === activeSession && r.semester === activeSemester).length} courses</strong></p>
                    </div>
                    <div className="sm:text-right">
                      <p>Total Registered Units: <strong className="text-sm font-mono text-[#0A1F44]">{
                        registrations.filter(r => 
                          r.studentMatric === loggedInStudent.matricNo &&
                          r.academicSession === activeSession &&
                          r.semester === activeSemester
                        ).reduce((acc, curr) => {
                          const c = courses.find(cr => cr.code === curr.courseCode);
                          return acc + (c ? c.units : 3);
                        }, 0)
                      } / 24 Units</strong></p>
                    </div>
                  </div>

                  {/* Signatures Panel */}
                  <div className="hidden print:grid grid-cols-3 gap-12 mt-16 pt-12 border-t border-dashed border-slate-300">
                    <div className="text-center">
                      <div className="h-10 border-b border-slate-400 mb-2"></div>
                      <p className="font-bold uppercase text-[9px] text-slate-500">Student Signature / Date</p>
                    </div>
                    <div className="text-center">
                      <div className="h-10 border-b border-slate-400 mb-2"></div>
                      <p className="font-bold uppercase text-[9px] text-slate-500">Course Adviser Signature</p>
                    </div>
                    <div className="text-center">
                      <div className="h-10 border-b border-slate-400 mb-2"></div>
                      <p className="font-bold uppercase text-[9px] text-slate-500">HOD Approval / Seal</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* INCOMPLETE REGISTRATION: SELECT AND REGISTER */
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Academic Clearance Desk</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Welcome to your Course Registry Workspace. You are currently in <strong>{loggedInStudent.level} Level</strong>, belonging to the <strong>{loggedInStudent.department}</strong> department science programs. 
                        Please select the verified syllabus courses listed below to apply for formal course registry for this term.
                      </p>
                    </div>
                  </div>

                  {courses.filter(c => {
                    const deptMatch = c.department.toLowerCase() === loggedInStudent.department.toLowerCase() ||
                                      c.department.toLowerCase() === 'general' ||
                                      c.department.toLowerCase() === 'gst' ||
                                      c.department.toLowerCase().includes('general studies');
                    return deptMatch && c.level === loggedInStudent.level && c.semester === activeSemester;
                  }).length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <span className="text-3xl block filter grayscale mb-2">📚</span>
                      <p className="text-sm font-semibold text-slate-500">No courses defined by Admin for your Level and Department in this Active semester yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Please inform the Admin/Registry office to define the syllabus courses under the "Manage Syllabus" panel.</p>
                    </div>
                  ) : (
                    <div>
                      {/* Course lists with Checklist checks */}
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const targetCourses = courses.filter(c => {
                          const deptMatch = c.department.toLowerCase() === loggedInStudent.department.toLowerCase() ||
                                            c.department.toLowerCase() === 'general' ||
                                            c.department.toLowerCase() === 'gst' ||
                                            c.department.toLowerCase().includes('general studies');
                          return deptMatch && c.level === loggedInStudent.level && c.semester === activeSemester;
                        });
                        
                        if (confirm('Are you submit-ready? This action registers your courses formally in the semester catalog.')) {
                          const newRegs: CourseRegistration[] = targetCourses.map(course => ({
                            id: `${loggedInStudent.matricNo}_${course.code}_${activeSession.replace('/', '-')}_${activeSemester}`,
                            studentMatric: loggedInStudent.matricNo,
                            courseCode: course.code,
                            semester: activeSemester,
                            academicSession: activeSession,
                            dateRegistered: new Date().toISOString().split('T')[0]
                          }));
                          onSetRegistrations([...registrations, ...newRegs]);
                          onAddToast("Course registration successful!", "success");
                        }
                      }}>
                        
                        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6 bg-slate-50/50">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 bg-slate-100">
                                <th className="px-4 py-3 text-center">Compulsory</th>
                                <th className="px-4 py-3">Course Code</th>
                                <th className="px-4 py-3">Course Title</th>
                                <th className="px-4 py-3 text-center">Credit Units</th>
                                <th className="px-4 py-3 text-center">Semester / Level</th>
                              </tr>
                            </thead>
                            <tbody className="text-xs text-slate-700">
                              {courses.filter(c => {
                                const deptMatch = c.department.toLowerCase() === loggedInStudent.department.toLowerCase() ||
                                                  c.department.toLowerCase() === 'general' ||
                                                  c.department.toLowerCase() === 'gst' ||
                                                  c.department.toLowerCase().includes('general studies');
                                return deptMatch && c.level === loggedInStudent.level && c.semester === activeSemester;
                              }).map((course) => (
                                <tr key={course.code} className="border-b border-slate-100 hover:bg-white bg-slate-50/40">
                                  <td className="px-4 py-4 text-center">
                                    <input 
                                      type="checkbox" 
                                      checked={true}
                                      disabled={true} // In health schools, course registration is general and mandatory for each stage
                                      className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-slate-300 rounded cursor-not-allowed"
                                    />
                                  </td>
                                  <td className="px-4 py-4 font-mono font-bold text-[#0A1F44]">{course.code}</td>
                                  <td className="px-4 py-4 font-semibold">{course.title}</td>
                                  <td className="px-4 py-4 text-center font-bold font-mono text-slate-800">{course.units} Units</td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="px-2 py-0.5 bg-[#0A1F44]/5 text-[#0A1F44] text-[9px] font-extrabold rounded uppercase">{course.level}L</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Credits Check info */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-100 p-4 rounded-xl border mb-6 text-xs text-slate-600 gap-4">
                          <div>
                            <p>Total Courses selected: <strong>{courses.filter(c => {
                                const deptMatch = c.department.toLowerCase() === loggedInStudent.department.toLowerCase() ||
                                                  c.department.toLowerCase() === 'general' ||
                                                  c.department.toLowerCase() === 'gst' ||
                                                  c.department.toLowerCase().includes('general studies');
                                return deptMatch && c.level === loggedInStudent.level && c.semester === activeSemester;
                              }).length}</strong></p>
                            <p className="mt-1">Cumulative units: <strong className="text-sm font-mono text-[#0A1F44]">{
                              courses.filter(c => {
                                const deptMatch = c.department.toLowerCase() === loggedInStudent.department.toLowerCase() ||
                                                  c.department.toLowerCase() === 'general' ||
                                                  c.department.toLowerCase() === 'gst' ||
                                                  c.department.toLowerCase().includes('general studies');
                                return deptMatch && c.level === loggedInStudent.level && c.semester === activeSemester;
                              }).reduce((sum, c) => sum + c.units, 0)
                            } Units</strong></p>
                          </div>
                          <div>
                            <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold uppercase">Registration Mandatory for Examination Permit</span>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#0A1F44] hover:bg-slate-800 text-[#D4A017] font-extrabold py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#0A1F44]/15 transition-all cursor-pointer"
                        >
                          Confirm &amp; Register All Semester Courses
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: FEES */}
          {activeTab === 'fees' && (
            <div className="space-y-6 animate-fade-in print:block">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F44] font-poppins uppercase">Financial Accounts</h3>
                    <p className="text-xs text-slate-400 mt-1">Summary of registered fees and clearance permits</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Outstanding Due</span>
                      <strong className="text-lg text-red-600 font-mono">₦{outstandingBalance.toLocaleString()}</strong>
                    </div>

                    <div className={`p-3 border rounded-xl text-center ${isCleared ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Clearance status</span>
                      <strong className="text-sm font-bold uppercase block mt-1">{isCleared ? '✅ CLEARED' : '❌ NOT CLEARED'}</strong>
                    </div>
                  </div>
                </div>

                {myFees.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-medium">
                    <span>💵</span>
                    <p className="text-sm mt-2">No registered fee billing reports listed in your panel.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                          <th className="px-4 py-3">Academic Session</th>
                          <th className="px-4 py-3">Semester</th>
                          <th className="px-4 py-3">Fee Description</th>
                          <th className="px-4 py-3 text-right">Amount (₦)</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3">Date Settled</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {myFees.map((f, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-4 font-mono font-bold text-slate-700">{f.academicSession}</td>
                            <td className="px-4 py-4">{f.semester} Semester</td>
                            <td className="px-4 py-4 font-semibold text-[#0A1F44]">{f.description}</td>
                            <td className="px-4 py-4 text-right font-mono font-bold">₦{f.amount.toLocaleString()}</td>
                            <td className="px-4 py-4 text-center">
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                                f.status === 'Paid' 
                                  ? 'bg-green-100 text-green-700' 
                                  : f.status === 'Partial' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {f.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-mono text-slate-500">{f.datePaid || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
