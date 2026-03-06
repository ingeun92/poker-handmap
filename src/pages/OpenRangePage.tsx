import { useState } from 'react'
import { POSITIONS, POSITION_RANGES } from '@/data/positions'
import type { Position } from '@/data/positions'
import { OpenRangeQuiz } from '@/components/quiz/OpenRangeQuiz'
import type { OpenRangeResult } from '@/components/quiz/OpenRangeQuiz'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type QuizMode = 'all' | 'raise' | 'call'

const MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'all', label: '전체 (Raise+Call)' },
  { value: 'raise', label: 'Raise만' },
  { value: 'call', label: 'Call만' },
]

export function OpenRangePage() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [selectedMode, setSelectedMode] = useState<QuizMode>('all')
  const [quizKey, setQuizKey] = useState(0)
  const [history, setHistory] = useLocalStorage<OpenRangeResult[]>(
    'poker-handmap:open-range-history',
    []
  )

  const handleComplete = (result: OpenRangeResult) => {
    setHistory(prev => [result, ...prev].slice(0, 20))
    setSelectedPosition(null)
  }

  const handleStart = (pos: Position) => {
    setSelectedPosition(pos)
    setQuizKey(prev => prev + 1)
  }

  if (selectedPosition) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedPosition(null)}
            className="mb-4 text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; 돌아가기
          </button>
          <OpenRangeQuiz
            key={quizKey}
            position={selectedPosition}
            mode={selectedMode}
            onComplete={handleComplete}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1">오픈 레인지 테스트</h1>
          <p className="text-gray-400 text-sm">
            포지션별 오픈 레인지를 그리드에서 직접 선택하여 테스트하세요
          </p>
        </div>

        {/* 모드 선택 */}
        <div className="mb-6">
          <span className="text-sm text-gray-400 block mb-2">테스트 모드</span>
          <div className="flex gap-2">
            {MODE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedMode(opt.value)}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedMode === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 포지션 선택 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {POSITIONS.map(pos => {
            const range = POSITION_RANGES[pos]
            const raiseCount = Object.values(range.actions).filter(a => a === 'raise').length
            const callCount = Object.values(range.actions).filter(a => a === 'call').length
            const lastResult = history.find(
              r => r.position === pos && r.mode === selectedMode
            )

            return (
              <button
                key={pos}
                onClick={() => handleStart(pos)}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-left transition-all"
              >
                <div className="text-lg font-bold text-white mb-1">{pos}</div>
                <div className="text-xs text-gray-400 mb-2">{range.label}</div>
                <div className="text-xs space-y-0.5">
                  <div className="text-green-400">Raise: {raiseCount}개</div>
                  <div className="text-yellow-400">Call: {callCount}개</div>
                </div>
                {lastResult && (
                  <div className={[
                    'mt-2 text-xs font-medium',
                    lastResult.accuracy >= 80 ? 'text-green-400' :
                    lastResult.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400',
                  ].join(' ')}>
                    최근: {lastResult.accuracy}%
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* 최근 기록 */}
        {history.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3">최근 기록</h2>
            <div className="space-y-2">
              {history.slice(0, 5).map((result, idx) => (
                <div
                  key={`${result.timestamp}-${idx}`}
                  className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white">{result.position}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      {result.mode === 'all' ? 'Raise+Call' : result.mode === 'raise' ? 'Raise' : 'Call'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-400">{result.correct}개 정답</span>
                    <span className="text-red-400">{result.wrong}개 오답</span>
                    <span className="text-orange-400">{result.missed}개 누락</span>
                    <span className={[
                      'font-bold',
                      result.accuracy >= 80 ? 'text-green-400' :
                      result.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400',
                    ].join(' ')}>
                      {result.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
