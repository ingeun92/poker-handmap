import { useState, useCallback, useEffect } from 'react'
import type { Hand } from '@/types/hand'
import { getRandomHandPair, compareHands } from '@/utils/hand-utils'
import { HAND_STRENGTHS } from '@/data/hands'
import { getTierColor, getTierLabel } from '@/utils/color-utils'

type Difficulty = 'easy' | 'medium' | 'hard'

interface HandCompareQuizProps {
  difficulty: Difficulty
  onComplete?: (correct: number, total: number) => void
}

interface RoundState {
  handA: Hand
  handB: Hand
  selected: 'A' | 'B' | null
  correctChoice: 'A' | 'B'
}

const TOTAL_QUESTIONS = 10

function buildRound(difficulty: Difficulty): RoundState {
  const [hA, hB] = getRandomHandPair(difficulty)
  const comp = compareHands(hA.name, hB.name)
  const correctChoice: 'A' | 'B' = comp >= 0 ? 'A' : 'B'
  return { handA: hA, handB: hB, selected: null, correctChoice }
}

export function HandCompareQuiz({ difficulty, onComplete }: HandCompareQuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [round, setRound] = useState<RoundState>(() => buildRound(difficulty))
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setRound(buildRound(difficulty))
    setQuestionIndex(0)
    setCorrectCount(0)
    setStreak(0)
    setMaxStreak(0)
    setFinished(false)
  }, [difficulty])

  const handleSelect = useCallback((choice: 'A' | 'B') => {
    if (round.selected !== null || finished) return
    const isCorrect = choice === round.correctChoice
    const newStreak = isCorrect ? streak + 1 : 0
    const newMaxStreak = Math.max(maxStreak, newStreak)
    const newCorrect = isCorrect ? correctCount + 1 : correctCount
    const newIndex = questionIndex + 1

    setRound(prev => ({ ...prev, selected: choice }))
    setStreak(newStreak)
    setMaxStreak(newMaxStreak)
    setCorrectCount(newCorrect)

    setTimeout(() => {
      if (newIndex >= TOTAL_QUESTIONS) {
        setFinished(true)
        setQuestionIndex(newIndex)
        onComplete?.(newCorrect, TOTAL_QUESTIONS)
      } else {
        setQuestionIndex(newIndex)
        setRound(buildRound(difficulty))
      }
    }, 1000)
  }, [round, finished, streak, maxStreak, correctCount, questionIndex, difficulty, onComplete])

  const handleRestart = useCallback(() => {
    setRound(buildRound(difficulty))
    setQuestionIndex(0)
    setCorrectCount(0)
    setStreak(0)
    setMaxStreak(0)
    setFinished(false)
  }, [difficulty])

  if (finished) {
    const accuracy = Math.round((correctCount / TOTAL_QUESTIONS) * 100)
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">
          {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">라운드 완료!</h2>
        <div className="flex justify-center gap-6 mt-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-xs text-gray-500">정확도</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{correctCount}</div>
            <div className="text-xs text-gray-500">정답</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{maxStreak}</div>
            <div className="text-xs text-gray-500">최대 연속</div>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          다시 하기
        </button>
      </div>
    )
  }

  const { handA, handB, selected, correctChoice } = round
  const strengthA = HAND_STRENGTHS[handA.name]
  const strengthB = HAND_STRENGTHS[handB.name]

  return (
    <div>
      {/* 진행상황 */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-500">{questionIndex + 1} / {TOTAL_QUESTIONS}</span>
        {streak >= 2 && (
          <span className="bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full text-xs">
            연속 정답 {streak}회 🔥
          </span>
        )}
        <span className="text-green-600 font-medium">정답 {correctCount}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all"
          style={{ width: `${(questionIndex / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      <p className="text-center text-gray-600 mb-4 font-medium">더 강한 핸드를 선택하세요</p>

      {/* 핸드 카드 */}
      <div className="grid grid-cols-2 gap-4">
        {(['A', 'B'] as const).map(side => {
          const hand = side === 'A' ? handA : handB
          const strength = side === 'A' ? strengthA : strengthB
          const isSelected = selected === side
          const isCorrect = selected !== null && side === correctChoice
          const isWrong = isSelected && side !== correctChoice

          return (
            <button
              key={side}
              onClick={() => handleSelect(side)}
              disabled={selected !== null}
              className={[
                'p-6 rounded-2xl border-2 transition-all text-center',
                selected === null && 'hover:border-blue-400 hover:shadow-md cursor-pointer',
                selected === null && 'border-gray-200 bg-white',
                isCorrect && 'border-green-500 bg-green-50',
                isWrong && 'border-red-400 bg-red-50',
                !isSelected && selected !== null && side !== correctChoice && 'border-gray-200 bg-white opacity-60',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">{hand.name}</div>
              {selected !== null && strength && (
                <div className="mt-1">
                  <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${getTierColor(strength.tier)}`}>
                    {getTierLabel(strength.tier)} · 랭킹 #{strength.numericRank}
                  </div>
                </div>
              )}
              {isCorrect && <div className="mt-2 text-green-600 font-semibold text-sm">정답</div>}
              {isWrong && <div className="mt-2 text-red-500 font-semibold text-sm">오답</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
