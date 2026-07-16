import React, { useEffect, useRef } from 'react';

const CloudBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class for smoke/fog/ink cloud puffs
    class Particle {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        // Start near the top-center (like the ink drop in the image)
        this.x = width * 0.5 + (Math.random() - 0.5) * (width * 0.2);
        // If initial, distribute along the y-axis to populate the cloud immediately
        this.y = isInitial 
          ? height * 0.1 + Math.random() * (height * 0.7)
          : height * 0.1 + (Math.random() - 0.5) * 50;

        // Slow downward and outward movement
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = 0.2 + Math.random() * 0.5;

        // Size: starts medium and expands (billowing)
        this.baseRadius = 60 + Math.random() * 80;
        this.radius = isInitial ? this.baseRadius * (1 + Math.random() * 1.5) : 30 + Math.random() * 30;
        this.maxRadius = this.baseRadius * (2.5 + Math.random() * 1.5);
        this.growthRate = 0.15 + Math.random() * 0.25;

        // Opacity
        this.maxOpacity = 0.12 + Math.random() * 0.18;
        this.opacity = isInitial ? Math.random() * this.maxOpacity : 0;
        this.fadeIn = !isInitial; // Fade in new particles
        this.fadeRate = 0.002 + Math.random() * 0.003;

        // Spin
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.001;

        // Color variance: vibrant cyan/teal tones matching the image
        const colors = [
          { r: 20, g: 184, b: 166 }, // teal-500
          { r: 6, g: 182, b: 212 },  // cyan-500
          { r: 13, g: 148, b: 136 }, // teal-600
          { r: 8, g: 145, b: 178 }   // cyan-600
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.spin;

        // Expand radius (billowing effect)
        if (this.radius < this.maxRadius) {
          this.radius += this.growthRate;
        }

        // Opacity lifecycle
        if (this.fadeIn) {
          this.opacity += 0.005;
          if (this.opacity >= this.maxOpacity) {
            this.opacity = this.maxOpacity;
            this.fadeIn = false;
          }
        } else {
          this.opacity -= this.fadeRate;
        }

        // Reset if completely faded out or moved too far down
        if (this.opacity <= 0 || this.y - this.radius > height) {
          this.reset(false);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);

        // Volumetric radial gradient matching ink diffusion
        const grad = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        const r = this.color.r;
        const g = this.color.g;
        const b = this.color.b;

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.6})`);
        grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.25})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        context.fillStyle = grad;
        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    // Set up particles
    const particleCount = 120;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      // Pre-populate particles to have an initial shape on load
      particles.push(new Particle(true));
    }

    // Handle resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles.forEach((p) => p.reset(true));
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive effect (gentle push/repulsion)
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Main animation loop
    const animate = () => {
      // Background gradient matching the image
      // Center-top is brighter teal, corners are dark cyan-navy
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.4, width * 0.1,
        width * 0.5, height * 0.5, width * 0.8
      );
      bgGrad.addColorStop(0, '#00a39d');     // Glowing teal/cyan
      bgGrad.addColorStop(0.4, '#007b77');   // Deep teal
      bgGrad.addColorStop(0.7, '#082937');   // Dark oceanic cyan-blue
      bgGrad.addColorStop(1, '#03141c');     // Deepest navy-black

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw cloud particles
      particles.forEach((p) => {
        // Mouse interactive force
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            const force = (300 - dist) / 300;
            // Push gently away from mouse
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        p.update();
        p.draw(ctx);
      });

      // Extra organic lighting overlay: a soft overlay gradient
      const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
      overlayGrad.addColorStop(0, 'rgba(0, 240, 220, 0.08)');
      overlayGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      overlayGrad.addColorStop(1, 'rgba(3, 20, 28, 0.3)');
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-20 block" />;
};

export default CloudBackground;
