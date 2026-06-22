import React from 'react';
import { Notice } from '../types';

interface LandingPageProps {
  onNavigate: (view: 'home' | 'admission' | 'student-login' | 'admin-login') => void;
  notices: Notice[];
}

export default function LandingPage({ onNavigate, notices }: LandingPageProps) {
  // At least 6 health programmes
  const programmes = [
    {
      title: 'Nursing Science',
      degree: 'Regular / 5 Years ND-HND',
      desc: 'Comprehensive practical and clinical training in adult, pediatric, and community health nursing, prepping qualified registered healthcare personnel.',
      icon: '🩺'
    },
    {
      title: 'Medical Laboratory Science',
      degree: 'Regular / 4 Years ND-HND',
      desc: 'Rigorous coursework in chemical pathology, medical microbiology, haematology, and histopathology for precise biomedical diagnoses.',
      icon: '🔬'
    },
    {
      title: 'Public Health Technology',
      degree: 'Regular / 4 Years ND-HND',
      desc: 'Equips specialists to analyze health statistics, address environmental health threats, prevent epidemics and build municipal wellness strategies.',
      icon: '🌱'
    },
    {
      title: 'Pharmacy Technician',
      degree: 'Regular / 3 Years Certificate',
      desc: 'Expert preparation in pharmaceutical chemistry, compounding, dispensing pharmacology, and medicine shelf management guidelines.',
      icon: '💊'
    },
    {
      title: 'Physiotherapy Technology',
      degree: 'Regular / 4 Years Associate',
      desc: 'Practical skills training in kinesiology, physical therapeutics, pain mitigation, sports rehab, and structural skeletal biomechanics studies.',
      icon: '💪'
    },
    {
      title: 'Health Information Management',
      degree: 'Regular / 3 Years ND-HND',
      desc: 'Innovative learning covering medical record auditing, health statistics reporting, clinical classifications, and health IT systems framework.',
      icon: '📁'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emergency': return 'bg-red-100 text-red-700 border-red-300';
      case 'Fees': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Academic': return 'bg-sky-100 text-sky-800 border-sky-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Top Notification bar */}
      <div className="bg-[#D4A017] text-black text-center py-2 px-4 text-xs font-semibold uppercase tracking-wider">
        📣 ADMISSIONS OPEN FOR THE 2025/2026 ACADEMIC SESSION — <button onClick={() => onNavigate('admission')} className="underline hover:opacity-8 focus:outline-none cursor-pointer">APPLY NOW</button>
      </div>

      {/* Header / Navbar */}
      <header className="bg-[#0A1F44] text-white shadow-xl sticky top-0 z-40 border-b border-[#1A2E54]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center text-2xl shadow-md border border-yellow-300">
              👑
            </div>
            <div>
              <h1 className="text-lg font-poppins font-bold tracking-tight text-[#D4A017] uppercase leading-none">Crown Heritage</h1>
              <span className="text-[10px] text-slate-300 tracking-wider font-semibold uppercase">College of Health &amp; Allied Sciences</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="text-white hover:text-[#D4A017] transition-all font-medium text-sm border-b-2 border-[#D4A017] pb-1 cursor-pointer">Home</button>
            <a href="#about" className="text-slate-300 hover:text-white transition-all font-medium text-sm cursor-pointer">About Us</a>
            <a href="#programmes" className="text-slate-300 hover:text-white transition-all font-medium text-sm cursor-pointer">Programmes</a>
            <button onClick={() => onNavigate('admission')} className="text-slate-300 hover:text-white transition-all font-medium text-sm cursor-pointer">Admission</button>
            <button onClick={() => onNavigate('student-login')} className="bg-[#1A2E54] hover:bg-slate-800 text-white hover:text-[#D4A017] transition-all px-4 py-2 rounded-lg font-semibold text-sm border border-slate-700 cursor-pointer">Student Portal</button>
            <button onClick={() => onNavigate('admin-login')} className="bg-[#D4A017] hover:bg-[#c39112] text-black transition-all px-4 py-2 rounded-lg font-bold text-sm cursor-pointer">Admin Login</button>
          </nav>

          {/* Mobile portal launcher overlay check (handled in app.tsx menu or directly via quick buttons) */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => onNavigate('student-login')} className="bg-[#D4A017] text-black text-xs px-3 py-1.5 rounded font-bold cursor-pointer">Portal</button>
            <button onClick={() => onNavigate('admission')} className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 font-semibold cursor-pointer">Apply</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#0A1F44] text-white overflow-hidden py-20 lg:py-32">
        {/* Background Accent Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D4A017_1.2px,transparent_1.2px)] [background-size:24px_24px]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#D4A017]/10 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:w-3/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A2E54] text-[#D4A017] rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-[#2A4474]">
              🇳🇬 Registered &amp; Approved Health Institution
            </div>
            <h1 className="text-4xl lg:text-6xl font-poppins font-extrabold tracking-tight leading-tight">
              Empowering the Next Generation of <span className="text-[#D4A017]">Healthcare Pioneers</span>
            </h1>
            <p className="mt-4 text-slate-300 text-lg font-medium italic">
              "Excellence in Health Education"
            </p>
            <p className="mt-6 text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome to Crown Heritage College of Health. We specialize in developing skilled healthcare practitioners who operate at globally recognized standards of practice. Join thousands of qualified researchers, nurses, and technicians saving lives.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('admission')}
                className="bg-[#D4A017] hover:bg-[#c39112] text-black font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-[#D4A017]/25 transition-all text-sm uppercase tracking-wide cursor-pointer"
              >
                Apply Online Now
              </button>
              <button 
                onClick={() => onNavigate('student-login')}
                className="bg-transparent hover:bg-slate-800 text-white font-semibold border-2 border-slate-600 hover:border-white px-8 py-4 rounded-xl transition-all text-sm uppercase tracking-wide cursor-pointer"
              >
                Student Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Grid */}
      <section className="bg-white py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl lg:text-4xl font-poppins font-extrabold text-[#0A1F44]">6+</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Professional Programmes</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-poppins font-extrabold text-[#D4A017]">98%</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Board Exam Passing Rate</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-poppins font-extrabold text-[#0A1F44]">3,500+</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Alumni Network</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-poppins font-extrabold text-[#D4A017]">100%</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Modern Lab Practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-bold text-[#D4A017] uppercase tracking-widest mb-1">Who We Are</p>
              <h2 className="text-3xl font-poppins font-bold text-[#0A1F44] tracking-tight">
                Our Heritage of Health Academic Leadership
              </h2>
              <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
                Crown Heritage College of Health is established with a clear mandate: to bridge the gap in skilled human resource requirements within the Nigerian healthcare sector. With state-of-the-art diagnostic laboratories, anatomy simulators, and dedicated clinic placements, we combine hands-on clinical exposure with rigid academic modules.
              </p>
              <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                Our tutors are certified medical practitioners and educators who prioritize individual student mentorship, research discipline, and ethics in hospital administration.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex-1">
                  <span className="text-xl">🎯</span>
                  <h3 className="font-bold text-[#0A1F44] text-xs uppercase tracking-wide mt-2">Our Mission</h3>
                  <p className="text-xs text-slate-500 mt-1">To groom highly technical healthcare graduates capable of rendering premium professional empathy globally.</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex-1">
                  <span className="text-xl">👁️</span>
                  <h3 className="font-bold text-[#0A1F44] text-xs uppercase tracking-wide mt-2">Our Vision</h3>
                  <p className="text-xs text-slate-500 mt-1">To stand out as the foremost premium health polytechnic in West Africa through robust curriculum updates.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-[#0A1F44] to-[#1A2E54] text-white p-8 rounded-3xl shadow-xl border border-slate-700 relative">
              <div className="absolute top-4 right-4 text-4xl opacity-10">👑</div>
              <h3 className="text-xl font-poppins font-bold text-[#D4A017]">Core Admissions Requirements</h3>
              <p className="text-slate-300 text-xs mt-2">Please read through before starting your application procedure</p>
              
              <ul className="mt-6 space-y-4 text-xs sm:text-sm">
                <li className="flex gap-2">
                  <span className="text-[#D4A017]">✔</span>
                  <span>Minimum of <strong>5 O Level Credits</strong> (WAEC / NECO / NABTEB) in Chemistry, Chemistry/Biology, Physics, Mathematics, and English Language in not more than 2 sittings.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4A017]">✔</span>
                  <span>Scanned <strong>Passport Photograph</strong> (Clear white background, PNG/JPG under 2MB).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4A017]">✔</span>
                  <span><strong>Next of Kin Details</strong> and formal state of origin validation credentials.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D4A017]">✔</span>
                  <span>Minimum Age representation of <strong>16 years certificate</strong> in the calendar academic stream.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <button 
                  onClick={() => onNavigate('admission')}
                  className="w-full bg-[#D4A017] hover:bg-[#c39112] text-black font-extrabold text-xs py-3 rounded-lg uppercase tracking-wider cursor-pointer text-center"
                >
                  Start Admission Portal Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section id="programmes" className="py-20 bg-white border-t border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-bold text-[#D4A017] uppercase tracking-widest">Academic Offerings</p>
            <h2 className="text-3xl font-poppins font-bold text-[#0A1F44] tracking-tight mt-1">
              Health &amp; Clinical Sciences Directory
            </h2>
            <p className="mt-4 text-slate-500 text-sm">
              We offer accreditation streams approved by corresponding governing healthcare professional councils in Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {programmes.map((p, idx) => (
              <div key={idx} className="bg-slate-50 hover:bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-[#0A1F44] text-[#D4A017] rounded-xl flex items-center justify-center text-xl font-bold mb-4 shadow-inner group-hover:bg-[#D4A017] group-hover:text-black transition-all">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1F44] font-poppins group-hover:text-[#D4A017] transition-all">{p.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mt-1">{p.degree}</span>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/50 flex justify-between items-center text-xs">
                  <span className="text-[#0A1F44] font-semibold">Approved by NUC/Boards</span>
                  <button onClick={() => onNavigate('admission')} className="text-[#D4A017] font-bold uppercase tracking-wider hover:underline focus:outline-none cursor-pointer">Apply →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Announcements Section */}
      <section id="notices" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-slate-200 pb-4">
            <div>
              <p className="text-sm font-bold text-[#D4A017] uppercase tracking-widest">Keep Updated</p>
              <h2 className="text-3xl font-poppins font-bold text-[#0A1F44] tracking-tight mt-1">
                News &amp; Official Communications
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Total: {notices.length} updates</span>
          </div>

          {notices.length === 0 ? (
            <div className="bg-white text-center py-12 rounded-2xl shadow-sm border text-slate-400">
              <span className="text-3xl">📭</span>
              <p className="mt-2 text-sm">No news or announcements reported recently.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {notices.map((n) => (
                <div key={n.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase rounded-md ${getCategoryColor(n.category)}`}>
                        {n.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                    </div>
                    <h3 className="font-poppins font-bold text-[#0A1F44] text-base leading-snug">{n.title}</h3>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-line">
                      {n.content}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>👑 Crown Heritage Media Unit</span>
                    <span>Admin Approved</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1F44] text-[#8C9BB4] pt-16 pb-8 border-t border-[#1A2E54]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#D4A017] rounded-lg flex items-center justify-center text-lg">👑</div>
              <h2 className="text-white font-poppins font-extrabold text-[#D4A017] text-md">CROWN HERITAGE</h2>
            </div>
            <p className="text-xs leading-relaxed text-[#8C9BB4]">
              Premium health sciences technological training delivering qualified medical technicians, lab assistants, public health officers, and registered nurses on merit.
            </p>
            <p className="text-xs font-bold text-[#D4A017] mt-4">"Excellence in Health Education"</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-[#1A2E54] pb-2">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer block">Home Dashboard</button></li>
              <li><a href="#about" className="hover:text-white block">About the Institution</a></li>
              <li><a href="#programmes" className="hover:text-white block">Programmes Directory</a></li>
              <li><button onClick={() => onNavigate('admission')} className="hover:text-white cursor-pointer block">Admission Online Form</button></li>
              <li><button onClick={() => onNavigate('student-login')} className="hover:text-white cursor-pointer block">Student Portal Login</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-[#1A2E54] pb-2">Our Campus</h3>
            <address className="not-italic text-xs space-y-2 leading-relaxed">
              <p>📍 Km 4, Idiroko Expressway, Ota, Ogun State, Nigeria.</p>
              <p>📞 +234 812 345 6789, +234 803 987 6543</p>
              <p>✉ info@crownheritage.edu.ng</p>
            </address>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-[#1A2E54] pb-2">Legal Security</h3>
            <p className="text-xs leading-relaxed mb-4">
              Approved by the federal Ministry of Health and authorized to run accredited and validated technical programmes.
            </p>
            <div className="flex gap-3 text-lg font-bold">
              <span className="hover:text-white cursor-pointer">🌐</span>
              <span className="hover:text-white cursor-pointer">🦅</span>
              <span className="hover:text-white cursor-pointer">📘</span>
              <span className="hover:text-white cursor-pointer">✉</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#1A2E54] flex flex-col sm:flex-row justify-between items-center text-[11px]">
          <p>© 2026 Crown Heritage College of Health. All academic rights reserved.</p>
          <p className="mt-2 sm:mt-0 italic">Powered by <span className="text-[#D4A017] font-bold">Crown Heritage ICT Unit</span></p>
        </div>
      </footer>
    </div>
  );
}
