import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navigation } from './Navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gray-950 border-b border-gray-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-white font-bold text-lg tracking-wide hover:text-blue-400 transition-colors"
        >
          포커 핸드맵 트레이너
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { path: '/handmap', label: '핸드맵', emoji: '🗺️' },
            { path: '/grid-fill', label: '그리드', emoji: '🧩' },
            { path: '/hand-compare', label: '비교', emoji: '⚖️' },
            { path: '/category-sort', label: '분류', emoji: '📂' },
            { path: '/spaced-repetition', label: '간격반복', emoji: '🔄' },
            { path: '/speed-quiz', label: '스피드', emoji: '⚡' },
            { path: '/dashboard', label: '대시보드', emoji: '📊' },
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700">
          <Navigation onItemClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  )
}
