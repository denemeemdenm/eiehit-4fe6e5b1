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

  const springConfig = { stiffness: 150, damping: 26, mass: 1 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, { stiffness: 200, damping: 28, mass: 0.8 });

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
      scale.set(1.02);
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
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        className={`relative cursor-pointer group ${className}`}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          minHeight: '240px',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onClick={onClick}
        whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      >
        {/* Clip wrapper — isolates overflow:hidden + borderRadius from 3D transform */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            overflow: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          {/* Background image */}
          {image ? (
            <>
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              {/* Dark gradient at bottom for text readability */}
              <div
                className="absolute inset-0 z-[3] pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 35%, transparent 60%)',
                }}
              />
              {/* Progressive blur layer */}
              <div
                className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none"
                style={{
                  height: '40%',
                  backdropFilter: 'blur(25px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                  mask: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
                  WebkitMask: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
                  transform: 'translateZ(0)',
                  willChange: 'backdrop-filter',
                }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: 'hsla(var(--glass-bg))',
                backdropFilter: 'blur(25px) saturate(200%)',
                WebkitBackdropFilter: 'blur(25px) saturate(200%)',
              }}
            />
          )}

          {/* Specular highlight */}
          <div
            className="absolute inset-0 pointer-events-none z-[6] transition-opacity duration-500"
            style={{
              opacity: isHovered ? 0.4 : 0,
              background: `radial-gradient(ellipse 300px 220px at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.2), transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-[5] p-6">
            <h3
              className="font-semibold text-base mb-1 text-white"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.4)' }}
            >
              {title}
            </h3>
            {description && (
              <p
                className="text-sm leading-relaxed text-white/85"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
              >
                {description}
              </p>
            )}
            {children}
          </div>
        </div>

        {/* Border glow — outside the clip wrapper so it doesn't get clipped */}
        <div
          className="absolute inset-0 pointer-events-none z-[7] transition-opacity duration-500"
          style={{
            borderRadius: 20,
            opacity: isHovered ? 1 : 0,
            boxShadow: `inset 0 0 0 1.125px hsla(0, 0%, 100%, 0.1), 0 20px 50px hsla(0, 0%, 0%, 0.25)`,
          }}
        />

        {/* Invisible spacer to maintain height */}
        <div style={{ minHeight: '240px', borderRadius: 20 }} />
      </motion.div>
    </div>
  );
}
