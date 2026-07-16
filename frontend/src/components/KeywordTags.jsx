import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

const KeywordTags = ({ matched = [], missing = [], overallFeedback = "" }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Resume vs JD Analysis</h3>
        
        {/* Matched Keywords */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Keywords Matched ({matched.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.length > 0 ? (
              matched.map((kw, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No matching keywords found.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Missing Skills ({missing.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.length > 0 ? (
              missing.map((kw, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">Zero keyword gaps detected! Perfect match.</span>
            )}
          </div>
        </div>
      </div>

      {/* Overall Recommendation */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Overall Feedback
        </span>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
          matched.length / (matched.length + missing.length || 1) >= 0.7 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }`}>
          {overallFeedback || (matched.length / (matched.length + missing.length || 1) >= 0.7 ? "Excellent fit for this role" : "Needs Optimization")}
        </span>
      </div>
    </div>
  );
};

export default KeywordTags;
