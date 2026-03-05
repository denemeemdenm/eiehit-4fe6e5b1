import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { getCardsByCourse } from '../data';
import { getCardProgress, saveCardProgress, addSession } from '../store';
import { reviewCard, getIntervalLabel, isDueToday } from '../sm2';
import { useTheme } from '@/hooks/useTheme';
import GlassPanel from '../components/GlassPanel';
import type { ReviewQuality } from '../types';

interface Props {
  courseId: string;
  onClose: () => void;
}

export default function FCSpacedRepetition({ courseId, onClose }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const dueCards = useMemo(() => {
    return getCardsByCourse(courseId).filter(c => isDueToday(getCardProgress(c.id)));
  }, [courseId]);

  const [queue, setQueue] = useState(dueCards);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(0);
  const startTime = useRef(Date.now());
  const intervalRef = useRef<number>();

  // Timer
  useState(() => {
    intervalRef.current = window.setInterval(() => {
      setTimer(Math.round((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  });

  const card = queue[index];
  const progress = card ? getCardProgress(card.id) : null;

  const handleReview = useCallback((quality: ReviewQuality) => {
    if (!card) return;
    const p = getCardProgress(card.id);
    const updated = reviewCard(p, quality);
    saveCardProgress(updated);

    // If quality 0 (again), re-add to end of queue
    if (quality === 0) {
      setQueue(prev => [...prev, card]);
    }

    if (index >= queue.length - 1 && quality !== 0) {
      setDone(true);
      clearInterval(intervalRef.current);
      addSession({
        date: new Date().toISOString().split('T')[0],
        cardsStudied: queue.length,
        timeSpentSeconds: Math.round((Date.now() - startTime.current) / 1000),
        courseId,
      });
    } else {
      setIndex(i => i + 1);
      setShowAnswer(false);
    }
  }, [card, index, queue, courseId]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (queue.length === 0 || done) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-[80vh] px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="text-5xl mb-4">🎉</span>
        <h2 className="text-xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
          {queue.length === 0 ? 'Bekleyen kart yok!' : 'Oturum tamamlandı!'}
        </h2>
        <p className="text-sm mb-6" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
          {done ? `${queue.length} kart · ${formatTime(timer)}` : 'Harika iş çıkardınız!'}
        </p>
        <motion.button
          className="px-6 py-3 rounded-2xl font-semibold text-sm"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: isDark ? '#fff' : '#000' }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
        >
          Geri Dön
        </motion.button>
      </motion.div>
    );
  }

  const buttons: { quality: ReviewQuality; label: string; color: string; emoji: string }[] = progress ? [
    { quality: 0, label: getIntervalLabel(progress, 0), color: '#FF4B00', emoji: '🔴' },
    { quality: 3, label: getIntervalLabel(progress, 3), color: '#FFCC00', emoji: '🟡' },
    { quality: 4, label: getIntervalLabel(progress, 4), color: '#64FFFF', emoji: '🟢' },
    { quality: 5, label: getIntervalLabel(progress, 5), color: '#D7C3A5', emoji: '💎' },
  ] : [];

  const qualityLabels: Record<number, string> = { 0: 'Tekrar', 3: 'Zor', 4: 'İyi', 5: 'Kolay' };

  return (
    <motion.div className="flex flex-col h-[100dvh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <button onClick={onClose}>
          <X size={22} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }} />
        </button>
        <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          Aralıklı Tekrar
        </span>
        <div className="flex items-center gap-1" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>
          <Clock size={14} />
          <span className="text-xs">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mb-4">
        <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
          Kalan: {queue.length - index} kart
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${card.id}-${showAnswer}`}
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <GlassPanel>
              <div className="p-8 min-h-[260px] flex flex-col items-center justify-center text-center">
                <p className="text-base font-medium leading-relaxed whitespace-pre-line" style={{ color: isDark ? '#fff' : '#000' }}>
                  {showAnswer ? card.back : card.front}
                </p>
                {!showAnswer && (
                  <motion.button
                    className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAnswer(true)}
                  >
                    Cevabı Göster
                  </motion.button>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating buttons */}
      {showAnswer && (
        <motion.div
          className="px-4 pb-6 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-center mb-3" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
            Nasıl bildiniz?
          </p>
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
            {buttons.map(btn => (
              <motion.button
                key={btn.quality}
                className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
                  boxShadow: `0 2px 12px ${btn.color}22`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReview(btn.quality)}
              >
                <span>{btn.emoji}</span>
                <span style={{ color: btn.color }}>{qualityLabels[btn.quality]}</span>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>{btn.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
