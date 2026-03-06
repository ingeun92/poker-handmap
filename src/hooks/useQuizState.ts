import { useState, useCallback } from 'react'
import type { HandName } from '@/types/hand'
import type { QuizResult, TestMode } from '@/types/quiz'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface QuizSessionState {
  isActive: boolean
  currentQuestionIndex: number
  totalQuestions: number
  correctCount: number
  history: QuizResult[]
  showFeedback: boolean
  mode: TestMode
}

interface UseQuizStateReturn {
  session: QuizSessionState
  history: QuizResult[]
  startQuiz: (mode: TestMode, totalQuestions: number) => void
  submitAnswer: (correct: boolean, hand: HandName, responseTimeMs: number) => void
  nextQuestion: () => void
  endQuiz: () => void
}

const initialSession: QuizSessionState = {
  isActive: false,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  correctCount: 0,
  history: [],
  showFeedback: false,
  mode: 'hand-compare',
}

export function useQuizState(): UseQuizStateReturn {
  const [session, setSession] = useState<QuizSessionState>(initialSession)
  const [history, setHistory] = useLocalStorage<QuizResult[]>('poker-handmap:quiz-history', [])

  const startQuiz = useCallback((mode: TestMode, totalQuestions: number) => {
    setSession({
      isActive: true,
      currentQuestionIndex: 0,
      totalQuestions,
      correctCount: 0,
      history: [],
      showFeedback: false,
      mode,
    })
  }, [])

  const submitAnswer = useCallback((correct: boolean, hand: HandName, responseTimeMs: number) => {
    setSession(prev => {
      const result: QuizResult = {
        hand,
        correct,
        timestamp: Date.now(),
        responseTimeMs,
        mode: prev.mode,
      }
      return {
        ...prev,
        correctCount: correct ? prev.correctCount + 1 : prev.correctCount,
        history: [...prev.history, result],
        showFeedback: true,
      }
    })
  }, [])

  const nextQuestion = useCallback(() => {
    setSession(prev => {
      if (prev.currentQuestionIndex + 1 >= prev.totalQuestions) {
        return { ...prev, isActive: false, showFeedback: false }
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
      }
    })
  }, [])

  const endQuiz = useCallback(() => {
    setSession(prev => {
      setHistory(prevHistory => [...prevHistory, ...prev.history])
      return { ...initialSession }
    })
  }, [setHistory])

  return { session, history, startQuiz, submitAnswer, nextQuestion, endQuiz }
}
