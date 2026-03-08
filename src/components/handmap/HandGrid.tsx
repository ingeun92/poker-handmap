import { useState } from 'react'
import type { Hand, StrengthTier, ActionCategory } from '@/types/hand'
import { RANKS } from '@/types/hand'
import { HAND_GRID, HAND_STRENGTHS } from '@/data/hands'
import { HandCell, type ColorMode } from './HandCell'
import { HandTooltip } from './HandTooltip'

interface HandGridProps {
  onHandClick?: (hand: Hand) => void
  selectedHands?: Set<string>
  highlightTiers?: Set<StrengthTier>
  actionOverlay?: Record<string, ActionCategory>
  threeBetSet?: Set<string>
  colorMode?: ColorMode
}

interface TooltipState {
  hand: Hand
  x: number
  y: number
}

export function HandGrid({ onHandClick, selectedHands, highlightTiers, actionOverlay, threeBetSet, colorMode = 'action' }: HandGridProps) {
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
        className="grid gap-[1px]"
        style={{
          gridTemplateColumns: `24px repeat(13, minmax(0, 1fr))`,
          background: '#0d0d1a',
        }}
      >
        {/* Header row */}
        <div className="w-6" />
        {RANKS.map(rank => (
          <div
            key={`col-${rank}`}
            className="flex items-center justify-center text-[10px] sm:text-xs font-mono font-medium text-gray-500 h-5 sm:h-6"
          >
            {rank}
          </div>
        ))}

        {/* Data rows */}
        {HAND_GRID.map((row, rowIdx) => (
          <>
            <div
              key={`row-label-${rowIdx}`}
              className="flex items-center justify-center text-[10px] sm:text-xs font-mono font-medium text-gray-500 w-6"
            >
              {RANKS[rowIdx]}
            </div>

            {row.map((hand) => (
              <div
                key={hand.name}
                onMouseEnter={e => handleMouseEnter(hand, e)}
                onMouseLeave={handleMouseLeave}
                className={isHighlighted(hand) ? '' : 'opacity-20'}
              >
                <HandCell
                  hand={hand}
                  onClick={onHandClick}
                  selected={selectedHands?.has(hand.name)}
                  highlighted={isHighlighted(hand)}
                  action={actionOverlay?.[hand.name]}
                  is3Bet={threeBetSet?.has(hand.name)}
                  colorMode={colorMode}
                />
              </div>
            ))}
          </>
        ))}
      </div>

      {tooltip && (
        <HandTooltip
          hand={tooltip.hand}
          x={tooltip.x}
          y={tooltip.y}
          action={actionOverlay?.[tooltip.hand.name]}
          is3Bet={threeBetSet?.has(tooltip.hand.name)}
        />
      )}
    </div>
  )
}
