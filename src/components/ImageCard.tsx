import { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ImageCardProps {
  image: string;
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  tiltIntensity?: number;
}

export default function ImageCard({ image, title, description, className = '', onClick, children, tiltIntensity = 6 }: ImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  // tvOS 26: smooth, weighted spring physics
  const springConfig = { stiffness: 180, damping: 22, mass: 1.0 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 250, damping: 24, mass: 0.8 });
  const translateZ = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const percentX = (e.clientX - rect.left) / rect.width;
      const percentY = (e.clientY - rect.top) / rect.height;
      rotateY.set((percentX - 0.5) * tiltIntensity * 2);
      rotateX.set(-(percentY - 0.5) * tiltIntensity * 2);
      scale.set(1.04);
      translateZ.set(10);
      setSpecularPos({ x: percentX * 100, y: percentY * 100 });
    });
  }, [tiltIntensity, rotateX, rotateY, scale, translateZ]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    translateZ.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY, scale, translateZ]);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        z: translateZ,
        perspective: 1200,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered
          ? '0 20px 50px hsla(0,0%,0%,0.30), 0 0 0 0.5px hsla(0,0%,100%,0.06)'
          : 'var(--shadow-rest)',
        willChange: 'transform',
        minHeight: '240px',
        transition: 'box-shadow 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
    >
      {/* Background image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Progressive blur overlay */}
      <div className="absolute inset-0 z-[2]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.03) 80%, transparent 100%)' }}
      />
      <div className="absolute inset-0 z-[3]"
        style={{
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          mask: 'linear-gradient(to top, black 0%, black 20%, transparent 55%)',
          WebkitMask: 'linear-gradient(to top, black 0%, black 20%, transparent 55%)',
        }}
      />

      {/* Specular highlight — cursor-following tvOS glare */}
      <div
        className="absolute inset-0 pointer-events-none z-[6] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: `radial-gradient(ellipse 300px 220px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.22), transparent 70%)`,
        }}
      />

      {/* Hover rim light on border */}
      <div
        className="absolute inset-0 pointer-events-none z-[7] rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(ellipse 400px 300px at ${specularPos.x}% ${specularPos.y}%, hsla(0 0% 100% / 0.14), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '0.5px',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] p-6">
        <h3 className="font-semibold text-base text-white mb-1">{title}</h3>
        {description && <p className="text-sm text-white/70 leading-relaxed">{description}</p>}
        {children}
      </div>
    </motion.div>
  );
}
