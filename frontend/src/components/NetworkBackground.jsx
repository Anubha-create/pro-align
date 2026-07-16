import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  BarChart2, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clipboard, 
  Trophy, 
  Star, 
  Mic, 
  Search, 
  User,
  Sparkles
} from 'lucide-react';

const NetworkBackground = ({ theme }) => {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  // Sync theme prop to ref to avoid canvas loop closures
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Node count based on screen size
    const nodeCount = Math.min(65, Math.floor((width * height) / 22000));
    const nodes = [];

    // Mesh gradient color blobs shifting position slowly
    const blobs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.15, vy: 0.1, r: width * 0.35, colorDark: 'rgba(20, 184, 166, 0.18)', colorLight: 'rgba(20, 184, 166, 0.15)' }, // Teal
      { x: width * 0.8, y: height * 0.4, vx: -0.1, vy: 0.12, r: width * 0.4, colorDark: 'rgba(6, 182, 212, 0.15)', colorLight: 'rgba(6, 182, 212, 0.12)' },  // Cyan
      { x: width * 0.5, y: height * 0.8, vx: 0.08, vy: -0.15, r: width * 0.45, colorDark: 'rgba(15, 23, 42, 0.9)', colorLight: 'rgba(255, 255, 255, 0.8)' }   // Base overlay
    ];

    class Node {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow organic movement
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = 1.2 + Math.random() * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.baseOpacity = 0.15 + Math.random() * 0.35;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += this.pulseSpeed;

        // Bounce off canvas boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(context, isDark) {
        context.save();
        // Pulsing glow
        const glowOpacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.12;
        
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        if (isDark) {
          context.fillStyle = `rgba(34, 211, 238, ${glowOpacity})`; // Cyan-400
          context.shadowColor = 'rgba(34, 211, 238, 0.5)';
          context.shadowBlur = 6;
        } else {
          context.fillStyle = `rgba(13, 148, 136, ${glowOpacity * 1.6})`; // Higher opacity Teal-600
          context.shadowColor = 'rgba(13, 148, 136, 0.35)'; // Dynamic soft shadow for light mode
          context.shadowBlur = 5;
        }
        context.fill();
        context.restore();
      }
    }

    // Set up nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }

    // Track mouse coordinates
    let mouse = { x: null, y: null, maxDist: 150 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Window resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      blobs[0].r = width * 0.35;
      blobs[1].r = width * 0.4;
      blobs[2].r = width * 0.45;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const draw = () => {
      const isDark = themeRef.current === 'dark';
      
      // 1. Draw Mesh Gradient base (moving blobs)
      // Dark mode: Dark ocean turquoise-black
      // Light mode: Light glowing turquoise-blue
      ctx.fillStyle = isDark ? '#041c24' : '#e6f9fa';
      ctx.fillRect(0, 0, width, height);

      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce blobs
        if (blob.x - blob.r < 0 || blob.x + blob.r > width) blob.vx *= -1;
        if (blob.y - blob.r < 0 || blob.y + blob.r > height) blob.vy *= -1;

        // Soft blob gradient
        const color = isDark ? blob.colorDark : blob.colorLight;
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, isDark ? 'rgba(4, 28, 36, 0)' : 'rgba(230, 249, 250, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Network lines
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        
        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = n1.x - mouse.x;
          const dy = n1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            const alpha = (1 - dist / mouse.maxDist) * (isDark ? 0.35 : 0.6); // Increased alpha in light mode
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(mouse.x, mouse.y);
            
            const strokeColor = isDark 
              ? `rgba(34, 211, 238, ${alpha})` // cyan-400
              : `rgba(8, 145, 178, ${alpha})`; // cyan-600
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isDark ? 0.8 : 1.25; // Thicker lines in light mode
            ctx.stroke();
          }
        }

        // Connect to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxLineDist = 135;

          if (dist < maxLineDist) {
            const alpha = (1 - dist / maxLineDist) * (isDark ? 0.18 : 0.45); // Increased alpha in light mode
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            
            ctx.strokeStyle = isDark 
              ? `rgba(20, 184, 166, ${alpha})` // teal-500
              : `rgba(13, 148, 136, ${alpha})`; // teal-600
            ctx.lineWidth = isDark ? 0.6 : 0.95; // Thicker lines in light mode for visibility
            ctx.stroke();
          }
        }
      }

      // 3. Update and draw nodes
      nodes.forEach((node) => {
        node.update();
        node.draw(ctx, isDark);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Skill tags with recruiting keywords and icons
  const skillTags = [
    { name: 'Resume', icon: <FileText className="w-3.5 h-3.5 text-teal-500" />, delay: 0.5, duration: 18, top: '22%', left: '12%' },
    { name: 'ATS Score', icon: <BarChart2 className="w-3.5 h-3.5 text-cyan-500" />, delay: 2, duration: 15, top: '55%', left: '8%' },
    { name: 'Job Match', icon: <Briefcase className="w-3.5 h-3.5 text-teal-500" />, delay: 4, duration: 22, top: '78%', left: '18%' },
    { name: 'Interview Ready', icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />, delay: 1, duration: 19, top: '15%', left: '42%' },
    { name: 'Recruiter', icon: <User className="w-3.5 h-3.5 text-teal-500" />, delay: 5, duration: 17, top: '72%', left: '40%' },
    { name: 'Skill Gap', icon: <Target className="w-3.5 h-3.5 text-cyan-500" />, delay: 3, duration: 21, top: '18%', left: '72%' },
    { name: 'Career Growth', icon: <TrendingUp className="w-3.5 h-3.5 text-teal-500" />, delay: 0, duration: 24, top: '65%', left: '78%' },
    { name: 'Resume Optimizer', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-500" />, delay: 6, duration: 16, top: '28%', left: '88%' },
    { name: 'Cover Letter', icon: <Clipboard className="w-3.5 h-3.5 text-teal-500" />, delay: 2.5, duration: 20, top: '48%', left: '92%' },
    { name: 'Application', icon: <FileText className="w-3.5 h-3.5 text-cyan-500" />, delay: 5.5, duration: 14, top: '82%', left: '68%' },
    { name: 'Candidate', icon: <User className="w-3.5 h-3.5 text-teal-500" />, delay: 1.5, duration: 23, top: '88%', left: '88%' },
    { name: 'Hiring', icon: <Briefcase className="w-3.5 h-3.5 text-cyan-500" />, delay: 3.5, duration: 18, top: '85%', left: '32%' },
    { name: 'Resume Score', icon: <BarChart2 className="w-3.5 h-3.5 text-teal-500" />, delay: 7, duration: 25, top: '42%', left: '3%' },
    { name: 'Professional Profile', icon: <User className="w-3.5 h-3.5 text-cyan-500" />, delay: 2, duration: 20, top: '5%', left: '20%' },
    { name: 'Interview Coach', icon: <Mic className="w-3.5 h-3.5 text-teal-500" />, delay: 4.5, duration: 16, top: '92%', left: '50%' },
    { name: 'Career Success', icon: <Trophy className="w-3.5 h-3.5 text-cyan-500" />, delay: 3, duration: 22, top: '38%', left: '55%' }
  ];

  return (
    <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden pointer-events-none">
      {/* 1. Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 2. Scanning Sweep (with theme-aligned colors) */}
      <div 
        className="absolute left-0 w-full h-[150px] pointer-events-none opacity-30 dark:opacity-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.25), rgba(6, 182, 212, 0.08), transparent)',
          animation: 'scanLineSweep 10s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          zIndex: 1
        }}
      />

      <style>{`
        @keyframes scanLineSweep {
          0% { top: -150px; }
          60%, 100% { top: 100%; }
        }
      `}</style>

      {/* 3. Floating skill tags */}
      <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
        {skillTags.map((tag, idx) => (
          <motion.div
            key={idx}
            style={{
              position: 'absolute',
              top: tag.top,
              left: tag.left,
            }}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -18, 0],
              x: [0, 8, 0],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{
              duration: tag.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: tag.delay,
              times: [0, 0.15, 0.85, 1]
            }}
            className="px-3.5 py-1.5 text-[10px] md:text-[11px] font-semibold text-teal-800 dark:text-cyan-300 border border-teal-500/10 dark:border-cyan-500/15 bg-white/70 dark:bg-[#09212c]/40 backdrop-blur-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.18)] pointer-events-auto cursor-default select-none hover:border-teal-400/30 dark:hover:border-cyan-400/35 hover:text-teal-950 dark:hover:text-cyan-200 transition-colors duration-300 flex items-center gap-1.5 rounded-full"
          >
            {tag.icon}
            <span>{tag.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NetworkBackground;
