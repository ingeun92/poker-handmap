import { useState } from 'react'
import type { ActionCategory } from '@/types/hand'
import type { Position } from '@/data/positions'
import { POSITIONS, POSITION_RANGES } from '@/data/positions'
import { CategorySortQuiz } from '@/components/quiz/CategorySortQuiz'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface BatchSummary {
  position: Position
  correct: number
  total: number
  accuracy: number
  timestamp: number
  categoryBreakdown: { category: ActionCategory; correct: number; total: number }[]
}

export function CategorySortPage() {
  const [position, setPosition] = useState<Position>('BTN')
  const [quizKey, setQuizKey] = useState(0)
  const [history, setHistory] = useLocalStorage<BatchSummary[]>('poker-handmap:category-sort-history', [])

  const handleComplete = (results: { category: ActionCategory; correct: number; total: number }[]) => {
    const total = results.reduce((sum, r) => sum + r.total, 0)
    const correct = results.reduce((sum, r) => sum + r.correct, 0)
    const summary: BatchSummary = {
      position,
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      timestamp: Date.now(),
      categoryBreakdown: results,
    }
    setHistory(prev => [summary, ...prev].slice(0, 20))
  }

  const handlePositionChange = (pos: Position) => {
    setPosition(pos)
    setQuizKey(k => k + 1)
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-2">카테고리 분류</h1>
      <p className="text-sm text-gray-400 mb-4">
        해당 포지션에서 핸드를 레이즈/콜/폴드로 분류하세요.
      </p>

      {/* 포지션 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">포지션 선택</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => handlePositionChange(pos)}
              className={[
                'py-2 rounded-lg text-sm font-semibold transition-colors',
                position === pos
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ].join(' ')}
            >
              {pos}
              <div className="text-xs font-normal opacity-70 mt-0.5 hidden sm:block">
                {POSITION_RANGES[pos].label.slice(0, 3)}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">{POSITION_RANGES[position].label}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <CategorySortQuiz key={quizKey} position={position} onComplete={handleComplete} />
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-700 mb-2 text-sm">기록 (최근 20회)</h2>
          <div className="space-y-1">
            {history.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
                <span className="font-medium">{r.position}</span>
                <span>{new Date(r.timestamp).toLocaleDateString('ko-KR')}</span>
                <span className="font-semibold">{r.accuracy}% ({r.correct}/{r.total})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
