import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

/**
 * Cyber-Luxe Neural Mesh Background
 * High-performance canvas-based dynamic background with deep blacks, neon accents, and structural grid
 */
export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation parameters
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    // Premium Cyber-Luxe Colors
    const colors = [
      '6, 182, 212',   // Sui Blue
      '139, 92, 246',   // Purple
      '34, 197, 94',   // Success Green
      '2, 132, 199',   // Deep Blue
    ];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 450 + 150,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.12 + 0.03
      });
    }

    const animate = () => {
      if (!canvas || !ctx) return;

      // Deepest black base
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw Structural Neural Grid (Subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 120;
      
      for (let x = 0; x < window.innerWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
        ctx.stroke();
      }
      for (let y = 0; y < window.innerHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
        ctx.stroke();
      }

      // High-performance particle rendering
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.radius) p.x = window.innerWidth + p.radius;
        if (p.x > window.innerWidth + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = window.innerHeight + p.radius;
        if (p.y > window.innerHeight + p.radius) p.y = -p.radius;

        const garden = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        garden.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        garden.addColorStop(1, 'rgba(5, 5, 5, 0)');

        ctx.fillStyle = garden;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Atmospheric Vignette & Top Glow
      const vignette = ctx.createRadialGradient(
        window.innerWidth / 2, 
        window.innerHeight / 2, 
        0, 
        window.innerWidth / 2, 
        window.innerHeight / 2, 
        window.innerWidth
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const topReflect = ctx.createLinearGradient(0, 0, 0, 400);
      topReflect.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
      topReflect.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = topReflect;
      ctx.fillRect(0, 0, window.innerWidth, 400);

      requestAnimationFrame(animate);
    };

    const requestId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-background" style={{ opacity: 1 }} />;
};
