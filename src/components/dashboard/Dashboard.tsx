import type { StatsData } from '@/hooks/useStats'

interface DashboardProps {
  stats: StatsData
}

export function Dashboard({ stats }: DashboardProps) {
  const overviewCards = [
    { label: '총 퀴즈', value: stats.totalQuizzes, icon: '📝', color: 'text-blue-400' },
    { label: '전체 정확도', value: `${stats.overallAccuracy}%`, icon: '🎯', color: 'text-green-400' },
    { label: '연속 학습', value: `${stats.currentStreak}일`, icon: '🔥', color: 'text-orange-400' },
    { label: '학습 일수', value: `${stats.studyDays}일`, icon: '📅', color: 'text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {overviewCards.map(card => (
        <div
          key={card.label}
          className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center"
        >
          <div className="text-2xl mb-2">{card.icon}</div>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-gray-400 text-xs mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
