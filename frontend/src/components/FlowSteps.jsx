import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, BarChart2, Briefcase, Mic, Trophy } from 'lucide-react';

const FlowSteps = ({ theme }) => {
  const containerRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);
  const step6Ref = useRef(null);

  const [points, setPoints] = useState([]);

  // Calculate real-time center positions of the draggable nodes
  const updatePoints = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const getCenter = (ref) => {
      if (!ref.current) return { x: 0, y: 0 };
      const rect = ref.current.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
      };
    };

    setPoints([
      getCenter(step1Ref),
      getCenter(step2Ref),
      getCenter(step3Ref),
      getCenter(step4Ref),
      getCenter(step5Ref),
      getCenter(step6Ref)
    ]);
  };

  // Run updates in a requestAnimationFrame loop to ensure buttery-smooth line rendering
  useEffect(() => {
    let active = true;
    const loop = () => {
      if (!active) return;
      updatePoints();
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      active = false;
    };
  }, []);

  // Compute smooth double-bezier closed loop paths between two points
  const getCubicLoopPaths = (pA, pB, bulgeAmount = 35) => {
    if (!pA || !pB) return { forward: '', backward: '' };
    const dx = pB.x - pA.x;
    const dy = pB.y - pA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return { forward: '', backward: '' };

    // Normalized perpendicular vector
    const px = -dy / dist;
    const py = dx / dist;

    // Shift offset
    const shiftX = px * bulgeAmount;
    const shiftY = py * bulgeAmount;

    // Base control points (standard S-curve segments)
    const base_cp1x = pA.x - 30;
    const base_cp1y = pA.y + (pB.y - pA.y) * 0.45;
    const base_cp2x = pB.x + 30;
    const base_cp2y = pB.y - (pB.y - pA.y) * 0.45;

    // Outer curve (forward)
    const cp1a_x = base_cp1x + shiftX;
    const cp1a_y = base_cp1y + shiftY;
    const cp2a_x = base_cp2x + shiftX;
    const cp2a_y = base_cp2y + shiftY;

    // Inner curve (backward)
    const cp1b_x = base_cp1x - shiftX;
    const cp1b_y = base_cp1y - shiftY;
    const cp2b_x = base_cp2x - shiftX;
    const cp2b_y = base_cp2y - shiftY;

    const pathForward = `M ${pA.x} ${pA.y} C ${cp1a_x} ${cp1a_y}, ${cp2a_x} ${cp2a_y}, ${pB.x} ${pB.y}`;
    const pathBackward = `M ${pB.x} ${pB.y} C ${cp2b_x} ${cp2b_y}, ${cp1b_x} ${cp1b_y}, ${pA.x} ${pA.y}`;

    return { forward: pathForward, backward: pathBackward };
  };

  // Compute smooth single S-curve segment
  const getSingleSegmentPath = (pA, pB) => {
    if (!pA || !pB) return '';
    const cp1x = pA.x - 35;
    const cp1y = pA.y + (pB.y - pA.y) * 0.45;
    const cp2x = pB.x + 35;
    const cp2y = pB.y - (pB.y - pA.y) * 0.45;
    return `M ${pA.x} ${pA.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pB.x} ${pB.y}`;
  };

  const isDark = theme === 'dark';

  // Step item definitions: Resume -> Analysis -> Match Score -> Job Match -> Interview -> Hired
  const steps = [
    {
      ref: step1Ref,
      icon: <FileText className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      label: 'RESUME',
      initialX: 60,
      initialY: 10,
      pulseColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      ref: step2Ref,
      icon: <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      label: 'ANALYSIS',
      initialX: -30,
      initialY: 90,
      pulseColor: 'rgba(20, 184, 166, 0.4)'
    },
    {
      ref: step3Ref,
      icon: <BarChart2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      label: 'MATCH SCORE',
      initialX: 30,
      initialY: 170,
      pulseColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      ref: step4Ref,
      icon: <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      label: 'JOB MATCH',
      initialX: -30,
      initialY: 250,
      pulseColor: 'rgba(20, 184, 166, 0.4)'
    },
    {
      ref: step5Ref,
      icon: <Mic className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      label: 'INTERVIEW',
      initialX: 30,
      initialY: 330,
      pulseColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      ref: step6Ref,
      icon: <Trophy className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      label: 'HIRED',
      initialX: -45,
      initialY: 410,
      pulseColor: 'rgba(20, 184, 166, 0.4)'
    }
  ];

  const loop1 = points.length === 6 ? getCubicLoopPaths(points[0], points[1], 35) : { forward: '', backward: '' };
  const loop2 = points.length === 6 ? getCubicLoopPaths(points[1], points[2], 35) : { forward: '', backward: '' };
  const loop3 = points.length === 6 ? getCubicLoopPaths(points[2], points[3], 35) : { forward: '', backward: '' };
  const loop4 = points.length === 6 ? getCubicLoopPaths(points[3], points[4], 35) : { forward: '', backward: '' };
  const path5 = points.length === 6 ? getSingleSegmentPath(points[4], points[5]) : '';

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[510px] select-none flex justify-center"
    >
      
      {/* 1. SVG Canvas for Interactive Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="pulseGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* Base dashed connection paths */}
        {points.length === 6 && (
          <>
            {/* Loop 1: RESUME <-> ANALYSIS */}
            <path
              d={loop1.forward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />
            <path
              d={loop1.backward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />

            {/* Loop 2: ANALYSIS <-> MATCH SCORE */}
            <path
              d={loop2.forward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />
            <path
              d={loop2.backward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />

            {/* Loop 3: MATCH SCORE <-> JOB MATCH */}
            <path
              d={loop3.forward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />
            <path
              d={loop3.backward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />

            {/* Loop 4: JOB MATCH <-> INTERVIEW */}
            <path
              d={loop4.forward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />
            <path
              d={loop4.backward}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />

            {/* Path 5: INTERVIEW -> HIRED */}
            <path
              d={path5}
              fill="none"
              stroke={isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(13, 148, 136, 0.45)'}
              strokeWidth="2.5"
              strokeDasharray="6, 6"
            />
          </>
        )}

        {/* Animated glowing energy pulses (Bidirectional) */}
        {points.length === 6 && (
          <>
            {/* Loop 1: RESUME <-> ANALYSIS pulses */}
            <path
              d={loop1.forward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowForward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />
            <path
              d={loop1.backward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowBackward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />

            {/* Loop 2: ANALYSIS <-> MATCH SCORE pulses */}
            <path
              d={loop2.forward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowForward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />
            <path
              d={loop2.backward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowBackward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />

            {/* Loop 3: MATCH SCORE <-> JOB MATCH pulses */}
            <path
              d={loop3.forward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowForward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />
            <path
              d={loop3.backward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowBackward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />

            {/* Loop 4: JOB MATCH <-> INTERVIEW pulses */}
            <path
              d={loop4.forward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowForward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />
            <path
              d={loop4.backward}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowBackward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />

            {/* Path 5: INTERVIEW -> HIRED pulses */}
            <path
              d={path5}
              fill="none"
              stroke={isDark ? "url(#pulseGrad)" : "url(#pulseGradLight)"}
              strokeWidth="3.5"
              strokeDasharray="5, 25"
              style={{
                animation: 'dashFlowForward 3.5s linear infinite',
                filter: isDark 
                  ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))' 
                  : 'drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))'
              }}
            />
          </>
        )}
      </svg>

      {/* Global CSS injection for pulse animation */}
      <style>{`
        @keyframes dashFlowForward {
          to {
            stroke-dashoffset: -180;
          }
        }
        @keyframes dashFlowBackward {
          to {
            stroke-dashoffset: 180;
          }
        }
      `}</style>

      {/* 2. Interactive Draggable Glass Nodes */}
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          ref={step.ref}
          drag
          dragConstraints={containerRef}
          dragElastic={0.4}
          dragMomentum={false}
          style={{
            position: 'absolute',
            left: `calc(50% + ${step.initialX}px - 60px)`, // Center align + offset
            top: step.initialY,
            cursor: 'grab',
            zIndex: 10
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96, cursor: 'grabbing' }}
          className="w-[120px] p-3 rounded-2xl border border-teal-500/10 dark:border-white/12 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md shadow-[0_8px_30px_rgba(0,180,180,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.45)] hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] dark:hover:border-cyan-500/35 transition-shadow duration-300 flex flex-col items-center gap-1.5"
        >
          {/* Glowing dot effect behind icon */}
          <div className="relative w-9 h-9 rounded-xl bg-teal-500/5 dark:bg-white/5 border border-teal-500/10 dark:border-white/5 flex items-center justify-center">
            {step.icon}
          </div>
          <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider text-center select-none">
            {step.label}
          </span>
        </motion.div>
      ))}

    </div>
  );
};

export default FlowSteps;
