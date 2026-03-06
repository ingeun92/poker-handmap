import type { StrengthTier } from '@/types/hand'
import { getTierColor, getTierTextColor } from '@/utils/color-utils'

const TIER_CYCLE: (StrengthTier | null)[] = ['premium', 'strong', 'playable', 'marginal', 'weak', null]

interface GridFillCellProps {
  handName: string
  selectedTier: StrengthTier | null
  correctTier?: StrengthTier
  showResult?: boolean
  disabled?: boolean
  onTierChange: (tier: StrengthTier | null) => void
}

export function GridFillCell({
  handName,
  selectedTier,
  correctTier,
  showResult = false,
  disabled = false,
  onTierChange,
}: GridFillCellProps) {
  const handleClick = () => {
    if (disabled) return
    const currentIndex = TIER_CYCLE.indexOf(selectedTier)
    const nextIndex = (currentIndex + 1) % TIER_CYCLE.length
    onTierChange(TIER_CYCLE[nextIndex] ?? null)
  }

  const isCorrect = showResult && correctTier && selectedTier === correctTier
  const isWrong = showResult && correctTier && selectedTier !== correctTier

  const bgClass = selectedTier ? getTierColor(selectedTier) : 'bg-gray-100'
  const textClass = selectedTier ? getTierTextColor(selectedTier) : 'text-gray-400'

  return (
    <button
      onClick={handleClick}
      disabled={disabled && !showResult}
      className={[
        'w-full aspect-square flex items-center justify-center text-xs font-semibold rounded transition-all',
        bgClass,
        textClass,
        !disabled && 'hover:opacity-80 cursor-pointer',
        disabled && 'cursor-default',
        showResult && isCorrect && 'ring-2 ring-green-500 ring-offset-1',
        showResult && isWrong && 'ring-2 ring-red-500 ring-offset-1',
      ]
        .filter(Boolean)
        .join(' ')}
      title={selectedTier ?? '미선택'}
    >
      <span className="leading-none">{handName}</span>
    </button>
  )
}
