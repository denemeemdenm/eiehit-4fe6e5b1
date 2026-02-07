import { useEffect, useRef } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const particlesRef = useRef<TrailParticle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Skip on mobile/touch devices
    if ('ontouchstart' in window && window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    function spawnParticles() {
      const m = mouseRef.current;
      const pm = prevMouseRef.current;
      const dx = m.x - pm.x;
      const dy = m.y - pm.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (m.x > 0 && speed > 1.5) {
        const count = Math.min(Math.floor(speed * 0.4), 5);
        for (let i = 0; i < count; i++) {
          const spread = (Math.random() - 0.5) * 6;
          const life = 30 + Math.random() * 25;
          particlesRef.current.push({
            x: m.x + spread,
            y: m.y + 12 + Math.random() * 4, // emanate from bottom of cursor
            vx: (Math.random() - 0.5) * 1.2,
            vy: 0.8 + Math.random() * 1.5, // fall downward
            alpha: 0.7 + Math.random() * 0.3,
            size: 1.2 + Math.random() * 2.5,
            life,
            maxLife: life,
            hue: 38 + Math.random() * 15, // gold range: 38-53
          });
        }
      }
      prevMouseRef.current = { ...m };
    }

    function updateAndDraw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      spawnParticles();

      particlesRef.current = particlesRef.current.filter(p => {
        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gentle gravity
        p.vx *= 0.98;
        p.size *= 0.985;

        const progress = p.life / p.maxLife;
        p.alpha = progress * progress; // ease out fade

        if (p.life <= 0 || p.alpha < 0.01) return false;

        // Draw glow
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        g.addColorStop(0, `hsla(${p.hue}, 85%, 65%, ${p.alpha * 0.5})`);
        g.addColorStop(0.4, `hsla(${p.hue}, 90%, 55%, ${p.alpha * 0.2})`);
        g.addColorStop(1, `hsla(${p.hue}, 90%, 50%, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx!.fill();

        // Draw core
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.alpha * 0.9})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx!.fill();

        return true;
      });

      // Keep array from growing unbounded
      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-150);
      }

      animRef.current = requestAnimationFrame(updateAndDraw);
    }

    animRef.current = requestAnimationFrame(updateAndDraw);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
