import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  size: number;
  pulsePhase: number;
}

const COLORS = ['#00CCFF', '#FF4B00', '#FFCC00'];

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const isDarkRef = useRef(false);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const observer = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    isDarkRef.current = document.documentElement.classList.contains('dark');

    const mobile = window.innerWidth < 768;
    const particleCount = mobile ? 30 : 70;
    const connectionDist = mobile ? 100 : 130;
    const cursorRadius = 180;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: Math.random() * 0.5 + 0.4,
          baseOpacity: Math.random() * 0.5 + 0.4,
          size: Math.random() * 1.5 + 1.2,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    function updateParticles(time: number) {
      const mouse = mouseRef.current;
      particlesRef.current.forEach(p => {
        // Organic drift with subtle sine wave
        p.x += p.vx + Math.sin(time * 0.0003 + p.pulsePhase) * 0.04;
        p.y += p.vy + Math.cos(time * 0.00025 + p.pulsePhase) * 0.04;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Cursor attraction
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius && dist > 0) {
            const force = (1 - dist / cursorRadius) * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        // Keep minimum drift
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.1) {
          const angle = Math.atan2(p.vy, p.vx);
          p.vx = Math.cos(angle) * 0.1;
          p.vy = Math.sin(angle) * 0.1;
        }

        // Pulse opacity
        p.opacity = p.baseOpacity + Math.sin(time * 0.001 + p.pulsePhase) * 0.08;
      });
    }

    function drawParticles() {
      const isDark = isDarkRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        const alpha = Math.max(0, Math.min(1, p.opacity)) * (isDark ? 0.7 : 0.5);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function drawConnections(time: number) {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const isDark = isDarkRef.current;

      // Inter-particle connections with color blending
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (isDark ? 0.25 : 0.15);
            // Gradient line between two particle colors
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, p1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            grad.addColorStop(1, p2.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Cursor connections — warm orange
      if (mouse.x > 0 && mouse.y > 0) {
        particles.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius) {
            const alpha = (1 - dist / cursorRadius) * 0.2;
            ctx.strokeStyle = `rgba(255, 75, 0, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }
    }

    function drawCursorGlow() {
      const mouse = mouseRef.current;
      if (mouse.x < 0) return;
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
      g.addColorStop(0, 'rgba(255, 75, 0, 0.08)');
      g.addColorStop(1, 'rgba(255, 75, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate(time: number) {
      timeRef.current = time;
      updateParticles(time);
      drawParticles();
      drawConnections(time);
      drawCursorGlow();
      animRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => resizeCanvas();
    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleTouch = (e: TouchEvent) => { mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const handleTouchEnd = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
}
