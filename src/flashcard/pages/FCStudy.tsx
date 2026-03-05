import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Star, Shuffle, RotateCcw } from 'lucide-react';
import { getCardsByCourse, getCardsByUnit } from '../data';
import { toggleStar, isStarred, addSession } from '../store';
import { useTheme } from '@/hooks/useTheme';
import GlassPanel from '../components/GlassPanel';
import GlassProgress from '../components/GlassProgress';
import type { FCView } from '../FlashcardApp';

interface Props {
  courseId: string;
  unitId?: string;
  starredOnly?: boolean;
  onClose: () => void;
  navigate: (v: FCView) => void;
}

export default function FCStudy({ courseId, unitId, starredOnly, onClose, navigate }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const allCards = useMemo(() => {
    let cards = unitId ? getCardsByUnit(unitId) : getCardsByCourse(courseId);
    if (starredOnly) cards = cards.filter(c => isStarred(c.id));
    return cards;
  }, [courseId, unitId, starredOnly]);

  const [cards, setCards] = useState(allCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set(allCards.filter(c => isStarred(c.id)).map(c => c.id)));
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());

  const card = cards[index];
  const progress = cards.length > 0 ? ((index) / cards.length) * 100 : 0;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const leftGlow = useTransform(x, [-200, 0], [0.5, 0]);
  const rightGlow = useTransform(x, [0, 200], [0, 0.5]);

  const handleNext = useCallback((direction: 'known' | 'unknown') => {
    if (!card) return;
    if (direction === 'known') setKnown(p => [...p, card.id]);
    else setUnknown(p => [...p, card.id]);

    if (index >= cards.length - 1) {
      setDone(true);
      addSession({
        date: new Date().toISOString().split('T')[0],
        cardsStudied: cards.length,
        timeSpentSeconds: Math.round((Date.now() - startTime.current) / 1000),
        courseId,
      });
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
    }
  }, [card, index, cards.length, courseId]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80) {
      handleNext(info.offset.x > 0 ? 'known' : 'unknown');
    }
  };

  const handleStar = () => {
    if (!card) return;
    const newState = toggleStar(card.id);
    setStarredIds(prev => {
      const s = new Set(prev);
      if (newState) s.add(card.id);
      else s.delete(card.id);
      return s;
    });
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  };

  const handleReset = () => {
    setCards(allCards);
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
    startTime.current = Date.now();
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 pt-20">
        <p className="text-lg font-medium mb-4" style={{ color: isDark ? '#fff' : '#000' }}>Kart bulunamadı</p>
        <button onClick={onClose} className="text-sm" style={{ color: 'hsl(var(--primary))' }}>Geri dön</button>
      </div>
    );
  }

  if (done) {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[80vh] px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <span className="text-5xl mb-4">🎉</span>
        <h2 className="text-xl font-bold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>Tebrikler!</h2>
        <GlassPanel className="w-full max-w-sm">
          <div className="p-5 space-y-3">
            <Row label="✅ Bilinen" value={`${known.length} (%${cards.length ? Math.round(known.length / cards.length * 100) : 0})`} isDark={isDark} />
            <Row label="❌ Bilinmeyen" value={`${unknown.length} (%${cards.length ? Math.round(unknown.length / cards.length * 100) : 0})`} isDark={isDark} />
            <Row label="⭐ Yıldızlanan" value={`${starredIds.size}`} isDark={isDark} />
            <Row label="⏱️ Süre" value={`${mins}:${secs.toString().padStart(2, '0')}`} isDark={isDark} />
          </div>
        </GlassPanel>
        <div className="flex flex-col gap-3 mt-6 w-full max-w-sm">
          {unknown.length > 0 && (
            <motion.button
              className="w-full py-3 rounded-2xl font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))', color: '#000' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const unknownCards = cards.filter(c => unknown.includes(c.id));
                setCards(unknownCards);
                setIndex(0);
                setFlipped(false);
                setKnown([]);
                setUnknown([]);
                setDone(false);
                startTime.current = Date.now();
              }}
            >
              Bilinmeyenleri Tekrar Çalış
            </motion.button>
          )}
          <motion.button
            className="w-full py-3 rounded-2xl font-medium text-sm"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
          >
            Geri Dön
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-[100dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <button onClick={onClose}>
          <X size={22} style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }} />
        </button>
        <span className="text-sm font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          {index + 1}/{cards.length}
        </span>
        <div style={{ width: 22 }} />
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <GlassProgress value={progress} />
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Swipe glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 0% 50%, rgba(255,75,0,0.15), transparent 50%)',
            opacity: leftGlow,
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 100% 50%, rgba(100,255,255,0.15), transparent 50%)',
            opacity: rightGlow,
          }}
        />

        <motion.div
          className="w-full max-w-sm cursor-grab active:cursor-grabbing"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          onClick={() => setFlipped(f => !f)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${card.id}-${flipped}`}
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <GlassPanel>
                <div className="p-8 min-h-[280px] flex flex-col items-center justify-center text-center">
                  <p
                    className="text-base font-medium leading-relaxed whitespace-pre-line"
                    style={{ color: isDark ? '#fff' : '#000' }}
                  >
                    {flipped ? card.back : card.front}
                  </p>
                  {!flipped && index === 0 && (
                    <p className="text-xs mt-6" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }}>
                      Çevirmek için dokun
                    </p>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-8 py-6 px-4">
        <button onClick={handleStar} className="flex flex-col items-center gap-1">
          <Star
            size={22}
            style={{
              color: starredIds.has(card?.id) ? 'hsl(var(--accent))' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
              fill: starredIds.has(card?.id) ? 'hsl(var(--accent))' : 'transparent',
            }}
          />
          <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}>Yıldızla</span>
        </button>
        <button onClick={handleShuffle} className="flex flex-col items-center gap-1">
          <Shuffle size={22} style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }} />
          <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}>Karıştır</span>
        </button>
        <button onClick={handleReset} className="flex flex-col items-center gap-1">
          <RotateCcw size={22} style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }} />
          <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}>Başa dön</span>
        </button>
      </div>

      {/* Swipe hint */}
      <p className="text-center text-[10px] pb-4" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}>
        ← Bilmiyorum · Biliyorum →
      </p>
    </motion.div>
  );
}

function Row({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>{value}</span>
    </div>
  );
}
