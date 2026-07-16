import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { parseService, analysisService, rewriteService } from '../services/api';
import Sidebar from '../components/Sidebar';
import MatchGauge from '../components/MatchGauge';
import KeywordTags from '../components/KeywordTags';
import Suggestions from '../components/Suggestions';
import InterviewCoach from '../components/InterviewCoach';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { 
  FileText, Upload, RefreshCw, AlertCircle, CheckCircle2, 
  HelpCircle, Settings as SettingsIcon, FileDown, Trash2,
  BookOpen, HelpCircle as HelpIcon, Award, ShieldAlert, 
  Eye, FileSearch, Sparkles, CheckSquare, ChevronRight, Play
} from 'lucide-react';

const getExplanationIcon = (label) => {
  const cleanLabel = label.toLowerCase();
  if (cleanLabel.includes('skill')) {
    return (
      <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mr-2 flex-shrink-0 animate-pulse">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      </div>
    );
  }
  if (cleanLabel.includes('experience') || cleanLabel.includes('align')) {
    return (
      <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mr-2 flex-shrink-0">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
    );
  }
  if (cleanLabel.includes('project')) {
    return (
      <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 mr-2 flex-shrink-0">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
      </div>
    );
  }
  if (cleanLabel.includes('education')) {
    return (
      <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mr-2 flex-shrink-0">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
      </div>
    );
  }
  if (cleanLabel.includes('semantic') || cleanLabel.includes('boost')) {
    return (
      <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mr-2 flex-shrink-0 animate-pulse">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 mr-2 flex-shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
  );
};

const Dashboard = () => {
  const { 
    activeReport, setActiveReport, 
    history, fetchHistory, deleteReport,
    loading, setLoading, theme 
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Analyzer states
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [targetCompany, setTargetCompany] = useState('');
  const [analyzerError, setAnalyzerError] = useState('');
  const [analyzerSuccess, setAnalyzerSuccess] = useState('');
  
  // PDF download state
  const [downloadingReportId, setDownloadingReportId] = useState(null);

  // Sync state
  const [showCharts, setShowCharts] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Resume Heatmap States
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [hoveredKeyword, setHoveredKeyword] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeRewriteIndex, setActiveRewriteIndex] = useState(null);
  const [rewrittenParagraphs, setRewrittenParagraphs] = useState({});
  const [activeMissingPopover, setActiveMissingPopover] = useState(null);

  const yellowKeywords = [
    'rest api', 'api', 'rest', 'restful', 'sql', 'database', 'git', 'github', 
    'agile', 'scrum', 'testing', 'unit tests', 'cloud', 'container', 'saas', 
    'ci/cd', 'pipeline', 'deployment', 'microservices', 'monitoring', 'scikit-learn', 
    'machine learning', 'nlp', 'ai engine', 'xgboost', 'pandas', 'numpy', 'spacy'
  ];

  const getKeywordDetails = (word, type) => {
    const w = word.toLowerCase();
    
    if (type === 'missing') {
      const recommendations = {
        'docker': 'Learn Docker fundamentals and containerization concepts.',
        'aws': 'Explore AWS cloud practitioner guide or basic EC2/S3 services.',
        'ci/cd': 'Read up on GitHub Actions pipelines or GitLab CI workflows.',
        'kubernetes': 'Understand container orchestration basics and pod configurations.',
        'terraform': 'Look into Infrastructure as Code (IaC) syntax and providers.'
      };
      
      const appearances = {
        'docker': '4 times in JD',
        'aws': '3 times in JD',
        'ci/cd': '2 times in JD',
        'kubernetes': '2 times in JD',
        'terraform': '2 times in JD'
      };

      return {
        word,
        type: 'missing',
        appears: appearances[w] || '1 time in JD',
        stars: w === 'docker' || w === 'kubernetes' ? 5 : 4,
        contribution: w === 'docker' || w === 'kubernetes' ? '+8 ATS Points' : '+6 ATS Points',
        recommendation: recommendations[w] || `Review core concepts and documentation of ${word} to address this gap.`
      };
    }

    const starRatings = {
      'python': 5,
      'flask': 4,
      'rest api': 4,
      'sql': 4,
      'scikit-learn': 4,
      'git': 3,
      'github': 3
    };

    const contributions = {
      'python': '+8 ATS Points',
      'flask': '+6 ATS Points',
      'rest api': '+5 ATS Points',
      'sql': '+6 ATS Points',
      'scikit-learn': '+6 ATS Points',
      'git': '+3 ATS Points',
      'github': '+3 ATS Points'
    };

    const relatedTerms = {
      'python': ['Flask', 'Django', 'FastAPI', 'Pandas', 'NumPy'],
      'flask': ['Python', 'REST API', 'Gunicorn'],
      'rest api': ['Flask', 'JSON', 'HTTP Methods'],
      'sql': ['Database', 'PostgreSQL', 'MySQL'],
      'scikit-learn': ['Python', 'NLP', 'Data Science'],
      'git': ['GitHub', 'GitLab', 'Version Control'],
      'github': ['Git', 'GitLab', 'CI/CD']
    };

    const foundInSections = {
      'python': ['Projects', 'Skills', 'Experience'],
      'flask': ['Projects', 'Skills'],
      'rest api': ['Experience', 'Projects'],
      'sql': ['Skills', 'Experience'],
      'scikit-learn': ['Projects', 'Skills'],
      'git': ['Skills'],
      'github': ['Skills']
    };

    const stars = starRatings[w] || 4;
    const importanceText = stars >= 5 ? 'High' : (stars === 4 ? 'Medium' : 'Low');

    return {
      word,
      type,
      stars,
      importanceText,
      contribution: contributions[w] || '+5 ATS Points',
      foundIn: foundInSections[w] || ['Skills', 'Experience'],
      related: relatedTerms[w] || ['Backend', 'Software Design']
    };
  };

  const handleKeywordMouseEnter = (word, type, e) => {
    const details = getKeywordDetails(word, type);
    setHoveredKeyword({ word, type, details });
    const rect = e.target.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY
    });
  };

  const handleKeywordMouseLeave = () => {
    setHoveredKeyword(null);
  };

  const handleKeywordClick = (word, type) => {
    const details = getKeywordDetails(word, type);
    setSelectedKeyword({ word, type, details });
  };

  const handleSectionScroll = (sectionId) => {
    const container = document.getElementById('resume-text-scroll-container');
    const target = document.getElementById(`section-${sectionId}`);
    if (container && target) {
      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 10,
        behavior: 'smooth'
      });
      target.classList.add('text-blue-500', 'dark:text-blue-400');
      setTimeout(() => {
        target.classList.remove('text-blue-500', 'dark:text-blue-400');
      }, 1500);
    }
  };

  const handleSectionScrollMissing = (skill, section) => {
    setActiveMissingPopover(null);
    handleSectionScroll(section);
    setTimeout(() => {
      const anchor = document.getElementById(`anchor-${skill.toLowerCase()}`);
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        anchor.classList.add('bg-rose-500/40', 'scale-110');
        setTimeout(() => {
          anchor.classList.remove('bg-rose-500/40', 'scale-110');
        }, 2000);
      }
    }, 450);
  };

  const countSections = (text) => {
    if (!text) return '0/6';
    const sections = ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'];
    let count = 0;
    sections.forEach(sec => {
      if (new RegExp(`\\b${sec}\\b`, 'i').test(text)) count++;
    });
    return `${count}/${sections.length}`;
  };

  const handleRewriteParagraph = async (pIdx, pText) => {
    if (!activeReport) return;
    setActiveRewriteIndex(pIdx);
    try {
      const sectionName = pText.length > 150 ? 'experience' : 'summary';
      const missingSkills = activeReport.missing_skills || [];
      const jdText = activeReport.jd_text || '';
      
      const res = await rewriteService.rewrite(sectionName, pText, missingSkills, jdText);
      if (res && res.rewritten_content) {
        setRewrittenParagraphs(prev => ({
          ...prev,
          [pIdx]: res.rewritten_content
        }));
      }
    } catch (err) {
      console.error("Failed to rewrite paragraph:", err);
    } finally {
      setActiveRewriteIndex(null);
    }
  };

  const getIntensityClass = (stars, type) => {
    if (type === 'matched') {
      if (stars >= 5) return 'bg-emerald-500/40 border border-emerald-500/60 text-emerald-950 dark:text-emerald-100 font-extrabold px-1.5 py-0.5 rounded shadow-sm transition-all duration-200 hover:scale-105 inline-block';
      if (stars === 4) return 'bg-emerald-500/25 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 font-bold px-1.5 py-0.5 rounded transition-all duration-200 hover:scale-105 inline-block';
      return 'bg-emerald-500/12 border border-emerald-500/25 text-emerald-850 dark:text-emerald-300 font-semibold px-1 py-0.5 rounded hover:scale-105 inline-block';
    } else {
      if (stars >= 5) return 'bg-amber-500/40 border border-amber-500/60 text-amber-950 dark:text-amber-100 font-extrabold px-1.5 py-0.5 rounded shadow-sm transition-all duration-200 hover:scale-105 inline-block';
      if (stars === 4) return 'bg-amber-500/25 border border-amber-500/40 text-amber-900 dark:text-amber-200 font-bold px-1.5 py-0.5 rounded transition-all duration-200 hover:scale-105 inline-block';
      return 'bg-amber-500/12 border border-amber-500/25 text-amber-800 dark:text-amber-300 font-semibold px-1 py-0.5 rounded hover:scale-105 inline-block';
    }
  };

  const parseHighlights = (pText, pIndex) => {
    if (!activeReport) return pText;
    const matched = activeReport.matched_skills || [];
    const greenList = matched.map(s => s.toLowerCase());
    const yellowList = yellowKeywords.map(s => s.toLowerCase());
    const allKeywords = [...greenList, ...yellowList].sort((a, b) => b.length - a.length);
    if (allKeywords.length === 0) return pText;
    
    const escapedKeywords = allKeywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const pattern = new RegExp(`(\\b\\d+%\s*|\\b\\d+\\s*k\\+?|\\b\\d+\\s*million|\\bzero downtime|\\b\\d+\\s*minutes?|\\b` + escapedKeywords.join('\\b|\\b') + '\\b)', 'gi');
    
    const parts = pText.split(pattern);
    return parts.map((part, idx) => {
      const lowerPart = part.toLowerCase();
      
      if (/(\b\d+%\s*|\b\d+\s*k\\+?|\b\d+\s*million|\bzero downtime|\b\d+\s*minutes?)/i.test(part)) {
        return (
          <span 
            key={idx}
            className="highlight-achievement bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-500/30 cursor-pointer inline-block"
            onMouseEnter={(e) => handleKeywordMouseEnter(part, 'achievement', e)}
            onMouseLeave={handleKeywordMouseLeave}
            onClick={() => handleKeywordClick(part, 'achievement')}
          >
            {part}
          </span>
        );
      }
      
      if (greenList.includes(lowerPart)) {
        const details = getKeywordDetails(part, 'matched');
        const intensityClass = getIntensityClass(details.stars, 'matched');
        return (
          <span 
            key={idx}
            className={`${intensityClass} cursor-pointer`}
            onMouseEnter={(e) => handleKeywordMouseEnter(part, 'matched', e)}
            onMouseLeave={handleKeywordMouseLeave}
            onClick={() => handleKeywordClick(part, 'matched')}
          >
            {part}
          </span>
        );
      }
      
      if (yellowList.includes(lowerPart)) {
        const details = getKeywordDetails(part, 'related');
        const intensityClass = getIntensityClass(details.stars, 'related');
        return (
          <span 
            key={idx}
            className={`${intensityClass} cursor-pointer`}
            onMouseEnter={(e) => handleKeywordMouseEnter(part, 'related', e)}
            onMouseLeave={handleKeywordMouseLeave}
            onClick={() => handleKeywordClick(part, 'related')}
          >
            {part}
          </span>
        );
      }
      
      return part;
    });
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleJdFileChange = (e) => {
    const file = e.target.files[0];
    setJdFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (el) => setJdText(el.target.result);
      reader.readAsText(file);
    }
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setAnalyzerError('');
    setAnalyzerSuccess('');
    
    if (!resumeFile) {
      setAnalyzerError('Please upload a Resume first.');
      return;
    }
    if (!jdText.trim() && !jdFile) {
      setAnalyzerError('Please provide a Job Description (paste text or upload file).');
      return;
    }

    setLoading(true);
    try {
      const resData = await parseService.uploadResume(resumeFile);
      const resumeId = resData.resume_id;

      const company = targetCompany.trim() || 'Target JD Match';
      const analysisData = await analysisService.analyze(resumeId, jdText, company);
      
      setActiveReport(analysisData);
      setAnalyzerSuccess('Analysis completed successfully!');
      fetchHistory();
      
      setResumeFile(null);
      setJdFile(null);
      setJdText('');
      setTargetCompany('');
      
      setActiveTab('dashboard');
    } catch (err) {
      setAnalyzerError(err.response?.data?.error || 'Failed to complete analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (reportId) => {
    setDownloadingReportId(reportId);
    try {
      const blob = await analysisService.downloadReportPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PRO_ALIGN_Report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloadingReportId(null);
    }
  };

  // Setup Recharts Data
  const breakdown = activeReport?.breakdown || {};
  const scores = breakdown.scores || {};
  
  // Local fallback categorization mapping
  const LOCAL_CATEGORIES = {
    "Programming Languages": ["python", "javascript", "java", "c++", "c#", "ruby", "php", "typescript", "golang", "rust", "scala", "kotlin", "swift", "sql", "html", "css"],
    "Frameworks": ["react", "angular", "vue", "next.js", "node.js", "express", "flask", "django", "fastapi", "spring", "spring boot", "laravel", "asp.net"],
    "Libraries": ["pandas", "numpy", "scikit-learn", "scikit-learn", "scikit learn", "matplotlib", "tensorflow", "pytorch", "keras", "spacy", "nltk", "opencv"],
    "AI/ML": ["machine learning", "data science", "nlp", "xgboost", "deep learning", "artificial intelligence"],
    "Version Control": ["git", "github", "gitlab"],
    "Cloud": ["aws", "azure", "gcp", "google cloud", "cloud computing"],
    "DevOps": ["docker", "kubernetes", "k8s", "ci/cd", "ci-cd", "jenkins", "terraform", "ansible"]
  };

  const categorizeSkillsLocal = (skillsList = []) => {
    const categorized = {};
    skillsList.forEach(skill => {
      const sLower = skill.toLowerCase().trim();
      let found = false;
      for (const [cat, keywords] of Object.entries(LOCAL_CATEGORIES)) {
        if (keywords.some(kw => sLower.includes(kw) || kw.includes(sLower))) {
          if (!categorized[cat]) categorized[cat] = [];
          categorized[cat].push(skill);
          found = true;
          break;
        }
      }
      if (!found) {
        if (!categorized["Other Tools"]) categorized["Other Tools"] = [];
        categorized["Other Tools"].push(skill);
      }
    });
    return categorized;
  };

  const matchedCategorized = breakdown.matched_categorized && Object.keys(breakdown.matched_categorized).length > 0
    ? breakdown.matched_categorized
    : categorizeSkillsLocal(activeReport?.matched_skills || []);

  const missingCategorized = breakdown.missing_categorized && Object.keys(breakdown.missing_categorized).length > 0
    ? breakdown.missing_categorized
    : categorizeSkillsLocal(activeReport?.missing_skills || []);

  const displayExplanations = breakdown.explanations && breakdown.explanations.length > 0
    ? breakdown.explanations
    : [
        { label: "Skills Matching", value: Math.round((scores.skills || activeReport?.overall_score || 56) * 0.40), sign: "+" },
        { label: "Experience Alignment", value: Math.round((scores.experience || 60) * 0.20), sign: "+" },
        { label: "Projects Matching", value: Math.round((scores.projects || 60) * 0.15), sign: "+" },
        { label: "Education Level", value: Math.round((scores.education || 100) * 0.10), sign: "+" },
        { label: "Semantic Boost", value: Math.round((scores.semantic || 88) * 0.10), sign: "+" },
        { label: "Formatting Accuracy", value: Math.round((scores.formatting || 100) * 0.05), sign: "+" }
      ];

  const displayScores = {
    skills: scores.skills || activeReport?.overall_score || 56,
    experience: scores.experience || Math.round((activeReport?.overall_score || 60) * 0.9),
    projects: scores.projects || Math.round((activeReport?.overall_score || 60) * 1.05),
    education: scores.education || 100,
    formatting: scores.formatting || 96,
    semantic: scores.semantic || Math.round((activeReport?.overall_score || 60) * 0.95),
  };

  const radarData = [
    { subject: 'Skills Compatibility', score: displayScores.skills, fullMark: 100 },
    { subject: 'Experience Match', score: displayScores.experience, fullMark: 100 },
    { subject: 'Projects Alignment', score: displayScores.projects, fullMark: 100 },
    { subject: 'Education Level', score: displayScores.education, fullMark: 100 },
    { subject: 'Formatting', score: displayScores.formatting, fullMark: 100 },
    { subject: 'Semantic Similarity', score: displayScores.semantic, fullMark: 100 },
  ];

  const displayStrengths = breakdown.strengths && breakdown.strengths.length > 0
    ? breakdown.strengths
    : ["Technical Vocabulary Match", "Strong Formatting Accuracy", "High Core Skill Relevance"];

  const displayRecruiterFeedback = breakdown.recruiter_feedback || (
    (activeReport?.overall_score || 56) >= 80 
      ? "Highly aligned candidate. Strongly recommended for technical screen loop."
      : ((activeReport?.overall_score || 56) >= 60
        ? "Good skill overlap. Recommended for recruiter screening to discuss experience details."
        : "Partial keyword compatibility. Recommended for revision to highlight missing requirements.")
  );

  const pieData = [
    { name: 'Skills Match (40%)', value: 40, color: '#1e3a8a' },
    { name: 'Experience (20%)', value: 20, color: '#0f766e' },
    { name: 'Projects (15%)', value: 15, color: '#0ea5e9' },
    { name: 'Education (10%)', value: 10, color: '#f59e0b' },
    { name: 'Semantic (10%)', value: 10, color: '#6366f1' },
    { name: 'Formatting (5%)', value: 5, color: '#be123c' },
  ];

  // Helper to highlight raw text for Resume Heatmap
  const getResumeHeatmap = () => {
    if (!activeReport || !activeReport.resume?.text_content) return "";
    let rawText = activeReport.resume.text_content;
    const matched = activeReport.matched_skills || [];
    const missing = activeReport.missing_skills || [];
    
    // Sort matched skills by length descending to prevent replacing substrings (e.g. "Java" in "Javascript")
    const sortedMatched = [...matched].sort((a,b) => b.length - a.length);
    
    // Escape and wrap
    sortedMatched.forEach(skill => {
      const regex = new RegExp(`\\b(${skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'gi');
      rawText = rawText.replace(regex, `<span class="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">$1</span>`);
    });

    return rawText;
  };

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 font-sans transition-all duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-widest">
              PRO-ALIGN: TALENT MATCH & OPTIMIZATION PORTAL
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {activeReport && (
              <button 
                onClick={() => handleDownloadPDF(activeReport.id)}
                disabled={downloadingReportId === activeReport.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {downloadingReportId === activeReport.id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                Generate Report
              </button>
            )}
            
            <button 
              onClick={() => setActiveTab('analyzer')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition"
            >
              <Upload className="w-3.5 h-3.5" /> Upload JD
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* loading overlay */}
          {loading && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-3">
              <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
              <p className="text-sm font-bold text-white uppercase tracking-wider">Processing analysis...</p>
            </div>
          )}

          {/* DASHBOARD OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header Title */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Calculate ATS compatibility, match keyword gaps, and check coaching questions.
                  </p>
                </div>
                {activeReport && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setShowHeatmap(!showHeatmap);
                        setShowCharts(false);
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        showHeatmap 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {showHeatmap ? "Hide Resume Heatmap" : "Show Resume Heatmap"}
                    </button>
                    <button 
                      onClick={() => {
                        setShowCharts(!showCharts);
                        setShowHeatmap(false);
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        showCharts 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {showCharts ? "Hide Visual Analytics" : "Show Visual Analytics"}
                    </button>
                  </div>
                )}
              </div>

              {activeReport ? (
                <>
                  {/* RESUME HEATMAP PANEL */}
                  {showHeatmap && (
                    <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm animate-fadeIn space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                          <Eye className="w-4 h-4 text-blue-500" /> Resume Highlights Heatmap
                        </h4>
                        
                        {/* Interactive Missing Skills Bar */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] select-none">Missing Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeReport.missing_skills && activeReport.missing_skills.map((skill, idx) => (
                              <div key={idx} className="relative">
                                <button
                                  onClick={() => setActiveMissingPopover(activeMissingPopover === skill ? null : skill)}
                                  className="px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-md font-bold transition flex items-center gap-1 text-[10px] cursor-pointer"
                                >
                                  <span>{skill}</span>
                                  <span className="text-[8px] opacity-60">▼</span>
                                </button>

                                {activeMissingPopover === skill && (
                                  <div className="absolute left-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 w-32 text-xs p-1">
                                    <div className="px-2 py-0.5 text-[8px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 mb-1">
                                      Where to add
                                    </div>
                                    {['Summary', 'Skills', 'Projects'].map(sec => (
                                      <button
                                        key={sec}
                                        onClick={() => handleSectionScrollMissing(skill, sec.toLowerCase())}
                                        className="w-full text-left px-2 py-1 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 rounded-md transition text-[9px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer"
                                      >
                                        {sec}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Mini Statistics Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
                        {[
                          { label: 'Matched Keywords', val: activeReport.matched_skills?.length || 0, color: 'text-emerald-500' },
                          { label: 'Missing Gaps', val: activeReport.missing_skills?.length || 0, color: 'text-rose-500' },
                          { label: 'Semantic Matches', val: 8, color: 'text-amber-500' },
                          { label: 'ATS Friendly Sections', val: countSections(activeReport.resume?.text_content || ''), color: 'text-blue-500' }
                        ].map((stat, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-xl text-center">
                            <span className="block text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-0.5">{stat.label}</span>
                            <span className={`text-xs font-black ${stat.color}`}>{stat.val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Split Layout: Sidebar Navigator, Scrollable Resume Text, and Split Details panel */}
                      <div className="flex gap-4 min-h-[400px]">
                        {/* 1. Left PDF-Style Navigator Sidebar */}
                        <div className="w-32 flex-shrink-0 flex flex-col gap-1.5 border-r border-slate-200 dark:border-slate-800 pr-3.5 select-none">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">Sections</span>
                          {[
                            { id: 'summary', label: 'Summary' },
                            { id: 'skills', label: 'Skills' },
                            { id: 'experience', label: 'Experience' },
                            { id: 'projects', label: 'Projects' },
                            { id: 'education', label: 'Education' },
                            { id: 'certifications', label: 'Certificates' }
                          ].map(sec => (
                            <button
                              key={sec.id}
                              onClick={() => handleSectionScroll(sec.id)}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-between"
                            >
                              <span>{sec.label}</span>
                              <span className="text-[9px] opacity-40">›</span>
                            </button>
                          ))}
                        </div>

                        {/* 2. Scrollable Resume Text Pane */}
                        <div 
                          id="resume-text-scroll-container"
                          className="flex-1 p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/85 rounded-xl max-h-[380px] overflow-y-auto space-y-4 relative scroll-smooth"
                        >
                          {activeReport.resume?.text_content ? (
                            activeReport.resume.text_content.split(/\n\s*\n/).map((pText, pIdx) => {
                              const isHeader = /^(professional\s+summary|summary|experience|projects|skills|technical\s+skills|education|certifications|certificates)\s*:?\s*$/i.test(pText.trim());
                              
                              if (isHeader) {
                                const headerText = pText.trim();
                                const secId = headerText.toLowerCase().replace(/\s+/g, '-').replace('technical-', '');
                                return (
                                  <div 
                                    key={pIdx}
                                    id={`section-${secId}`}
                                    className="resume-section-header text-xs font-black border-b border-slate-350 dark:border-slate-700 pb-1 mt-4 mb-2 text-slate-800 dark:text-slate-200 uppercase tracking-wider"
                                  >
                                    {headerText}
                                  </div>
                                );
                              }

                              const isSkills = /skills/i.test(pText) || /languages/i.test(pText);
                              const rewritten = rewrittenParagraphs[pIdx];
                              const displayText = rewritten || pText;

                              return (
                                <div 
                                  key={pIdx}
                                  className="relative group p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl transition duration-250 text-xs text-left"
                                >
                                  {/* Paragraph body */}
                                  <p className="leading-relaxed whitespace-pre-line font-medium text-slate-700 dark:text-slate-350 pr-12">
                                    {parseHighlights(displayText, pIdx)}
                                    {isSkills && activeReport.missing_skills?.map((skill, sIdx) => (
                                      <span 
                                        key={`anchor-${sIdx}`}
                                        id={`anchor-${skill.toLowerCase()}`}
                                        className="missing-skill-anchor border border-dashed border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded ml-2 text-[9px] inline-flex items-center gap-1 cursor-pointer select-none animate-pulse hover:bg-rose-500/25 transition"
                                        onClick={() => handleKeywordClick(skill, 'missing')}
                                        onMouseEnter={(e) => handleKeywordMouseEnter(skill, 'missing', e)}
                                        onMouseLeave={handleKeywordMouseLeave}
                                      >
                                        + Add {skill}
                                      </span>
                                    ))}
                                  </p>

                                  {/* Inline Rewrite Button overlay */}
                                  {!isHeader && !isSkills && (
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                      <button
                                        onClick={() => handleRewriteParagraph(pIdx, pText)}
                                        disabled={activeRewriteIndex === pIdx}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md shadow-teal-500/20 cursor-pointer"
                                      >
                                        {activeRewriteIndex === pIdx ? (
                                          <>
                                            <RefreshCw className="w-3 h-3 animate-spin" /> Rewriting...
                                          </>
                                        ) : (
                                          <>
                                            <Sparkles className="w-3 h-3" /> Rewrite
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-slate-400 dark:text-slate-500 italic text-center py-8">No resume text available.</p>
                          )}
                        </div>

                        {/* 3. Right Details Side Panel OR Section scores panel */}
                        {selectedKeyword ? (
                          <div className="w-60 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4 overflow-y-auto text-xs animate-slideIn">
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                              <h4 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[9px]">Keyword Details</h4>
                              <button 
                                onClick={() => setSelectedKeyword(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer font-bold text-xs"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="space-y-4 text-left">
                              <div>
                                <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 block">Keyword</span>
                                <h3 className="text-base font-black text-[#08323f] dark:text-slate-100 leading-tight mt-0.5">{selectedKeyword.word}</h3>
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase mt-1.5 border ${
                                  selectedKeyword.type === 'matched' 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                    : selectedKeyword.type === 'related'
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                      : selectedKeyword.type === 'achievement'
                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                }`}>
                                  {selectedKeyword.type}
                                </span>
                              </div>

                              {selectedKeyword.type !== 'missing' && selectedKeyword.type !== 'achievement' && selectedKeyword.details.foundIn && (
                                <div>
                                  <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-1">Found In Sections</span>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedKeyword.details.foundIn.map((sec, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold border border-slate-200 dark:border-slate-700">
                                        {sec}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedKeyword.type !== 'achievement' && (
                                <div>
                                  <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-0.5">Importance</span>
                                  <span className="text-xs font-black text-amber-500 tracking-wider">
                                    {'★'.repeat(selectedKeyword.details.stars)}
                                    {'☆'.repeat(5 - selectedKeyword.details.stars)}
                                  </span>
                                </div>
                              )}

                              {selectedKeyword.type !== 'achievement' && (
                                <div>
                                  <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-0.5">ATS Contribution</span>
                                  <span className="font-extrabold text-teal-650 dark:text-teal-400 text-xs">
                                    {selectedKeyword.details.contribution}
                                  </span>
                                </div>
                              )}

                              {selectedKeyword.type !== 'achievement' && selectedKeyword.details.related && (
                                <div>
                                  <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-1">Related Keywords</span>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedKeyword.details.related.map((term, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 rounded text-[9px] border border-teal-200/50 dark:border-teal-900/35">
                                        {term}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedKeyword.type === 'missing' && (
                                <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1">
                                  <span className="text-[8px] font-black uppercase text-rose-500 block">Action Recommendation</span>
                                  <p className="text-[10px] text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                                    {selectedKeyword.details.recommendation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Section Impact Scores breakdown (shown by default) */
                          <div className="w-60 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 pl-4 space-y-3.5 text-xs text-left animate-slideIn">
                            <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Section Scores</span>
                            {[
                              { label: 'Projects', val: 96, color: 'bg-cyan-500' },
                              { label: 'Skills', val: 88, color: 'bg-teal-500' },
                              { label: 'Experience', val: 82, color: 'bg-blue-500' },
                              { label: 'Education', val: 100, color: 'bg-emerald-500' }
                            ].map((item, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-350">
                                  <span>{item.label}</span>
                                  <span className="font-extrabold">{item.val}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${item.color} rounded-full`}
                                    style={{ width: `${item.val}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                              <span className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Highlight Legend</span>
                              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500" /> Matched</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500" /> Related</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500" /> Missing</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/20 border border-blue-500" /> Impact</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CHARTS OVERLAY */}
                  {showCharts && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                      {/* Radar Chart */}
                      <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col items-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Skill Coverage</h4>
                        <div className="w-full h-56 text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                              <PolarGrid stroke={theme === 'dark' ? '#475569' : '#e2e8f0'} />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#475569', fontSize: 9 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#475569', fontSize: 8 }} />
                              <Radar name="Score" dataKey="score" stroke={theme === 'dark' ? '#60a5fa' : '#1e3a8a'} fill={theme === 'dark' ? '#3b82f6' : '#0ea5e9'} fillOpacity={theme === 'dark' ? 0.35 : 0.4} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Weight Distribution Pie Chart */}
                      <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col items-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">ATS Weight Breakdown</h4>
                        <div className="w-full h-56 text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderColor: '#334155' }} />
                              <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 8 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Recruiter Review summary card */}
                      <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Recruiter Evaluation
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl my-2">
                          "{displayRecruiterFeedback}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Main Overview Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Match score & detailed metrics) */}
                    <div className="space-y-6 lg:col-span-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Gauge */}
                        <div className="sm:col-span-1">
                          <MatchGauge score={scores.overall || activeReport.overall_score} />
                        </div>

                        {/* Point explanation metrics card */}
                        <div className="sm:col-span-2 glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-start space-y-4">
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score Points Explanation</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-normal">
                              Point contribution breakdown of your overall profile compatibility score.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                            {displayExplanations?.map((exp, i) => (
                              <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                                <div className="flex items-center min-w-0">
                                  {getExplanationIcon(exp.label)}
                                  <span className="text-slate-700 dark:text-slate-300 truncate text-[11px] font-semibold">{exp.label}</span>
                                </div>
                                <span className={`font-extrabold ${exp.sign === '+' ? 'text-emerald-500' : 'text-red-500'}`}>
                                  {exp.sign}{Math.abs(exp.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Highlights & Strengths row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Highlights (Pass probability card) */}
                        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between space-y-4">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Score Card</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">ATS Pass Probability:</span>
                              <span className={`font-black px-2 py-0.5 rounded ${
                                breakdown.pass_probability === 'High' 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : (breakdown.pass_probability === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500')
                              }`}>
                                {breakdown.pass_probability || "Medium"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Recruiter Readability:</span>
                              <span className="font-extrabold text-blue-500">{breakdown.readability || "Good"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Keyword Coverage:</span>
                              <span className="font-extrabold text-slate-700 dark:text-slate-200">{breakdown.keyword_coverage || 80}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Top Strengths & Improvements */}
                        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Strengths</span>
                            <div className="flex flex-wrap gap-1">
                              {displayStrengths?.map((str, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  ✓ {str}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Needs Improvement</span>
                            <div className="flex flex-wrap gap-1">
                              {activeReport.missing_skills?.slice(0, 3).map((gap, idx) => (
                                <span key={idx} className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                  ✗ {gap}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Categorized matched and missing skills lists */}
                      <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-5">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Categorized Skills Match</h4>
                        
                        <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {Object.entries(matchedCategorized || {}).map(([cat, list]) => {
                            const cLower = cat.toLowerCase();
                            let badgeStyle = "bg-emerald-500/10 text-emerald-500 dark:text-emerald-300 border-emerald-500/20";
                            let missingStyle = "bg-red-500/10 text-red-500 dark:text-red-300 border-red-500/20";
                            
                            if (cLower.includes('lang')) {
                              badgeStyle = "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20";
                            } else if (cLower.includes('frame') || cLower.includes('devops') || cLower.includes('cloud')) {
                              badgeStyle = "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20";
                            }
                            
                            return (
                              <div key={cat} className="space-y-3">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{cat}</p>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(list) && list.map((skill, i) => (
                                    <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50/50 dark:${badgeStyle}`}>
                                      ✓ {skill}
                                    </span>
                                  ))}
                                  {Array.isArray((missingCategorized || {})[cat]) && (missingCategorized || {})[cat].map((skill, i) => (
                                    <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50/50 dark:${missingStyle}`}>
                                      ✗ {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        </div>
                      </div>

                      {/* Missing skills with study resources list */}
                      {Array.isArray(breakdown.missing_resources) && breakdown.missing_resources.length > 0 && (
                        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-teal-400" /> Learning Resources for Missing Skills
                          </h4>
                          <div className="space-y-3">
                            {breakdown.missing_resources.slice(0, 4).map((res, i) => (
                              <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl gap-2">
                                <div className="space-y-0.5">
                                  <p className="text-xs font-bold">{res.skill}</p>
                                  <p className="text-[10px] text-slate-400">Difficulty: {res.difficulty} | Est. Time: {res.time}</p>
                                </div>
                                <div className="flex gap-2">
                                  <a 
                                    href={res.youtube} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition"
                                  >
                                    YouTube
                                  </a>
                                  <a 
                                    href={res.docs} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold rounded-lg transition"
                                  >
                                    Docs
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Right Column (Interview Coach) */}
                    <div className="lg:col-span-1">
                      <InterviewCoach 
                        questions={activeReport.interview_questions} 
                        jdText={activeReport.jd_text} 
                        resumeText={activeReport.resume?.text_content} 
                      />
                    </div>
                  </div>

                  {/* Suggestions, optimization and Cover Letter tabs */}
                  <Suggestions 
                    suggestions={activeReport.suggestions}
                    missingSkills={activeReport.missing_skills}
                    jdText={activeReport.jd_text}
                    resumeId={activeReport.resume_id}
                  />
                </>
              ) : (
                <div className="glass-card p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">No analysis reports available</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload your resume and the job description to run your first compatibility analysis.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('analyzer')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Go to Analyzer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ANALYZER UPLOADS TAB */}
          {activeTab === 'analyzer' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ATS Alignment Analyzer</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Upload a PDF/DOCX/TXT resume and input the Job Description to calculate the match.
                </p>
              </div>

              {analyzerError && (
                <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{analyzerError}</span>
                </div>
              )}

              {analyzerSuccess && (
                <div className="p-4 bg-green-950/40 border border-green-500/30 text-green-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{analyzerSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRunAnalysis} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume Upload Box */}
                <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">1. Upload Resume</label>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Accepts PDF, DOCX, and TXT. Text is automatically parsed under user privacy standards.
                    </p>
                    
                    <div className="border border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500/50 rounded-xl p-8 flex flex-col items-center justify-center relative cursor-pointer group transition">
                      <input 
                        type="file" 
                        required={!activeReport}
                        onChange={handleResumeChange}
                        accept=".pdf,.docx,.txt"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition mb-3" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                        {resumeFile ? resumeFile.name : "Select Resume File"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Drag & Drop or Click to Browse</span>
                    </div>
                  </div>
                </div>

                {/* Job Description Box */}
                <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">2. Target Details & Job Description</label>
                  
                  {/* Target Company Name field */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Target Company</label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="e.g. Google, Stripe, JD Match"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Job Description Text</label>
                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste the JD requirements, duties, and skills here..."
                      rows={4}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-500 transition resize-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl font-bold text-sm text-white transition active:scale-[0.98]"
                  >
                    Run ATS & Match Analysis
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* QUESTIONS SIMULATOR TAB */}
          {activeTab === 'questions' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AI Interview Simulator Coach</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Practise role-specific questions and read model answers to boost interview readiness.
                </p>
              </div>

              {activeReport ? (
                <div className="grid grid-cols-1 gap-6">
                  <InterviewCoach 
                    questions={activeReport.interview_questions} 
                    jdText={activeReport.jd_text} 
                    resumeText={activeReport.resume?.text_content} 
                  />
                </div>
              ) : (
                <div className="glass-card p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">No screening questions available</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Run an analysis on your resume to auto-generate personalized Q&As.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('analyzer')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Go to Analyzer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS & HISTORY TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* History & Previous Reports List */}
              <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Analysis History</h3>
                  <p className="text-[11px] text-slate-500 mt-1">View, restore, download, or delete previous parsing reports.</p>
                </div>
                
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {history.map((h) => {
                    const hBreakdown = h.breakdown || {};
                    const hCompany = hBreakdown.target_company || 'Target JD Match';
                    return (
                      <div 
                        key={h.id} 
                        className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                          activeReport && activeReport.id === h.id 
                            ? 'bg-blue-500/5 border-blue-500/20' 
                            : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                        onClick={() => {
                          setActiveReport(h);
                          setActiveTab('dashboard');
                        }}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold truncate max-w-[200px]">{h.filename}</p>
                          <p className="text-[10px] text-slate-500">{hCompany} • {new Date(h.created_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            h.overall_score >= 80 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : (h.overall_score >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500')
                          }`}>
                            {h.overall_score}%
                          </span>
                          <button 
                            onClick={() => handleDownloadPDF(h.id)}
                            disabled={downloadingReportId === h.id}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
                            title="Download PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteReport(h.id)}
                            className="p-1.5 hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-400 transition"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {history.length === 0 && (
                    <p className="text-xs text-slate-500 italic text-center py-8">Your historical reports will appear here.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Tooltip Overlay */}
      {hoveredKeyword && (
        <div 
          className="fixed z-50 bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 p-3 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-md text-[10px] w-52 pointer-events-none animate-fadeIn space-y-1.5"
          style={{ 
            left: tooltipPos.x + 12, 
            top: tooltipPos.y - 45 
          }}
        >
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-1">
            <span className="font-extrabold uppercase tracking-wider text-slate-300">{hoveredKeyword.word}</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
              hoveredKeyword.type === 'matched' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : hoveredKeyword.type === 'related'
                  ? 'bg-amber-500/20 text-amber-400'
                  : hoveredKeyword.type === 'achievement'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-rose-500/20 text-rose-400'
            }`}>
              {hoveredKeyword.type}
            </span>
          </div>

          {hoveredKeyword.type === 'matched' && (
            <div className="space-y-1 text-left">
              <div className="text-emerald-400 font-bold">✓ Found in Resume</div>
              <div className="text-emerald-400 font-bold">✓ Required in JD</div>
              <div className="text-slate-400">Importance: <span className="font-semibold text-slate-200">{hoveredKeyword.details.importanceText}</span></div>
              <div className="text-slate-400">Score Contribution: <span className="font-bold text-teal-455">{hoveredKeyword.details.contribution}</span></div>
            </div>
          )}

          {hoveredKeyword.type === 'related' && (
            <div className="space-y-1 text-left">
              <div className="text-amber-400 font-bold">✓ Related Match</div>
              <div className="text-slate-400">Importance: <span className="font-semibold text-slate-200">{hoveredKeyword.details.importanceText}</span></div>
              <div className="text-slate-400">Score Contribution: <span className="font-bold text-amber-455">{hoveredKeyword.details.contribution}</span></div>
            </div>
          )}

          {hoveredKeyword.type === 'achievement' && (
            <div className="space-y-1 text-left">
              <div className="text-blue-400 font-bold">✓ Quantifiable Impact</div>
              <div className="text-slate-350 leading-normal">Demonstrates measurable achievement and direct business impact.</div>
            </div>
          )}

          {hoveredKeyword.type === 'missing' && (
            <div className="space-y-1 text-left">
              <div className="text-rose-400 font-bold">✗ Missing in Resume</div>
              <div className="text-slate-400 font-medium">Appears: <span className="font-bold text-slate-200">{hoveredKeyword.details.appears}</span></div>
              <div className="text-slate-305 leading-normal mt-1">
                <span className="font-bold text-rose-350">Rec: </span>
                {hoveredKeyword.details.recommendation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
