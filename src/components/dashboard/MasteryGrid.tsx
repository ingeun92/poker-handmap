import { useState } from 'react'
import type { HandName } from '@/types/hand'
import { HAND_GRID } from '@/data/hands'

interface MasteryData {
  perHandAccuracy: Record<HandName, { correct: number; total: number }>
}

interface MasteryGridProps {
  data: MasteryData
}

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

export function MasteryGrid({ data }: MasteryGridProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  const getMasteryColor = (hand: HandName): string => {
    const acc = data.perHandAccuracy[hand]
    if (!acc || acc.total === 0) return '#1f2937' // gray-800, not attempted
    const pct = (acc.correct / acc.total) * 100
    if (pct >= 80) return '#15803d'  // green-700, mastered
    if (pct >= 50) return '#a16207'  // yellow-700, learning
    return '#b91c1c'                 // red-700, struggling
  }

  const getMasteryLabel = (hand: HandName): string => {
    const acc = data.perHandAccuracy[hand]
    if (!acc || acc.total === 0) return '미시도'
    const pct = Math.round((acc.correct / acc.total) * 100)
    if (pct >= 80) return `숙달 (${pct}%)`
    if (pct >= 50) return `학습 중 (${pct}%)`
    return `부족 (${pct}%)`
  }

  const hoveredAcc = hovered ? data.perHandAccuracy[hovered] : null

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-medium mb-2">핸드 숙련도 맵</h3>

      {/* Hover info */}
      <div className="h-8 mb-3">
        {hovered && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white font-bold">{hovered}</span>
            <span className="text-gray-400">{getMasteryLabel(hovered)}</span>
            {hoveredAcc && hoveredAcc.total > 0 && (
              <span className="text-gray-500">{hoveredAcc.correct}/{hoveredAcc.total}회</span>
            )}
          </div>
        )}
      </div>

      {/* Column headers */}
      <div className="flex gap-0.5 mb-0.5 pl-7">
        {RANKS.map(r => (
          <div key={r} className="w-6 text-center text-gray-500 text-xs">{r}</div>
        ))}
      </div>

      {/* Grid */}
      {HAND_GRID.map((row, ri) => (
        <div key={ri} className="flex gap-0.5 mb-0.5 items-center">
          <div className="w-6 text-gray-500 text-xs text-right pr-1">{RANKS[ri]}</div>
          {row.map((hand, ci) => {
            const color = getMasteryColor(hand.name)
            const isHovered = hovered === hand.name
            return (
              <div
                key={ci}
                title={hand.name}
                className="w-6 h-6 rounded-sm cursor-default transition-all"
                style={{
                  backgroundColor: color,
                  outline: isHovered ? '2px solid #60a5fa' : undefined,
                }}
                onMouseEnter={() => setHovered(hand.name)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        {[
          { color: '#1f2937', label: '미시도' },
          { color: '#b91c1c', label: '부족 (<50%)' },
          { color: '#a16207', label: '학습 중 (50-80%)' },
          { color: '#15803d', label: '숙달 (>80%)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
