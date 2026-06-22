import React, { useState } from 'react';
import { Application } from '../types';

interface AdmissionFormProps {
  onBack: () => void;
  onSubmitSuccess: (appNo: string, appData: Application) => void;
  programmes: string[];
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

export default function AdmissionForm({ onBack, onSubmitSuccess, programmes }: AdmissionFormProps) {
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [lga, setLga] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [programme, setProgramme] = useState(programmes[0] || 'Nursing Science');
  
  // O'Level results state: minimum 5 subjects
  const [olevelResults, setOlevelResults] = useState([
    { subject: 'English Language', grade: 'C4' },
    { subject: 'Mathematics', grade: 'C5' },
    { subject: 'Biology', grade: 'B3' },
    { subject: 'Chemistry', grade: 'B2' },
    { subject: 'Physics', grade: 'C6' }
  ]);

  const [passportPhoto, setPassportPhoto] = useState('');
  const [nextOfKinName, setNextOfKinName] = useState('');
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState('');
  const [nextOfKinPhone, setNextOfKinPhone] = useState('');
  const [declaration, setDeclaration] = useState(false);

  // Errors state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAddSubject = () => {
    setOlevelResults([...olevelResults, { subject: '', grade: '' }]);
  };

  const handleRemoveSubject = (idx: number) => {
    if (olevelResults.length <= 5) {
      alert("At least 5 subjects are required for O'Level evaluation.");
      return;
    }
    setOlevelResults(olevelResults.filter((_, i) => i !== idx));
  };

