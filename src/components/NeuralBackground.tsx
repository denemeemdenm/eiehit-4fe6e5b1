import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  baseOpacity: number;
}

const NEURAL_CONFIG = {
  particleCount: 100,
  particleSize: 2,
  connectionDistance: 150,
  connectionOpacity: 0.3,
  colors: ['#00CCFF', '#FF4B00', '#FFCC00'],
  animationDamping: 0.98,
  cursorAttractionRadius: 200,
};

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const isDarkRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    // Observe dark mode
    const observer = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    isDarkRef.current = document.documentElement.classList.contains('dark');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particlesRef.current = [];
      for (let i = 0; i < NEURAL_CONFIG.particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: NEURAL_CONFIG.colors[Math.floor(Math.random() * NEURAL_CONFIG.colors.length)],
          opacity: Math.random() * 0.6 + 0.4,
          baseOpacity: Math.random() * 0.6 + 0.4,
        });
      }
    }

    function updateParticles() {
      const mouse = mouseRef.current;
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Keep in bounds
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < NEURAL_CONFIG.cursorAttractionRadius && distance > 0) {
          const force = (1 - distance / NEURAL_CONFIG.cursorAttractionRadius) * 0.03;
          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }

        p.vx *= NEURAL_CONFIG.animationDamping;
        p.vy *= NEURAL_CONFIG.animationDamping;
        p.opacity = p.baseOpacity;
      });
    }

    function drawParticles() {
      const isDark = isDarkRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        const alphaHex = Math.floor(p.opacity * (isDark ? 150 : 100)).toString(16).padStart(2, '0');
        ctx.fillStyle = p.color + alphaHex;
        ctx.beginPath();
        ctx.arc(p.x, p.y, NEURAL_CONFIG.particleSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawConnections() {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Inter-particle connections
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < NEURAL_CONFIG.connectionDistance) {
            const opacity = (1 - distance / NEURAL_CONFIG.connectionDistance) * NEURAL_CONFIG.connectionOpacity;
            ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Connections to cursor (secondary/red color)
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < NEURAL_CONFIG.cursorAttractionRadius) {
          const opacity = (1 - distance / NEURAL_CONFIG.cursorAttractionRadius) * NEURAL_CONFIG.connectionOpacity * 0.6;
          ctx.strokeStyle = `rgba(255, 75, 0, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    function drawCursorGlow() {
      const mouse = mouseRef.current;
      if (mouse.x < 0) return;
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
      gradient.addColorStop(0, 'rgba(255, 75, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 75, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      updateParticles();
      drawParticles();
      drawConnections();
      drawCursorGlow();
      animRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => resizeCanvas();
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
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
