export interface Flashcard {
  id: string;
  front: string;
  back: string;
  courseId: string;
  unitId: string;
}

export interface Unit {
  id: string;
  courseId: string;
  name: string;
  order: number;
}

export interface Course {
  id: string;
  name: string;
  emoji: string;
  order: number;
}

// SM-2 spaced repetition data per card
export interface CardProgress {
  cardId: string;
  easeFactor: number;    // starts at 2.5
  interval: number;      // days
  repetitions: number;
  nextReviewDate: string; // ISO date
  lapses: number;
  starred: boolean;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0=blackout, 1=incorrect, 2=difficult, 3=hard, 4=good, 5=easy

export interface StudySession {
  date: string;
  cardsStudied: number;
  timeSpentSeconds: number;
  courseId?: string;
}

export interface DailyStats {
  date: string;
  cardsStudied: number;
  timeSpentSeconds: number;
}
