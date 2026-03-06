import { useStats } from '@/hooks/useStats'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { ProgressChart } from '@/components/dashboard/ProgressChart'
import { StreakDisplay } from '@/components/dashboard/StreakDisplay'
import { MasteryGrid } from '@/components/dashboard/MasteryGrid'

export function DashboardPage() {
  const stats = useStats()

  const modeLabels: Record<string, string> = {
    'grid-fill': '그리드 채우기',
    'hand-compare': '핸드 비교',
    'category-sort': '카테고리 분류',
    'spaced-repetition': '간격 반복',
    'speed-quiz': '스피드 퀴즈',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">학습 대시보드</h1>

      {/* Overview cards */}
      <Dashboard stats={stats} />

      {/* Streak calendar */}
      <StreakDisplay
        dailyPractice={stats.dailyPractice}
        currentStreak={stats.currentStreak}
        longestStreak={stats.longestStreak}
      />

      {/* Progress chart */}
      <ProgressChart dailyPractice={stats.dailyPractice} />

      {/* Mastery grid */}
      <MasteryGrid data={{ perHandAccuracy: stats.perHandAccuracy }} />

      {/* Per-mode accuracy */}
      {Object.keys(stats.perModeAccuracy).length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-white font-medium mb-4">모드별 정확도</h3>
          <div className="space-y-3">
            {Object.entries(stats.perModeAccuracy).map(([mode, acc]) => {
              const pct = acc.total > 0 ? Math.round((acc.correct / acc.total) * 100) : 0
              return (
                <div key={mode}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{modeLabels[mode] ?? mode}</span>
                    <span className="text-white font-medium">
                      {pct}% ({acc.correct}/{acc.total})
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Weak and strong hands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.weakestHands.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 border border-red-900">
            <h3 className="text-red-400 font-medium mb-3">취약한 핸드 Top 10</h3>
            <div className="flex flex-wrap gap-2">
              {stats.weakestHands.map(hand => {
                const acc = stats.perHandAccuracy[hand]
                const pct = acc ? Math.round((acc.correct / acc.total) * 100) : 0
                return (
                  <div key={hand} className="bg-red-900/30 border border-red-800 rounded px-2 py-1">
                    <span className="text-white text-sm font-medium">{hand}</span>
                    <span className="text-red-400 text-xs ml-1">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {stats.strongestHands.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 border border-green-900">
            <h3 className="text-green-400 font-medium mb-3">숙달한 핸드 Top 10</h3>
            <div className="flex flex-wrap gap-2">
              {stats.strongestHands.map(hand => {
                const acc = stats.perHandAccuracy[hand]
                const pct = acc ? Math.round((acc.correct / acc.total) * 100) : 0
                return (
                  <div key={hand} className="bg-green-900/30 border border-green-800 rounded px-2 py-1">
                    <span className="text-white text-sm font-medium">{hand}</span>
                    <span className="text-green-400 text-xs ml-1">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {stats.weakestHands.length === 0 && stats.strongestHands.length === 0 && (
          <div className="col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-700 text-center">
            <p className="text-gray-500">
              핸드별 통계를 보려면 퀴즈를 3번 이상 풀어보세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
