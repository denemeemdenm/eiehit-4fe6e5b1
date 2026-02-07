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

interface GoldTrail { x: number; y: number; alpha: number; size: number; }

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<GoldTrail[]>([]);
  const animRef = useRef<number>(0);
  const isDarkRef = useRef(false);
  const timeRef = useRef(0);
  const prevMouseRef = useRef({ x: -1000, y: -1000 });

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
    const particleCount = mobile ? 40 : 90;
    const connectionDist = mobile ? 110 : 140;
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

        // Cursor interaction: gentle attraction far away, repulsion when too close
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius && dist > 0) {
            const repelZone = 60;
            if (dist < repelZone) {
              // Repel particles that get too close to prevent clustering
              const repelForce = (1 - dist / repelZone) * 0.08;
              p.vx -= (dx / dist) * repelForce;
              p.vy -= (dy / dist) * repelForce;
            } else {
              // Very gentle attraction beyond repel zone
              const force = (1 - dist / cursorRadius) * 0.005;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }
        }

        // Inter-particle repulsion to prevent clustering
        particlesRef.current.forEach(other => {
          if (other === p) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30 && dist > 0) {
            const repel = (1 - dist / 30) * 0.03;
            p.vx += (dx / dist) * repel;
            p.vy += (dy / dist) * repel;
          }
        });

        p.vx *= 0.98;
        p.vy *= 0.98;

        // Clamp max speed to prevent bursts
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 1.2;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // Keep minimum drift
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

    function updateGoldTrail() {
      const mouse = mouseRef.current;
      const prev = prevMouseRef.current;
      // Only add trail when mouse is moving
      if (mouse.x > 0 && (Math.abs(mouse.x - prev.x) > 1 || Math.abs(mouse.y - prev.y) > 1)) {
        trailRef.current.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          alpha: 0.6,
          size: Math.random() * 3 + 1.5,
        });
      }
      prevMouseRef.current = { ...mouse };
      // Fade out trail
      trailRef.current = trailRef.current.filter(t => {
        t.alpha -= 0.015;
        t.size *= 0.97;
        return t.alpha > 0;
      });
    }

    function drawGoldTrail() {
      trailRef.current.forEach(t => {
        const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size * 3);
        g.addColorStop(0, `rgba(255, 204, 0, ${t.alpha * 0.5})`);
        g.addColorStop(0.5, `rgba(255, 180, 0, ${t.alpha * 0.2})`);
        g.addColorStop(1, `rgba(255, 160, 0, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gold cursor glow
      const mouse = mouseRef.current;
      if (mouse.x > 0) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
        g.addColorStop(0, 'rgba(255, 204, 0, 0.1)');
        g.addColorStop(0.5, 'rgba(255, 180, 0, 0.04)');
        g.addColorStop(1, 'rgba(255, 160, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate(time: number) {
      timeRef.current = time;
      updateParticles(time);
      updateGoldTrail();
      drawParticles();
      drawConnections(time);
      drawGoldTrail();
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
