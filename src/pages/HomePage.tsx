import { Link } from 'react-router-dom'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface ModeCard {
  path: string
  emoji: string
  title: string
  description: string
  color: string
}

const MODE_CARDS: ModeCard[] = [
  {
    path: '/handmap',
    emoji: '🗺️',
    title: '핸드맵',
    description: '13x13 그리드로 모든 프리플랍 핸드의 강도를 한눈에 확인합니다.',
    color: 'from-blue-600 to-blue-800',
  },
  {
    path: '/grid-fill',
    emoji: '🧩',
    title: '그리드 채우기',
    description: '빈 핸드맵을 채우며 핸드 강도를 직접 분류합니다.',
    color: 'from-purple-600 to-purple-800',
  },
  {
    path: '/hand-compare',
    emoji: '⚖️',
    title: '핸드 비교',
    description: '두 핸드 중 더 강한 핸드를 선택하는 퀴즈입니다.',
    color: 'from-green-600 to-green-800',
  },
  {
    path: '/category-sort',
    emoji: '📂',
    title: '카테고리 분류',
    description: '핸드를 프리미엄부터 약한 핸드까지 5단계로 분류합니다.',
    color: 'from-yellow-600 to-yellow-800',
  },
  {
    path: '/spaced-repetition',
    emoji: '🔄',
    title: '간격 반복',
    description: '라이트너 박스 알고리즘으로 효율적으로 핸드를 암기합니다.',
    color: 'from-cyan-600 to-cyan-800',
  },
  {
    path: '/speed-quiz',
    emoji: '⚡',
    title: '스피드 퀴즈',
    description: '제한 시간 내에 최대한 많은 핸드를 빠르게 분류합니다.',
    color: 'from-red-600 to-red-800',
  },
  {
    path: '/dashboard',
    emoji: '📊',
    title: '학습 대시보드',
    description: '학습 진도, 정확도, 연속 학습 일수를 통계로 확인합니다.',
    color: 'from-orange-600 to-orange-800',
  },
]

interface LastSession {
  date: string
  mode: string
  count: number
  accuracy: number
}

export function HomePage() {
  const [lastSession] = useLocalStorage<LastSession | null>('poker-handmap:last-session', null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">포커 핸드맵 트레이너</h1>
        <p className="text-gray-400 text-lg">
          169개 프리플랍 핸드를 효율적으로 학습하세요
        </p>
      </div>

      {/* Last session summary */}
      {lastSession && (
        <div className="mb-8 bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
          <div className="text-2xl">📅</div>
          <div>
            <p className="text-sm text-gray-400">마지막 세션</p>
            <p className="text-white font-medium">
              {lastSession.date} · {lastSession.mode} · {lastSession.count}문제 · 정답률 {lastSession.accuracy}%
            </p>
          </div>
          <Link
            to="/dashboard"
            className="ml-auto text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            전체 통계 보기 →
          </Link>
        </div>
      )}

      {/* Mode cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODE_CARDS.map(card => (
          <div
            key={card.path}
            className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 transition-colors group"
          >
            <div className={`bg-gradient-to-br ${card.color} p-4`}>
              <span className="text-4xl">{card.emoji}</span>
            </div>
            <div className="p-4">
              <h2 className="text-white font-semibold text-lg mb-2">{card.title}</h2>
              <p className="text-gray-400 text-sm mb-4">{card.description}</p>
              <Link
                to={card.path}
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                시작
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
