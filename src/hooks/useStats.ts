import { useMemo } from 'react'
import type { QuizResult, TestMode } from '@/types/quiz'
import type { HandName } from '@/types/hand'

const QUIZ_RESULTS_KEY = 'poker-handmap:quiz-results'

function loadResults(): QuizResult[] {
  try {
    const raw = window.localStorage.getItem(QUIZ_RESULTS_KEY)
    return raw ? (JSON.parse(raw) as QuizResult[]) : []
  } catch {
    return []
  }
}

function formatDate(ts: number): string {
  return new Date(ts).toISOString().split('T')[0] ?? ''
}

function getStartOfDay(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export interface StatsData {
  perHandAccuracy: Record<HandName, { correct: number; total: number }>
  perModeAccuracy: Record<TestMode, { correct: number; total: number }>
  dailyPractice: { date: string; count: number; accuracy: number }[]
  currentStreak: number
  longestStreak: number
  totalPracticeTime: number
  weakestHands: HandName[]
  strongestHands: HandName[]
  totalQuizzes: number
  overallAccuracy: number
  studyDays: number
}

export function useStats(): StatsData {
  const results = useMemo(() => loadResults(), [])

  return useMemo(() => {
    const perHandAccuracy: Record<HandName, { correct: number; total: number }> = {}
    const perModeAccuracy: Record<string, { correct: number; total: number }> = {}
    const dailyMap: Record<string, { count: number; correct: number }> = {}

    results.forEach(r => {
      // per hand
      if (!perHandAccuracy[r.hand]) {
        perHandAccuracy[r.hand] = { correct: 0, total: 0 }
      }
      perHandAccuracy[r.hand]!.total += 1
      if (r.correct) perHandAccuracy[r.hand]!.correct += 1

      // per mode
      if (!perModeAccuracy[r.mode]) {
        perModeAccuracy[r.mode] = { correct: 0, total: 0 }
      }
      perModeAccuracy[r.mode]!.total += 1
      if (r.correct) perModeAccuracy[r.mode]!.correct += 1

      // daily
      const date = formatDate(r.timestamp)
      if (!dailyMap[date]) {
        dailyMap[date] = { count: 0, correct: 0 }
      }
      dailyMap[date]!.count += 1
      if (r.correct) dailyMap[date]!.correct += 1
    })

    const dailyPractice = Object.entries(dailyMap)
      .map(([date, { count, correct }]) => ({
        date,
        count,
        accuracy: count > 0 ? Math.round((correct / count) * 100) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Streaks
    const practiceSet = new Set(dailyPractice.map(d => d.date))
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const today = getStartOfDay(new Date())
    for (let i = 0; i < 365; i++) {
      const d = new Date(today - i * 24 * 60 * 60 * 1000)
      const dateStr = formatDate(d.getTime())
      if (practiceSet.has(dateStr)) {
        if (i === 0 || currentStreak > 0) currentStreak++
        tempStreak++
        if (tempStreak > longestStreak) longestStreak = tempStreak
      } else {
        if (i === 0) currentStreak = 0
        tempStreak = 0
      }
    }

    // Weakest/strongest hands
    const handEntries = Object.entries(perHandAccuracy)
      .filter(([, v]) => v.total >= 3)
      .map(([hand, v]) => ({ hand: hand as HandName, accuracy: v.correct / v.total }))

    handEntries.sort((a, b) => a.accuracy - b.accuracy)
    const weakestHands = handEntries.slice(0, 10).map(e => e.hand)

    handEntries.sort((a, b) => b.accuracy - a.accuracy)
    const strongestHands = handEntries.slice(0, 10).map(e => e.hand)

    const totalQuizzes = results.length
    const totalCorrect = results.filter(r => r.correct).length
    const overallAccuracy = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuizzes) * 100) : 0

    // Estimated practice time (avg 3s per question)
    const totalPracticeTime = results.reduce((sum, r) => sum + (r.responseTimeMs ?? 3000), 0)

    return {
      perHandAccuracy,
      perModeAccuracy: perModeAccuracy as Record<TestMode, { correct: number; total: number }>,
      dailyPractice,
      currentStreak,
      longestStreak,
      totalPracticeTime,
      weakestHands,
      strongestHands,
      totalQuizzes,
      overallAccuracy,
      studyDays: practiceSet.size,
    }
  }, [results])
}
