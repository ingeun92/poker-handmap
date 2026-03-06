import { useState, useCallback } from 'react'
import type { StrengthTier } from '@/types/hand'
import { HAND_GRID, HAND_STRENGTHS } from '@/data/hands'
import { RANKS } from '@/types/hand'
import { GridFillCell } from './GridFillCell'

type GridMode = 'full' | 'row' | 'col' | 'random10' | 'random25'

interface GridFillQuizProps {
  onComplete?: (correct: number, total: number) => void
}

interface CellState {
  row: number
  col: number
  handName: string
  selected: StrengthTier | null
  correct: StrengthTier
  included: boolean
}

function buildCellStates(mode: GridMode): CellState[] {
  const cells: CellState[] = []

  HAND_GRID.forEach((rowArr, ri) => {
    rowArr.forEach((hand, ci) => {
      const correct = HAND_STRENGTHS[hand.name]?.tier ?? 'weak'
      cells.push({ row: ri, col: ci, handName: hand.name, selected: null, correct, included: false })
    })
  })

  if (mode === 'full') {
    return cells.map(c => ({ ...c, included: true }))
  }
  if (mode === 'row') {
    const targetRow = Math.floor(Math.random() * 13)
    return cells.map(c => ({ ...c, included: c.row === targetRow }))
  }
  if (mode === 'col') {
    const targetCol = Math.floor(Math.random() * 13)
    return cells.map(c => ({ ...c, included: c.col === targetCol }))
  }
  if (mode === 'random10') {
    const indices = getRandomIndices(169, 10)
    return cells.map((c, i) => ({ ...c, included: indices.has(i) }))
  }
  // random25
  const indices = getRandomIndices(169, 25)
  return cells.map((c, i) => ({ ...c, included: indices.has(i) }))
}

function getRandomIndices(total: number, count: number): Set<number> {
  const set = new Set<number>()
  while (set.size < count) {
    set.add(Math.floor(Math.random() * total))
  }
  return set
}

export function GridFillQuiz({ onComplete }: GridFillQuizProps) {
  const [mode, setMode] = useState<GridMode>('random10')
  const [cells, setCells] = useState<CellState[]>(() => buildCellStates('random10'))
  const [submitted, setSubmitted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleModeChange = useCallback((newMode: GridMode) => {
    setMode(newMode)
    setCells(buildCellStates(newMode))
    setSubmitted(false)
    setShowAnswer(false)
  }, [])

  const handleTierChange = useCallback((row: number, col: number, tier: StrengthTier | null) => {
    setCells(prev =>
      prev.map(c => (c.row === row && c.col === col ? { ...c, selected: tier } : c))
    )
  }, [])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    const included = cells.filter(c => c.included)
    const correct = included.filter(c => c.selected === c.correct).length
    onComplete?.(correct, included.length)
  }, [cells, onComplete])

  const handleReset = useCallback(() => {
    setCells(buildCellStates(mode))
    setSubmitted(false)
    setShowAnswer(false)
  }, [mode])

  const includedCells = cells.filter(c => c.included)
  const correctCount = submitted ? includedCells.filter(c => c.selected === c.correct).length : 0
  const accuracy = submitted && includedCells.length > 0
    ? Math.round((correctCount / includedCells.length) * 100)
    : 0

  const modeOptions: { value: GridMode; label: string }[] = [
    { value: 'full', label: '전체 (169개)' },
    { value: 'row', label: '행 (13개)' },
    { value: 'col', label: '열 (13개)' },
    { value: 'random10', label: '랜덤 10개' },
    { value: 'random25', label: '랜덤 25개' },
  ]

  return (
    <div>
      {/* 모드 선택 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {modeOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleModeChange(opt.value)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              mode === opt.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {(['premium', 'strong', 'playable', 'marginal', 'weak'] as StrengthTier[]).map(tier => (
          <div key={tier} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${
              tier === 'premium' ? 'bg-red-500' :
              tier === 'strong' ? 'bg-orange-400' :
              tier === 'playable' ? 'bg-yellow-400' :
              tier === 'marginal' ? 'bg-blue-400' :
              'bg-gray-400'
            }`} />
            <span className="text-gray-600">{
              tier === 'premium' ? '프리미엄' :
              tier === 'strong' ? '강함' :
              tier === 'playable' ? '플레이어블' :
              tier === 'marginal' ? '마지널' :
              '약함'
            }</span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" />
          <span className="text-gray-400">미선택</span>
        </div>
      </div>

      {/* 제출 결과 */}
      {submitted && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-xs text-gray-500">정확도</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">{correctCount}</div>
              <div className="text-xs text-gray-500">정답</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-500">{includedCells.length - correctCount}</div>
              <div className="text-xs text-gray-500">오답</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowAnswer(a => !a)}
              className="flex-1 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              {showAnswer ? '결과 숨기기' : '정답 보기'}
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              다시 하기
            </button>
          </div>
        </div>
      )}

      {/* 그리드 */}
      <div className="overflow-x-auto">
        <div className="min-w-[340px]">
          {/* 헤더 행 */}
          <div className="grid grid-cols-14 gap-px mb-px">
            <div className="w-full aspect-square" />
            {RANKS.map(r => (
              <div key={r} className="w-full aspect-square flex items-center justify-center text-xs text-gray-400 font-medium">
                {r}
              </div>
            ))}
          </div>

          {/* 그리드 행 */}
          {RANKS.map((r1, ri) => (
            <div key={r1} className="grid grid-cols-14 gap-px mb-px">
              <div className="w-full aspect-square flex items-center justify-center text-xs text-gray-400 font-medium">
                {r1}
              </div>
              {RANKS.map((_r2, ci) => {
                const cell = cells[ri * 13 + ci]
                if (!cell) return null
                if (!cell.included) {
                  return (
                    <div
                      key={`${ri}-${ci}`}
                      className="w-full aspect-square bg-gray-50 rounded"
                    />
                  )
                }
                return (
                  <GridFillCell
                    key={`${ri}-${ci}`}
                    handName={cell.handName}
                    selectedTier={showAnswer ? cell.correct : cell.selected}
                    correctTier={cell.correct}
                    showResult={submitted}
                    disabled={submitted}
                    onTierChange={tier => handleTierChange(ri, ci, tier)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 제출 버튼 */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          제출
        </button>
      )}
    </div>
  )
}
