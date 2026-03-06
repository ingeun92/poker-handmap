import { useState } from 'react'
import type { Hand, StrengthTier, ActionCategory } from '@/types/hand'
import { RANKS } from '@/types/hand'
import { HAND_GRID, HAND_STRENGTHS } from '@/data/hands'
import { HandCell } from './HandCell'
import { HandTooltip } from './HandTooltip'

interface HandGridProps {
  onHandClick?: (hand: Hand) => void
  selectedHands?: Set<string>
  highlightTiers?: Set<StrengthTier>
  actionOverlay?: Record<string, ActionCategory>
  threeBetSet?: Set<string>
}

interface TooltipState {
  hand: Hand
  x: number
  y: number
}

export function HandGrid({ onHandClick, selectedHands, highlightTiers, actionOverlay, threeBetSet }: HandGridProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const handleMouseEnter = (hand: Hand, e: React.MouseEvent) => {
    setTooltip({ hand, x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const isHighlighted = (hand: Hand): boolean => {
    if (!highlightTiers || highlightTiers.size === 0) return true
    const tier = HAND_STRENGTHS[hand.name]?.tier
    return tier ? highlightTiers.has(tier) : false
  }

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      <div
        className="grid"
        style={{ gridTemplateColumns: `auto repeat(13, minmax(0, 1fr))` }}
      >
        {/* 헤더 행: 빈 셀 + 열 레이블 */}
        <div className="w-7" />
        {RANKS.map(rank => (
          <div
            key={`col-${rank}`}
            className="flex items-center justify-center text-xs font-bold text-gray-500 pb-1 h-6"
          >
            {rank}
          </div>
        ))}

        {/* 데이터 행 */}
        {HAND_GRID.map((row, rowIdx) => (
          <>
            {/* 행 레이블 */}
            <div
              key={`row-label-${rowIdx}`}
              className="flex items-center justify-center text-xs font-bold text-gray-500 pr-1 w-7"
            >
              {RANKS[rowIdx]}
            </div>

            {/* 핸드 셀들 */}
            {row.map((hand, colIdx) => (
              <div
                key={hand.name}
                onMouseEnter={e => handleMouseEnter(hand, e)}
                onMouseLeave={handleMouseLeave}
                className={[
                  'border-r border-b border-gray-800/40',
                  rowIdx === 0 ? 'border-t' : '',
                  colIdx === 0 ? 'border-l' : '',
                  isHighlighted(hand) ? '' : 'opacity-25',
                ].filter(Boolean).join(' ')}
              >
                <HandCell
                  hand={hand}
                  onClick={onHandClick}
                  selected={selectedHands?.has(hand.name)}
                  highlighted={isHighlighted(hand)}
                  action={actionOverlay?.[hand.name]}
                  is3Bet={threeBetSet?.has(hand.name)}
                />
              </div>
            ))}
          </>
        ))}
      </div>

      {/* 툴팁 */}
      {tooltip && (
        <HandTooltip
          hand={tooltip.hand}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}
    </div>
  )
}
