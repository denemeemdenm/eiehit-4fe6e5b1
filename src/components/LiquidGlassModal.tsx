import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiquidGlassPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

export default function LiquidGlassModal({ isOpen, onClose, anchorRef }: LiquidGlassPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // ESC key + click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          className="absolute top-full right-0 mt-2 z-[100] w-[260px]"
          style={{ borderRadius: '16px' }}
          initial={{ opacity: 0, y: -6, scale: 0.96, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, scale: 0.96, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
        >
          {/* Glass surface */}
          <div
            className="relative p-8 text-center overflow-hidden"
            style={{
              borderRadius: '16px',
              background: 'hsla(0 0% 100% / 0.12)',
              backdropFilter: 'blur(80px) saturate(200%)',
              WebkitBackdropFilter: 'blur(80px) saturate(200%)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {/* Noise/grain texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[inherit]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px',
              }}
            />

            {/* Top shine */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[inherit]"
              style={{ background: 'linear-gradient(180deg, hsla(0 0% 100% / 0.18) 0%, transparent 100%)' }}
            />

            {/* Rim light border */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{
                padding: '0.5px',
                background: 'linear-gradient(180deg, hsla(0 0% 100% / 0.35) 0%, hsla(0 0% 100% / 0.08) 40%, hsla(0 0% 100% / 0.15) 100%)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor' as any,
              }}
            />

            {/* Arrow/notch pointing up */}
            <div className="absolute -top-[6px] right-6 w-3 h-3 rotate-45" style={{
              background: 'hsla(0 0% 100% / 0.12)',
              backdropFilter: 'blur(80px)',
              WebkitBackdropFilter: 'blur(80px)',
              borderTop: '0.5px solid hsla(0 0% 100% / 0.3)',
              borderLeft: '0.5px solid hsla(0 0% 100% / 0.3)',
            }} />

            {/* Content */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3 }}
            >
              <div className="text-3xl mb-3">🚀</div>
              <h3
                className="text-lg font-bold mb-1.5 text-white"
                style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}
              >
                Çok Yakında!
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                HiT platformu üzerinde çalışmalar devam etmektedir.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
