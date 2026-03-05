import { CardProgress, ReviewQuality } from './types';

export function reviewCard(progress: CardProgress, quality: ReviewQuality): CardProgress {
  let { easeFactor, interval, repetitions, lapses } = progress;

  // SM-2 formula
  const newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, newEF);

  if (quality >= 3) {
    // Successful
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);

    // Easy bonus
    if (quality === 5) interval = Math.round(interval * 1.3);
  } else {
    // Failed - reset
    repetitions = 0;
    interval = quality === 0 ? 0 : 1; // 0 = show again today
    lapses += 1;
  }

  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + interval);

  return {
    ...progress,
    easeFactor,
    interval,
    repetitions,
    lapses,
    nextReviewDate: next.toISOString().split('T')[0],
  };
}

export function getIntervalLabel(progress: CardProgress, quality: ReviewQuality): string {
  const result = reviewCard(progress, quality);
  if (result.interval === 0) return '<1 dk';
  if (result.interval === 1) return '1 gün';
  return `${result.interval} gün`;
}

export function isDueToday(progress: CardProgress): boolean {
  const today = new Date().toISOString().split('T')[0];
  return progress.nextReviewDate <= today;
}
