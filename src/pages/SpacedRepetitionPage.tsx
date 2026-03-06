import { useState } from 'react'
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition'
import { LeitnerBoxVisual } from '@/components/spaced-repetition/LeitnerBoxVisual'
import { ReviewQueue } from '@/components/spaced-repetition/ReviewQueue'
import { SpacedRepetitionQuiz } from '@/components/spaced-repetition/SpacedRepetitionQuiz'
import type { LeitnerCard } from '@/types/spaced-repetition'

type PageState = 'overview' | 'quiz' | 'complete'

export function SpacedRepetitionPage() {
  const { getDueCards, getNewCards, reviewCard, getBoxCounts, getSessionStats, resetDeck } =
    useSpacedRepetition()

  const [pageState, setPageState] = useState<PageState>('overview')
  const [sessionCards, setSessionCards] = useState<LeitnerCard[]>([])
  const [sessionResult, setSessionResult] = useState({ correct: 0, total: 0 })

  const boxCounts = getBoxCounts()
  const dueCards = getDueCards()
  const newCards = getNewCards(10)
  const stats = getSessionStats()

  const handleStartSession = () => {
    const due = getDueCards()
    const newC = getNewCards(Math.max(0, 10 - due.length))
    const combined = [...due, ...newC]

    if (combined.length === 0) {
      setPageState('complete')
      return
    }

    setSessionCards(combined)
    setSessionResult({ correct: 0, total: 0 })
    setPageState('quiz')
  }

  const handleAnswer = (_hand: string, correct: boolean) => {
    reviewCard(_hand, correct)
    setSessionResult(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  const handleComplete = () => {
    setPageState('complete')
  }

  if (pageState === 'quiz') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">간격 반복 학습</h1>
        <SpacedRepetitionQuiz
          cards={sessionCards}
          boxCounts={getBoxCounts()}
          onAnswer={handleAnswer}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  if (pageState === 'complete') {
    const accuracy =
      sessionResult.total > 0
        ? Math.round((sessionResult.correct / sessionResult.total) * 100)
        : 0

    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">세션 완료!</h1>
        <p className="text-gray-400 mb-8">오늘의 학습이 끝났습니다</p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">총 문제</p>
              <p className="text-white text-2xl font-bold">{sessionResult.total}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">정답</p>
              <p className="text-green-400 text-2xl font-bold">{sessionResult.correct}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">정확도</p>
              <p className="text-blue-400 text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
        </div>

        <LeitnerBoxVisual boxCounts={getBoxCounts()} />

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setPageState('overview')}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            개요로 돌아가기
          </button>
          {getDueCards().length > 0 && (
            <button
              onClick={handleStartSession}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              계속 학습
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">간격 반복 학습</h1>
        <button
          onClick={resetDeck}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          초기화
        </button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: '오늘 복습', value: stats.dueCount, color: 'text-red-400' },
          { label: '새 카드', value: stats.newCount, color: 'text-blue-400' },
          { label: '총 시도', value: stats.totalReviewed, color: 'text-white' },
          { label: '정확도', value: `${stats.accuracy}%`, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 rounded-lg p-3 border border-gray-700 text-center">
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Leitner boxes */}
      <div className="mb-6">
        <LeitnerBoxVisual boxCounts={boxCounts} />
      </div>

      {/* Review queue */}
      <div className="mb-6">
        <ReviewQueue dueCards={dueCards} newCards={newCards} />
      </div>

      {/* Start button */}
      <button
        onClick={handleStartSession}
        disabled={dueCards.length === 0 && newCards.length === 0}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl text-lg transition-colors"
      >
        {dueCards.length + newCards.length > 0
          ? `학습 시작 (${dueCards.length + newCards.length}개)`
          : '오늘 학습 완료'}
      </button>
    </div>
  )
}
