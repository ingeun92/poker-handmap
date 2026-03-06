import { getTierLabel } from '@/utils/color-utils'
import type { StrengthTier } from '@/types/hand'

interface QuestionRecord {
  hand: string
  selected: StrengthTier
  correct: StrengthTier
  isCorrect: boolean
  responseTimeMs: number
}

interface PersonalBest {
  score: number
  accuracy: number
  date: string
  duration: number
}

interface SpeedResultsProps {
  records: QuestionRecord[]
  score?: number
  duration: number
  personalBest: PersonalBest | null
  isNewBest: boolean
  onRestart: () => void
}

export function SpeedResults({
  records,
  duration,
  personalBest,
  isNewBest,
  onRestart,
}: SpeedResultsProps) {
  const total = records.length
  const correct = records.filter(r => r.isCorrect).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const avgResponseMs =
    total > 0 ? Math.round(records.reduce((sum, r) => sum + r.responseTimeMs, 0) / total) : 0

  let bestStreak = 0
  let tempStreak = 0
  records.forEach(r => {
    if (r.isCorrect) {
      tempStreak++
      if (tempStreak > bestStreak) bestStreak = tempStreak
    } else {
      tempStreak = 0
    }
  })

  return (
    <div className="space-y-6">
      {isNewBest && (
        <div className="bg-yellow-900/40 border border-yellow-600 rounded-xl p-4 text-center">
          <p className="text-yellow-400 font-bold text-lg">신기록!</p>
          <p className="text-yellow-300 text-sm">개인 최고 점수를 갱신했습니다</p>
        </div>
      )}

      {/* Main stats */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-4 text-center">라운드 결과</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: '총 문제', value: total, color: 'text-white' },
            { label: '정답', value: correct, color: 'text-green-400' },
            { label: '정확도', value: `${accuracy}%`, color: 'text-blue-400' },
            { label: '평균 반응', value: `${(avgResponseMs / 1000).toFixed(1)}s`, color: 'text-yellow-400' },
            { label: '최고 연속', value: bestStreak, color: 'text-orange-400' },
            { label: '시간', value: `${duration}초`, color: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personal best comparison */}
      {personalBest && !isNewBest && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">개인 최고 기록 ({personalBest.duration}초)</p>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-400 text-xs">점수</span>
              <p className="text-white font-bold">{personalBest.score}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs">정확도</span>
              <p className="text-white font-bold">{personalBest.accuracy}%</p>
            </div>
            <div className="ml-auto text-sm text-gray-500">{personalBest.date}</div>
          </div>
        </div>
      )}

      {/* Per-question breakdown */}
      {records.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="text-white text-sm font-medium">문제별 기록</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {records.map((r, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-2 border-b border-gray-800 text-sm ${
                  r.isCorrect ? '' : 'bg-red-900/10'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${r.isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-white font-medium w-12">{r.hand}</span>
                <span className="text-gray-400 flex-1">
                  {r.isCorrect ? (
                    <span className="text-green-400">{getTierLabel(r.correct)}</span>
                  ) : (
                    <>
                      <span className="text-red-400 line-through">{getTierLabel(r.selected)}</span>
                      {' → '}
                      <span className="text-green-400">{getTierLabel(r.correct)}</span>
                    </>
                  )}
                </span>
                <span className="text-gray-500 text-xs">{(r.responseTimeMs / 1000).toFixed(1)}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        다시 하기
      </button>
    </div>
  )
}
