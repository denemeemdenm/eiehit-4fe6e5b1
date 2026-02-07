import { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface ImageCardProps {
  image: string;
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  tiltIntensity?: number;
}

export default function ImageCard({ image, title, description, className = '', onClick, children, tiltIntensity = 8 }: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const rotateX = useSpring(0, { stiffness: 260, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 20 });
  const scale = useSpring(1, { stiffness: 260, damping: 20 });

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
      scale.set(1.04);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
    });
  }, [tiltIntensity, rotateX, rotateY, scale]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setIsHovered(false);
  }, [rotateX, rotateY, scale]);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        perspective: 800,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-rest)',
        willChange: 'transform',
        minHeight: '220px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
    >
      {/* Background image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Progressive blur overlay - bottom to top */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.05) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[3]"
        style={{
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          mask: 'linear-gradient(to top, black 0%, black 30%, transparent 60%)',
          WebkitMask: 'linear-gradient(to top, black 0%, black 30%, transparent 60%)',
        }}
      />

      {/* Specular highlight */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-[6] opacity-60"
          style={{
            background: `radial-gradient(ellipse 250px 180px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.25), transparent 70%)`,
          }}
        />
      )}

      {/* Content overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] p-6">
        <h3 className="font-semibold text-base text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-white/70 leading-relaxed">{description}</p>
        )}
        {children}
      </div>
    </motion.div>
  );
}
