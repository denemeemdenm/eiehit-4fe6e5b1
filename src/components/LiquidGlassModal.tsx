import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiquidGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiquidGlassModal({ isOpen, onClose }: LiquidGlassModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key + scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop: dim + blur */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'hsla(0 0% 0% / 0.4)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            }}
            onClick={onClose}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-[300px] max-w-[85vw] overflow-hidden"
            style={{ borderRadius: '20px' }}
            initial={{ scale: 0.92, opacity: 0, filter: 'blur(12px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0.92, opacity: 0, filter: 'blur(12px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
          >
            {/* Glass surface */}
            <div
              className="relative p-10 text-center"
              style={{
                background: 'hsla(0 0% 100% / 0.12)',
                backdropFilter: 'blur(80px) saturate(200%)',
                WebkitBackdropFilter: 'blur(80px) saturate(200%)',
              }}
            >
              {/* Noise/grain texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[inherit]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '128px',
                }}
              />

              {/* Top shine / glass reflection */}
              <div
                className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[inherit]"
                style={{
                  background: 'linear-gradient(180deg, hsla(0 0% 100% / 0.18) 0%, hsla(0 0% 100% / 0.04) 60%, transparent 100%)',
                }}
              />

              {/* Rim light border */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[inherit]"
                style={{
                  padding: '0.5px',
                  background: `linear-gradient(
                    180deg,
                    hsla(0 0% 100% / 0.35) 0%,
                    hsla(0 0% 100% / 0.12) 30%,
                    hsla(0 0% 100% / 0.04) 60%,
                    hsla(0 0% 100% / 0.15) 100%
                  )`,
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor' as any,
                }}
              />

              {/* Content */}
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className="text-4xl mb-4">🚀</div>
                <h3
                  className="text-xl font-bold mb-2 text-white"
                  style={{ fontFamily: "'EKiN Pro Max Diyakritik', sans-serif" }}
                >
                  Çok Yakında!
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  HiT platformu üzerinde çalışmalar devam etmektedir.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
