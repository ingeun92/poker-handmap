import { useState } from 'react'
import { HandCompareQuiz } from '@/components/quiz/HandCompareQuiz'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type Difficulty = 'easy' | 'medium' | 'hard'

interface QuizSummary {
  correct: number
  total: number
  accuracy: number
  difficulty: Difficulty
  timestamp: number
}

export function HandComparePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [history, setHistory] = useLocalStorage<QuizSummary[]>('poker-handmap:hand-compare-history', [])

  const handleComplete = (correct: number, total: number) => {
    const result: QuizSummary = {
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      difficulty,
      timestamp: Date.now(),
    }
    setHistory(prev => [result, ...prev].slice(0, 20))
  }

  const difficultyOptions: { value: Difficulty; label: string; description: string }[] = [
    { value: 'easy', label: '쉬움', description: '다른 티어 핸드 비교' },
    { value: 'medium', label: '보통', description: '인접 티어 핸드 비교' },
    { value: 'hard', label: '어려움', description: '같은 티어 핸드 비교' },
  ]

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-2">핸드 비교</h1>
      <p className="text-sm text-gray-400 mb-6">두 핸드 중 더 강한 핸드를 선택하세요.</p>

      {/* 난이도 선택 */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {difficultyOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setDifficulty(opt.value)}
            className={[
              'py-3 px-2 rounded-xl border-2 text-center transition-colors',
              difficulty === opt.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
            ].join(' ')}
          >
            <div className="font-semibold text-sm">{opt.label}</div>
            <div className="text-xs mt-0.5 text-gray-400">{opt.description}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <HandCompareQuiz difficulty={difficulty} onComplete={handleComplete} />
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-700 mb-2 text-sm">기록 (최근 20회)</h2>
          <div className="space-y-1">
            {history.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
                <span>{new Date(r.timestamp).toLocaleDateString('ko-KR')}</span>
                <span className="capitalize">{r.difficulty}</span>
                <span className="font-medium">{r.accuracy}% ({r.correct}/{r.total})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
