import { motion, AnimatePresence } from 'framer-motion';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className="pointer-events-auto text-center px-12 py-10 max-w-sm mx-4"
              style={{
                backdropFilter: 'blur(40px) saturate(1.8) brightness(1.1)',
                WebkitBackdropFilter: 'blur(40px) saturate(1.8) brightness(1.1)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderTop: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '24px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold mb-3 gradient-text-cyan">Çok Yakında!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bu özellik üzerinde çalışılmaktadır. En kısa sürede hizmetinize sunulacaktır.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                Tamam
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
