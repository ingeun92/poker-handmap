interface DailyData {
  date: string
  count: number
  accuracy: number
}

interface StreakDisplayProps {
  dailyPractice: DailyData[]
  currentStreak: number
  longestStreak: number
}

function getLast30Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0]!)
  }
  return days
}

export function StreakDisplay({ dailyPractice, currentStreak, longestStreak }: StreakDisplayProps) {
  const practiceMap = new Map(dailyPractice.map(d => [d.date, d]))
  const last30 = getLast30Days()

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">학습 기록</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-orange-400 font-bold">🔥 {currentStreak}일 연속</span>
          <span className="text-gray-500">최장 {longestStreak}일</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-wrap gap-1">
        {last30.map(date => {
          const data = practiceMap.get(date)
          const hasPractice = !!data
          const accuracy = data?.accuracy ?? 0

          let bgClass = 'bg-gray-800'
          if (hasPractice) {
            if (accuracy >= 80) bgClass = 'bg-green-500'
            else if (accuracy >= 60) bgClass = 'bg-green-700'
            else if (accuracy >= 40) bgClass = 'bg-yellow-600'
            else bgClass = 'bg-orange-700'
          }

          return (
            <div
              key={date}
              title={hasPractice ? `${date}: ${data.count}문제 (${accuracy}%)` : date}
              className={`w-6 h-6 rounded-sm ${bgClass} cursor-default transition-opacity hover:opacity-80`}
            />
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
        <span>적음</span>
        <div className="flex gap-1">
          {['bg-gray-800', 'bg-orange-700', 'bg-yellow-600', 'bg-green-700', 'bg-green-500'].map(c => (
            <div key={c} className={`w-4 h-4 rounded-sm ${c}`} />
          ))}
        </div>
        <span>많음</span>
      </div>
    </div>
  )
}
