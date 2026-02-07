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
  homeX: number;
  homeY: number;
}

const COLORS = ['#64FFFF', '#FF4B00', '#FFCC00'];

interface GoldTrail { x: number; y: number; alpha: number; size: number; }

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<GoldTrail[]>([]);
  const animRef = useRef<number>(0);
  const isDarkRef = useRef(false);
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
    const particleCount = mobile ? 35 : 75;
    const connectionDist = mobile ? 120 : 150;
    const cursorRadius = 220;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redistribute particles on resize if they exist
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach(p => {
          p.homeX = Math.random() * canvas.width;
          p.homeY = Math.random() * canvas.height;
        });
      }
    }

    function createParticles() {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: Math.random() * 0.4 + 0.3,
          baseOpacity: Math.random() * 0.4 + 0.3,
          size: Math.random() * 1.5 + 1,
          pulsePhase: Math.random() * Math.PI * 2,
          homeX: x,
          homeY: y,
        });
      }
    }

    function updateParticles(time: number) {
      const mouse = mouseRef.current;
      particlesRef.current.forEach(p => {
        // Organic drift around home position
        p.x += p.vx + Math.sin(time * 0.0003 + p.pulsePhase) * 0.05;
        p.y += p.vy + Math.cos(time * 0.00025 + p.pulsePhase) * 0.05;

        // Gentle pull back toward home position to prevent clustering
        const homeDistX = p.homeX - p.x;
        const homeDistY = p.homeY - p.y;
        const homeDist = Math.sqrt(homeDistX * homeDistX + homeDistY * homeDistY);
        if (homeDist > 50) {
          const homeForce = Math.min(homeDist * 0.0003, 0.04);
          p.vx += (homeDistX / homeDist) * homeForce;
          p.vy += (homeDistY / homeDist) * homeForce;
        }

        // Wrap around edges instead of bouncing (more natural)
        if (p.x < -20) { p.x = canvas.width + 20; p.homeX = canvas.width * Math.random(); }
        if (p.x > canvas.width + 20) { p.x = -20; p.homeX = canvas.width * Math.random(); }
        if (p.y < -20) { p.y = canvas.height + 20; p.homeY = canvas.height * Math.random(); }
        if (p.y > canvas.height + 20) { p.y = -20; p.homeY = canvas.height * Math.random(); }

        // Cursor interaction — REPEL only, no attraction (prevents clustering)
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius && dist > 0) {
            const force = (1 - dist / cursorRadius) * 0.06;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Inter-particle repulsion to prevent clustering
        particlesRef.current.forEach(other => {
          if (other === p) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30 && dist > 0) {
            const repel = (1 - dist / 30) * 0.02;
            p.vx += (dx / dist) * repel;
            p.vy += (dy / dist) * repel;
          }
        });

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
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

    function drawConnections() {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const isDark = isDarkRef.current;

      // Draw connections between nearby particles (not dependent on cursor)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (isDark ? 0.15 : 0.08);
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, p1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            grad.addColorStop(1, p2.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Brighter connections near cursor
      if (mouse.x > 0 && mouse.y > 0) {
        const nearCursor: Particle[] = [];
        particles.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius) nearCursor.push(p);
        });

        for (let i = 0; i < nearCursor.length; i++) {
          for (let j = i + 1; j < nearCursor.length; j++) {
            const p1 = nearCursor[i];
            const p2 = nearCursor[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * (isDark ? 0.3 : 0.15);
              const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
              grad.addColorStop(0, p1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
              grad.addColorStop(1, p2.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    function updateGoldTrail() {
      const mouse = mouseRef.current;
      const prev = prevMouseRef.current;
      if (mouse.x > 0 && (Math.abs(mouse.x - prev.x) > 1 || Math.abs(mouse.y - prev.y) > 1)) {
        trailRef.current.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          alpha: 0.5,
          size: Math.random() * 2.5 + 1,
        });
      }
      prevMouseRef.current = { ...mouse };
      trailRef.current = trailRef.current.filter(t => {
        t.alpha -= 0.018;
        t.size *= 0.97;
        return t.alpha > 0;
      });
    }

    function drawGoldTrail() {
      trailRef.current.forEach(t => {
        const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size * 3);
        g.addColorStop(0, `rgba(255, 204, 0, ${t.alpha * 0.4})`);
        g.addColorStop(0.5, `rgba(255, 180, 0, ${t.alpha * 0.15})`);
        g.addColorStop(1, `rgba(255, 160, 0, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      const mouse = mouseRef.current;
      if (mouse.x > 0) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 50);
        g.addColorStop(0, 'rgba(255, 204, 0, 0.08)');
        g.addColorStop(0.5, 'rgba(255, 180, 0, 0.03)');
        g.addColorStop(1, 'rgba(255, 160, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate(time: number) {
      updateParticles(time);
      updateGoldTrail();
      drawParticles();
      drawConnections();
      drawGoldTrail();
      animRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => { resizeCanvas(); };
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
      style={{ opacity: 0.6 }}
    />
  );
}
