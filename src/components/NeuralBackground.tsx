import { useEffect, useRef } from 'react';

interface Node {
  x: number; y: number; vx: number; vy: number; radius: number;
  color: string; baseRadius: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const trailRef = useRef<{ x: number; y: number; alpha: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#00CCFF', '#FF4B00', '#FFCC00'];
    const nodeCount = Math.min(100, Math.floor(window.innerWidth / 16));

    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      baseRadius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const maxDist = 180;
      const mouseRadius = 250;
      const trail = trailRef.current;

      // Update cursor trail
      if (mouse.x > 0 && mouse.y > 0) {
        trail.push({ x: mouse.x, y: mouse.y, alpha: 0.5 });
        if (trail.length > 20) trail.shift();
      }

      // Draw cursor trail — subtle gold glow
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        t.alpha *= 0.88;
        if (t.alpha < 0.01) { trail.splice(i, 1); i--; continue; }
        const r = 4 + (1 - t.alpha / 0.5) * 12;
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
        grad.addColorStop(0, `rgba(255, 204, 0, ${t.alpha * 0.6})`);
        grad.addColorStop(0.5, `rgba(255, 180, 0, ${t.alpha * 0.2})`);
        grad.addColorStop(1, `rgba(255, 160, 0, 0)`);
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw subtle gold glow at cursor
      if (mouse.x > 0) {
        const cg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 30);
        cg.addColorStop(0, 'rgba(255, 204, 0, 0.25)');
        cg.addColorStop(0.6, 'rgba(255, 180, 0, 0.06)');
        cg.addColorStop(1, 'rgba(255, 160, 0, 0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Mouse attraction — nodes gravitate toward cursor
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 1) {
          const force = (mouseRadius - dist) / mouseRadius * 0.015;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
          // Grow slightly near cursor
          node.radius = node.baseRadius + (1 - dist / mouseRadius) * 1.5;
        } else {
          node.radius += (node.baseRadius - node.radius) * 0.05;
        }

        // Damping
        node.vx *= 0.995;
        node.vy *= 0.995;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '70';
        ctx.fill();
      }

      // Draw neural connections — stronger when near cursor
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const mouseDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
            const mouseBoost = mouseDist < mouseRadius ? (1 - mouseDist / mouseRadius) * 0.2 : 0;
            const alpha = (1 - dist / maxDist) * 0.12 + mouseBoost;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 204, 255, ${Math.min(alpha, 0.35)})`;
            ctx.lineWidth = 0.5 + mouseBoost * 2;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
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
