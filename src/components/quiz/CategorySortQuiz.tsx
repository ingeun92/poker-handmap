import { useState, useCallback, useEffect } from 'react'
import type { Hand, ActionCategory } from '@/types/hand'
import type { Position } from '@/data/positions'
import { POSITION_RANGES } from '@/data/positions'
import { ALL_HANDS } from '@/data/hands'

interface CategorySortQuizProps {
  position: Position
  onComplete?: (results: { category: ActionCategory; correct: number; total: number }[]) => void
}

interface RoundResult {
  hand: string
  selected: ActionCategory
  correct: ActionCategory
  isCorrect: boolean
}

const BATCH_SIZE = 10
const ACTION_LABELS: Record<ActionCategory, string> = {
  raise: '레이즈',
  call: '콜',
  fold: '폴드',
}
const ACTION_COLORS: Record<ActionCategory, string> = {
  raise: 'bg-green-500 hover:bg-green-600',
  call: 'bg-blue-500 hover:bg-blue-600',
  fold: 'bg-red-500 hover:bg-red-600',
}

function getCorrectAction(hand: Hand, position: Position): ActionCategory {
  const posRange = POSITION_RANGES[position]
  return posRange.actions[hand.name] ?? 'fold'
}

function getRandomHands(count: number): Hand[] {
  const shuffled = [...ALL_HANDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function CategorySortQuiz({ position, onComplete }: CategorySortQuizProps) {
  const [hands, setHands] = useState<Hand[]>(() => getRandomHands(BATCH_SIZE))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; correct: ActionCategory } | null>(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setHands(getRandomHands(BATCH_SIZE))
    setCurrentIndex(0)
    setResults([])
    setLastFeedback(null)
    setFinished(false)
  }, [position])

  const handleAction = useCallback((selected: ActionCategory) => {
    const currentHand = hands[currentIndex]
    if (!currentHand || lastFeedback !== null) return

    const correct = getCorrectAction(currentHand, position)
    const isCorrect = selected === correct

    const result: RoundResult = { hand: currentHand.name, selected, correct, isCorrect }
    const newResults = [...results, result]
    const newIndex = currentIndex + 1

    setLastFeedback({ isCorrect, correct })

    setTimeout(() => {
      setLastFeedback(null)
      if (newIndex >= BATCH_SIZE) {
        setFinished(true)
        setResults(newResults)
        // 카테고리별 집계
        const categories: ActionCategory[] = ['raise', 'call', 'fold']
        const summary = categories.map(cat => ({
          category: cat,
          correct: newResults.filter(r => r.correct === cat && r.isCorrect).length,
          total: newResults.filter(r => r.correct === cat).length,
        }))
        onComplete?.(summary)
      } else {
        setCurrentIndex(newIndex)
        setResults(newResults)
      }
    }, 800)
  }, [hands, currentIndex, lastFeedback, results, position, onComplete])

  const handleRestart = useCallback(() => {
    setHands(getRandomHands(BATCH_SIZE))
    setCurrentIndex(0)
    setResults([])
    setLastFeedback(null)
    setFinished(false)
  }, [])

  const currentHand = hands[currentIndex]
  const correctCount = results.filter(r => r.isCorrect).length

  if (finished) {
    const accuracy = Math.round((correctCount / BATCH_SIZE) * 100)
    const categories: ActionCategory[] = ['raise', 'call', 'fold']

    return (
      <div className="py-4">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">배치 완료!</h2>
        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
            <div className="text-xs text-gray-500">정확도</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{correctCount}</div>
            <div className="text-xs text-gray-500">정답</div>
          </div>
        </div>

        {/* 카테고리별 정확도 */}
        <div className="space-y-2 mb-6">
          {categories.map(cat => {
            const catResults = results.filter(r => r.correct === cat)
            const catCorrect = catResults.filter(r => r.isCorrect).length
            const catAcc = catResults.length > 0 ? Math.round((catCorrect / catResults.length) * 100) : null
            return (
              <div key={cat} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <span className="font-medium text-gray-700">{ACTION_LABELS[cat]}</span>
                <span className="text-sm text-gray-500">
                  {catAcc !== null ? `${catCorrect}/${catResults.length} (${catAcc}%)` : '해당 없음'}
                </span>
              </div>
            )
          })}
        </div>

        {/* 오답 목록 */}
        {results.some(r => !r.isCorrect) && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">오답 핸드</h3>
            <div className="space-y-1">
              {results.filter(r => !r.isCorrect).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-red-50 rounded px-3 py-1.5">
                  <span className="font-semibold">{r.hand}</span>
                  <span className="text-red-500">{ACTION_LABELS[r.selected]} 선택</span>
                  <span className="text-green-600">정답: {ACTION_LABELS[r.correct]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleRestart}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          다시 하기
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* 진행상황 */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-gray-500">{currentIndex + 1} / {BATCH_SIZE}</span>
        <span className="text-green-600 font-medium">정답 {correctCount}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all"
          style={{ width: `${(currentIndex / BATCH_SIZE) * 100}%` }}
        />
      </div>

      {/* 현재 핸드 카드 */}
      {currentHand && (
        <div className={[
          'p-8 rounded-2xl text-center mb-6 border-2 transition-all',
          lastFeedback === null && 'border-gray-200 bg-white',
          lastFeedback?.isCorrect && 'border-green-400 bg-green-50',
          lastFeedback && !lastFeedback.isCorrect && 'border-red-400 bg-red-50',
        ].filter(Boolean).join(' ')}>
          <div className="text-5xl font-bold text-gray-900 mb-3">{currentHand.name}</div>
          {lastFeedback && (
            <div className={`mt-3 text-lg font-semibold ${lastFeedback.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {lastFeedback.isCorrect ? '정답!' : `오답! 정답: ${ACTION_LABELS[lastFeedback.correct]}`}
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="grid grid-cols-3 gap-3">
        {(['raise', 'call', 'fold'] as ActionCategory[]).map(action => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            disabled={lastFeedback !== null}
            className={[
              'py-4 rounded-xl text-white font-bold text-lg transition-colors',
              ACTION_COLORS[action],
              lastFeedback !== null && 'opacity-50 cursor-not-allowed',
            ].filter(Boolean).join(' ')}
          >
            {ACTION_LABELS[action]}
          </button>
        ))}
      </div>
    </div>
  )
}
