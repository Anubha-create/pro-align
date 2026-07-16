import React, { useState } from 'react';
import { 
  Lightbulb, 
  Award, 
  FileCheck, 
  Edit3, 
  Cpu, 
  Sparkles,
  Clipboard,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { rewriteService, coverLetterService } from '../services/api';

const Suggestions = ({ suggestions = [], missingSkills = [], jdText = "", resumeId = null }) => {
  const [activeSubTab, setActiveSubTab] = useState('suggestions'); // 'suggestions', 'rewriter', 'coverletter'
  
  // Rewriter states
  const [selectedSection, setSelectedSection] = useState('summary');
  const [sectionContent, setSectionContent] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [rewrittenText, setRewrittenText] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteError, setRewriteError] = useState('');
  const [rewriteCopied, setRewriteCopied] = useState(false);
  
  // Cover Letter states
  const [coverLetter, setCoverLetter] = useState('');
  const [letterLoading, setLetterLoading] = useState(false);
  const [letterError, setLetterError] = useState('');
  const [letterCopied, setLetterCopied] = useState(false);

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleRewrite = async () => {
    setRewriteError('');
    setRewrittenText('');
    
    if (!sectionContent || !sectionContent.trim()) {
      setRewriteError('Please input your original section content first.');
      return;
    }
    
    setRewriteLoading(true);
    try {
      const data = await rewriteService.rewrite(
        selectedSection,
        sectionContent,
        selectedSkills.length > 0 ? selectedSkills : missingSkills,
        jdText
      );
      setRewrittenText(data.rewritten_content);
    } catch (err) {
      setRewriteError('Failed to optimize content. Please check API connection.');
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setLetterError('');
    setCoverLetter('');
    
    if (!resumeId) {
      setLetterError('No resume uploaded yet. Run analysis first.');
      return;
    }
    
    setLetterLoading(true);
    try {
      const data = await coverLetterService.generateCoverLetter(resumeId, jdText);
      setCoverLetter(data.cover_letter);
    } catch (err) {
      setLetterError('Failed to generate cover letter. Please check connection.');
    } finally {
      setLetterLoading(false);
    }
  };

  const handleCopyRewrite = () => {
    navigator.clipboard.writeText(rewrittenText);
    setRewriteCopied(true);
    setTimeout(() => setRewriteCopied(false), 2000);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setLetterCopied(true);
    setTimeout(() => setLetterCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm w-full">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveSubTab('suggestions')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'suggestions'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Optimization Suggestions
        </button>
        <button
          onClick={() => setActiveSubTab('rewriter')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'rewriter'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          One-Click ATS Rewriter
        </button>
        <button
          onClick={() => setActiveSubTab('coverletter')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
            activeSubTab === 'coverletter'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Cover Letter
        </button>
      </div>

      {/* TAB 1: SUGGESTIONS */}
      {activeSubTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Actionable Suggestions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug, i) => {
              // Graceful support for both object maps and string arrays from old database entries
              const textContent = typeof sug === 'object' ? (sug.message || sug.text || JSON.stringify(sug)) : sug;
              return (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="mt-0.5 text-xs text-blue-500">✓</div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{textContent}</p>
                  </div>
                </div>
              );
            })}
            {suggestions.length === 0 && (
              <p className="text-xs text-slate-500 italic">No recommendations compiled yet. Upload your resume to start.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI REWRITER COMPARISON */}
      {activeSubTab === 'rewriter' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Optimize Resume Bullet Points (Before vs After)</h4>
          </div>

          {rewriteError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{rewriteError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Input Column */}
            <div className="sm:col-span-1 space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Section type</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-slate-700 dark:text-slate-300 transition"
                >
                  <option value="summary">Summary</option>
                  <option value="experience">Experience bullets</option>
                  <option value="projects">Projects details</option>
                  <option value="skills">Skills section</option>
                </select>
              </div>

              {missingSkills.length > 0 && (
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Inject Keywords</label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {missingSkills.map((s, idx) => {
                      const isSelected = selectedSkills.includes(s);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSkillToggle(s)}
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-full border transition ${
                            isSelected
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                              : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800/80'
                          }`}
                        >
                          {isSelected ? '✓' : '+'} {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Before vs After comparison boxes */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Original Bullets (Before)</label>
                <textarea
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  placeholder="e.g. Built investment advisor."
                  rows={5}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-500 transition resize-none"
                />
              </div>

              {/* After */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Optimized (After)</label>
                  {rewrittenText && (
                    <button 
                      onClick={handleCopyRewrite}
                      className="text-[10px] text-teal-500 hover:text-teal-400 flex items-center gap-1 transition"
                    >
                      {rewriteCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                      {rewriteCopied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className="w-full p-3 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-300 min-h-[105px] max-h-[105px] overflow-y-auto whitespace-pre-line leading-relaxed italic placeholder:text-slate-600">
                  {rewriteLoading ? (
                    <div className="flex items-center justify-center h-full gap-2 text-slate-400">
                      <Cpu className="w-4 h-4 animate-spin text-teal-500" />
                      <span>Aligning syntax with AI...</span>
                    </div>
                  ) : rewrittenText ? (
                    rewrittenText
                  ) : (
                    <span className="text-slate-500">e.g. Developed an AI-powered investment advisor using Python, Flask, and XGBoost...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRewrite}
            disabled={rewriteLoading}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 rounded-xl font-bold text-xs text-white transition active:scale-[0.99]"
          >
            Optimize Resume Section
          </button>
        </div>
      )}

      {/* TAB 3: COVER LETTER */}
      {activeSubTab === 'coverletter' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">AI Cover Letter Generator</h4>
          </div>

          {letterError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{letterError}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Generates custom application draft from resume matches.</span>
              {coverLetter && (
                <button 
                  onClick={handleCopyLetter}
                  className="text-[10px] text-teal-500 hover:text-teal-400 flex items-center gap-1 transition"
                >
                  {letterCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {letterCopied ? 'Copied!' : 'Copy letter'}
                </button>
              )}
            </div>

            <div className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 min-h-[160px] max-h-[220px] overflow-y-auto whitespace-pre-line leading-relaxed italic">
              {letterLoading ? (
                <div className="flex items-center justify-center h-full gap-2 text-slate-400 mt-12">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                  <span>Drafting custom cover letter...</span>
                </div>
              ) : coverLetter ? (
                coverLetter
              ) : (
                <span className="text-slate-500">Your tailored cover letter will be generated here.</span>
              )}
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={letterLoading}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold text-xs text-white transition active:scale-[0.99]"
            >
              Generate Tailored Cover Letter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