  const handleSubjectChange = (idx: number, field: 'subject' | 'grade', value: string) => {
    const updated = [...olevelResults];
    updated[idx][field] = value;
    setOlevelResults(updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Keep it under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!dob) errors.dob = 'Date of birth is required.';
    if (!stateOfOrigin) errors.stateOfOrigin = 'Please select state of origin.';
    if (!lga.trim()) errors.lga = 'LGA is required.';
    if (!phone.trim()) errors.phone = 'Phone number is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Please provide a valid email adress.';
    if (!address.trim()) errors.address = 'Residential address is required.';
    if (!nextOfKinName.trim()) errors.nextOfKinName = 'Next of Kin name is required.';
    if (!nextOfKinRelationship.trim()) errors.nextOfKinRelationship = 'Relationship is required.';
    if (!nextOfKinPhone.trim()) errors.nextOfKinPhone = 'Next of Kin phone number is required.';
    if (!declaration) errors.declaration = 'You must accept the academic declaration.';

    // O'Level evaluation
    let hasEmptyOlevel = false;
    olevelResults.forEach((res, i) => {
      if (!res.subject.trim() || !res.grade.trim()) {
        hasEmptyOlevel = true;
      }
    });
    if (hasEmptyOlevel) {
      errors.olevel = 'Please fill out all subject and grade fields correctly.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // scroll to error representation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Generate unique Application Number
    const existing = JSON.parse(localStorage.getItem('chch_applications') || '[]');
    const nextNum = 1000 + existing.length + Math.floor(Math.random() * 90);
    const applicationNo = `CHCH/2025/${nextNum}`;

    const newApp: Application = {
      applicationNo,
      fullName,
      dob,
      gender,
      stateOfOrigin,
      lga,
      phone,
      email,
      address,
      programme,
      olevelResults,
      passportPhoto,
      nextOfKinName,
      nextOfKinRelationship,
      nextOfKinPhone,
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    // Save to list
    existing.push(newApp);
    localStorage.setItem('chch_applications', JSON.stringify(existing));

    onSubmitSuccess(applicationNo, newApp);
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-[#0A1F44] hover:text-[#D4A017] transition-all focus:outline-none cursor-pointer"
        >
          ← Back to Homepage
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-[#0A1F44] text-white p-6 sm:p-10 border-b border-[#1A2E54]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#D4A017] rounded-xl flex items-center justify-center text-2xl shadow-md">
              👑
            </div>
            <div>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">CHCH Registrar's Unit</span>
              <h1 className="text-xl sm:text-2xl font-poppins font-extrabold tracking-tight text-white uppercase">Online Admission Application</h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Please fill out this form accurately. Ensure your credentials, passport photograph and Next of Kin fields are authentic as falsifying claims leads to immediate disqualification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          {/* SECTION 1: Personal Data */}
          <div>
            <h2 className="text-base font-bold font-poppins text-[#0A1F44] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              Step 1: Bio-Data &amp; Contact Info
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name (Surname First, then Middle &amp; Last Names)</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Okafor Adaeze Ruth"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                />
                {formErrors.fullName && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.dob ? 'border-red-500 bg-red-50/50' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                />
                {formErrors.dob && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.dob}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State of Origin</label>
                <select 
                  value={stateOfOrigin}
                  onChange={(e) => setStateOfOrigin(e.target.value)}
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.stateOfOrigin ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                >
                  <option value="">-- Choose State --</option>
                  {NIGERIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
                {formErrors.stateOfOrigin && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.stateOfOrigin}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Local Government Area (LGA)</label>
                <input 
                  type="text" 
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  placeholder="e.g. Nnewi North"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.lga ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                />
                {formErrors.lga && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.lga}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 812 345 6789"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.phone ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                />
                {formErrors.phone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.email ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                />
                {formErrors.email && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Home Resident Address</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Provide physical street address, town and state"
                  rows={2}
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.address ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white`}
                />
                {formErrors.address && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.address}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Choice */}
          <div>
            <h2 className="text-base font-bold font-poppins text-[#0A1F44] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              Step 2: Programme of Interest
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Applied Programme</label>
                <select 
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white"
                >
                  {programmes.map(prog => <option key={prog} value={prog}>{prog}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Clear Passport Photo (White Background max 2MB)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0A1F44] hover:file:bg-[#D4A017]/20 file:rounded-lg"
                  />
                  {passportPhoto ? (
                    <img 
                      src={passportPhoto} 
                      alt="Uploaded passport preview" 
                      className="w-12 h-12 object-cover rounded-xl border-2 border-[#D4A017]" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 border border-dashed rounded-xl flex items-center justify-center text-slate-400 text-xs">No img</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: O Level Credentials */}
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-4">
              <h2 className="text-base font-bold font-poppins text-[#0A1F44] uppercase tracking-wider">
                Step 3: O’Level Subjects Validation (Minimum 5)
              </h2>
              <button 
                type="button" 
                onClick={handleAddSubject}
                className="bg-blue-50 text-[#0A1F44] hover:bg-blue-100 px-3 py-1 text-xs font-bold rounded-lg border border-[#0A1F44]/15 cursor-pointer"
              >
                + Add Custom Subject
              </button>
            </div>
            {formErrors.olevel && <p className="text-red-500 text-xs my-2 font-semibold">⚠️ {formErrors.olevel}</p>}

            <div className="space-y-3">
              {olevelResults.map((ol, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={ol.subject}
                      onChange={(e) => handleSubjectChange(idx, 'subject', e.target.value)}
                      placeholder="e.g. English Language"
                      className="w-full text-xs sm:text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white"
                    />
                  </div>
                  <div className="w-24 sm:w-32">
                    <input 
                      type="text" 
                      value={ol.grade}
                      onChange={(e) => handleSubjectChange(idx, 'grade', e.target.value)}
                      placeholder="e.g. C4 or A1"
                      className="w-full text-xs sm:text-sm px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSubject(idx)}
                    className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold cursor-pointer"
                    title="Remove subject"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Next of Kin */}
          <div>
            <h2 className="text-base font-bold font-poppins text-[#0A1F44] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              Step 4: Next of Kin Information
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Next of Kin Full Name</label>
                <input 
                  type="text" 
                  value={nextOfKinName}
                  onChange={(e) => setNextOfKinName(e.target.value)}
                  placeholder="e.g. Samuel Okafor"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.nextOfKinName ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]`}
                />
                {formErrors.nextOfKinName && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.nextOfKinName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Relationship</label>
                <input 
                  type="text" 
                  value={nextOfKinRelationship}
                  onChange={(e) => setNextOfKinRelationship(e.target.value)}
                  placeholder="e.g. Father, Uncle"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.nextOfKinRelationship ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]`}
                />
                {formErrors.nextOfKinRelationship && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.nextOfKinRelationship}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Next of Kin Phone</label>
                <input 
                  type="tel" 
                  value={nextOfKinPhone}
                  onChange={(e) => setNextOfKinPhone(e.target.value)}
                  placeholder="e.g. +234 803 111 2222"
                  className={`w-full text-sm px-4 py-3 bg-slate-50 border ${formErrors.nextOfKinPhone ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017]`}
                />
                {formErrors.nextOfKinPhone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.nextOfKinPhone}</p>}
              </div>
            </div>
          </div>

          {/* Declaration and Submit */}
          <div className="pt-6 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#0A1F44] border-slate-300 rounded focus:ring-0 focus:outline-none cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium leading-relaxed">
                I hereby declare that all bio-data, academic records and passport configurations provided in this portal represent the truth. I understand that supplying fake or invalid credentials will subject me to immediate dismissal by the Crown Heritage College Admission Senate and legal consequences.
              </span>
            </label>
            {formErrors.declaration && <p className="text-red-500 text-[10px] mt-1 font-semibold">{formErrors.declaration}</p>}

            <div className="mt-8 flex gap-4">
              <button 
                type="submit"
                className="flex-1 bg-[#0A1F44] text-[#D4A017] hover:bg-slate-800 font-extrabold px-6 py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-[#0A1F44]/15 transition-all text-center cursor-pointer"
              >
                Submit College Registry Form
              </button>
              <button 
                type="button"
                onClick={onBack}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-4 rounded-xl text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
