import type { HandName } from './hand'

export type TestMode = 'grid-fill' | 'hand-compare' | 'category-sort' | 'spaced-repetition' | 'speed-quiz'

export interface QuizResult {
  hand: HandName
  correct: boolean
  timestamp: number
  responseTimeMs: number
  mode: TestMode
}
