import React from 'react';
import { motion } from 'framer-motion';

const BubbleOverlay = () => {
  // Bubble specs matching positions and sizes relative to the screen layout
  const bubbles = [
    { id: 1, size: 85, left: '23%', top: '30%', delay: 0, duration: 8 },
    { id: 2, size: 45, left: '8%', top: '48%', delay: 1.5, duration: 10 },
    { id: 3, size: 28, left: '38%', top: '60%', delay: 0.5, duration: 7 },
    { id: 4, size: 38, left: '52%', top: '80%', delay: 2.2, duration: 9 },
    { id: 5, size: 68, left: '67%', top: '58%', delay: 1, duration: 11 },
    { id: 6, size: 55, left: '96%', top: '28%', delay: 3, duration: 8.5 },
    { id: 7, size: 30, left: '92%', top: '68%', delay: 0.8, duration: 9.5 }
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          style={{
            position: 'absolute',
            left: bubble.left,
            top: bubble.top,
            width: bubble.size,
            height: bubble.size,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, 12, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bubble.delay,
          }}
          className="relative rounded-full pointer-events-auto cursor-pointer select-none"
        >
          {/* Glass Sphere Body */}
          <div 
            className="w-full h-full rounded-full border border-white/35 backdrop-blur-[3px] shadow-[inset_-4px_-4px_12px_rgba(255,255,255,0.18),inset_4px_4px_10px_rgba(0,0,0,0.12),0_8px_16px_rgba(3,20,28,0.15)]"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 60%, rgba(20, 184, 166, 0.08) 80%, rgba(255, 255, 255, 0) 100%)'
            }}
          />

          {/* Glare Highlight Reflection */}
          <div 
            className="absolute top-[12%] left-[12%] w-[25%] h-[25%] rounded-full bg-gradient-to-br from-white/60 to-white/0 opacity-80"
            style={{
              filter: 'blur(0.5px)'
            }}
          />
          
          {/* Subtle secondary reflection at the bottom-right */}
          <div className="absolute bottom-[15%] right-[15%] w-[18%] h-[18%] rounded-full bg-white/20 opacity-40" />
        </motion.div>
      ))}
    </div>
  );
};

export default BubbleOverlay;
