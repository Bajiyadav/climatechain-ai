import React, { useEffect, useRef } from 'react';

/**
 * CyberCanvas: High-Performance 3D Particle Constellation & Satellite Orbital Canvas
 * Renders pulsating energy grid nodes, satellite orbital arcs, and interactive magnetic mouse particles.
 */
export default function CyberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    const particles = [];
    const colors = ['#10b981', '#06b6d4', '#34d399', '#f59e0b'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }

    // Satellite sweeping beam
    let angle = 0;
    const centerX = width * 0.78;
    const centerY = height * 0.32;
    const orbitRadiusX = 180;
    const orbitRadiusY = 65;

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Satellite Orbit & Satellite Sensor
      angle += 0.012;
      const satX = centerX + Math.cos(angle) * orbitRadiusX;
      const satY = centerY + Math.sin(angle) * orbitRadiusY;

      // Orbit Ellipse path
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, orbitRadiusX, orbitRadiusY, 0.25, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Satellite sensor beam cone
      const beamGrad = ctx.createRadialGradient(satX, satY, 2, satX, satY + 120, 100);
      beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      beamGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(satX - 60, satY + 140);
      ctx.lineTo(satX + 60, satY + 140);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Satellite glowing dot
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. Render and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse gravity deflection
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        p.pulse += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulse) * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - cdist / 130) * 0.18;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="cyber-canvas-layer" />;
}
