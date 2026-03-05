import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import NeuralBackground from '@/components/NeuralBackground';
import FCHome from './pages/FCHome';
import FCCourseDetail from './pages/FCCourseDetail';
import FCStudy from './pages/FCStudy';
import FCSpacedRepetition from './pages/FCSpacedRepetition';
import FCStats from './pages/FCStats';
import { ArrowLeft, Home, BarChart3 } from 'lucide-react';

export type FCView =
  | { type: 'home' }
  | { type: 'course'; courseId: string }
  | { type: 'study'; courseId: string; unitId?: string; starredOnly?: boolean }
  | { type: 'spaced'; courseId: string }
  | { type: 'stats' };

interface FlashcardAppProps {
  onClose: () => void;
  originRect?: DOMRect | null;
}

export default function FlashcardApp({ onClose, originRect }: FlashcardAppProps) {
  const [view, setView] = useState<FCView>({ type: 'home' });
  const [history, setHistory] = useState<FCView[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navigate = (v: FCView) => {
    setHistory(prev => [...prev, view]);
    setView(v);
  };

  const goBack = () => {
    if (history.length > 0) {
      setView(history[history.length - 1]);
      setHistory(prev => prev.slice(0, -1));
    } else {
      handleClose();
    }
  };

  const goHome = () => {
    setHistory([]);
    setView({ type: 'home' });
  };

  const handleClose = () => {
    onClose();
  };

  const showNav = view.type !== 'study' && view.type !== 'spaced';

  // Calculate initial transform from origin rect
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const hasOrigin = !!originRect;
  const originX = hasOrigin ? originRect!.left + originRect!.width / 2 - vw / 2 : 0;
  const originY = hasOrigin ? originRect!.top + originRect!.height / 2 - vh / 2 : 0;
  const scaleX = hasOrigin ? originRect!.width / vw : 0.85;
  const scaleY = hasOrigin ? originRect!.height / vh : 0.85;
  const initialScale = Math.max(scaleX, scaleY, 0.03);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background: isDark ? 'hsl(0 0% 0%)' : 'hsl(0 0% 96%)',
      }}
      initial={{
        opacity: 0,
        scale: initialScale,
        x: originX,
        y: originY,
        borderRadius: hasOrigin ? 40 : 24,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        borderRadius: 0,
      }}
      exit={{
        opacity: 0,
        scale: initialScale,
        x: originX,
        y: originY,
        borderRadius: hasOrigin ? 40 : 24,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 32,
        mass: 0.8,
        opacity: { duration: 0.25 },
      }}
      onAnimationComplete={(def: any) => {
        // When exit animation completes
        if (isClosing && def?.opacity === 0) {
          onClose();
        }
      }}
    >
      {/* Overlay glow during morph */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[200]"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, hsla(180 100% 69% / 0.15), transparent 70%)'
            : 'radial-gradient(ellipse at center, hsla(0 0% 100% / 0.4), transparent 70%)',
        }}
      />

      <NeuralBackground />
      {/* Top bar */}
      {showNav && (
        <div
          className="flex items-center justify-between px-4 pt-3 pb-2 sticky top-0 z-50"
          style={{
            background: isDark ? 'hsla(0 0% 0% / 0.8)' : 'hsla(0 0% 96% / 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <button onClick={goBack} className="flex items-center gap-1 text-sm font-medium" style={{ color: 'hsl(var(--primary))' }}>
            <ArrowLeft size={18} />
            {view.type === 'home' ? 'Kapat' : 'Geri'}
          </button>
          <div className="flex items-center gap-3">
            {view.type !== 'home' && (
              <button onClick={goHome} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
                <Home size={20} />
              </button>
            )}
            <button onClick={() => navigate({ type: 'stats' })} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
              <BarChart3 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view.type === 'home' && <FCHome key="home" navigate={navigate} />}
          {view.type === 'course' && <FCCourseDetail key={`course-${view.courseId}`} courseId={view.courseId} navigate={navigate} />}
          {view.type === 'study' && <FCStudy key="study" courseId={view.courseId} unitId={view.unitId} starredOnly={view.starredOnly} onClose={goBack} navigate={navigate} />}
          {view.type === 'spaced' && <FCSpacedRepetition key="spaced" courseId={view.courseId} onClose={goBack} />}
          {view.type === 'stats' && <FCStats key="stats" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
