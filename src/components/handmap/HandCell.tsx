import type { Hand, ActionCategory } from '@/types/hand'
import { HAND_STRENGTHS } from '@/data/hands'
import { getTierColor, getTierTextColor } from '@/utils/color-utils'

interface HandCellProps {
  hand: Hand
  onClick?: (hand: Hand) => void
  selected?: boolean
  highlighted?: boolean
  showTooltip?: boolean
  action?: ActionCategory
  is3Bet?: boolean
}

export function HandCell({ hand, onClick, selected, highlighted, action, is3Bet }: HandCellProps) {
  const strength = HAND_STRENGTHS[hand.name]
  const tier = strength?.tier ?? 'weak'
  const bgColor = getTierColor(tier)
  const textColor = getTierTextColor(tier)

  const handleClick = () => {
    onClick?.(hand)
  }

  return (
    <button
      onClick={handleClick}
      title={undefined}
      className={[
        'flex items-center justify-center relative overflow-hidden',
        'text-xs font-bold leading-none',
        'transition-all duration-150',
        'w-full aspect-square min-w-0',
        bgColor,
        textColor,
        selected
          ? 'ring-2 ring-white ring-offset-1 scale-105 z-10 relative'
          : '',
        highlighted
          ? 'opacity-100'
          : 'opacity-80',
        onClick
          ? 'cursor-pointer hover:opacity-100 hover:scale-105 hover:z-10 hover:relative'
          : 'cursor-default',
        hand.suit === 'p' ? 'ring-1 ring-inset ring-white/30' : '',
      ].filter(Boolean).join(' ')}
    >
      <span className="truncate px-0.5 text-[10px] sm:text-xs">
        {hand.name}
      </span>
      {action && (
        <span
          className="absolute bottom-0 left-[1px] right-[1px] text-[6px] sm:text-[7px] text-center font-extrabold leading-none py-[2.5px] rounded-t-[3px]"
          style={{
            background: action === 'raise' && is3Bet
              ? 'linear-gradient(to top, #c2410c, #fb923c)'
              : action === 'raise'
                ? 'linear-gradient(to top, #059669, #34d399)'
                : action === 'call'
                  ? 'linear-gradient(to top, #7c3aed, #a78bfa)'
                  : 'linear-gradient(to top, #57534e, #a8a29e)',
            color: action === 'fold' ? '#e7e5e4' : '#fff',
            boxShadow: '0 -1px 3px rgba(0,0,0,0.15)',
          }}
        >
          {action === 'raise' && is3Bet
            ? '3B'
            : action === 'raise'
              ? 'R'
              : action === 'call'
                ? 'C'
                : 'F'}
        </span>
      )}
    </button>
  )
}
