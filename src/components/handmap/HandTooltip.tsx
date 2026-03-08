import type { Hand, ActionCategory } from '@/types/hand'
import { HAND_STRENGTHS } from '@/data/hands'
import { getTierLabel } from '@/utils/color-utils'

interface HandTooltipProps {
  hand: Hand
  x: number
  y: number
  action?: ActionCategory
  is3Bet?: boolean
}

const SUIT_LABEL: Record<string, string> = {
  's': 'Suited',
  'o': 'Offsuit',
  'p': 'Pocket Pair',
}

function getActionInfo(action: ActionCategory, is3Bet: boolean): { label: string; color: string; bg: string } {
  if (action === 'raise' && is3Bet) return { label: '3-Bet', color: '#fff', bg: '#dc2626' }
  if (action === 'raise') return { label: 'Raise', color: '#fff', bg: '#059669' }
  if (action === 'call') return { label: 'Call', color: '#fff', bg: '#2563eb' }
  return { label: 'Fold', color: '#888', bg: '#2a2a3e' }
}

export function HandTooltip({ hand, x, y, action, is3Bet }: HandTooltipProps) {
  const strength = HAND_STRENGTHS[hand.name]
  const tier = strength?.tier ?? 'weak'
  const actionInfo = action ? getActionInfo(action, !!is3Bet) : null

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x + 14, top: y - 14 }}
    >
      <div className="rounded-lg shadow-2xl p-3 min-w-40 border border-white/10"
        style={{ background: '#12121f', backdropFilter: 'blur(12px)' }}
      >
        {/* Hand name + action badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono font-bold text-xl text-white">{hand.name}</span>
          {actionInfo && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
              style={{ background: actionInfo.bg, color: actionInfo.color }}
            >
              {actionInfo.label}
            </span>
          )}
        </div>

        <div className="text-xs space-y-1.5 font-sans">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">등급</span>
            <span className="font-semibold text-gray-300">{getTierLabel(tier)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">랭킹</span>
            <span className="font-semibold text-gray-300">{strength?.numericRank ?? '?'} / 169</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">타입</span>
            <span className="font-semibold text-gray-300">{SUIT_LABEL[hand.suit] ?? ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
