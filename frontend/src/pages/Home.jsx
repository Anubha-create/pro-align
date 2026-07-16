import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Bot, 
  Lock, 
  ArrowRight, 
  Heart, 
  UploadCloud,
  FileCheck2,
  ChevronDown,
  Sun,
  Moon,
  FileText,
  CheckCircle,
  Sparkles,
  Cpu,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import NetworkBackground from '../components/NetworkBackground';
import BubbleOverlay from '../components/BubbleOverlay';
import FlowSteps from '../components/FlowSteps';
import Interactive3DCard from '../components/Interactive3DCard';

const Home = () => {
  const navigate = useNavigate();
  const belowFoldRef = useRef(null);
  const { theme, toggleTheme } = useApp();

  const roles = [
    'Senior Product Manager',
    'Data Analyst',
    'Marketing Executive',
    'Software Engineer',
    'UI/UX Designer'
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    belowFoldRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll reveal variants for feature cards
  const cardVariants = {
    hidden: { opacity: 0, y: 45 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
        delay: i * 0.15
      }
    })
  };

  return (
    <div className="bg-transparent text-[#0d2c3e] dark:text-slate-200 font-sans min-h-screen flex flex-col justify-between overflow-x-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION (ABOVE-THE-FOLD REPLICATION) */}
      <section className="relative min-h-[100vh] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 py-6 z-10">
        
        {/* Animated Mesh, Neural Constellation Network, Floating Skill Tags & Scanning Pulse Overlay */}
        <NetworkBackground theme={theme} />
        <BubbleOverlay />

        {/* TOP NAVBAR */}
        <header className="max-w-7xl mx-auto w-full flex justify-between items-center z-20">
          {/* Logo: "PRO-ALIGN" with glass bubble decoration */}
          <div className="flex items-center relative cursor-pointer select-none" onClick={() => navigate('/')}>
            <div className="absolute -left-2.5 w-7 h-7 rounded-full border border-teal-500/25 dark:border-white/35 bg-teal-500/5 dark:bg-white/5 backdrop-blur-[2px] shadow-[inset_-2px_-2px_6px_rgba(0,180,180,0.15)] dark:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.22)] pointer-events-none" />
            <span className="font-extrabold text-sm text-[#0b3a43] dark:text-white tracking-wider pl-3 z-10">PRO-ALIGN</span>
          </div>

          {/* Outlined pill Sign Up button & Theme Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-teal-500/5 dark:bg-white/5 border border-teal-500/15 dark:border-white/10 hover:bg-teal-500/10 dark:hover:bg-white/10 text-[#0b3a43] dark:text-yellow-400 transition-all duration-200 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="text-[#0b3a43]/80 hover:text-[#0b3a43] dark:text-white/80 dark:hover:text-white text-sm font-bold tracking-wider transition-colors duration-200 cursor-pointer hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-6 py-2.5 border border-teal-500/40 hover:border-teal-600 text-[#0b3a43] dark:border-white/50 dark:hover:border-white dark:text-white rounded-full text-sm font-semibold tracking-wider transition-all duration-300 backdrop-blur-[1px] hover:scale-105 active:scale-95 cursor-pointer bg-teal-500/5 dark:bg-white/5"
            >
              Sign Up
            </button>
          </div>
        </header>

        {/* HERO CONTENT: THREE COLUMN SAAS GRID */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex-grow flex items-center py-10 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full">
            
            {/* Left Column: Title, Description, CTA Buttons & Stats */}
            <div className="lg:col-span-5 text-left space-y-6 select-none">
              <span className="inline-block bg-teal-500/10 dark:bg-white/5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-teal-700 dark:text-cyan-300 border border-teal-500/10 dark:border-white/5">
                ✨ AI-Powered Career Intelligence
              </span>
              
              <h1 className="text-[3.8rem] sm:text-[5.2rem] lg:text-[6.2rem] font-bold text-[#08323f] dark:text-white leading-[0.88] tracking-tight">
                Analyze.<br />Optimize.<br />Get Hired.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed font-medium max-w-md">
                Match your resume with any job description, improve your ATS score, bridge skill gaps, and practice mock interviews with our AI-powered career assistant.
              </p>
              
              {/* Two CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-1">
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-7 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(20,184,166,0.25)] dark:shadow-[0_4px_20px_rgba(20,184,166,0.35)] cursor-pointer"
                >
                  Analyze Resume
                </button>
                <button 
                  onClick={handleScrollDown}
                  className="px-7 py-3 border border-teal-500/40 hover:border-teal-500 text-[#0b3a43] dark:border-white/50 dark:hover:border-white dark:text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-[1px] hover:scale-105 active:scale-95 cursor-pointer bg-teal-500/5 dark:bg-white/5"
                >
                  Live Demo
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-teal-500/10 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8.5 h-8.5 rounded-lg bg-teal-500/5 dark:bg-white/5 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <span className="block text-base font-black text-[#08323f] dark:text-white leading-none">15K+</span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">Resumes Scanned</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8.5 h-8.5 rounded-lg bg-teal-500/5 dark:bg-white/5 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-455" />
                  </div>
                  <div className="text-left">
                    <span className="block text-base font-black text-[#08323f] dark:text-white leading-none">95%+</span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">ATS Accuracy</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8.5 h-8.5 rounded-lg bg-teal-500/5 dark:bg-white/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <span className="block text-base font-black text-[#08323f] dark:text-white leading-none">50+</span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider">Skills Detected</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8.5 h-8.5 rounded-lg bg-teal-500/5 dark:bg-white/5 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-teal-600 dark:text-teal-455" />
                  </div>
                  <div className="text-left">
                    <span className="block text-base font-black text-[#08323f] dark:text-white leading-none">AI</span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider">Powered Insights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: Interactive Draggable Connective Flowchart */}
            <div className="lg:col-span-3 w-full flex justify-center">
              <FlowSteps theme={theme} />
            </div>

            {/* Right Column: Rich SaaS Dashboard Mockup with Interactive 3D Touch */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end w-full">
              <Interactive3DCard
                defaultTransform="perspective(1000px) rotateX(10deg) rotateY(-12deg) rotateZ(1.5deg)"
                maxTilt={20}
                scale={1.03}
                className="w-full max-w-[370px] cursor-grab active:cursor-grabbing"
              >
                <div className="w-full p-5 rounded-3xl border border-teal-500/10 dark:border-cyan-400/50 shadow-[0_20px_50px_rgba(0,180,180,0.06)] dark:shadow-[inset_0_0_30px_rgba(6,182,212,0.18),0_0_35px_rgba(6,182,212,0.4),0_0_5px_rgba(20,184,166,0.25),0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md bg-white/90 dark:bg-[#092736]/90 space-y-4 relative overflow-hidden">
                  
                  {/* Neon radial glow overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_65%)] pointer-events-none rounded-3xl" />
                  {/* Header info */}
                  <div className="flex justify-between items-center pb-1 border-b border-teal-500/10 dark:border-white/5">
                    <div>
                      <span className="block font-bold text-[#08323f] dark:text-white text-xs tracking-wide">Dashboard</span>
                      <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">Target: <span className="text-teal-600 dark:text-teal-400 font-extrabold">{roles[currentRoleIndex]}</span></span>
                    </div>
                    <button 
                      onClick={() => navigate('/signup')}
                      className="px-2.5 py-1 border border-teal-500/35 hover:border-teal-500 dark:border-white/20 dark:hover:border-white text-[8px] font-bold uppercase tracking-wider rounded-md text-[#0b3a43] dark:text-white bg-teal-500/5 dark:bg-white/5 cursor-pointer"
                    >
                      Generate Report
                    </button>
                  </div>

                  {/* Score gauge circle */}
                  <div className="p-3 bg-teal-500/5 dark:bg-slate-900/40 rounded-2xl border border-teal-500/5 dark:border-white/5">
                    <div className="relative w-28 h-28 flex items-center justify-center mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="42"
                          className="stroke-slate-200 dark:stroke-slate-800"
                          strokeWidth="6"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="42"
                          className="stroke-emerald-500 dark:stroke-emerald-450"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 42}
                          strokeDashoffset={2 * Math.PI * 42 * (1 - 0.92)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-black text-slate-850 dark:text-white leading-none">92%</span>
                        <span className="text-[7.5px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-0.5">ATS Score</span>
                        <span className="mt-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[7px] font-black uppercase rounded tracking-wider leading-none">Excellent</span>
                      </div>
                    </div>
                  </div>

                  {/* ATS horizontal progress bars */}
                  <div className="space-y-3">
                    {/* Match Alignment */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold tracking-wide">
                        <span className="text-slate-500 dark:text-slate-400 uppercase">Match Alignment</span>
                        <span className="text-teal-600 dark:text-teal-400">89%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[89%] rounded-full shadow-[0_0_8px_rgba(20,184,166,0.35)]" />
                      </div>
                    </div>

                    {/* Keyword Coverage */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-bold tracking-wide">
                        <span className="text-slate-500 dark:text-slate-400 uppercase">Keyword Coverage</span>
                        <span className="text-cyan-600 dark:text-cyan-400">91%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-[91%] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.35)]" />
                      </div>
                    </div>
                  </div>

                  {/* Skill Match metrics checklist */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1.5">
                    {[
                      { label: 'Technical Skills', val: '95%' },
                      { label: 'Soft Skills', val: '88%' },
                      { label: 'Experience', val: '84%' },
                      { label: 'Education', val: '100%' }
                    ].map((metric, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[7px] font-bold text-slate-500 dark:text-slate-455 uppercase">
                          <span>{metric.label}</span>
                          <span>{metric.val}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full" 
                            style={{ width: metric.val }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tag examples */}
                  <div className="space-y-1.5">
                    <span className="block text-[8.5px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-455">Tag Examples</span>
                    <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-hidden">
                      {[
                        'Resume Score', 'Interview Ready', 'Skill Match', 
                        'Career Growth', 'Recruiter Approved', 'ATS Friendly', 
                        'Job Match', 'Application Success', 'Professional Profile'
                      ].map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-650 dark:text-teal-400 border border-teal-500/20 rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation block with trending chart */}
                  <div className="p-3 bg-teal-500/5 dark:bg-slate-900/40 rounded-2xl border border-teal-500/5 dark:border-white/5 flex items-center justify-between gap-3 text-left">
                    <div className="space-y-0.5">
                      <span className="block text-[7.5px] font-black uppercase text-teal-600 dark:text-teal-400">Recommendation</span>
                      <p className="text-[8.5px] text-slate-600 dark:text-slate-350 leading-tight font-medium">
                        Great match! Your resume is well-aligned. Add missing skills to improve score.
                      </p>
                    </div>
                    
                    {/* Miniature growth chart */}
                    <div className="flex-shrink-0">
                      <svg className="w-14 h-7 text-cyan-600 dark:text-cyan-400 stroke-current" viewBox="0 0 100 40" fill="none">
                        <path
                          d="M0 35 Q 25 15, 50 25 T 100 5"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Interactive3DCard>

            </div>

          </div>
        </div>

        {/* Core Services Cards Bottom Row with Interactive 3D hover */}
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-6 pb-6 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-20 relative">
          {[
            {
              title: "AI Resume Analyzer",
              desc: "Deep scan & match",
              icon: <FileCheck2 className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: "Skill Gap Analysis",
              desc: "Find & fill gaps",
              icon: <Zap className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
            },
            {
              title: "Interview Coach",
              desc: "AI mock interviews",
              icon: <Bot className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
            },
            {
              title: "Cover Letter Generator",
              desc: "Tailored for you",
              icon: <Sparkles className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
            }
          ].map((item, idx) => (
            <Interactive3DCard
              key={idx}
              maxTilt={12}
              scale={1.03}
              className="cursor-pointer"
            >
              <div className="p-3.5 rounded-2xl border border-teal-500/10 dark:border-white/5 bg-white/70 dark:bg-[#072a36]/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,180,180,0.04)] dark:shadow-none hover:border-teal-500/20 dark:hover:border-white/10 transition-all duration-300 flex items-center gap-3.5 group h-full">
                <div className="w-9 h-9 rounded-xl bg-teal-500/5 dark:bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  {item.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-[11px] font-bold text-[#08323f] dark:text-white tracking-wide">{item.title}</h4>
                  <p className="text-[9.5px] text-slate-500 dark:text-slate-455 mt-0.5 font-semibold">{item.desc}</p>
                </div>
              </div>
            </Interactive3DCard>
          ))}
        </div>

      </section>

      {/* 2. WHY SECTION (BELOW-THE-FOLD PRO-ALIGN INTEGRATION) */}
      <section 
        ref={belowFoldRef} 
        className="bg-white/50 dark:bg-slate-900/40 text-[#0d2c3e] dark:text-white py-24 px-8 text-center relative overflow-hidden border-t border-teal-500/10 dark:border-white/5 transition-colors duration-300"
      >
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-455 dark:to-cyan-300">
              Why PRO-ALIGN?
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Engineered to make you stand out from the crowd and beat automated screening models with advanced semantic analysis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div 
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="h-full"
            >
              <Interactive3DCard
                maxTilt={10}
                scale={1.02}
                className="h-full"
              >
                <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/40 border border-teal-500/10 dark:border-slate-800 hover:border-teal-500/30 dark:hover:border-slate-700 transition-all duration-300 space-y-5 text-left backdrop-blur-sm shadow-sm dark:shadow-none h-full">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-650 dark:text-cyan-400 shadow-inner">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-[#08323f] dark:text-slate-100">Instant Resume Analysis</h3>
                  <p className="text-sm text-slate-555 dark:text-slate-455 leading-relaxed font-medium">
                    Upload your resume and a job description to get an instant, visual match score and detailed category breakdown.
                  </p>
                </div>
              </Interactive3DCard>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div 
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="h-full"
            >
              <Interactive3DCard
                maxTilt={10}
                scale={1.02}
                className="h-full"
              >
                <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/40 border border-teal-500/10 dark:border-slate-800 hover:border-teal-500/30 dark:hover:border-slate-700 transition-all duration-300 space-y-5 text-left backdrop-blur-sm shadow-sm dark:shadow-none h-full">
                  <div className="w-12 h-12 rounded-2xl bg-teal-400/10 flex items-center justify-center text-teal-655 dark:text-teal-400 shadow-inner">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-[#08323f] dark:text-slate-100">AI-Powered Recommendations</h3>
                  <p className="text-sm text-slate-555 dark:text-slate-455 leading-relaxed font-medium">
                    Receive actionable, section-specific suggestions and custom interview coaching points tailored precisely to the target role.
                  </p>
                </div>
              </Interactive3DCard>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="h-full"
            >
              <Interactive3DCard
                maxTilt={10}
                scale={1.02}
                className="h-full"
              >
                <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/40 border border-teal-500/10 dark:border-slate-800 hover:border-teal-500/30 dark:hover:border-slate-700 transition-all duration-300 space-y-5 text-left backdrop-blur-sm shadow-sm dark:shadow-none h-full">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-655 dark:text-cyan-455 shadow-inner">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-[#08323f] dark:text-slate-100">ATS Optimization</h3>
                  <p className="text-sm text-slate-555 dark:text-slate-455 leading-relaxed font-medium">
                    Ensure your resume structure meets the formatting standards of Applicant Tracking Systems to confidently pass screening gates.
                  </p>
                </div>
              </Interactive3DCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. STEPPER UPLOAD CALL TO ACTION */}
      <section className="min-h-screen bg-gradient-to-r from-teal-500 to-cyan-500 flex flex-col justify-center items-center py-16 px-8 text-white text-center relative border-t border-teal-500/10 dark:border-white/5">
        <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Let's Find Your Match!</h2>
            <p className="text-sm md:text-base text-white/95 max-w-lg mx-auto leading-relaxed font-semibold">
              Upload your resume and job description to get AI-powered insights and recommendations.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.2 }}
            className="bg-white/90 dark:bg-[#09212c]/95 p-8 md:p-10 rounded-3xl shadow-2xl space-y-8 max-w-lg mx-auto border border-teal-600/10 dark:border-white/10 transition-colors"
          >
            <p className="text-xs md:text-[13px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest">Follow these simple steps to analyze your match</p>
            
            {/* Stepper display */}
            <div className="flex justify-center items-center gap-6 text-sm font-black text-slate-400">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-teal-500/20">1</span>
                <span className="text-[11px] md:text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider font-extrabold">Upload Resume</span>
              </motion.div>
              <span className="text-slate-400 dark:text-slate-600 text-lg">›</span>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black border border-slate-200 dark:border-white/5">2</span>
                <span className="text-[11px] md:text-xs uppercase tracking-wider font-extrabold">Job Description</span>
              </motion.div>
              <span className="text-slate-400 dark:text-slate-600 text-lg">›</span>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black border border-slate-200 dark:border-white/5">3</span>
                <span className="text-[11px] md:text-xs uppercase tracking-wider font-extrabold">Done</span>
              </motion.div>
            </div>

            <motion.div 
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.35 }}
              className="p-5 bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-350 rounded-2xl border border-teal-200 dark:border-teal-900/35 text-left text-sm leading-relaxed flex items-start gap-4"
            >
              <FileCheck2 className="w-6 h-6 mt-0.5 text-teal-600 dark:text-teal-450 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-sm md:text-base text-teal-900 dark:text-teal-200">Start by uploading your resume</p>
                <p className="text-[13px] md:text-sm text-teal-700/90 dark:text-teal-450 mt-1.5 leading-normal font-medium">Upload your resume in PDF, DOCX, or Word format. We will parse it securely and extract matching details.</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ 
                scale: 1.025, 
                y: -2,
                boxShadow: "0 10px 15px -8px rgba(20, 184, 166, 0.4)" 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signup')}
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-colors duration-250 shadow-sm flex items-center justify-center gap-2.5 cursor-pointer border border-white/10"
            >
              <UploadCloud className="w-4.5 h-4.5" /> Upload Resume
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-white/70 dark:bg-[#03141c] text-slate-600 dark:text-slate-455 py-16 px-8 border-t border-slate-200 dark:border-white/5 text-sm text-left transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 items-start border-b border-slate-200 dark:border-white/5 pb-12">
          {/* Logo & Newsletter */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <svg 
                className="w-7 h-7 text-teal-600 dark:text-teal-400 animate-pulse" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-lg tracking-widest">PRO-ALIGN</span>
            </div>
            <p className="text-slate-600 dark:text-slate-455 max-w-sm leading-relaxed">Stay updated on our product changes and feature optimizations:</p>
            <div className="flex gap-2.5">
              <input
                type="email"
                placeholder="Your Email Address"
                className="px-4 py-2.5 bg-white dark:bg-slate-950/60 border border-slate-250 dark:border-white/10 rounded-xl focus:outline-none focus:border-teal-500 text-sm text-slate-800 dark:text-slate-350 w-full max-w-[220px] transition-colors"
              />
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition-colors duration-200 cursor-pointer"
              >
                Subscribe
              </motion.button>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-4 tracking-wider uppercase text-xs">Product</h4>
            <ul className="space-y-3 font-medium text-slate-600 dark:text-slate-455">
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">Resume Match</a></li>
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">ATS Check</a></li>
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">AI Recommendations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-4 tracking-wider uppercase text-xs">Developers</h4>
            <ul className="space-y-3 font-medium text-slate-600 dark:text-slate-455">
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">GitHub Repo</a></li>
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">API Docs</a></li>
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-4 tracking-wider uppercase text-xs">Company</h4>
            <ul className="space-y-3 font-medium text-slate-600 dark:text-slate-455">
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">About Us</a></li>
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">Tech Blog</a></li>
              <li><a href="#/" className="hover:text-teal-600 dark:hover:text-slate-200 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom footer credit bar */}
        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 gap-4">
          <p>© 2026 PRO-ALIGN Team. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <a href="#/" className="hover:text-slate-700 dark:hover:text-slate-350 flex items-center gap-1.5 transition-colors">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" /> Support PRO-ALIGN
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
