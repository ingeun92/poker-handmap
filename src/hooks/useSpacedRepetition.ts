import { useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { LeitnerCard, LeitnerState } from '@/types/spaced-repetition'
import type { HandName } from '@/types/hand'
import { ALL_HANDS } from '@/data/hands'

const STORAGE_KEY = 'poker-handmap:leitner-state'

// Box intervals in days
const BOX_INTERVALS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
}

const MAX_NEW_CARDS_PER_SESSION = 10

function addDays(date: number, days: number): number {
  return date + days * 24 * 60 * 60 * 1000
}

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function initializeDeck(): LeitnerState {
  const now = Date.now()
  const cards: Record<HandName, LeitnerCard> = {}
  ALL_HANDS.forEach(hand => {
    cards[hand.name] = {
      hand: hand.name,
      box: 1,
      nextReviewDate: now,
      correctStreak: 0,
      totalAttempts: 0,
      totalCorrect: 0,
    }
  })
  return {
    cards,
    lastSessionDate: now,
  }
}

export function useSpacedRepetition() {
  const [state, setState] = useLocalStorage<LeitnerState>(STORAGE_KEY, initializeDeck())

  const getDueCards = useCallback((): LeitnerCard[] => {
    const now = Date.now()
    return Object.values(state.cards)
      .filter(card => card.totalAttempts > 0 && card.nextReviewDate <= now)
      .sort((a, b) => a.nextReviewDate - b.nextReviewDate)
  }, [state.cards])

  const getNewCards = useCallback(
    (limit: number = MAX_NEW_CARDS_PER_SESSION): LeitnerCard[] => {
      return Object.values(state.cards)
        .filter(card => card.totalAttempts === 0)
        .slice(0, limit)
    },
    [state.cards]
  )

  const reviewCard = useCallback(
    (hand: HandName, correct: boolean) => {
      setState(prev => {
        const card = prev.cards[hand]
        if (!card) return prev

        const now = Date.now()
        let newBox: number

        if (correct) {
          newBox = Math.min(card.box + 1, 5)
        } else {
          newBox = 1
        }

        const interval = BOX_INTERVALS[newBox] ?? 1
        const nextReview = addDays(now, interval)

        const updatedCard: LeitnerCard = {
          ...card,
          box: newBox,
          nextReviewDate: nextReview,
          correctStreak: correct ? card.correctStreak + 1 : 0,
          totalAttempts: card.totalAttempts + 1,
          totalCorrect: card.totalCorrect + (correct ? 1 : 0),
        }

        return {
          ...prev,
          cards: {
            ...prev.cards,
            [hand]: updatedCard,
          },
          lastSessionDate: now,
        }
      })
    },
    [setState]
  )

  const getBoxCounts = useCallback((): Record<number, number> => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    Object.values(state.cards).forEach(card => {
      counts[card.box] = (counts[card.box] ?? 0) + 1
    })
    return counts
  }, [state.cards])

  const getSessionStats = useCallback(() => {
    const todayStart = startOfDay(Date.now())
    const allCards = Object.values(state.cards)
    const todayCards = allCards.filter(
      card => card.totalAttempts > 0 && card.nextReviewDate >= todayStart
    )

    const totalReviewed = allCards.reduce((sum, c) => sum + c.totalAttempts, 0)
    const totalCorrect = allCards.reduce((sum, c) => sum + c.totalCorrect, 0)
    const accuracy = totalReviewed > 0 ? (totalCorrect / totalReviewed) * 100 : 0

    return {
      todayCount: todayCards.length,
      totalReviewed,
      accuracy: Math.round(accuracy),
      dueCount: getDueCards().length,
      newCount: getNewCards().length,
    }
  }, [state.cards, getDueCards, getNewCards])

  const resetDeck = useCallback(() => {
    setState(initializeDeck())
  }, [setState])

  return {
    state,
    getDueCards,
    getNewCards,
    reviewCard,
    getBoxCounts,
    getSessionStats,
    resetDeck,
  }
}
