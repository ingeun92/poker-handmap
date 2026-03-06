import type { StrengthTier } from '@/types/hand'

export function getTierColor(tier: StrengthTier): string {
  switch (tier) {
    case 'premium':
      return 'bg-red-500'
    case 'strong':
      return 'bg-orange-400'
    case 'playable':
      return 'bg-yellow-400'
    case 'marginal':
      return 'bg-blue-400'
    case 'weak':
      return 'bg-gray-400'
  }
}

export function getTierTextColor(tier: StrengthTier): string {
  switch (tier) {
    case 'premium':
      return 'text-white'
    case 'strong':
      return 'text-white'
    case 'playable':
      return 'text-gray-800'
    case 'marginal':
      return 'text-white'
    case 'weak':
      return 'text-gray-700'
  }
}

export function getTierLabel(tier: StrengthTier): string {
  switch (tier) {
    case 'premium':
      return '프리미엄'
    case 'strong':
      return '강한 핸드'
    case 'playable':
      return '플레이어블'
    case 'marginal':
      return '마지널'
    case 'weak':
      return '약한 핸드'
  }
}

export function getTierBorderColor(tier: StrengthTier): string {
  switch (tier) {
    case 'premium':
      return 'border-red-600'
    case 'strong':
      return 'border-orange-500'
    case 'playable':
      return 'border-yellow-500'
    case 'marginal':
      return 'border-blue-500'
    case 'weak':
      return 'border-gray-500'
  }
}
