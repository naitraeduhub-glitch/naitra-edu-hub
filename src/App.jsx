import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, X, BookOpen, Award, Users, Target, 
  Phone, Mail, MapPin, ArrowRight, Shield, 
  Activity, CheckCircle, GraduationCap, ChevronRight,
  MessageCircle, Search, Lock, Calendar, User, UserCircle,
  FileText, LineChart, ClipboardCheck, PlayCircle,
  Clock, Play, FileQuestion, Plus, Trash2, Edit, List, Check, AlertCircle, BarChart3, Download, LogOut,
  Bot, Sparkles, BrainCircuit, UserCheck
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'naitra-edu-hub';

const CONTACT_PHONE = "9772373002";
const CONTACT_EMAIL = "naitraeduhub@gmail.com";

const COURSES_LIST = [
  { title: "NDA 2027", duration: "1 Year", badge: "Popular", description: "Complete NDA written + SSB preparation" },
  { title: "CDS 2027", duration: "1 Year", badge: "New", description: "CDS OTA, IMA, INA, AFA preparation" },
  { title: "CAPF AC 2027", duration: "10 Months", badge: "Defence", description: "CAPF Assistant Commandant complete course" },
  { title: "SSC CGL 2027", duration: "1 Year", badge: "SSC", description: "Tier 1 + Tier 2 preparation" },
  { title: "SSC CPO 2027", duration: "10 Months", badge: "SSC", description: "SI Delhi Police & CAPF preparation" },
  { title: "UPSC CSE 2027", duration: "2 Years", badge: "Premium", description: "Prelims + Mains + Interview" },
  { title: "NEET 2027", duration: "2 Years", badge: "Medical", description: "Physics, Chemistry, Biology" },
  { title: "JEE 2027", duration: "2 Years", badge: "Engineering", description: "JEE Main + Advanced" },
  { title: "Rajasthan Agriculture Supervisor", duration: "6 Months", badge: "Rajasthan", description: "Rajasthan Agriculture Supervisor Exam" }
];

