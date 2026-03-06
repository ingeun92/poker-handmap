import type { Hand } from '@/types/hand'
import { HAND_STRENGTHS } from '@/data/hands'
import { getTierColor, getTierLabel, getTierTextColor } from '@/utils/color-utils'

interface HandTooltipProps {
  hand: Hand
  x: number
  y: number
}

const SUIT_LABEL: Record<string, string> = {
  's': '동색 (Suited)',
  'o': '이색 (Offsuit)',
  'p': '포켓 페어 (Pocket Pair)',
}

export function HandTooltip({ hand, x, y }: HandTooltipProps) {
  const strength = HAND_STRENGTHS[hand.name]
  const tier = strength?.tier ?? 'weak'
  const bgColor = getTierColor(tier)
  const textColor = getTierTextColor(tier)

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x + 12, top: y - 10 }}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 min-w-36 border border-gray-700">
        <div className={`${bgColor} ${textColor} rounded px-2 py-1 text-center font-bold text-lg mb-2`}>
          {hand.name}
        </div>
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">등급</span>
            <span className="font-semibold">{getTierLabel(tier)}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">랭킹</span>
            <span className="font-semibold">{strength?.numericRank ?? '?'} / 169</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">타입</span>
            <span className="font-semibold">{SUIT_LABEL[hand.suit] ?? ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
