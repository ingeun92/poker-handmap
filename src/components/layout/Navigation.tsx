import { NavLink } from 'react-router-dom'

interface NavItem {
  path: string
  label: string
  emoji: string
}

const NAV_ITEMS: NavItem[] = [
  { path: '/handmap', label: '핸드맵', emoji: '🗺️' },
  { path: '/grid-fill', label: '그리드 채우기', emoji: '🧩' },
  { path: '/hand-compare', label: '핸드 비교', emoji: '⚖️' },
  { path: '/category-sort', label: '카테고리 분류', emoji: '📂' },
  { path: '/open-range', label: '오픈 레인지', emoji: '🎯' },
  { path: '/spaced-repetition', label: '간격 반복', emoji: '🔄' },
  { path: '/speed-quiz', label: '스피드 퀴즈', emoji: '⚡' },
  { path: '/dashboard', label: '대시보드', emoji: '📊' },
]

interface NavigationProps {
  onItemClick?: () => void
}

export function Navigation({ onItemClick }: NavigationProps) {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 md:border-b-0 md:border-r">
      <ul className="flex flex-col">
        {NAV_ITEMS.map(item => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
