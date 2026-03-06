import { useState, useCallback, useEffect } from 'react'
import type { StrengthTier } from '@/types/hand'
import { HAND_STRENGTHS, ALL_HANDS } from '@/data/hands'
import { getTierColor, getTierLabel } from '@/utils/color-utils'
import { useTimer } from '@/hooks/useTimer'
import { SpeedTimer } from './SpeedTimer'

interface QuestionRecord {
  hand: string
  selected: StrengthTier
  correct: StrengthTier
  isCorrect: boolean
  responseTimeMs: number
}

interface SpeedQuizProps {
  duration: number
  onComplete: (records: QuestionRecord[], score: number) => void
}

const TIERS: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']

function getRandomHand() {
  const idx = Math.floor(Math.random() * ALL_HANDS.length)
  return ALL_HANDS[idx]!
}

export function SpeedQuiz({ duration, onComplete }: SpeedQuizProps) {
  const [currentHand, setCurrentHand] = useState(() => getRandomHand())
  const [score, setScore] = useState(0)
  const [records, setRecords] = useState<QuestionRecord[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [streak, setStreak] = useState(0)

  const handleTimeUp = useCallback(() => {
    onComplete(records, score)
  }, [records, score, onComplete])

  const { timeLeft, isRunning, start } = useTimer(duration, { onTimeUp: handleTimeUp })

  useEffect(() => {
    start()
    setQuestionStartTime(Date.now())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTier = useCallback(
    (tier: StrengthTier) => {
      if (!isRunning) return

      const correctTier = HAND_STRENGTHS[currentHand.name]?.tier ?? 'weak'
      const isCorrect = tier === correctTier
      const responseTimeMs = Date.now() - questionStartTime

      const record: QuestionRecord = {
        hand: currentHand.name,
        selected: tier,
        correct: correctTier,
        isCorrect,
        responseTimeMs,
      }

      setRecords(prev => [...prev, record])
      setFeedback(isCorrect ? 'correct' : 'incorrect')

      if (isCorrect) {
        setScore(prev => prev + 1)
        setStreak(prev => prev + 1)
      } else {
        setStreak(0)
      }

      setTimeout(() => {
        setFeedback(null)
        setCurrentHand(getRandomHand())
        setQuestionStartTime(Date.now())
      }, 300)
    },
    [isRunning, currentHand, questionStartTime]
  )

  const answered = records.length
  const correct = records.filter(r => r.isCorrect).length
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs">점수</p>
            <p className="text-white text-xl font-bold">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">정확도</p>
            <p className="text-green-400 text-xl font-bold">{accuracy}%</p>
          </div>
          {streak >= 3 && (
            <div className="text-center">
              <p className="text-gray-400 text-xs">연속</p>
              <p className="text-yellow-400 text-xl font-bold">{streak}🔥</p>
            </div>
          )}
        </div>

        <SpeedTimer timeLeft={timeLeft} duration={duration} />
      </div>

      {/* Hand display with feedback */}
      <div
        className={`bg-gray-800 rounded-2xl p-8 text-center border-2 transition-colors duration-200 ${
          feedback === 'correct'
            ? 'border-green-500 bg-green-900/20'
            : feedback === 'incorrect'
              ? 'border-red-500 bg-red-900/20'
              : 'border-gray-600'
        }`}
      >
        <div className="text-6xl font-bold text-white mb-2">{currentHand.name}</div>

        {feedback && (
          <div
            className={`mt-3 font-bold text-lg ${
              feedback === 'correct' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {feedback === 'correct' ? '정답!' : '오답!'}
          </div>
        )}
      </div>

      {/* Tier buttons */}
      <div className="grid grid-cols-1 gap-2">
        {TIERS.map(tier => (
          <button
            key={tier}
            onClick={() => handleSelectTier(tier)}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition-all active:scale-95"
          >
            <span className={`w-3 h-3 rounded-full ${getTierColor(tier)}`} />
            <span className="text-white font-medium">{getTierLabel(tier)}</span>
          </button>
        ))}
      </div>

      {/* Progress */}
      <p className="text-center text-gray-500 text-sm">{answered}문제 완료</p>
    </div>
  )
}
