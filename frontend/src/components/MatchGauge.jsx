import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MatchGauge = ({ score = 0 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const increment = score / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        clearInterval(timer);
        setAnimatedScore(score);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // SVG Gauge calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius; // 565.48
  // We only want a semi-circle gauge (260 degree arc)
  const arcLength = circumference * (260 / 360); // 408.4
  const strokeDashoffset = arcLength - (arcLength * (score / 100));

  // Determine alignment label
  let alignmentText = 'LOW ALIGNMENT';
  let badgeColor = 'bg-red-500/10 text-red-500 border border-red-500/20';
  
  if (score >= 80) {
    alignmentText = 'HIGH ALIGNMENT';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  } else if (score >= 60) {
    alignmentText = 'MEDIUM ALIGNMENT';
    badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm relative h-full">
      <div className="absolute top-4 left-5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Match Score</span>
      </div>
      
      <div className="relative w-48 h-48 flex items-center justify-center mt-4">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-[220deg]" viewBox="0 0 220 220">
          <defs>
            {/* Stunning gradient exactly matching the user's design */}
            <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />   {/* Emerald */}
              <stop offset="35%" stopColor="#06b6d4" />  {/* Teal */}
              <stop offset="70%" stopColor="#3b82f6" />  {/* Blue */}
              <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
            </linearGradient>
          </defs>
          
          {/* Background track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="12"
            strokeDasharray={arcLength}
            strokeLinecap="round"
          />
          {/* Dynamic Gradient Fill Path */}
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth="12"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className="text-5xl font-extrabold text-slate-800 dark:text-white tracking-tighter">
            {animatedScore}%
          </span>
          <div className={`mt-2 px-2.5 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider ${badgeColor}`}>
            {alignmentText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchGauge;
