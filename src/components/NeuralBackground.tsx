import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  color: string; opacity: number; baseOpacity: number;
  size: number; pulsePhase: number; homeX: number; homeY: number;
}

const COLORS = ['#64FFFF', '#FF4B00', '#FFCC00'];

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<GoldTrail[]>([]);
  const animRef = useRef<number>(0);
  const isDarkRef = useRef(false);
  const prevMouseRef = useRef({ x: -1000, y: -1000 });
  const scrollYRef = useRef(0);
  const coveredYRef = useRef(0); // how far down we've spawned particles

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

    const connectionDist = window.innerWidth < 768 ? 150 : 180;
    const cursorRadius = 220;
    const BUFFER = 300; // px buffer above/below viewport for updates
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    // Dynamic particle density: ~1 particle per 8000px² of screen area
    function getParticleCount() {
      const area = window.innerWidth * window.innerHeight;
      const mobile = window.innerWidth < 768;
      const density = mobile ? 12000 : 8000;
      return Math.max(30, Math.min(150, Math.round(area / density)));
    }

    let particleCount = getParticleCount();

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function makeParticle(minY: number, maxY: number): Particle {
      const x = Math.random() * canvas.width;
      const y = minY + Math.random() * (maxY - minY);
      return {
        x, y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.5 + 0.35,
        baseOpacity: Math.random() * 0.5 + 0.35,
        size: Math.random() * 2 + 1.2,
        pulsePhase: Math.random() * Math.PI * 2,
        homeX: x, homeY: y,
      };
    }

    // Spawn initial viewport worth of particles
    function createParticles() {
      particlesRef.current = [];
      const h = window.innerHeight;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(makeParticle(0, h));
      }
      coveredYRef.current = h;
    }

    // Extend particles into newly scrolled territory
    function extendParticlesIfNeeded() {
      const scrollY = scrollYRef.current;
      const viewBottom = scrollY + window.innerHeight;
      const needed = viewBottom + BUFFER;

      if (needed > coveredYRef.current) {
        const oldCovered = coveredYRef.current;
        const newCovered = needed;
        const bandHeight = newCovered - oldCovered;
        const viewportH = window.innerHeight;
        // Same density as initial: particleCount per viewportH
        const count = Math.round((bandHeight / viewportH) * particleCount);
        for (let i = 0; i < count; i++) {
          particlesRef.current.push(makeParticle(oldCovered, newCovered));
        }
        coveredYRef.current = newCovered;
      }
    }

    function updateParticles(time: number) {
      const mouse = mouseRef.current;
      const scrollY = scrollYRef.current;
      const viewTop = scrollY - BUFFER;
      const viewBottom = scrollY + window.innerHeight + BUFFER;
      // Mouse in document-space
      const mouseDocX = mouse.x;
      const mouseDocY = mouse.y > 0 ? mouse.y + scrollY : -1000;

      particlesRef.current.forEach(p => {
        // Only do full physics for particles near viewport
        if (p.y < viewTop - 200 || p.y > viewBottom + 200) return;

        p.x += p.vx + Math.sin(time * 0.0003 + p.pulsePhase) * 0.04;
        p.y += p.vy + Math.cos(time * 0.00025 + p.pulsePhase) * 0.04;

        const homeDistX = p.homeX - p.x;
        const homeDistY = p.homeY - p.y;
        const homeDist = Math.sqrt(homeDistX * homeDistX + homeDistY * homeDistY);
        if (homeDist > 50) {
          const homeForce = Math.min(homeDist * 0.0003, 0.04);
          p.vx += (homeDistX / homeDist) * homeForce;
          p.vy += (homeDistY / homeDist) * homeForce;
        }

        // Horizontal wrapping
        if (p.x < -20) { p.x = canvas.width + 20; p.homeX = canvas.width * Math.random(); }
        if (p.x > canvas.width + 20) { p.x = -20; p.homeX = canvas.width * Math.random(); }

        // Cursor attraction (document-space)
        if (mouseDocY > 0) {
          const dx = p.x - mouseDocX;
          const dy = p.y - mouseDocY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius && dist > 0) {
            const minDist = 60;
            if (dist > minDist) {
              const force = (1 - dist / cursorRadius) * 0.025;
              p.vx -= (dx / dist) * force;
              p.vy -= (dy / dist) * force;
            } else {
              const repel = (1 - dist / minDist) * 0.03;
              p.vx += (dx / dist) * repel;
              p.vy += (dy / dist) * repel;
            }
          }
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) { p.vx = (p.vx / speed) * 1.2; p.vy = (p.vy / speed) * 1.2; }
        p.opacity = p.baseOpacity + Math.sin(time * 0.001 + p.pulsePhase) * 0.1;
      });

      // Anti-clumping only for visible particles
      const visible = particlesRef.current.filter(p => p.y >= viewTop && p.y <= viewBottom);
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const p = visible[i];
          const other = visible[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30 && dist > 0) {
            const repel = (1 - dist / 30) * 0.02;
            p.vx += (dx / dist) * repel;
            p.vy += (dy / dist) * repel;
            other.vx -= (dx / dist) * repel;
            other.vy -= (dy / dist) * repel;
          }
        }
      }
    }

    function drawScene() {
      const isDark = isDarkRef.current;
      const scrollY = scrollYRef.current;
      const viewTop = scrollY;
      const viewBottom = scrollY + window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get visible particles (with buffer for connections that cross edges)
      const visible = particlesRef.current.filter(p =>
        p.y > viewTop - connectionDist && p.y < viewBottom + connectionDist
      );

      // Draw particles — transform doc Y to canvas Y
      visible.forEach(p => {
        const cy = p.y - scrollY;
        const alpha = Math.max(0, Math.min(1, p.opacity)) * (isDark ? 0.9 : 0.8);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, cy, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw connections
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const p1 = visible[i];
          const p2 = visible[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (isDark ? 0.28 : 0.22);
            const p1cy = p1.y - scrollY;
            const p2cy = p2.y - scrollY;
            const grad = ctx.createLinearGradient(p1.x, p1cy, p2.x, p2cy);
            grad.addColorStop(0, p1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            grad.addColorStop(1, p2.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            ctx.strokeStyle = grad;
            ctx.lineWidth = isDark ? 0.7 : 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1cy);
            ctx.lineTo(p2.x, p2cy);
            ctx.stroke();
          }
        }
      }

      // Cursor connections
      const mouse = mouseRef.current;
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseDocY = mouse.y + scrollY;
        const nearCursor = visible.filter(p => {
          const dx = mouse.x - p.x;
          const dy = mouseDocY - p.y;
          return Math.sqrt(dx * dx + dy * dy) < cursorRadius;
        });

        for (let i = 0; i < nearCursor.length; i++) {
          for (let j = i + 1; j < nearCursor.length; j++) {
            const p1 = nearCursor[i];
            const p2 = nearCursor[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * (isDark ? 0.5 : 0.35);
              const p1cy = p1.y - scrollY;
              const p2cy = p2.y - scrollY;
              const grad = ctx.createLinearGradient(p1.x, p1cy, p2.x, p2cy);
              grad.addColorStop(0, p1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
              grad.addColorStop(1, p2.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1cy);
              ctx.lineTo(p2.x, p2cy);
              ctx.stroke();
            }
          }
        }
      }

      // Gold trail (screen-space)
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
      extendParticlesIfNeeded();
      updateParticles(time);
      drawScene();
      animRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        particleCount = getParticleCount();
        createParticles();
      }, 200);
    };
    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const handleTouch = (e: TouchEvent) => { mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const handleTouchEnd = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    const handleScroll = () => { scrollYRef.current = window.scrollY; };
    const handleFlashcardScroll = (e: Event) => {
      const scrollTop = (e as CustomEvent).detail?.scrollTop ?? 0;
      scrollYRef.current = scrollTop;
      extendParticlesIfNeeded();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('flashcard-scroll', handleFlashcardScroll);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('flashcard-scroll', handleFlashcardScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
