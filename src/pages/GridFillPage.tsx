import { useState } from 'react'
import { GridFillQuiz } from '@/components/quiz/GridFillQuiz'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface QuizSummary {
  correct: number
  total: number
  accuracy: number
  timestamp: number
}

export function GridFillPage() {
  const [lastResult, setLastResult] = useState<QuizSummary | null>(null)
  const [history, setHistory] = useLocalStorage<QuizSummary[]>('poker-handmap:grid-fill-history', [])

  const handleComplete = (correct: number, total: number) => {
    const result: QuizSummary = {
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      timestamp: Date.now(),
    }
    setLastResult(result)
    setHistory(prev => [result, ...prev].slice(0, 20))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-2">그리드 채우기</h1>
      <p className="text-sm text-gray-400 mb-6">
        셀을 클릭하여 핸드 강도 티어를 선택하세요. 클릭할 때마다 티어가 순환됩니다.
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <GridFillQuiz onComplete={handleComplete} />
      </div>

      {lastResult && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h2 className="font-semibold text-blue-900 mb-2">최근 결과</h2>
          <div className="flex gap-4 text-sm">
            <span className="text-blue-700">정확도: <strong>{lastResult.accuracy}%</strong></span>
            <span className="text-green-600">정답: <strong>{lastResult.correct}</strong></span>
            <span className="text-red-500">오답: <strong>{lastResult.total - lastResult.correct}</strong></span>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-gray-700 mb-2 text-sm">기록 (최근 20회)</h2>
          <div className="space-y-1">
            {history.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
                <span>{new Date(r.timestamp).toLocaleDateString('ko-KR')}</span>
                <span className="font-medium">{r.accuracy}% ({r.correct}/{r.total})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
