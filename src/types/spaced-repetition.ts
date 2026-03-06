import type { HandName } from './hand'

export interface LeitnerCard {
  hand: HandName
  box: number           // 1-5
  nextReviewDate: number // timestamp ms
  correctStreak: number
  totalAttempts: number
  totalCorrect: number
}

export interface LeitnerState {
  cards: Record<HandName, LeitnerCard>
  lastSessionDate: number
}
