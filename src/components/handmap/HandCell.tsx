import type { Hand, ActionCategory, StrengthTier } from '@/types/hand'
import { HAND_STRENGTHS } from '@/data/hands'

export type ColorMode = 'action' | 'tier'

interface HandCellProps {
  hand: Hand
  onClick?: (hand: Hand) => void
  selected?: boolean
  highlighted?: boolean
  action?: ActionCategory
  is3Bet?: boolean
  colorMode?: ColorMode
}

function getActionClass(action: ActionCategory, is3Bet: boolean): string {
  if (action === 'raise' && is3Bet) return 'cell-3bet'
  if (action === 'raise') return 'cell-raise'
  if (action === 'call') return 'cell-call'
  return 'cell-fold'
}

function getTierClass(tier: StrengthTier): string {
  switch (tier) {
    case 'premium': return 'cell-premium'
    case 'strong': return 'cell-strong'
    case 'playable': return 'cell-playable'
    case 'marginal': return 'cell-marginal'
    case 'weak': return 'cell-weak'
  }
}

function getActionLabel(action: ActionCategory, is3Bet: boolean): string {
  if (action === 'raise' && is3Bet) return '3B'
  if (action === 'raise') return 'R'
  if (action === 'call') return 'C'
  return ''
}

export function HandCell({ hand, onClick, selected, highlighted, action, is3Bet, colorMode = 'action' }: HandCellProps) {
  const strength = HAND_STRENGTHS[hand.name]
  const tier = strength?.tier ?? 'weak'

  const cellClass = colorMode === 'action' && action
    ? getActionClass(action, !!is3Bet)
    : getTierClass(tier)

  const actionLabel = action ? getActionLabel(action, !!is3Bet) : ''
  const isFold = action === 'fold'

  return (
    <button
      onClick={() => onClick?.(hand)}
      className={[
        'hand-cell flex flex-col items-center justify-center relative overflow-hidden',
        'font-mono leading-none',
        'w-full aspect-square min-w-0 rounded-[2px]',
        cellClass,
        selected ? 'ring-2 ring-white scale-105 z-10' : '',
        highlighted === false ? 'opacity-20' : '',
        onClick ? 'cursor-pointer' : 'cursor-default',
        hand.suit === 'p' ? 'ring-1 ring-inset ring-white/20' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Hand name */}
      <span className={[
        'font-medium tracking-tight',
        isFold && colorMode === 'action' ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs',
      ].join(' ')}>
        {hand.name}
      </span>

      {/* Action label in tier mode */}
      {colorMode === 'tier' && actionLabel && (
        <span
          className="absolute bottom-0 left-[1px] right-[1px] text-[6px] sm:text-[7px] text-center font-bold leading-none py-[2px] rounded-t-[2px]"
          style={{
            background: action === 'raise' && is3Bet
              ? 'linear-gradient(to top, #dc2626, #ef4444)'
              : action === 'raise'
                ? 'linear-gradient(to top, #059669, #10b981)'
                : action === 'call'
                  ? 'linear-gradient(to top, #2563eb, #3b82f6)'
                  : 'transparent',
            color: '#fff',
          }}
        >
          {actionLabel}
        </span>
      )}

    </button>
  )
}
