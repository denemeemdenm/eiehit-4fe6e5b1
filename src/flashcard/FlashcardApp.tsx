import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
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

export default function FlashcardApp({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<FCView>({ type: 'home' });
  const [history, setHistory] = useState<FCView[]>([]);
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
      onClose();
    }
  };

  const goHome = () => {
    setHistory([]);
    setView({ type: 'home' });
  };

  const showNav = view.type !== 'study' && view.type !== 'spaced';

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: isDark ? 'hsl(0 0% 0%)' : 'hsl(0 0% 96%)' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
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