// --- GEMINI API INTEGRATION ---
const callGeminiAPI = async (prompt, retries = 5) => {
  const apiKey = ""; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: "You are an expert tutor and career counselor for Naitra Edu Hub, a premier institute preparing students for UPSC, NDA, CDS, SSC, and NEET/JEE. Keep your answers concise, encouraging, and highly educational." }] }
  };

  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      if (i === retries - 1) return "I'm having trouble connecting to my AI brain right now. Please try again later!";
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Student Portal Auth State
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTest, setActiveTest] = useState(null);

  // Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(COURSES_LIST[0].title);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const openEnrollModal = (courseTitle = COURSES_LIST[0].title) => {
    setSelectedCourse(courseTitle);
    setIsEnrollModalOpen(true);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'courses', label: 'Courses' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'student-portal', label: 'Online Test' },
  ];

  // Override view for active test
  if (activeTest && studentProfile) {
    return <TestEngine test={activeTest} studentProfile={studentProfile} onExit={() => setActiveTest(null)} user={user} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 relative">
      {/* Header / Navigation */}
      <header className="bg-white text-slate-900 sticky top-0 z-40 shadow-sm border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('home')}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                Naitra <span className="text-blue-600">Edu Hub</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`text-sm font-bold tracking-wide transition-colors hover:text-blue-600 ${
                    currentPage === link.id ? 'text-blue-600' : 'text-slate-600'
                  } ${link.id === 'student-portal' ? 'bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700 border border-blue-200' : ''}`}
                >
                  {link.label}
                  {currentPage === link.id && link.id !== 'student-portal' && (
                    <div className="h-0.5 w-full bg-blue-600 mt-1 rounded-full animate-fade-in" />
                  )}
                </button>
              ))}
              <div className="pl-4 border-l border-slate-200 flex items-center space-x-4">
                <button 
                  onClick={() => openEnrollModal()}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-7 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-xl hover:shadow-blue-600/30 flex items-center"
                >
                  Admission Now <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 bg-slate-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-2xl z-50">
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`block w-full text-left px-4 py-4 rounded-xl text-base font-bold ${
                    currentPage === link.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openEnrollModal();
                }}
                className="w-full mt-4 bg-slate-900 hover:bg-blue-600 text-white px-4 py-4 rounded-xl font-bold transition-colors shadow-lg flex justify-center items-center"
              >
                Admission Now <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' && <Home navigate={navigate} openEnrollModal={openEnrollModal} />}
        {currentPage === 'about' && <About openEnrollModal={openEnrollModal} />}
        {currentPage === 'courses' && <Courses openEnrollModal={openEnrollModal} />}
        {currentPage === 'contact' && <Contact openEnrollModal={openEnrollModal} />}
        {currentPage === 'admin' && <AdminDashboard user={user} />}
        {currentPage === 'student-portal' && (
           <StudentPortal 
             user={user} 
             studentProfile={studentProfile} 
             setStudentProfile={setStudentProfile} 
             onStartTest={(test) => setActiveTest(test)} 
           />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <a 
          href={`tel:${CONTACT_PHONE}`}
          className="bg-blue-600 text-white p-3.5 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center group relative border-2 border-white"
          aria-label="Call Us"
        >
          <Phone className="h-6 w-6" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">Call Now</span>
        </a>
        <a 
          href={`https://wa.me/91${CONTACT_PHONE}?text=Hello%20Naitra%20Edu%20Hub,%20I%20would%20like%20to%20know%20about%20admissions.`}
          target="_blank" rel="noreferrer"
          className="bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#20bd5a] hover:scale-110 transition-all flex items-center justify-center group relative border-2 border-white"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">WhatsApp</span>
        </a>
      </div>

      {/* Admission Form Modal */}
      {isEnrollModalOpen && (
        <AdmissionFormModal 
          user={user}
          initialCourse={selectedCourse} 
          onClose={() => setIsEnrollModalOpen(false)} 
        />
      )}

      {/* Premium Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">Naitra Edu Hub</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed font-medium">
              India's premier institution dedicated to transforming aspirations into achievements through expert guidance and unmatched monitoring.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigate('home')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> Home</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> About Us</button></li>
              <li><button onClick={() => navigate('student-portal')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> Online Test Series</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Top Courses</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigate('courses')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> UPSC CSE 2027</button></li>
              <li><button onClick={() => navigate('courses')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> NDA & CDS 2027</button></li>
              <li><button onClick={() => navigate('courses')} className="hover:text-blue-400 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2 text-blue-500"/> NEET & JEE 2027</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact Information</h3>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-center">
                <div className="bg-slate-800/50 p-2.5 rounded-lg mr-4 border border-slate-700/50"><Phone className="h-4 w-4 text-blue-400" /></div>
                <span className="text-slate-300 font-mono text-base">+91 {CONTACT_PHONE}</span>
              </li>
              <li className="flex items-center">
                <div className="bg-slate-800/50 p-2.5 rounded-lg mr-4 border border-slate-700/50"><Mail className="h-4 w-4 text-blue-400" /></div>
                <span className="text-slate-300">{CONTACT_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Naitra Edu Hub. All rights reserved.</p>
          <button onClick={() => navigate('admin')} className="mt-6 md:mt-0 px-4 py-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white flex items-center transition-colors border border-slate-800 hover:border-slate-600">
            <Lock className="h-4 w-4 mr-2" /> Admin Portal
          </button>
        </div>
      </footer>
    </div>
  );
}

function AdmissionFormModal({ user, initialCourse, onClose }) {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    mobile: '',
    course: initialCourse || COURSES_LIST[0].title,
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newEnquiryId = `NEH-27-${randomNum}`;
    
    const payload = {
      ...formData,
      enquiryId: newEnquiryId,
      createdAt: Date.now()
    };

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'enquiries'), payload);
      setEnquiryId(newEnquiryId);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      console.error("Error submitting form: ", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in relative mt-10 mb-10 border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
             <GraduationCap className="h-6 w-6 text-white"/>
          </div>
          <h2 className="text-2xl font-extrabold mb-1">Admission Enquiry</h2>
          <p className="text-blue-100 font-medium text-sm">Secure your seat for 2027 batches.</p>
        </div>

        <div className="p-8">
          {isSuccess ? (
             <div className="text-center py-6">
               <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-100/50">
                 <CheckCircle className="h-12 w-12 text-emerald-500" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
               <p className="text-slate-600 mb-8 font-medium">Thank you. Our counselor will contact you shortly.</p>
               <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl inline-block shadow-sm w-full">
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Your Enquiry ID</p>
                 <p className="text-3xl font-mono font-extrabold text-blue-600 tracking-tight">{enquiryId}</p>
               </div>
               <p className="text-sm text-slate-400 mt-8 flex items-center justify-center font-medium">
                 <Activity className="h-4 w-4 mr-2 animate-spin"/> Closing automatically...
               </p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Student Name *</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" name="studentName" required value={formData.studentName} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
                    placeholder="Enter full name" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Father's Name *</label>
                <div className="relative group">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
                    placeholder="Enter father's name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number *</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="tel" name="mobile" required pattern="[0-9]{10}" value={formData.mobile} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
                    placeholder="10 digit mobile number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Course *</label>
                <div className="relative group">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <select name="course" required value={formData.course} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 focus:bg-white appearance-none font-medium text-slate-900"
                  >
                    {COURSES_LIST.map((c, i) => <option key={i} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Village / City *</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" name="city" required value={formData.city} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
                    placeholder="e.g. Jaipur" />
                </div>
              </div>

              <div className="flex gap-4 mt-10 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-1/3 bg-white hover:bg-slate-100 text-slate-700 font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center border border-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-2/3 bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center shadow-xl shadow-slate-900/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE COMPONENTS
// ==========================================

function Home({ navigate, openEnrollModal }) {
  return (
    <div className="animate-fade-in bg-white">
      
      {/* PREMIUM HERO SECTION */}
      <section className="relative bg-slate-50 overflow-hidden min-h-[90vh] flex items-center border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LDE2MywxODQsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 w-full">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            
            <div className="inline-flex items-center rounded-full px-6 py-2 text-sm font-extrabold text-blue-700 bg-blue-100 mb-10 border border-blue-200 shadow-sm animate-fade-in">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 mr-3 animate-pulse"></span>
              Admissions Open 2027 Batches
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900">
              India's Premier <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Coaching Institute.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl leading-relaxed font-medium">
              Transforming potential into excellence. Join Naitra Edu Hub to conquer the nation's toughest competitive exams.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-14 text-sm font-bold text-slate-700">
              {['NDA', 'CDS', 'CAPF AC', 'SSC CGL', 'SSC CPO', 'UPSC CSE', 'NEET', 'JEE'].map((course, idx) => (
                <span key={idx} className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" /> {course}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center w-full sm:w-auto">
              <button 
                onClick={() => openEnrollModal()}
                className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4.5 rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-blue-600/30 flex items-center justify-center group w-full sm:w-auto"
              >
                Enroll Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <a 
                href={`tel:${CONTACT_PHONE}`}
                className="bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 px-10 py-4.5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center w-full sm:w-auto hover:border-slate-300"
              >
                <Phone className="mr-3 h-6 w-6 text-blue-600" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-slate-100">
            <StatCard icon={<Award className="h-10 w-10 text-blue-600" />} title="50+ Expert Faculty" />
            <StatCard icon={<FileText className="h-10 w-10 text-blue-600" />} title="Daily Mock Tests" />
            <StatCard icon={<UserCheck className="h-10 w-10 text-blue-600" />} title="Personal Mentorship" />
            <StatCard icon={<LineChart className="h-10 w-10 text-blue-600" />} title="Advanced Monitoring" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-blue-600 font-extrabold tracking-widest uppercase text-sm mb-4 block">The Naitra Difference</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Why Students Choose Us</h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-8 text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              We don't just provide study material; we provide an ecosystem of success. From top-tier faculty to unparalleled disciplinary focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PremiumFeatureCard 
              icon={<Award className="h-8 w-8 text-white" />}
              title="Elite Faculty Roster"
              desc="Learn directly from retired bureaucrats, ex-defence officers, and industry-leading subject matter experts with decades of proven selection history."
            />
            <PremiumFeatureCard 
              icon={<Target className="h-8 w-8 text-white" />}
              title="Result-Oriented Approach"
              desc="Our curriculum is strictly mapped to the latest examination patterns, eliminating unnecessary fluff and focusing entirely on rank-producing strategies."
            />
            <PremiumFeatureCard 
              icon={<Shield className="h-8 w-8 text-white" />}
              title="Disciplined Environment"
              desc="We maintain a highly focused, competitive, and disciplined campus environment that keeps students motivated 100% on their ultimate goal."
            />
          </div>
        </div>
      </section>

      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-400 font-extrabold tracking-widest uppercase text-sm mb-4 block">Proprietary Technology</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">Our Learning & <br/>Monitoring System</h2>
              <div className="w-24 h-1.5 bg-blue-500 mb-8 rounded-full"></div>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Education is incomplete without continuous evaluation. Our state-of-the-art monitoring framework ensures complete transparency and constant improvement.
              </p>
              
              <ul className="space-y-6">
                <SystemListItem icon={<ClipboardCheck />} title="Daily Study Tracking" desc="Every assignment and class activity is meticulously logged." />
                <SystemListItem icon={<FileText />} title="Weekly Tests & Analytics" desc="Rigorous mock tests with deep percentile and weak-area analytics." />
                <SystemListItem icon={<User />} title="Personal Guidance" desc="1-on-1 mentorship sessions to resolve psychological & academic hurdles." />
                <SystemListItem icon={<LineChart />} title="Progress Reports" desc="Transparent digital reporting system accessible by parents." />
              </ul>
            </div>
            
            <div className="relative">
               <div className="bg-slate-900 border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
                   <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                        <Activity className="h-6 w-6" />
                     </div>
                     <div>
                       <h4 className="text-white font-bold text-lg">Performance Dashboard</h4>
                       <p className="text-slate-400 text-sm">Live Monitoring Active</p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-sm mb-2 font-bold">
                       <span className="text-slate-300">Test Accuracy</span>
                       <span className="text-emerald-400">92%</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-3">
                       <div className="bg-emerald-500 h-full rounded-full w-[92%] relative overflow-hidden">
                         <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-sm mb-2 font-bold">
                       <span className="text-slate-300">Syllabus Completion</span>
                       <span className="text-blue-400">75%</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-3">
                       <div className="bg-blue-500 h-full rounded-full w-[75%] relative overflow-hidden">
                         <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                       </div>
                     </div>
                   </div>

                   <div className="pt-6 grid grid-cols-2 gap-4">
                     <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-center">
                        <h5 className="text-3xl font-bold text-white mb-1">A+</h5>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Grade</p>
                     </div>
                     <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-center">
                        <h5 className="text-3xl font-bold text-white mb-1">Top 5</h5>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Batch Rank</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-blue-600 font-extrabold tracking-widest uppercase text-sm mb-4 block">Target 2027</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Premium Courses</h2>
              <div className="w-24 h-1.5 bg-blue-600 rounded-full"></div>
            </div>
            <button 
              onClick={() => navigate('courses')}
              className="mt-8 md:mt-0 text-slate-900 hover:text-white bg-white hover:bg-slate-900 font-bold px-8 py-4 rounded-xl transition-all border border-slate-200 hover:border-slate-900 flex items-center shadow-sm"
            >
              Explore All Courses <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {COURSES_LIST.slice(0, 6).map((course, idx) => (
              <CourseGridCard 
                key={idx}
                title={course.title}
                badge={course.badge}
                description={course.description}
                duration={course.duration}
                onApply={() => openEnrollModal(course.title)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left relative z-10">
          <div className="mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Ready to transform your future?</h2>
            <p className="text-blue-100 text-xl font-medium max-w-2xl">Admissions are open for the upcoming target batches. Secure your seat today.</p>
          </div>
          <button 
            onClick={() => openEnrollModal()}
            className="bg-white text-slate-900 hover:bg-slate-50 px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center shrink-0 border border-white"
          >
            Apply for Admission <ArrowRight className="ml-3 h-6 w-6 text-blue-600" />
          </button>
        </div>
      </section>
    </div>
  );
}

function About({ openEnrollModal }) {
  return (
    <div className="animate-fade-in py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">About Naitra Edu Hub</h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Pioneering Excellence in Education</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg font-medium">
              At Naitra Edu Hub, we believe that every student has the potential to achieve greatness if given the right guidance, environment, and resources. Founded in Jaipur, we have grown into one of India's most trusted names in premium competitive exam coaching.
            </p>
            <p className="text-slate-600 mb-10 leading-relaxed text-lg font-medium">
              We specialize in preparing candidates for India's toughest examinations: UPSC, Defence (NDA, CDS, CAPF), SSC, and Pre-Medical/Engineering tests. Our proven methodology focuses on concept clarity, rigorous practice, and continuous assessment.
            </p>
            <button onClick={() => openEnrollModal()} className="bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg">Join Us Today</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <Target className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 font-medium">To empower students with profound knowledge and ethical grounding required to serve the nation effectively.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm sm:mt-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                 <Activity className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
              <p className="text-slate-600 font-medium">To be the most trusted educational institution in India, producing leaders of the highest caliber.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Courses({ openEnrollModal }) {
  const [isCounselorOpen, setIsCounselorOpen] = useState(false);
  const [studentBg, setStudentBg] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isCounseling, setIsCounseling] = useState(false);

  const handleGetAdvice = async (e) => {
    e.preventDefault();
    setIsCounseling(true);
    const prompt = `A student with the following background is looking for course recommendations at Naitra Edu Hub: "${studentBg}". Based on our courses (NDA, CDS, CAPF AC, SSC CGL, SSC CPO, UPSC CSE, NEET, JEE), recommend the best fit and explain why in a short, encouraging paragraph.`;
    const res = await callGeminiAPI(prompt);
    setAiRecommendation(res);
    setIsCounseling(false);
  };

  return (
    <div className="animate-fade-in py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Premium Programs</h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Choose from our specialized 2027 targeted programs designed to crack India's elite competitive examinations.
          </p>
          
          <button 
            onClick={() => setIsCounselorOpen(true)}
            className="mt-8 inline-flex items-center bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 px-6 py-3 rounded-full font-bold transition-all shadow-sm hover:shadow-lg"
          >
            <BrainCircuit className="w-5 h-5 mr-2" /> Confused? Ask AI Career Counselor ✨
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COURSES_LIST.map((course, idx) => (
            <CourseGridCard 
              key={idx}
              title={course.title}
              badge={course.badge}
              description={course.description}
              duration={course.duration}
              onApply={() => openEnrollModal(course.title)}
            />
          ))}
        </div>

        {/* AI Counselor Modal */}
        {isCounselorOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-fade-in relative mt-10 mb-10 border border-slate-200">
              <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-8 text-white relative">
                <button onClick={() => setIsCounselorOpen(false)} className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm">
                  <X className="h-5 w-5" />
                </button>
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                  <Bot className="h-6 w-6 text-white"/>
                </div>
                <h2 className="text-2xl font-extrabold mb-1">AI Career Counselor ✨</h2>
                <p className="text-indigo-100 font-medium text-sm">Tell us your background, and we'll recommend the perfect course.</p>
              </div>
              
              <div className="p-8">
                <form onSubmit={handleGetAdvice} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Education & Interests</label>
                    <textarea 
                      rows="3" required value={studentBg} onChange={(e) => setStudentBg(e.target.value)}
                      placeholder="E.g., I just passed 12th PCM with 85% and I want to join the army as an officer..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none resize-none font-medium text-slate-900 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <button type="submit" disabled={isCounseling || !studentBg.trim()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center disabled:opacity-50">
                    {isCounseling ? 'Analyzing...' : 'Get Course Recommendation ✨'}
                  </button>
                </form>

                {aiRecommendation && (
                  <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative animate-fade-in">
                    <Sparkles className="absolute top-4 right-4 text-indigo-400 opacity-20 w-12 h-12"/>
                    <h4 className="text-indigo-900 font-extrabold mb-3 flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-indigo-600"/> AI Recommendation</h4>
                    <p className="text-sm text-indigo-800 font-medium leading-relaxed whitespace-pre-wrap relative z-10">{aiRecommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Contact({ openEnrollModal }) {
  return (
    <div className="animate-fade-in py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Get in Touch</h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Have questions? Our academic counselors are here to help you choose the right path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-5 pointer-events-none p-4">
                <MapPin className="w-64 h-64" />
             </div>
             <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-10 text-white">Institute Details</h3>
                
                <div className="space-y-10">
                  <div className="flex items-start space-x-6">
                    <div className="bg-blue-600/20 p-4 rounded-2xl flex-shrink-0 border border-blue-500/30">
                      <Phone className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">Contact Number</h4>
                      <p className="text-slate-300 font-medium font-mono text-lg">+91 {CONTACT_PHONE}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="bg-blue-600/20 p-4 rounded-2xl flex-shrink-0 border border-blue-500/30">
                      <Mail className="h-7 w-7 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">Email Address</h4>
                      <p className="text-slate-300 font-medium">{CONTACT_EMAIL}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Direct CTA */}
          <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="bg-white p-5 rounded-3xl shadow-sm mb-8 border border-slate-100">
              <GraduationCap className="h-14 w-14 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to start?</h3>
            <p className="text-slate-600 mb-10 text-lg font-medium px-4">
              Don't wait. Fill out our online admission form and our team will contact you with all the details regarding batches and fees.
            </p>
            <button 
              onClick={() => openEnrollModal()}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex justify-center items-center text-xl"
            >
              Fill Admission Form <ArrowRight className="ml-3 h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentPortal({ user, studentProfile, setStudentProfile, onStartTest }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeTab, setActiveTab] = useState('tests');

  // Gemini AI State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (!user || !studentProfile) return;

    const qTests = collection(db, 'artifacts', appId, 'public', 'data', 'tests');
    const unsubTests = onSnapshot(qTests, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(t => t.published);
      setTests(data);
    });

    const qAttempts = collection(db, 'artifacts', appId, 'public', 'data', 'testAttempts');
    const unsubAttempts = onSnapshot(qAttempts, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(a => a.studentPhone === studentProfile.phone)
        .sort((a, b) => b.createdAt - a.createdAt);
      setAttempts(data);
    });

    return () => {
      unsubTests();
      unsubAttempts();
    };
  }, [user, studentProfile]);

  const handleLogin = (e) => {
    e.preventDefault();
    if(phone.length === 10 && name.length > 2) {
      setStudentProfile({ phone, name });
    }
  };

  if (!studentProfile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex bg-blue-50 p-4 rounded-2xl mb-6">
              <UserCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Student Portal</h2>
            <p className="text-slate-500 font-medium mt-2">Login to access online tests</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
              <input 
                type="tel" required pattern="[0-9]{10}" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="10 digit mobile number"
                className="w-full px-6 py-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 text-lg">
              Proceed to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center mb-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10">
             <Target className="w-64 h-64 -mt-10 -mr-10" />
          </div>
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Welcome, {studentProfile.name}</h1>
            <p className="text-blue-200">Prepare smartly with our advanced mock tests.</p>
          </div>
          <div className="relative z-10 flex gap-4 bg-slate-800/50 p-2 rounded-2xl backdrop-blur-md overflow-x-auto">
            <button 
              onClick={() => setActiveTab('tests')}
              className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'tests' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Available Tests
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              My Results
            </button>
            <button 
              onClick={() => setActiveTab('assistant')}
              className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center whitespace-nowrap ${activeTab === 'assistant' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              <Sparkles className="w-4 h-4 mr-2"/> AI Assistant
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'tests' ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><ClipboardCheck className="mr-3 text-blue-600"/> Upcoming & Active Tests</h2>
            {tests.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-slate-200">
                <FileQuestion className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No tests available</h3>
                <p className="text-slate-500">Check back later for new mock tests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                  <div key={test.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-wide">{test.course}</span>
                       <span className="flex items-center text-slate-500 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 mr-1"/> {test.duration} min</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">{test.title}</h3>
                    <div className="text-sm text-slate-600 mb-6 space-y-1">
                      <p>• {test.questions?.length || 0} Multiple Choice Questions</p>
                      <p>• +{test.positiveMarks} marks for correct answer</p>
                      <p>• -{test.negativeMarks} marks for incorrect answer</p>
                    </div>
                    <button 
                      onClick={() => onStartTest(test)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center group"
                    >
                      <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"/> Start Test
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'history' ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><BarChart3 className="mr-3 text-blue-600"/> Test History & Performance</h2>
            {attempts.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-slate-200">
                <LineChart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No attempts yet</h3>
                <p className="text-slate-500">Take a test to see your performance analysis here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map(attempt => (
                  <div key={attempt.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded border border-blue-100">{attempt.course}</span>
                        <span className="text-sm text-slate-500 font-medium">{new Date(attempt.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{attempt.testTitle}</h3>
                    </div>
                    
                    <div className="flex gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Score</p>
                        <p className="text-2xl font-extrabold text-blue-600">{attempt.score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Accuracy</p>
                        <p className="text-2xl font-extrabold text-emerald-500">
                          {attempt.total > 0 ? Math.round((attempt.correct / (attempt.correct + attempt.incorrect)) * 100) || 0 : 0}%
                        </p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Attempted</p>
                        <p className="text-2xl font-extrabold text-slate-700">{attempt.correct + attempt.incorrect}/{attempt.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><Bot className="mr-3 text-indigo-600"/> AI Study Assistant ✨</h2>
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm">
              <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100 flex items-start">
                 <div className="bg-indigo-600 p-3 rounded-xl text-white mr-4 shrink-0">
                    <BrainCircuit className="w-6 h-6"/>
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-1">How can I help you study today?</h3>
                   <p className="text-slate-600 text-sm">Ask me to explain complex topics, solve doubts, or create a personalized study schedule based on your weak areas.</p>
                 </div>
              </div>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if(!aiQuery.trim()) return;
                  setIsAiLoading(true);
                  setAiResponse('');
                  const res = await callGeminiAPI(`As a tutor for Naitra Edu Hub, please answer this student query: ${aiQuery}`);
                  setAiResponse(res);
                  setIsAiLoading(false);
                }} 
                className="mb-8 relative"
              >
                <textarea 
                  rows="3"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="E.g., Explain the concept of Plate Tectonics in Geography for UPSC..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none resize-none font-medium text-slate-900 bg-slate-50 focus:bg-white transition-colors md:pr-36"
                />
                <button 
                  type="submit" 
                  disabled={isAiLoading || !aiQuery.trim()}
                  className="md:absolute bottom-4 right-4 mt-4 md:mt-0 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isAiLoading ? 'Thinking...' : 'Ask AI ✨'}
                </button>
              </form>

              {aiResponse && (
                <div className="bg-slate-900 text-slate-300 p-6 md:p-8 rounded-2xl shadow-inner border border-slate-800 animate-fade-in relative">
                  <Sparkles className="absolute top-4 right-4 text-indigo-400 opacity-20 w-16 h-16"/>
                  <h4 className="text-white font-bold mb-4 flex items-center"><Bot className="w-5 h-5 mr-2 text-indigo-400"/> AI Response</h4>
                  <div className="prose prose-invert prose-indigo max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TestEngine({ test, studentProfile, onExit, user }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const questions = test.questions || [];

  useEffect(() => {
    if (result || isSubmitting) return;
    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result, isSubmitting]);

  const handleSelectOption = (optIndex) => {
    setAnswers(prev => ({ ...prev, [currentQIndex]: optIndex }));
  };

  const calculateResult = () => {
    let correct = 0;
    let incorrect = 0;
    
    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== undefined) {
        if (selected === parseInt(q.correctOption)) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const unattempted = questions.length - (correct + incorrect);
    const score = (correct * parseFloat(test.positiveMarks)) - (incorrect * parseFloat(test.negativeMarks));

    return {
      testId: test.id,
      testTitle: test.title,
      course: test.course,
      studentName: studentProfile.name,
      studentPhone: studentProfile.phone,
      total: questions.length,
      correct,
      incorrect,
      unattempted,
      score,
      createdAt: Date.now()
    };
  };

  const handleSubmitTest = async () => {
    if (!user) return; 
    setIsSubmitting(true);
    const finalResult = calculateResult();
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'testAttempts'), finalResult);
      setResult(finalResult);
    } catch (error) {
      console.error("Error saving attempt:", error);
      alert("Failed to save result. Please check connection.");
    }
    setIsSubmitting(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 text-white p-10 text-center relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-slate-800">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold mb-2">Test Submitted Successfully!</h2>
            <p className="text-slate-400">{test.title} • {studentProfile.name}</p>
          </div>
          
          <div className="p-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Your Performance Scorecard</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total Score</p>
                 <p className="text-3xl font-extrabold text-blue-700">{result.score}</p>
                 <p className="text-xs text-slate-400 mt-1">out of {result.total * test.positiveMarks}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Correct</p>
                 <p className="text-3xl font-extrabold text-emerald-600">{result.correct}</p>
                 <p className="text-xs text-emerald-600/70 mt-1">+{result.correct * test.positiveMarks} marks</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-2xl text-center border border-rose-100">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Incorrect</p>
                 <p className="text-3xl font-extrabold text-rose-600">{result.incorrect}</p>
                 <p className="text-xs text-rose-600/70 mt-1">-{result.incorrect * test.negativeMarks} marks</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Accuracy</p>
                 <p className="text-3xl font-extrabold text-slate-700">
                   {result.correct + result.incorrect > 0 ? Math.round((result.correct / (result.correct + result.incorrect)) * 100) : 0}%
                 </p>
              </div>
            </div>

            <button 
              onClick={onExit}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">{test.title}</h1>
          <p className="text-sm text-slate-500 font-medium">Candidate: {studentProfile.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className={`flex items-center font-mono font-bold text-xl px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
            <Clock className="w-5 h-5 mr-2" /> {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => {
               if(window.confirm("Are you sure you want to submit the test early?")) handleSubmitTest();
            }}
            disabled={isSubmitting}
            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full p-4 lg:p-6 gap-6">
        
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 md:p-10 flex-1">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Question {currentQIndex + 1} <span className="text-slate-400 font-medium text-sm ml-2">of {questions.length}</span></h2>
              <div className="flex gap-3 text-sm font-bold">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg">+{test.positiveMarks}</span>
                <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg">-{test.negativeMarks}</span>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-slate-800 font-medium mb-10 leading-relaxed">
              {currentQuestion?.questionText || "No question text provided."}
            </p>

            <div className="space-y-4">
              {currentQuestion?.options?.map((opt, idx) => {
                const isSelected = answers[currentQIndex] === idx;
                return (
                  <label 
                    key={idx} 
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${isSelected ? 'border-blue-600' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                    </div>
                    <span className={`text-base font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{opt}</span>
                    <input 
                      type="radio" 
                      name={`q-${currentQIndex}`} 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => handleSelectOption(idx)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 md:p-6 border-t border-slate-200 flex justify-between items-center">
            <button 
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const newAnswers = {...answers};
                  delete newAnswers[currentQIndex];
                  setAnswers(newAnswers);
                }}
                className="px-6 py-3 rounded-xl font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors hidden sm:block"
              >
                Clear Answer
              </button>
              <button 
                onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQIndex === questions.length - 1}
                className="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="lg:w-80 bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center"><List className="w-5 h-5 mr-2 text-blue-600"/> Question Palette</h3>
          <div className="flex flex-wrap gap-2 mb-8 flex-1 content-start">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isActive = currentQIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${
                    isActive ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  } ${
                    isAnswered ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          
          <div className="pt-6 border-t border-slate-100 space-y-3 mb-6 text-sm font-medium">
            <div className="flex items-center justify-between">
              <div className="flex items-center"><div className="w-4 h-4 rounded bg-emerald-500 mr-2"></div> Attempted</div>
              <span>{Object.keys(answers).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center"><div className="w-4 h-4 rounded bg-slate-100 border border-slate-300 mr-2"></div> Unattempted</div>
              <span>{questions.length - Object.keys(answers).length}</span>
            </div>
          </div>

          <button 
            onClick={() => {
               if(window.confirm("Are you sure you want to submit the test? You cannot undo this.")) handleSubmitTest();
            }}
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg lg:hidden"
          >
            {isSubmitting ? 'Submitting...' : 'Final Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================
function AdminDashboard({ user }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [adminTab, setAdminTab] = useState('enquiries');

  const [enquiries, setEnquiries] = useState([]);
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditingTest, setIsEditingTest] = useState(false);
  const [editTestObj, setEditTestObj] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === 'admin123') setIsAuthenticated(true);
    else setPin('');
  };

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    const unsubEnq = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'enquiries'), snap => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
      setEnquiries(data);
    });

    const unsubTests = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'tests'), snap => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
      setTests(data);
    });

    const unsubResults = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'testAttempts'), snap => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
      setResults(data);
    });

    return () => { unsubEnq(); unsubTests(); unsubResults(); };
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex bg-blue-50 p-4 rounded-2xl mb-6">
              <Lock className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Admin Portal</h2>
            <p className="text-slate-500 font-medium mt-2">Enter PIN to access (Demo: admin123)</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN"
                className="w-full px-6 py-4 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none text-center text-xl tracking-widest font-mono bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20 text-lg">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getFilteredData = () => {
    const lower = searchTerm.toLowerCase();
    if (adminTab === 'enquiries') {
      return enquiries.filter(e => 
        (e.studentName?.toLowerCase().includes(lower)) || (e.mobile?.includes(lower)) || (e.course?.toLowerCase().includes(lower))
      );
    }
    if (adminTab === 'tests') {
      return tests.filter(t => t.title?.toLowerCase().includes(lower) || t.course?.toLowerCase().includes(lower));
    }
    if (adminTab === 'results') {
      return results.filter(r => 
        r.studentName?.toLowerCase().includes(lower) || r.testTitle?.toLowerCase().includes(lower) || r.studentPhone?.includes(lower)
      );
    }
    return [];
  };
  const filteredData = getFilteredData();

  const handleCreateNewTest = () => {
    setEditTestObj({
      title: '', course: COURSES_LIST[0].title, duration: 60, positiveMarks: 4, negativeMarks: 1,
      published: false, questions: []
    });
    setIsEditingTest(true);
  };

  const deleteTest = async (id) => {
    if(window.confirm("Delete this test?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tests', id));
  };
  const togglePublish = async (test) => {
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tests', test.id), { published: !test.published });
  };

  if (isEditingTest) {
    return (
      <AdminTestBuilder 
        user={user} 
        initialData={editTestObj} 
        onCancel={() => setIsEditingTest(false)} 
        onSave={() => setIsEditingTest(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Admin Control Center</h1>
            <p className="text-slate-600 mt-2 font-medium">Manage admissions, tests, and view results.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl transition-colors flex items-center shadow-sm">
             <LogOut className="w-4 h-4 mr-2"/> Logout
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <button onClick={() => setAdminTab('enquiries')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center ${adminTab === 'enquiries' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Users className="w-4 h-4 mr-2"/> Admission Leads
          </button>
          <button onClick={() => setAdminTab('tests')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center ${adminTab === 'tests' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            <FileQuestion className="w-4 h-4 mr-2"/> Manage Tests
          </button>
          <button onClick={() => setAdminTab('results')} className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center ${adminTab === 'results' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            <BarChart3 className="w-4 h-4 mr-2"/> Student Results
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" placeholder={`Search ${adminTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-white"
            />
          </div>
          {adminTab === 'tests' && (
            <button onClick={handleCreateNewTest} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2"/> Create New Test
            </button>
          )}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                  {adminTab === 'enquiries' && (
                    <>
                      <th className="p-5">ID / Date</th><th className="p-5">Student / Father Name</th><th className="p-5">Mobile</th><th className="p-5">Course</th><th className="p-5">City</th>
                    </>
                  )}
                  {adminTab === 'tests' && (
                    <>
                      <th className="p-5">Test Title</th><th className="p-5">Course</th><th className="p-5">Details</th><th className="p-5 text-center">Status</th><th className="p-5 text-right">Actions</th>
                    </>
                  )}
                  {adminTab === 'results' && (
                    <>
                      <th className="p-5">Date</th><th className="p-5">Student</th><th className="p-5">Test / Course</th><th className="p-5">Score</th><th className="p-5 text-center">Accuracy</th>
                    </>
                  )}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr><td colSpan="6" className="p-10 text-center text-slate-500 font-medium">No records found.</td></tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {adminTab === 'enquiries' && (
                        <>
                          <td className="p-5">
                            <div className="font-mono text-sm text-blue-600 font-bold">{item.enquiryId}</div>
                            <div className="text-xs text-slate-500 mt-1">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</div>
                          </td>
                          <td className="p-5"><div className="font-bold text-slate-900">{item.studentName}</div><div className="text-sm text-slate-500">{item.fatherName}</div></td>
                          <td className="p-5 font-bold font-mono text-slate-700">{item.mobile}</td>
                          <td className="p-5"><span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">{item.course}</span></td>
                          <td className="p-5 font-medium text-slate-600">{item.city}</td>
                        </>
                      )}
                      
                      {adminTab === 'tests' && (
                        <>
                          <td className="p-5 font-bold text-slate-900">{item.title}</td>
                          <td className="p-5"><span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">{item.course}</span></td>
                          <td className="p-5 text-sm text-slate-600 font-medium">
                            {item.questions?.length || 0} Qs • {item.duration}m • (+{item.positiveMarks}/-{item.negativeMarks})
                          </td>
                          <td className="p-5 text-center">
                            <button onClick={() => togglePublish(item)} className={`px-3 py-1 rounded-lg text-xs font-bold border ${item.published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                              {item.published ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="p-5 text-right flex justify-end gap-2">
                            <button onClick={() => { setEditTestObj(item); setIsEditingTest(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5"/></button>
                            <button onClick={() => deleteTest(item.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5"/></button>
                          </td>
                        </>
                      )}

                      {adminTab === 'results' && (
                        <>
                          <td className="p-5 text-sm text-slate-600 font-medium">{new Date(item.createdAt).toLocaleString()}</td>
                          <td className="p-5"><div className="font-bold text-slate-900">{item.studentName}</div><div className="text-xs font-mono text-slate-500">{item.studentPhone}</div></td>
                          <td className="p-5"><div className="font-bold text-slate-700">{item.testTitle}</div><div className="text-xs text-blue-600 font-bold mt-1">{item.course}</div></td>
                          <td className="p-5 font-extrabold text-blue-600 text-lg">{item.score} <span className="text-xs text-slate-400 font-medium">/ {item.total * (tests.find(t=>t.id===item.testId)?.positiveMarks || 4)}</span></td>
                          <td className="p-5 text-center">
                            <div className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.total > 0 ? Math.round((item.correct / (item.correct + item.incorrect)) * 100) || 0 : 0}%
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-200 text-sm font-medium text-slate-500">
             Total Records: {filteredData.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminTestBuilder({ user, initialData, onCancel, onSave }) {
  const [test, setTest] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => setTest({ ...test, [e.target.name]: e.target.value });

  const addQuestion = () => {
    setTest({
      ...test,
      questions: [...test.questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }]
    });
  };

  const updateQuestion = (qIndex, field, value) => {
    const updatedQs = [...test.questions];
    updatedQs[qIndex][field] = value;
    setTest({ ...test, questions: updatedQs });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updatedQs = [...test.questions];
    updatedQs[qIndex].options[optIndex] = value;
    setTest({ ...test, questions: updatedQs });
  };

  const removeQuestion = (qIndex) => {
    if(!window.confirm("Remove this question?")) return;
    const updatedQs = test.questions.filter((_, idx) => idx !== qIndex);
    setTest({ ...test, questions: updatedQs });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        ...test,
        duration: Number(test.duration),
        positiveMarks: Number(test.positiveMarks),
        negativeMarks: Number(test.negativeMarks),
        updatedAt: Date.now()
      };

      if (test.id) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tests', test.id), payload);
      } else {
        payload.createdAt = Date.now();
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tests'), payload);
      }
      onSave();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save test.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">{test.id ? 'Edit Test' : 'Create New Test'}</h1>
          <button onClick={onCancel} className="bg-white border border-slate-300 px-4 py-2 rounded-xl font-bold hover:bg-slate-100 transition-colors">Cancel</button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">Test Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Test Title *</label>
                <input type="text" name="title" required value={test.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white" placeholder="e.g. Weekly NDA Mock Test 1"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category / Course *</label>
                <select name="course" required value={test.course} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white">
                  {COURSES_LIST.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Minutes) *</label>
                <input type="number" min="1" name="duration" required value={test.duration} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Positive Marks (per correct) *</label>
                <input type="number" min="0" step="0.5" name="positiveMarks" required value={test.positiveMarks} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Negative Marks (per incorrect) *</label>
                <input type="number" min="0" step="0.1" name="negativeMarks" required value={test.negativeMarks} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white"/>
              </div>
              <div className="md:col-span-2 pt-2 flex items-center">
                <input type="checkbox" id="published" checked={test.published} onChange={(e) => setTest({...test, published: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mr-3"/>
                <label htmlFor="published" className="font-bold text-slate-700 cursor-pointer">Publish immediately (visible to students)</label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-slate-900">Questions ({test.questions.length})</h2>
              <button type="button" onClick={addQuestion} className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-4 py-2 rounded-lg flex items-center transition-colors">
                 <Plus className="w-4 h-4 mr-2"/> Add Question
              </button>
            </div>
            
            {test.questions.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 border-dashed">
                <p className="text-slate-500 font-medium">No questions added yet. Click "Add Question" to start building the test.</p>
              </div>
            )}

            {test.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group">
                <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-600 transition-colors p-1 bg-slate-50 hover:bg-rose-50 rounded-md">
                   <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="mb-4 pr-10">
                   <label className="block text-sm font-bold text-slate-700 mb-2">Q{qIndex + 1}. Question Text</label>
                   <textarea required rows="2" value={q.questionText} onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none font-medium bg-slate-50 focus:bg-white resize-none" placeholder="Enter question..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center">
                      <input 
                        type="radio" name={`correct-${qIndex}`} checked={Number(q.correctOption) === optIdx} onChange={() => updateQuestion(qIndex, 'correctOption', optIdx)}
                        className="w-5 h-5 mr-3 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <input 
                        type="text" required value={opt} onChange={(e) => updateOption(qIndex, optIdx, e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border outline-none font-medium transition-colors ${Number(q.correctOption) === optIdx ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500'}`}
                        placeholder={`Option ${optIdx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 pb-20 border-t border-slate-200 flex justify-end">
             <button type="submit" disabled={isSaving || test.questions.length === 0} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-xl shadow-lg transition-colors text-lg">
               {isSaving ? 'Saving...' : 'Save Complete Test'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================

function StatCard({ icon, title }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="bg-blue-50 p-4 rounded-2xl mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="font-extrabold text-slate-900 text-lg md:text-xl leading-tight">{title}</h3>
    </div>
  );
}

function PremiumFeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-300">
      <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-900/20">
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function SystemListItem({ icon, title, desc }) {
  return (
    <li className="flex items-start">
      <div className="bg-blue-600/20 p-2.5 rounded-xl mr-5 mt-1 border border-blue-500/30 text-blue-400 shrink-0">
         {icon}
      </div>
      <div>
        <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
        <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}

function CourseGridCard({ title, badge, description, duration, onApply }) {
  const getIcon = (b) => {
    switch(b) {
      case 'Popular': return <Shield className="h-10 w-10 text-blue-400" />;
      case 'New': return <Target className="h-10 w-10 text-indigo-400" />;
      case 'Defence': return <Shield className="h-10 w-10 text-emerald-400" />;
      case 'SSC': return <Users className="h-10 w-10 text-blue-400" />;
      case 'Premium': return <Award className="h-10 w-10 text-amber-400" />;
      case 'Medical': return <Activity className="h-10 w-10 text-rose-400" />;
      case 'Engineering': return <Target className="h-10 w-10 text-cyan-400" />;
      case 'Rajasthan': return <MapPin className="h-10 w-10 text-orange-400" />;
      default: return <BookOpen className="h-10 w-10 text-blue-400" />;
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 group">
      <div className="bg-slate-900 p-8 relative overflow-hidden h-48 flex flex-col justify-between border-b-4 border-blue-600">
        <div className="absolute -bottom-4 -right-4 p-8 opacity-10 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 text-white">
          {getIcon(badge)}
        </div>
        <div className="relative z-10 flex justify-between items-start">
          <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
            {badge}
          </span>
          <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 flex items-center text-white text-xs font-bold">
             <Calendar className="h-3.5 w-3.5 mr-1.5" /> {duration}
          </div>
        </div>
        <h3 className="text-2xl font-extrabold text-white mt-auto relative z-10 tracking-tight">{title}</h3>
      </div>
      
      <div className="p-8 flex-grow flex flex-col justify-between bg-white relative">
        <p className="text-slate-600 mb-8 leading-relaxed font-medium">{description}</p>
        <button 
          onClick={onApply}
          className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center border border-slate-200 group-hover:border-slate-900 shadow-sm"
        >
          Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}