import type { StrengthTier } from '@/types/hand'
import { getTierColor, getTierLabel, getTierTextColor } from '@/utils/color-utils'
import { getHandsInTier } from '@/utils/hand-utils'

const TIERS: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']

interface HandLegendProps {
  activeTiers?: Set<StrengthTier>
  onTierToggle?: (tier: StrengthTier) => void
}

export function HandLegend({ activeTiers, onTierToggle }: HandLegendProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {TIERS.map(tier => {
        const count = getHandsInTier(tier).length
        const bgColor = getTierColor(tier)
        const textColor = getTierTextColor(tier)
        const isActive = activeTiers ? activeTiers.has(tier) : true
        const isClickable = !!onTierToggle

        return (
          <button
            key={tier}
            onClick={() => onTierToggle?.(tier)}
            className={[
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              bgColor,
              textColor,
              isClickable ? 'cursor-pointer hover:opacity-90' : 'cursor-default',
              isActive ? 'opacity-100' : 'opacity-40',
            ].join(' ')}
          >
            <span>{getTierLabel(tier)}</span>
            <span className="text-xs opacity-75">({count})</span>
          </button>
        )
      })}
    </div>
  )
}
