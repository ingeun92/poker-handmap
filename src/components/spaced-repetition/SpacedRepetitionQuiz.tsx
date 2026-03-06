import { useState, useCallback } from 'react'
import type { LeitnerCard } from '@/types/spaced-repetition'
import type { StrengthTier } from '@/types/hand'
import { HAND_STRENGTHS } from '@/data/hands'
import { getTierColor, getTierLabel } from '@/utils/color-utils'
import { LeitnerBoxVisual } from './LeitnerBoxVisual'

interface SpacedRepetitionQuizProps {
  cards: LeitnerCard[]
  boxCounts: Record<number, number>
  onAnswer: (hand: string, correct: boolean) => void
  onComplete: () => void
}

type QuizPhase = 'question' | 'result'

const TIERS: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']

export function SpacedRepetitionQuiz({
  cards,
  boxCounts,
  onAnswer,
  onComplete,
}: SpacedRepetitionQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<QuizPhase>('question')
  const [selectedTier, setSelectedTier] = useState<StrengthTier | null>(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [animateBox, setAnimateBox] = useState<number | null>(null)

  const currentCard = cards[currentIndex]

  const handleSelectTier = useCallback(
    (tier: StrengthTier) => {
      if (phase !== 'question' || !currentCard) return

      const correctTier = HAND_STRENGTHS[currentCard.hand]?.tier
      const isCorrect = tier === correctTier

      setSelectedTier(tier)
      setPhase('result')
      onAnswer(currentCard.hand, isCorrect)
      setSessionTotal(prev => prev + 1)
      if (isCorrect) setSessionCorrect(prev => prev + 1)

      // Animate box change
      const newBox = isCorrect ? Math.min(currentCard.box + 1, 5) : 1
      setAnimateBox(newBox)
      setTimeout(() => setAnimateBox(null), 1000)
    },
    [phase, currentCard, onAnswer]
  )

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= cards.length) {
      onComplete()
    } else {
      setCurrentIndex(prev => prev + 1)
      setPhase('question')
      setSelectedTier(null)
    }
  }, [currentIndex, cards.length, onComplete])

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">학습할 카드가 없습니다</p>
      </div>
    )
  }

  const correctTier = HAND_STRENGTHS[currentCard.hand]?.tier
  const progress = ((currentIndex + 1) / cards.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>{currentIndex + 1} / {cards.length}</span>
          <span>정답 {sessionCorrect}/{sessionTotal}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Box indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">현재 위치:</span>
        <span className="bg-gray-700 text-white px-2 py-0.5 rounded font-medium">
          Box {currentCard.box}
        </span>
        <span className="text-gray-500 text-xs">
          (시도 {currentCard.totalAttempts}회, 정답 {currentCard.totalCorrect}회)
        </span>
      </div>

      {/* Hand card */}
      <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-600">
        <p className="text-gray-400 text-sm mb-3">이 핸드의 강도는?</p>
        <div className="text-6xl font-bold text-white mb-4">{currentCard.hand}</div>
        {currentCard.hand.endsWith('s') && (
          <p className="text-blue-400 text-sm">수티드 (Suited)</p>
        )}
        {currentCard.hand.endsWith('o') && (
          <p className="text-gray-400 text-sm">오프수트 (Offsuit)</p>
        )}
        {!currentCard.hand.endsWith('s') && !currentCard.hand.endsWith('o') && (
          <p className="text-yellow-400 text-sm">포켓 페어 (Pocket Pair)</p>
        )}
      </div>

      {/* Tier buttons */}
      <div className="grid grid-cols-1 gap-2">
        {TIERS.map(tier => {
          const isSelected = selectedTier === tier
          const isCorrectAnswer = phase === 'result' && tier === correctTier
          const isWrongAnswer = phase === 'result' && isSelected && tier !== correctTier

          let borderClass = 'border-gray-700 hover:border-gray-500'
          if (isCorrectAnswer) borderClass = 'border-green-500 bg-green-900/30'
          else if (isWrongAnswer) borderClass = 'border-red-500 bg-red-900/30'
          else if (isSelected) borderClass = 'border-blue-500'

          return (
            <button
              key={tier}
              onClick={() => handleSelectTier(tier)}
              disabled={phase === 'result'}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${borderClass} ${
                phase === 'question' ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${getTierColor(tier)}`} />
              <span className="text-white font-medium">{getTierLabel(tier)}</span>
              {isCorrectAnswer && <span className="ml-auto text-green-400 text-sm">정답</span>}
              {isWrongAnswer && <span className="ml-auto text-red-400 text-sm">오답</span>}
            </button>
          )
        })}
      </div>

      {/* Result feedback */}
      {phase === 'result' && (
        <div className="space-y-4">
          <div
            className={`text-center py-3 rounded-lg font-semibold ${
              selectedTier === correctTier
                ? 'bg-green-900/40 text-green-400 border border-green-700'
                : 'bg-red-900/40 text-red-400 border border-red-700'
            }`}
          >
            {selectedTier === correctTier ? (
              <span>정답! Box {Math.min(currentCard.box + 1, 5)}으로 이동</span>
            ) : (
              <span>오답. 정답은 {getTierLabel(correctTier ?? 'weak')}. Box 1로 이동</span>
            )}
          </div>

          <LeitnerBoxVisual boxCounts={boxCounts} activeBox={animateBox ?? undefined} />

          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            {currentIndex + 1 >= cards.length ? '완료' : '다음 카드'}
          </button>
        </div>
      )}
    </div>
  )
}
