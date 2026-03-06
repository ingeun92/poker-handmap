import { useState, useMemo, useCallback } from 'react'
import type { Hand, ActionCategory } from '@/types/hand'
import { RANKS } from '@/types/hand'
import { HAND_GRID, HAND_STRENGTHS, ALL_HANDS } from '@/data/hands'
import { POSITION_RANGES } from '@/data/positions'
import type { Position } from '@/data/positions'
import { getTierColor, getTierTextColor } from '@/utils/color-utils'

type QuizMode = 'all' | 'raise' | 'call'

interface OpenRangeQuizProps {
  position: Position
  mode: QuizMode
  onComplete: (result: OpenRangeResult) => void
}

export interface OpenRangeResult {
  position: Position
  mode: QuizMode
  accuracy: number
  correct: number
  wrong: number
  missed: number
  total: number
  timestamp: number
}

type DiffStatus = 'correct' | 'wrong' | 'missed'

export function OpenRangeQuiz({ position, mode, onComplete }: OpenRangeQuizProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const correctSet = useMemo(() => {
    const range = POSITION_RANGES[position]
    const set = new Set<string>()
    ALL_HANDS.forEach(hand => {
      const action = range.actions[hand.name] as ActionCategory | undefined
      if (mode === 'all' && (action === 'raise' || action === 'call')) {
        set.add(hand.name)
      } else if (mode === 'raise' && action === 'raise') {
        set.add(hand.name)
      } else if (mode === 'call' && action === 'call') {
        set.add(hand.name)
      }
    })
    return set
  }, [position, mode])

  const diffMap = useMemo<Record<string, DiffStatus>>(() => {
    if (!submitted) return {}
    const map: Record<string, DiffStatus> = {}
    ALL_HANDS.forEach(hand => {
      const isSelected = selected.has(hand.name)
      const isCorrect = correctSet.has(hand.name)
      if (isSelected && isCorrect) {
        map[hand.name] = 'correct'
      } else if (isSelected && !isCorrect) {
        map[hand.name] = 'wrong'
      } else if (!isSelected && isCorrect) {
        map[hand.name] = 'missed'
      }
    })
    return map
  }, [submitted, selected, correctSet])

  const stats = useMemo(() => {
    if (!submitted) return null
    let correct = 0
    let wrong = 0
    let missed = 0
    for (const status of Object.values(diffMap)) {
      if (status === 'correct') correct++
      else if (status === 'wrong') wrong++
      else if (status === 'missed') missed++
    }
    const total = correctSet.size
    const accuracy = total > 0
      ? Math.round(((total - missed - wrong) / total) * 100)
      : 100
    return { correct, wrong, missed, total, accuracy: Math.max(0, accuracy) }
  }, [submitted, diffMap, correctSet])

  const handleCellClick = useCallback((hand: Hand) => {
    if (submitted) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(hand.name)) {
        next.delete(hand.name)
      } else {
        next.add(hand.name)
      }
      return next
    })
  }, [submitted])

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleComplete = () => {
    if (!stats) return
    onComplete({
      position,
      mode,
      accuracy: stats.accuracy,
      correct: stats.correct,
      wrong: stats.wrong,
      missed: stats.missed,
      total: stats.total,
      timestamp: Date.now(),
    })
  }

  const handleReset = () => {
    setSelected(new Set())
    setSubmitted(false)
  }

  const modeLabel = mode === 'all' ? '오픈 가능 (Raise+Call)' : mode === 'raise' ? 'Raise만' : 'Call만'

  const getCellClasses = (hand: Hand): string => {
    const strength = HAND_STRENGTHS[hand.name]
    const tier = strength?.tier ?? 'weak'
    const bgColor = getTierColor(tier)
    const textColor = getTierTextColor(tier)
    const isSelected = selected.has(hand.name)
    const diff = diffMap[hand.name]

    const classes = [
      'flex items-center justify-center relative',
      'text-xs font-bold leading-none',
      'border-2 transition-all duration-150',
      'w-full aspect-square min-w-0',
      'cursor-pointer',
    ]

    if (submitted) {
      classes.push(bgColor, textColor)
      if (diff === 'correct') {
        classes.push('border-green-400 ring-1 ring-green-400')
      } else if (diff === 'wrong') {
        classes.push('border-red-400 ring-1 ring-red-400')
      } else if (diff === 'missed') {
        classes.push('border-orange-400 ring-1 ring-orange-400')
      } else {
        classes.push('border-transparent opacity-40')
      }
    } else {
      if (isSelected) {
        classes.push(bgColor, textColor, 'border-white ring-1 ring-white')
      } else {
        classes.push('bg-gray-800 text-gray-500 border-transparent hover:border-gray-600')
      }
    }

    return classes.filter(Boolean).join(' ')
  }

  const suitIndicator = (hand: Hand) =>
    hand.suit === 's' ? 's' : hand.suit === 'o' ? 'o' : ''

  return (
    <div>
      {/* 퀴즈 헤더 */}
      <div className="mb-4 text-center">
        <div className="text-lg font-bold text-white">
          {position} 포지션 - {modeLabel}
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {submitted
            ? '결과를 확인하세요'
            : `${modeLabel} 핸드를 모두 선택하세요`}
        </p>
      </div>

      {/* 선택 카운터 */}
      {!submitted && (
        <div className="mb-3 text-center text-sm text-gray-400">
          선택: {selected.size}개
          {correctSet.size > 0 && (
            <span className="text-gray-600 ml-2">(정답: {correctSet.size}개)</span>
          )}
        </div>
      )}

      {/* 결과 통계 */}
      {submitted && stats && (
        <div className="mb-4 bg-gray-800 rounded-xl p-4">
          <div className="text-center mb-3">
            <span className={[
              'text-3xl font-bold',
              stats.accuracy >= 80 ? 'text-green-400' :
              stats.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400',
            ].join(' ')}>
              {stats.accuracy}%
            </span>
            <span className="text-gray-400 text-sm ml-2">정확도</span>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-green-400">정답 {stats.correct}개</span>
            <span className="text-red-400">오답 {stats.wrong}개</span>
            <span className="text-orange-400">누락 {stats.missed}개</span>
          </div>
          {submitted && (
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded border-2 border-green-400" /> 정답
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded border-2 border-red-400" /> 오답
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded border-2 border-orange-400" /> 누락
              </span>
            </div>
          )}
        </div>
      )}

      {/* 그리드 */}
      <div className="bg-gray-900 rounded-xl p-3 overflow-x-auto">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `auto repeat(13, minmax(0, 1fr))` }}
        >
          {/* 헤더 행 */}
          <div className="w-7" />
          {RANKS.map(rank => (
            <div
              key={`col-${rank}`}
              className="flex items-center justify-center text-xs font-bold text-gray-500 pb-1 h-6"
            >
              {rank}
            </div>
          ))}

          {/* 데이터 행 */}
          {HAND_GRID.map((row, rowIdx) => (
            <>
              <div
                key={`row-label-${rowIdx}`}
                className="flex items-center justify-center text-xs font-bold text-gray-500 pr-1 w-7"
              >
                {RANKS[rowIdx]}
              </div>
              {row.map(hand => (
                <button
                  key={hand.name}
                  onClick={() => handleCellClick(hand)}
                  className={getCellClasses(hand)}
                  title={hand.name}
                >
                  <span className="truncate px-0.5 text-[10px] sm:text-xs">
                    {hand.rank1}{hand.rank2 !== hand.rank1 ? hand.rank2 : ''}{suitIndicator(hand)}
                  </span>
                  {submitted && diffMap[hand.name] === 'correct' && (
                    <span className="absolute top-0 right-0 text-[7px] text-green-300 leading-none">✓</span>
                  )}
                  {submitted && diffMap[hand.name] === 'wrong' && (
                    <span className="absolute top-0 right-0 text-[7px] text-red-300 leading-none">✗</span>
                  )}
                  {submitted && diffMap[hand.name] === 'missed' && (
                    <span className="absolute top-0 right-0 text-[7px] text-orange-300 leading-none">!</span>
                  )}
                </button>
              ))}
            </>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex justify-center gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className={[
              'px-6 py-2.5 rounded-lg font-bold text-sm transition-all',
              selected.size > 0
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed',
            ].join(' ')}
          >
            제출하기
          </button>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gray-700 hover:bg-gray-600 text-white transition-all"
            >
              다시 도전
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-lg font-bold text-sm bg-green-600 hover:bg-green-500 text-white transition-all"
            >
              완료
            </button>
          </>
        )}
      </div>
    </div>
  )
}
