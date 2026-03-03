import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  LayoutDashboard, 
  UserPlus, 
  Home as HomeIcon,
  BookOpen,
  Trophy,
  Brain,
  Sparkles,
  Languages,
  X,
  Megaphone,
  ShieldCheck,
  Phone,
  Clock,
  Settings,
  Download,
  Palette,
  Image as ImageIcon,
  Share2,
  Copy,
  Wand2,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import Markdown from 'react-markdown';
import { VoiceAssistant } from './components/VoiceAssistant';
import Advertisements from './components/Advertisements';
import AdminDashboard from './components/AdminDashboard';
import { PricingInfo, CourseModule, StudentPerformance, TOPICS } from './types';
import { generateCourseContent, getPostQuizAssistance, generateAdminPost, editImageColor } from './services/gemini';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, privacyMode, setPrivacyMode }: { 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  privacyMode: boolean,
  setPrivacyMode: (v: boolean) => void
}) => {
  const [showSecurityCenter, setShowSecurityCenter] = useState(false);

  return (
    <nav className="bg-white/70 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('home')}>
            {/* Integrated BIDA x Digital Azadi Logo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-6 bg-white px-8 py-3.5 rounded-[3rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] group-hover:border-brand/30 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Digital Azadi Logo First */}
              <div className="flex items-center gap-2 relative z-10">
                <img 
                  src="https://digitalazadi.com/wp-content/uploads/2025/03/Digital-Azadi-Logo-v3.png" 
                  alt="Digital Azadi" 
                  className="h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="h-10 w-px bg-slate-100"></div>

              {/* BIDA Part */}
              <div className="flex flex-col items-center relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-ink tracking-tighter">BIDA</span>
                  <div className="flex gap-1">
                    <motion.div animate={{ height: [10, 18, 10] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 bg-red-500 rounded-full" />
                    <motion.div animate={{ height: [18, 10, 18] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <span className="text-[7px] font-black text-brand uppercase tracking-[0.3em] leading-none">Bhaav Institute</span>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-10 ml-10">
              {['home', 'tools', 'ads'].map((tab) => (
                <button
                  key={tab}
                  onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                    activeTab === tab ? 'text-brand' : 'text-slate-400 hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {/* Security Shield Tool */}
            <div className="flex items-center bg-slate-50 rounded-[2rem] p-1.5 border border-slate-100">
              <button 
                onClick={() => setShowSecurityCenter(true)}
                className="p-2.5 text-slate-400 hover:text-brand transition-colors"
                title="Security Center"
              >
                <ShieldCheck size={20} />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1.5"></div>
              <button 
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                  privacyMode 
                    ? 'bg-ink text-white shadow-xl shadow-ink/20' 
                    : 'text-slate-500 hover:bg-white'
                }`}
              >
                {privacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="hidden xl:inline">{privacyMode ? "Public Mode Active" : "Public Mode"}</span>
              </button>
            </div>

            <div className="h-10 w-px bg-slate-100 mx-2"></div>

            <button 
              onClick={() => setActiveTab('admin')}
              className="p-3 text-slate-400 hover:text-brand transition-colors"
              title="Admin Panel"
            >
              <Settings size={22} />
            </button>
            
            <a 
              href="tel:+919891707226" 
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
            >
              <Phone size={14} /> +91 98917 07226
            </a>

            <button
              onClick={() => setActiveTab('register')}
              className="btn-premium btn-premium-primary"
            >
              Enroll Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Security Center Modal */}
      <AnimatePresence>
        {showSecurityCenter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityCenter(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden"
            >
              <div className="p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand/10 rounded-3xl flex items-center justify-center text-brand">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">Security Center</h2>
                      <p className="text-slate-500 font-medium">BIDA x Digital Azadi Safety Protocol</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSecurityCenter(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand mb-4 shadow-sm">
                      <EyeOff size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Public Mode</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Instantly blur sensitive student data, scores, and emails when using the app in public spaces.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 mb-4 shadow-sm">
                      <Lock size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Encrypted Data</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">All student interactions and personal information are encrypted using industry-standard protocols.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-brand/5 rounded-[2rem] border border-brand/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${privacyMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-sm font-bold text-slate-700">Public Mode Status: {privacyMode ? 'ACTIVE' : 'INACTIVE'}</span>
                  </div>
                  <button 
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      privacyMode ? 'bg-slate-900 text-white' : 'bg-brand text-white'
                    }`}
                  >
                    {privacyMode ? 'Disable' : 'Enable Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Home = ({ onStart }: { onStart: () => void }) => (
  <div className="space-y-40 pb-40">
    <section className="relative pt-32 pb-56 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="label-micro mb-10 flex items-center gap-3"
            >
              <div className="w-12 h-px bg-brand"></div>
              <Sparkles size={14} className="text-brand" />
              Bhaav Institute x Digital Azadi
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-12"
            >
              <h1 className="text-8xl md:text-[10rem] font-black text-ink tracking-tighter leading-[0.75] uppercase">
                CRAFT <br />
                <span className="text-brand">YOUR</span> <br />
                LEGACY.
              </h1>
              
              {/* Laptop with Institute Name - Editorial Style */}
              <motion.div 
                initial={{ opacity: 0, x: 50, rotate: 12 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.6, type: 'spring', damping: 20 }}
                className="absolute -right-12 -bottom-16 hidden xl:block w-80"
              >
                <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl border-[6px] border-slate-800 shadow-[0_40px_80px_rgba(0,0,0,0.3)] overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-60"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full mb-4 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <img src="https://digitalazadi.com/wp-content/uploads/2025/03/Digital-Azadi-Logo-v3.png" className="w-8 invert" />
                    </div>
                    <span className="text-white font-black text-sm uppercase tracking-[0.2em] leading-tight">
                      Bhaav <br /> Digital Marketing <br /> Institute
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-700"></div>
                </div>
              </motion.div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-500 mb-16 leading-relaxed max-w-lg font-medium serif-italic"
            >
              Master AI-Powered Digital Marketing & Basic Computers in just 60 days. Learn in <span className="text-ink font-black not-italic">Easy Hindi</span> with India's No. 1 Digital Marketing Classes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-8 items-center"
            >
              <button 
                onClick={onStart}
                className="btn-premium btn-premium-primary px-12 py-6 text-sm"
              >
                Secure My Spot <ArrowRight size={22} />
              </button>
              
              <div className="flex items-center gap-5">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i+20}/120/120`} className="w-14 h-14 rounded-full border-4 border-white shadow-xl" />
                  ))}
                </div>
                <div>
                  <p className="text-lg font-black text-ink leading-none">10,000+</p>
                  <p className="label-micro !tracking-widest">Students Trained</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-[12px] border-white bg-white">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
                alt="Cheerful Students Jumping" 
                className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"></div>
              
              <div className="absolute bottom-12 left-12 right-12 glass p-10 rounded-[3rem]">
                <div className="flex items-center gap-5 mb-5">
                  <div className="bg-emerald-500 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                    <TrendingUp size={32} />
                  </div>
                  <div>
                    <p className="label-micro text-slate-400">Confidence Level</p>
                    <p className="text-3xl font-black text-ink">100% Confident</p>
                  </div>
                </div>
                <p className="text-base text-slate-600 font-medium leading-relaxed serif-italic">"Our students graduate with the skills and confidence to lead the digital revolution."</p>
              </div>
            </div>
            
            {/* Floating Badge - Premium Style */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 z-20 bg-white p-8 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-50 flex items-center gap-5"
            >
              <div className="w-16 h-16 bg-brand rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-brand/20">
                <Trophy size={32} />
              </div>
              <div>
                <p className="label-micro">Certified by</p>
                <p className="text-lg font-black text-ink">Bhaav Institute</p>
              </div>
            </motion.div>

            {/* Decorative Blurs */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand/10 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-24">
        <span className="label-micro text-brand mb-4 block">Core Advantages</span>
        <h2 className="text-5xl md:text-6xl font-black text-ink tracking-tighter">Why Choose <span className="text-brand">BIDA</span>?</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {[
          { icon: Brain, title: "Adaptive Learning", color: "bg-violet-50/50 text-violet-600 border-violet-100" },
          { icon: Languages, title: "Easy Hindi", color: "bg-emerald-50/50 text-emerald-600 border-emerald-100" },
          { icon: Trophy, title: "15+ Certs", color: "bg-amber-50/50 text-amber-600 border-amber-100" },
          { icon: BookOpen, title: "60+ Modules", color: "bg-sky-50/50 text-sky-600 border-sky-100" },
          { icon: Clock, title: "100+ Hours", color: "bg-rose-50/50 text-rose-600 border-rose-100" },
          { icon: CheckCircle, title: "Placement", color: "bg-indigo-50/50 text-indigo-600 border-indigo-100" },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -12, scale: 1.05 }}
            className={`${feature.color} p-10 rounded-[3rem] border shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center text-center group transition-all cursor-default`}
          >
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-12 transition-transform">
              <feature.icon size={28} />
            </div>
            <h3 className="text-[11px] font-black text-ink uppercase tracking-[0.25em] leading-tight">{feature.title}</h3>
            <div className="mt-4 w-10 h-1 bg-white/50 rounded-full group-hover:w-16 transition-all"></div>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-32 bg-slate-50 rounded-[4rem] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px]"></div>
      <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
        <div>
          <h2 className="text-5xl font-black text-ink mb-10 tracking-tighter leading-tight">Master Advanced <br /><span className="text-brand">Digital Marketing</span> <br />& Basic Computer Course</h2>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed serif-italic">"We offer a unique combination of advanced digital marketing and essential computer skills to make you a complete professional."</p>
          <div className="grid grid-cols-2 gap-5 mb-12">
            {["MS Word", "MS Excel", "MS Powerpoint", "Paint", "WordPad"].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>
                <span className="font-bold text-ink text-sm uppercase tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="card-premium p-10 bg-white">
              <h4 className="text-5xl font-black text-brand mb-3 tracking-tighter">60+</h4>
              <p className="label-micro">Latest Modules</p>
            </div>
            <div className="card-premium p-10 bg-white">
              <h4 className="text-5xl font-black text-emerald-500 mb-3 tracking-tighter">100+</h4>
              <p className="label-micro">Hours Training</p>
            </div>
          </div>
          <div className="space-y-8 pt-16">
            <div className="card-premium p-10 bg-white">
              <h4 className="text-5xl font-black text-amber-500 mb-3 tracking-tighter">15+</h4>
              <p className="label-micro">Certifications</p>
            </div>
            <div className="card-premium p-10 bg-white">
              <h4 className="text-5xl font-black text-indigo-500 mb-3 tracking-tighter">100%</h4>
              <p className="label-micro">Practical Work</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-32">
      <div className="text-center mb-24">
        <span className="label-micro text-brand mb-4 block">Comprehensive Curriculum</span>
        <h2 className="text-5xl md:text-7xl font-black text-ink mb-6 tracking-tighter">Our <span className="text-brand">60 Latest</span> Modules</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xl serif-italic">A colorful journey through the entire digital marketing landscape, powered by Bhaav Institute's expert methodology.</p>
      </div>
      
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="grid grid-cols-4 p-8 bg-slate-50 border-b border-slate-100">
          <span className="label-micro"># ID</span>
          <span className="label-micro">Module Name</span>
          <span className="label-micro">Category</span>
          <span className="label-micro">Status</span>
        </div>
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {TOPICS.map((topic, i) => (
            <div key={i} className="data-grid-row group">
              <span className="font-mono text-xs text-slate-400">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="font-bold text-ink uppercase tracking-widest text-xs group-hover:text-brand transition-colors">{topic}</span>
              <span className="text-xs text-slate-500 font-medium serif-italic">Digital Marketing Core</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Module</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-16 p-16 bg-ink rounded-[4rem] text-white text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10">
          <h3 className="text-4xl font-black mb-6 tracking-tight">Ready to start your colorful journey?</h3>
          <p className="text-slate-400 font-medium mb-12 max-w-xl mx-auto text-lg serif-italic">Join Bhaav Institute x Digital Azadi today and get access to all 60+ modules with lifetime updates and placement support.</p>
          <button 
            onClick={onStart}
            className="btn-premium bg-white text-ink hover:bg-brand hover:text-white px-12 py-6 mx-auto"
          >
            Enroll Now <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  </div>
);

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postPrompt, setPostPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [generatingPost, setGeneratingPost] = useState(false);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const generatePost = async () => {
    if (!postPrompt) return;
    setGeneratingPost(true);
    try {
      const text = await generateAdminPost(postPrompt);
      setGeneratedPost(text);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPost(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900">Registered Students</h2>
              <a 
                href="/api/admin/export-users" 
                className="flex items-center gap-2 text-sm font-bold text-brand hover:underline"
              >
                <Download size={16} /> Export CSV
              </a>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Fee Paid</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 privacy-blur">{user.name}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium privacy-blur">{user.email}</td>
                        <td className="px-6 py-4 font-black text-brand">₹{user.price_paid.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{new Date(user.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand p-2 rounded-xl text-white">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-bold">AI Post Agent</h3>
            </div>
            <p className="text-slate-400 text-sm mb-6">Generate high-converting social media posts with shareable links to boost sales.</p>
            
            <div className="space-y-4">
              <textarea
                value={postPrompt}
                onChange={(e) => setPostPrompt(e.target.value)}
                placeholder="What should the post be about? (e.g. 50% discount for next 10 students)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand outline-none transition-all h-32 resize-none"
              />
              <button
                onClick={generatePost}
                disabled={generatingPost || !postPrompt}
                className="w-full py-4 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {generatingPost ? 'Generating...' : 'Generate Post'}
              </button>
            </div>

            {generatedPost && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest">Generated Content</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedPost)}
                      className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Copy size={12} /> Copy
                    </button>
                    <button 
                      onClick={async () => {
                        const res = await fetch('/api/share', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ type: 'post', content: { text: generatedPost } }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          const url = `${window.location.origin}/?share=${data.id}`;
                          navigator.clipboard.writeText(url);
                          alert('Shareable link copied: ' + url);
                        }
                      }}
                      className="text-xs text-brand hover:text-brand-light transition-colors flex items-center gap-1"
                    >
                      <Share2 size={12} /> Share
                    </button>
                  </div>
                </div>
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {generatedPost}
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const CreativeLab = () => {
  const [activeTool, setActiveTool] = useState<'image' | 'copy' | 'idea' | 'seo' | 'mockup' | 'error'>('image');
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const [copyPrompt, setCopyPrompt] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [seoUrl, setSeoUrl] = useState('');
  const [seoResult, setSeoResult] = useState('');
  const [mockupText, setMockupText] = useState('');
  const [mockupImage, setMockupImage] = useState<string | null>(null);
  const [errorPrompt, setErrorPrompt] = useState('');
  const [errorResult, setErrorResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'image' | 'mockup') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'image') setImage(reader.result as string);
        else setMockupImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image || !instruction) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const result = await editImageColor(base64, instruction);
      setEditedImage(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateCopy = async () => {
    if (!copyPrompt) return;
    setLoading(true);
    try {
      const text = await generateAdminPost(copyPrompt);
      setGeneratedCopy(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateIdea = async () => {
    if (!ideaPrompt) return;
    setLoading(true);
    try {
      const text = await generateAdminPost(`Generate a creative business or marketing idea for: ${ideaPrompt}. Make it unique and actionable.`);
      setGeneratedIdea(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSeo = async () => {
    if (!seoUrl) return;
    setLoading(true);
    try {
      const text = await generateAdminPost(`Analyze the SEO potential for this website/keyword: ${seoUrl}. Provide 5 actionable tips for ranking higher.`);
      setSeoResult(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const detectError = async () => {
    if (!errorPrompt) return;
    setLoading(true);
    try {
      const text = await generateAdminPost(`Identify potential errors or improvements for this marketing campaign/setup: ${errorPrompt}. Provide a clear checklist of fixes.`);
      setErrorResult(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shareContent = async (type: string, content: any) => {
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
      });
      const data = await res.json();
      if (data.success) {
        setShareId(data.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-20 md:py-32 px-4 md:px-6">
      <div className="text-center mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="label-micro text-brand mb-4 md:mb-6 flex items-center justify-center gap-3"
        >
          <div className="w-8 h-px bg-brand"></div>
          <Sparkles size={14} />
          BIDA Creative Suite
          <div className="w-8 h-px bg-brand"></div>
        </motion.div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-ink mb-6 md:mb-8 tracking-tighter">
          The <span className="text-brand">Future</span> of Creation
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg md:text-xl serif-italic px-4">
          "Professional-grade tools designed for students and creators. Simple enough for children, powerful enough for agencies."
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12 md:mb-20">
        {[
          { id: 'image', label: 'Visual', icon: ImageIcon, desc: 'Visual Transformation' },
          { id: 'copy', label: 'Copy', icon: Megaphone, desc: 'Viral Content' },
          { id: 'idea', label: 'Idea', icon: Brain, desc: 'Smart Strategy' },
          { id: 'seo', label: 'SEO', icon: TrendingUp, desc: 'Rank Higher' },
          { id: 'mockup', label: 'Mockup', icon: LayoutDashboard, desc: 'Preview Ads' },
          { id: 'error', label: 'Error Lab', icon: ShieldCheck, desc: 'Self Error Detection' },
        ].map(tool => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id as any); setShareId(null); }}
            className={`flex flex-col items-center md:items-start gap-1 md:gap-2 px-6 md:px-10 py-4 md:py-6 rounded-[2rem] md:rounded-[3rem] font-bold transition-all border-2 ${
              activeTool === tool.id 
                ? 'bg-ink text-white border-ink shadow-xl md:shadow-2xl shadow-ink/20' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-brand/30'
            }`}
          >
            <div className="flex items-center gap-2 md:gap-4">
              <tool.icon size={18} className={activeTool === tool.id ? 'text-brand' : 'text-slate-400'} />
              <span className="text-[10px] md:text-sm uppercase tracking-[0.1em] md:tracking-[0.2em]">{tool.label}</span>
            </div>
            <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest opacity-60 ${activeTool === tool.id ? 'text-slate-400' : 'text-slate-400'}`}>
              {tool.desc}
            </span>
          </button>
        ))}
      </div>

      <div className="card-premium min-h-[500px] md:min-h-[700px] relative">
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-slate-50/50 -z-0"></div>
        
        {activeTool === 'image' && (
          <div className="grid lg:grid-cols-2 h-full relative z-10">
            <div className="p-8 md:p-16 lg:p-20 space-y-8 md:space-y-12">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-ink mb-4 tracking-tight">Visual Transformation</h3>
                <p className="text-slate-500 font-medium text-base md:text-lg serif-italic">Teach your brain to communicate with advanced systems. Change colors, styles, and moods with simple text commands.</p>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <span className="label-micro">Step 1: Source Material</span>
                  <input type="file" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" id="img-upload" accept="image/*" />
                  <label htmlFor="img-upload" className="w-full flex flex-col items-center justify-center gap-4 md:gap-6 p-8 md:p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] md:rounded-[4rem] cursor-pointer hover:border-brand hover:bg-brand/5 transition-all group">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                      <ImageIcon size={24} />
                    </div>
                    <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] md:text-xs">Drop your image here</span>
                  </label>
                </div>

                <div className="space-y-4">
                  <span className="label-micro">Step 2: Prompt</span>
                  <div className="relative">
                    <textarea
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder="e.g. Transform this into a vibrant neon cyberpunk scene"
                      className="w-full p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[3rem] outline-none focus:border-brand transition-all h-32 md:h-40 resize-none font-medium text-ink shadow-inner text-sm md:text-base"
                    />
                    <Wand2 className="absolute bottom-6 md:bottom-8 right-6 md:right-8 text-slate-300" size={20} />
                  </div>
                </div>

                <button
                  onClick={processImage}
                  disabled={loading || !image || !instruction}
                  className="btn-premium btn-premium-primary w-full py-6 md:py-8 text-xs md:text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    <>Execute Transformation <Sparkles size={18} /></>
                  )}
                </button>
              </div>
            </div>

            <div className="p-8 md:p-16 lg:p-20 flex flex-col items-center justify-center">
              {editedImage ? (
                <div className="space-y-8 md:space-y-10 w-full max-w-md">
                  <div className="relative group">
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      src={editedImage} 
                      className="w-full rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[8px] md:border-[12px] border-white" 
                    />
                    <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-brand text-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl">
                      <Sparkles size={20} />
                    </div>
                  </div>
                    <div className="flex gap-3 md:gap-5">
                      <button 
                        onClick={() => shareContent('image_edit', { original: image, edited: editedImage, instruction })}
                        className="btn-premium flex-1 bg-white border border-slate-200 text-ink hover:bg-slate-50 shadow-sm text-[10px] md:text-xs"
                      >
                        <Share2 className="w-4 h-4 md:w-5 md:h-5" /> Share
                      </button>
                      <a 
                        href={editedImage} 
                        download="bida-creation.png"
                        className="btn-premium bg-ink text-white hover:bg-brand p-4 md:p-5"
                      >
                        <Download className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                    </div>
                </div>
              ) : image ? (
                <div className="relative w-full max-w-sm">
                  <img src={image} className="w-full rounded-[3rem] md:rounded-[4rem] opacity-30 blur-md grayscale" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-xl px-6 md:px-10 py-3 md:py-5 rounded-full border border-white shadow-2xl">
                      <span className="text-[10px] md:text-xs font-black text-ink uppercase tracking-[0.2em] md:tracking-[0.3em]">Awaiting Command</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 md:space-y-8">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[3rem] md:rounded-[4rem] flex items-center justify-center text-slate-100 mx-auto shadow-2xl border border-slate-50">
                    <ImageIcon size={48} />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <p className="text-ink font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm">Visual Canvas Empty</p>
                    <p className="text-slate-400 font-medium text-xs md:text-sm serif-italic">Upload a photo to begin your creative journey</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTool === 'copy' && (
          <div className="p-8 md:p-16 lg:p-20 space-y-8 md:space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Viral Copy Lab</h3>
              <p className="text-slate-500 text-base md:text-lg font-medium">Generate high-converting headlines, captions, and posts that stop the scroll.</p>
            </div>
            
            <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-3">
                  <span className="label-micro">Campaign Context</span>
                  <textarea
                    value={copyPrompt}
                    onChange={(e) => setCopyPrompt(e.target.value)}
                    placeholder="Describe your product... (e.g. A 2-day workshop on Digital Marketing)"
                    className="w-full p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[3rem] outline-none focus:border-brand transition-all h-40 md:h-48 resize-none font-medium text-slate-700 shadow-inner text-sm md:text-base"
                  />
                </div>
                <button 
                  onClick={generateCopy}
                  disabled={loading || !copyPrompt}
                  className="w-full py-5 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-brand transition-all disabled:opacity-50 shadow-2xl shadow-slate-900/20"
                >
                  {loading ? 'Generating Magic...' : 'Generate Viral Content'}
                </button>
              </div>

              <div className="lg:col-span-2">
                {generatedCopy ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full flex flex-col gap-4 md:gap-6"
                  >
                    <div className="flex-1 p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl relative group overflow-y-auto max-h-[300px] md:max-h-[400px]">
                      <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed text-sm">
                        {generatedCopy}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCopy);
                          alert('Copy copied to clipboard!');
                        }}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors"
                      >
                        <Copy size={16} className="inline mr-2" /> Copy
                      </button>
                      <button 
                        onClick={() => shareContent('post', { text: generatedCopy })}
                        className="flex-1 py-4 bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                      >
                        <Share2 size={16} className="inline mr-2" /> Share
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full border-2 border-dashed border-slate-100 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                      <Megaphone className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Output Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTool === 'idea' && (
          <div className="p-8 md:p-16 lg:p-20 space-y-8 md:space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Strategy & Idea Lab</h3>
              <p className="text-slate-500 text-base md:text-lg font-medium">Stuck? Let our systems brainstorm your next big business move or marketing strategy.</p>
            </div>

            <div className="max-w-xl mx-auto space-y-8">
              <div className="relative">
                <input
                  type="text"
                  value={ideaPrompt}
                  onChange={(e) => setIdeaPrompt(e.target.value)}
                  placeholder="e.g. How to market a local bakery?"
                  className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-brand transition-all font-medium text-slate-700 shadow-inner pr-16 md:pr-20 text-sm md:text-base"
                />
                <button 
                  onClick={generateIdea}
                  disabled={loading || !ideaPrompt}
                  className="absolute right-2 top-2 bottom-2 px-4 md:px-6 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-brand transition-colors disabled:opacity-50"
                >
                  {loading ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>

              {generatedIdea && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center text-white">
                        <Brain size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Strategy Output</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-sm md:text-base">
                      <Markdown>{generatedIdea}</Markdown>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedIdea);
                          alert('Idea copied to clipboard!');
                        }}
                        className="flex-1 py-3 bg-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-colors"
                      >
                        <Copy size={14} className="inline mr-2" /> Copy
                      </button>
                      <button 
                        onClick={() => shareContent('idea', { text: generatedIdea })}
                        className="flex-1 py-3 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                      >
                        <Share2 size={14} className="inline mr-2" /> Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {activeTool === 'seo' && (
          <div className="p-8 md:p-16 lg:p-20 space-y-8 md:space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">SEO Lab</h3>
              <p className="text-slate-500 text-base md:text-lg font-medium">Analyze any website or keyword to get data-driven SEO optimization tips.</p>
            </div>

            <div className="max-w-xl mx-auto space-y-8">
              <div className="relative">
                <input
                  type="text"
                  value={seoUrl}
                  onChange={(e) => setSeoUrl(e.target.value)}
                  placeholder="Enter Website URL or Keyword..."
                  className="w-full px-6 md:px-8 py-5 md:py-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-brand transition-all font-medium text-slate-700 shadow-inner pr-16 md:pr-20 text-sm md:text-base"
                />
                <button 
                  onClick={analyzeSeo}
                  disabled={loading || !seoUrl}
                  className="absolute right-2 top-2 bottom-2 px-4 md:px-6 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-brand transition-colors disabled:opacity-50"
                >
                  {loading ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>

              {seoResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">SEO Analysis</span>
                  </div>
                  <div className="prose max-w-none text-sm md:text-base">
                    <Markdown>{seoResult}</Markdown>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(seoResult);
                        alert('SEO tips copied to clipboard!');
                      }}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors"
                    >
                      <Copy size={14} className="inline mr-2" /> Copy
                    </button>
                    <button 
                      onClick={() => shareContent('seo', { text: seoResult })}
                      className="flex-1 py-3 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                    >
                      <Share2 size={14} className="inline mr-2" /> Share
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {activeTool === 'error' && (
          <div className="p-8 md:p-16 lg:p-20 space-y-8 md:space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Error Lab</h3>
              <p className="text-slate-500 text-base md:text-lg font-medium">Self-detecting tool for marketing errors. Paste your campaign details or URL to find fixes.</p>
            </div>

            <div className="max-w-xl mx-auto space-y-8">
              <div className="relative">
                <textarea
                  value={errorPrompt}
                  onChange={(e) => setErrorPrompt(e.target.value)}
                  placeholder="Describe your campaign or paste a URL... (e.g. My Facebook ad is getting clicks but no sales)"
                  className="w-full p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[3rem] outline-none focus:border-brand transition-all h-32 md:h-40 resize-none font-medium text-slate-700 shadow-inner text-sm md:text-base"
                />
                <button 
                  onClick={detectError}
                  disabled={loading || !errorPrompt}
                  className="absolute right-4 bottom-4 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-brand transition-colors disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Detect Errors'}
                </button>
              </div>

              {errorResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-red-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Error Report</span>
                  </div>
                  <div className="prose max-w-none text-sm md:text-base text-red-900">
                    <Markdown>{errorResult}</Markdown>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(errorResult);
                        alert('Error report copied!');
                      }}
                      className="flex-1 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-colors"
                    >
                      <Copy size={14} className="inline mr-2" /> Copy
                    </button>
                    <button 
                      onClick={() => shareContent('error_report', { text: errorResult })}
                      className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                      <Share2 size={14} className="inline mr-2" /> Share
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {activeTool === 'mockup' && (
          <div className="p-8 md:p-16 lg:p-20 space-y-8 md:space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Ad Mockup Lab</h3>
              <p className="text-slate-500 text-base md:text-lg font-medium">Preview how your ads will look on social media before you launch them.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <span className="label-micro">Ad Creative</span>
                  <input type="file" onChange={(e) => handleImageUpload(e, 'mockup')} className="hidden" id="mockup-upload" accept="image/*" />
                  <label htmlFor="mockup-upload" className="w-full flex flex-col items-center justify-center gap-4 p-8 md:p-10 border-2 border-dashed border-slate-200 rounded-[1.5rem] md:rounded-[2rem] cursor-pointer hover:border-brand hover:bg-brand/5 transition-all">
                    {mockupImage ? (
                      <img src={mockupImage} className="h-24 md:h-32 rounded-xl" />
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
                        <span className="font-bold text-slate-500 text-xs md:text-sm">Upload Ad Image</span>
                      </>
                    )}
                  </label>
                </div>
                <div className="space-y-3">
                  <span className="label-micro">Ad Copy</span>
                  <textarea
                    value={mockupText}
                    onChange={(e) => setMockupText(e.target.value)}
                    placeholder="Enter your ad caption here..."
                    className="w-full p-5 md:p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-brand transition-all h-24 md:h-32 resize-none font-medium text-slate-700 text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-[320px] md:max-w-sm bg-white rounded-[2rem] md:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="p-3 md:p-4 flex items-center gap-3 border-b border-slate-50">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand rounded-full flex items-center justify-center text-white font-black text-[10px] md:text-xs">BIDA</div>
                    <div>
                      <p className="text-xs md:text-sm font-black text-slate-900">Bhaav Institute</p>
                      <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sponsored</p>
                    </div>
                  </div>
                  <div className="p-3 md:p-4 text-xs md:text-sm text-slate-700 min-h-[50px] md:min-h-[60px]">
                    {mockupText || "Your ad copy will appear here..."}
                  </div>
                  <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                    {mockupImage ? (
                      <img src={mockupImage} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-slate-200" />
                    )}
                  </div>
                  <div className="p-3 md:p-4 bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">BIDA.INSTITUTE</p>
                      <p className="text-xs md:text-sm font-black text-slate-900">Enroll in Marketing</p>
                    </div>
                    <button className="px-4 md:px-6 py-1.5 md:py-2 bg-slate-900 text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest">Learn More</button>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-3 w-full max-w-[320px] md:max-w-sm">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(mockupText);
                      alert('Ad copy copied!');
                    }}
                    className="flex-1 py-3 bg-white border border-slate-200 text-ink rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors"
                  >
                    <Copy size={14} className="inline mr-2" /> Copy
                  </button>
                  <button 
                    onClick={() => shareContent('mockup', { text: mockupText, image: mockupImage })}
                    className="flex-1 py-3 bg-brand text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                  >
                    <Share2 size={14} className="inline mr-2" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share ID Display - Common for all tools */}
        <AnimatePresence>
          {shareId && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-30"
            >
              <div className="p-4 md:p-6 bg-ink text-white rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className="bg-brand p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <LinkIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Shareable Link</span>
                    <span className="text-[10px] md:text-xs font-black truncate">bida.institute/?share={shareId}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?share=${shareId}`);
                    alert('Shareable link copied!');
                  }}
                  className="bg-white text-ink p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-brand hover:text-white transition-all shadow-lg"
                >
                  <Copy className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SharedView = ({ id }: { id: string }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/share/${id}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <X size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black">Shared content not found</h2>
      <p className="text-slate-500">This link may have expired or is invalid.</p>
      <button onClick={() => window.location.href = '/'} className="mt-8 text-brand font-bold">Go to BIDA Home</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sparkles className="text-brand" />
            <span className="font-black uppercase tracking-widest text-xs">Shared from BIDA Creative Lab</span>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-xs font-bold text-slate-400 hover:text-white">Visit BIDA</button>
        </div>

        <div className="p-12">
          {data.type === 'image_edit' && (
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original</span>
                  <img src={data.content.original} className="w-full rounded-2xl grayscale opacity-50" />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest">AI Transformation</span>
                  <img src={data.content.edited} className="w-full rounded-2xl shadow-xl" />
                </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">The Instruction</h4>
                <p className="text-slate-600 font-medium italic">"{data.content.instruction}"</p>
              </div>
            </div>
          )}
          
          {data.type === 'post' && (
            <div className="max-w-xl mx-auto">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed">
                  {data.content.text}
                </div>
              </div>
            </div>
          )}

          {data.type === 'idea' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="text-brand" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest text-brand">Business Strategy</span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <Markdown>{data.content.text}</Markdown>
                </div>
              </div>
            </div>
          )}

          {data.type === 'seo' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-emerald-600" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">SEO Analysis</span>
                </div>
                <div className="prose max-w-none">
                  <Markdown>{data.content.text}</Markdown>
                </div>
              </div>
            </div>
          )}

          {data.type === 'error_report' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="text-red-600" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest text-red-600">Error Report</span>
                </div>
                <div className="prose max-w-none text-red-900">
                  <Markdown>{data.content.text}</Markdown>
                </div>
              </div>
            </div>
          )}

          {data.type === 'mockup' && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                  <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-black text-xs">BIDA</div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Bhaav Institute</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sponsored</p>
                  </div>
                </div>
                <div className="p-4 text-sm text-slate-700 min-h-[60px]">
                  {data.content.text}
                </div>
                <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                  {data.content.image ? (
                    <img src={data.content.image} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={48} className="text-slate-200" />
                  )}
                </div>
                <div className="p-4 bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">BIDA.INSTITUTE</p>
                    <p className="text-sm font-black text-slate-900">Enroll in Marketing</p>
                  </div>
                  <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Learn More</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Registration = ({ onRegisterSuccess }: { onRegisterSuccess: (email: string) => void }) => {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(setPricing);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricing) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pricePaid: pricing.finalPrice }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        localStorage.setItem('student_email', formData.email);
        setTimeout(() => {
          onRegisterSuccess(formData.email);
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Spot Secured!</h2>
          <p className="text-slate-500 font-medium mb-8">Welcome to the BIDA family. We're redirecting you to your personalized dashboard...</p>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="h-full bg-brand"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-24 px-6">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Begin Your <span className="gradient-text">Transformation</span>.</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">Secure your spot in the next cohort and get immediate access to our AI-powered learning platform.</p>
          </div>

          {pricing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand rounded-[2.5rem] p-10 text-white shadow-2xl shadow-brand/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="flex justify-between items-start mb-8">
                <span className="text-brand-light/80 font-bold uppercase tracking-widest text-xs">Enrollment Fee</span>
                {pricing.discount > 0 && (
                  <span className="bg-white text-brand text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                    Early Bird {pricing.discount}% Off
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-6xl font-black">₹{pricing.finalPrice.toLocaleString()}</span>
                {pricing.discount > 0 && (
                  <span className="text-2xl text-white/40 line-through font-bold">₹{pricing.basePrice.toLocaleString()}</span>
                )}
              </div>
              {pricing.remainingDiscountSeats > 0 ? (
                <div className="flex items-center gap-2 text-brand-light font-bold text-sm bg-white/10 px-4 py-2 rounded-xl inline-flex">
                  <Sparkles size={16} />
                  Only {pricing.remainingDiscountSeats} discounted seats left!
                </div>
              ) : (
                <p className="text-brand-light/60 text-sm font-medium">Standard pricing applied for this cohort.</p>
              )}
            </motion.div>
          )}

          <div className="grid gap-6">
            {[
              "Full access to all AI-adaptive modules",
              "Personalized mentor feedback sessions",
              "24/7 Multilingual AI Voice Assistant",
              "Industry recognized certification"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-700 font-bold">
                <div className="bg-emerald-100 p-1 rounded-full">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-12 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-slate-900">Registration Form</h3>
              <p className="text-slate-400 font-medium">Complete your enrollment details</p>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-3"
              >
                <X size={18} />
                {error}
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>
            
            <button
              disabled={loading || !pricing}
              type="submit"
              className="btn-primary w-full py-5 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : !pricing ? (
                "Loading Pricing..."
              ) : (
                <>Secure My Spot <ArrowRight size={24} /></>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-400 font-medium">
              By registering, you agree to our <a href="#" className="text-brand hover:underline">Terms of Service</a> and <a href="#" className="text-brand hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
      <VoiceAssistant context="Registration page. Helping user with the form and explaining pricing/discounts." />
    </div>
  );
};

const Dashboard = ({ email }: { email: string }) => {
  const [performance, setPerformance] = useState<StudentPerformance[]>([]);
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);
  const [module, setModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [postAssistance, setPostAssistance] = useState<string | null>(null);
  const [assistanceLoading, setAssistanceLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/performance/${email}`)
      .then(res => res.json())
      .then(setPerformance);
  }, [email]);

  const loadModule = async () => {
    setLoading(true);
    setModule(null);
    setQuizSubmitted(false);
    setQuizAnswers([]);
    
    // Determine difficulty based on past performance
    const pastScores = performance.filter(p => p.topic === activeTopic);
    const avgScore = pastScores.length > 0 ? pastScores.reduce((a, b) => a + b.score, 0) / pastScores.length : 50;
    
    let difficulty = "Beginner";
    if (avgScore > 80) difficulty = "Advanced";
    else if (avgScore > 50) difficulty = "Intermediate";

    try {
      const data = await generateCourseContent(activeTopic, difficulty);
      setModule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!module) return;
    let correct = 0;
    module.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) correct++;
    });
    const finalScore = (correct / module.quiz.length) * 100;
    setScore(finalScore);
    setQuizSubmitted(true);
    setAssistanceLoading(true);

    // Get AI Post-Assistance
    try {
      const assistance = await getPostQuizAssistance(activeTopic, finalScore, module.quiz, quizAnswers);
      setPostAssistance(assistance);
    } catch (err) {
      console.error("Assistance error:", err);
    } finally {
      setAssistanceLoading(false);
    }

    // Save performance
    await fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        topic: activeTopic,
        score: finalScore,
        difficulty: "Intermediate" // Simplified for demo
      }),
    });

    // Refresh performance list
    const res = await fetch(`/api/performance/${email}`);
    const data = await res.json();
    setPerformance(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center text-brand">
                <Users size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Student</p>
                <p className="text-sm font-bold text-slate-900 truncate privacy-blur">{email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600" />
              Learning Topics
            </h3>
            <div className="space-y-2">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    activeTopic === topic ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <button
              onClick={loadModule}
              disabled={loading}
              className="w-full mt-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <Brain size={18} />
              {loading ? 'Generating...' : 'Generate Module'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Your Progress
            </h3>
            <div className="space-y-4">
              {performance.length === 0 ? (
                <p className="text-xs text-slate-400 text-center">No quiz data yet.</p>
              ) : (
                performance.slice(0, 5).map(p => (
                  <div key={p.id} className="flex justify-between items-center">
                    <div className="text-xs">
                      <p className="font-medium text-slate-700 truncate w-32">{p.topic}</p>
                      <p className="text-slate-400">{new Date(p.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full privacy-blur ${p.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.score}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900">AI is crafting your module...</h3>
                <p className="text-slate-500">Analyzing trends and tailoring content to your level.</p>
              </motion.div>
            ) : module ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">{module.title}</h2>
                  <div className="prose prose-slate max-w-none">
                    <Markdown>{module.explanation}</Markdown>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Industry Trends</h3>
                    <ul className="space-y-3">
                      {module.trends.map((t, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <TrendingUp size={18} className="text-indigo-600 mt-1 flex-shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Practice Exercises</h3>
                    <ul className="space-y-3">
                      {module.exercises.map((e, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">Case Study: {module.caseStudy.title}</h3>
                  <div className="space-y-4 opacity-90">
                    <p><span className="font-bold text-indigo-300">Scenario:</span> {module.caseStudy.scenario}</p>
                    <p><span className="font-bold text-indigo-300">Challenge:</span> {module.caseStudy.challenge}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">Module Quiz</h3>
                  <div className="space-y-8">
                    {module.quiz.map((q, i) => (
                      <div key={i} className="space-y-4">
                        <p className="font-bold text-slate-800">{i + 1}. {q.question}</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                const newAns = [...quizAnswers];
                                newAns[i] = optIdx;
                                setQuizAnswers(newAns);
                              }}
                              className={`p-4 rounded-xl text-left text-sm transition-all border ${
                                quizAnswers[i] === optIdx 
                                  ? 'bg-indigo-600 text-white border-indigo-600' 
                                  : 'bg-slate-50 text-slate-700 border-slate-100 hover:border-indigo-300'
                              } ${
                                quizSubmitted && optIdx === q.correctAnswer ? 'ring-2 ring-green-500' : ''
                              } ${
                                quizSubmitted && quizAnswers[i] === optIdx && optIdx !== q.correctAnswer ? 'ring-2 ring-red-500' : ''
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      disabled={quizAnswers.length < module.quiz.length}
                      className="mt-12 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div className="mt-12 space-y-8">
                      <div className="p-8 bg-slate-50 rounded-[2rem] text-center border border-slate-100">
                        <p className="text-slate-500 mb-2 font-medium uppercase tracking-widest text-xs">Your Performance</p>
                        <p className={`text-7xl font-black privacy-blur ${score >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {score}%
                        </p>
                        <p className="mt-4 text-slate-600 font-medium">
                          {score >= 70 ? 'Outstanding! You have mastered this module.' : 'Good effort! Let\'s review and improve.'}
                        </p>
                      </div>

                      {assistanceLoading ? (
                        <div className="flex flex-col items-center py-12">
                          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-slate-500 font-medium">Mentor AI is analyzing your results...</p>
                        </div>
                      ) : postAssistance && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-brand-light rounded-[2.5rem] border border-brand/10"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="bg-brand p-2 rounded-xl text-white">
                              <Brain size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-brand-dark">Mentor AI Feedback</h4>
                          </div>
                          <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed">
                            <Markdown>{postAssistance}</Markdown>
                          </div>
                          <div className="mt-8 flex justify-center">
                            <button 
                              onClick={loadModule}
                              className="btn-primary"
                            >
                              Retake with New Content
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl p-20 text-center border border-slate-100 shadow-sm">
                <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
                  <Brain size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Learn?</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Select a topic from the sidebar and click "Generate Module" to start your AI-powered learning session.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <VoiceAssistant context={`Dashboard. Helping student with ${activeTopic}. Providing navigation and study tips.`} />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [studentEmail, setStudentEmail] = useState<string | null>(localStorage.getItem('student_email'));
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const share = params.get('share');
    if (share) {
      setSharedId(share);
      setActiveTab('shared');
    }
  }, []);

  const handleRegisterSuccess = (email: string) => {
    setStudentEmail(email);
    setActiveTab('dashboard');
  };

  if (sharedId && activeTab === 'shared') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900" data-privacy={privacyMode}>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          privacyMode={privacyMode} 
          setPrivacyMode={setPrivacyMode} 
        />
        <SharedView id={sharedId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" data-privacy={privacyMode}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        privacyMode={privacyMode} 
        setPrivacyMode={setPrivacyMode} 
      />
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Home onStart={() => setActiveTab('register')} />
            </motion.div>
          )}
          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CreativeLab />
            </motion.div>
          )}
          {activeTab === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Registration onRegisterSuccess={handleRegisterSuccess} />
            </motion.div>
          )}
          {activeTab === 'ads' && (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Advertisements />
            </motion.div>
          )}
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AdminPanel />
            </motion.div>
          )}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {studentEmail ? (
                <Dashboard email={studentEmail} />
              ) : (
                <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl text-center">
                  <h3 className="text-xl font-bold mb-4">Please Register First</h3>
                  <p className="text-slate-600 mb-6">You need to be registered to access the learning dashboard.</p>
                  <button 
                    onClick={() => setActiveTab('register')}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    Go to Registration
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-1 rounded-xl">
                  <img 
                    src="https://storage.googleapis.com/static.aistudio.google.com/content/file-0-1740314981831-277156942.png" 
                    alt="Digital Azadi" 
                    className="w-10 h-10 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-2xl font-black tracking-tighter">BIDA<span className="text-brand">.</span></span>
              </div>
              <p className="text-slate-400 max-w-sm mb-8">
                BIDA (Bhaav Institute x Digital Azadi) is dedicated to empowering the next generation of digital marketers through AI-driven education.
              </p>
              <div className="flex gap-4">
                <a href="tel:+919891707226" className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors">
                  <Phone size={20} className="text-brand" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Quick Links</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-brand transition-colors">Home</button></li>
                <li><button onClick={() => setActiveTab('ads')} className="hover:text-brand transition-colors">Advertisements</button></li>
                <li><button onClick={() => setActiveTab('register')} className="hover:text-brand transition-colors">Register</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Contact</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><a href="tel:9266347226" className="hover:text-brand transition-colors">+91 92663 47226</a></li>
                <li><a href="tel:8920306977" className="hover:text-brand transition-colors">+91 89203 06977</a></li>
                <li><a href="mailto:bhaav.institute@digitalazadi.com" className="hover:text-brand transition-colors">bhaav.institute@digitalazadi.com</a></li>
                <li>House No. 396, 1st Floor, Bhera Enclave, Paschim Vihar, New Delhi, 110087</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">© 2026 BIDA (Bhaav Institute x Digital Azadi). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
