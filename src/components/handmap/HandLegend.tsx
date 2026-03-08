import type { StrengthTier } from '@/types/hand'
import { getTierLabel } from '@/utils/color-utils'
import { getHandsInTier } from '@/utils/hand-utils'
import type { ColorMode } from './HandCell'

const TIERS: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']

interface HandLegendProps {
  activeTiers?: Set<StrengthTier>
  onTierToggle?: (tier: StrengthTier)=> void
  colorMode?: ColorMode
}

const TIER_STYLES: Record<StrengthTier, { bg: string; text: string }> = {
  premium: { bg: 'bg-purple-500/20 border-purple-500/40', text: 'text-purple-400' },
  strong: { bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-400' },
  playable: { bg: 'bg-yellow-500/20 border-yellow-500/40', text: 'text-yellow-400' },
  marginal: { bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-400' },
  weak: { bg: 'bg-gray-500/20 border-gray-500/40', text: 'text-gray-500' },
}

export function HandLegend({ activeTiers, onTierToggle, colorMode = 'action' }: HandLegendProps) {
  if (colorMode === 'action') return null

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {TIERS.map(tier => {
        const count = getHandsInTier(tier).length
        const styles = TIER_STYLES[tier]
        const isActive = activeTiers ? activeTiers.has(tier) : true

        return (
          <button
            key={tier}
            onClick={() => onTierToggle?.(tier)}
            className={[
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
              styles.bg,
              styles.text,
              isActive ? 'opacity-100' : 'opacity-30',
              onTierToggle ? 'cursor-pointer hover:opacity-90' : 'cursor-default',
            ].join(' ')}
          >
            <span>{getTierLabel(tier)}</span>
            <span className="opacity-60">({count})</span>
          </button>
        )
      })}
    </div>
  )
}
