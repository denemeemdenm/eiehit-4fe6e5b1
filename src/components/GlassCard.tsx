import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
}

export default function GlassCard({ children, className = '', onClick, tiltIntensity = 8 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const rotateX = useSpring(0, { stiffness: 260, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 22 });
  const scale = useSpring(1, { stiffness: 260, damping: 22 });
  const translateZ = useSpring(0, { stiffness: 260, damping: 22 });
  const borderAngle = useMotionValue(135);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = x / rect.width;
      const percentY = y / rect.height;
      rotateY.set((percentX - 0.5) * tiltIntensity * 2);
      rotateX.set(-(percentY - 0.5) * tiltIntensity * 2);
      scale.set(1.02);
      translateZ.set(8);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
      borderAngle.set(Math.atan2(percentY - 0.5, percentX - 0.5) * (180 / Math.PI) + 180);
    });
  }, [tiltIntensity, rotateX, rotateY, scale, translateZ, borderAngle]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    translateZ.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY, scale, translateZ]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        z: translateZ,
        perspective: 800,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered
          ? '0 20px 50px hsla(0,0%,0%,0.35), 0 0 0 1px hsla(0,0%,100%,0.06), inset 0 1px 0 hsla(0,0%,100%,0.08)'
          : 'var(--shadow-rest)',
        willChange: 'transform',
        transition: 'box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
    >
      {/* Border glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-20 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 350px 250px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.22), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 280px 200px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.18), transparent 70%)`,
        }}
      />

      <div className="relative z-[5]">{children}</div>
    </motion.div>
  );
}
