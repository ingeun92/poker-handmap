import type { Hand, HandName, HandStrength, Rank, StrengthTier } from '@/types/hand'
import { RANKS } from '@/types/hand'

// 표준 프리플랍 핸드 랭킹 (1=가장 강함, 169=가장 약함)
// 출처: 스카란스키 핸드 그룹 + 표준 포커 이론
const HAND_RANKINGS: Record<HandName, { rank: number; tier: StrengthTier }> = {
  // ===== PREMIUM (Tier 1) =====
  'AA': { rank: 1, tier: 'premium' },
  'KK': { rank: 2, tier: 'premium' },
  'QQ': { rank: 3, tier: 'premium' },
  'JJ': { rank: 5, tier: 'premium' },
  'AKs': { rank: 4, tier: 'premium' },
  'AQs': { rank: 6, tier: 'premium' },
  'KQs': { rank: 7, tier: 'premium' },
  'AJs': { rank: 8, tier: 'premium' },
  'KJs': { rank: 9, tier: 'premium' },
  'TT': { rank: 10, tier: 'premium' },
  'AKo': { rank: 11, tier: 'premium' },
  'ATs': { rank: 12, tier: 'premium' },
  'QJs': { rank: 13, tier: 'premium' },

  // ===== STRONG (Tier 2) =====
  'KTs': { rank: 14, tier: 'strong' },
  'QTs': { rank: 15, tier: 'strong' },
  'JTs': { rank: 16, tier: 'strong' },
  '99': { rank: 17, tier: 'strong' },
  'AQo': { rank: 18, tier: 'strong' },
  'A9s': { rank: 19, tier: 'strong' },
  'KQo': { rank: 20, tier: 'strong' },
  '88': { rank: 21, tier: 'strong' },
  'K9s': { rank: 22, tier: 'strong' },
  'T9s': { rank: 23, tier: 'strong' },
  'A8s': { rank: 24, tier: 'strong' },
  'Q9s': { rank: 25, tier: 'strong' },
  'J9s': { rank: 26, tier: 'strong' },
  'AJo': { rank: 27, tier: 'strong' },
  'A7s': { rank: 30, tier: 'strong' },
  '77': { rank: 29, tier: 'strong' },
  'K8s': { rank: 37, tier: 'strong' },
  'T8s': { rank: 38, tier: 'strong' },
  'KJo': { rank: 31, tier: 'strong' },
  'A6s': { rank: 34, tier: 'strong' },
  '98s': { rank: 40, tier: 'playable' },
  'A5s': { rank: 28, tier: 'strong' },
  'A4s': { rank: 32, tier: 'strong' },
  'A3s': { rank: 33, tier: 'strong' },
  'A2s': { rank: 39, tier: 'playable' },

  // ===== PLAYABLE (Tier 3) =====
  '66': { rank: 36, tier: 'strong' },
  'K7s': { rank: 41, tier: 'playable' },
  'QJo': { rank: 35, tier: 'strong' },
  '87s': { rank: 42, tier: 'playable' },
  'Q8s': { rank: 43, tier: 'playable' },
  '55': { rank: 44, tier: 'playable' },
  'J8s': { rank: 45, tier: 'playable' },
  'JTo': { rank: 46, tier: 'playable' },
  'ATo': { rank: 47, tier: 'playable' },
  '76s': { rank: 48, tier: 'playable' },
  'K6s': { rank: 49, tier: 'playable' },
  '97s': { rank: 50, tier: 'playable' },
  'KTo': { rank: 51, tier: 'playable' },
  '65s': { rank: 52, tier: 'playable' },
  'T7s': { rank: 53, tier: 'playable' },
  'K5s': { rank: 54, tier: 'playable' },
  'QTo': { rank: 55, tier: 'playable' },
  '54s': { rank: 56, tier: 'playable' },
  'K4s': { rank: 57, tier: 'playable' },
  '86s': { rank: 58, tier: 'playable' },
  'K3s': { rank: 59, tier: 'playable' },
  'K2s': { rank: 60, tier: 'playable' },
  'Q7s': { rank: 61, tier: 'playable' },
  'J7s': { rank: 62, tier: 'playable' },
  '75s': { rank: 63, tier: 'playable' },

  // ===== MARGINAL (Tier 4) =====
  '44': { rank: 64, tier: 'marginal' },
  'Q6s': { rank: 65, tier: 'marginal' },
  '96s': { rank: 66, tier: 'marginal' },
  'T9o': { rank: 67, tier: 'marginal' },
  '64s': { rank: 68, tier: 'marginal' },
  '33': { rank: 69, tier: 'marginal' },
  'Q5s': { rank: 70, tier: 'marginal' },
  'J9o': { rank: 71, tier: 'marginal' },
  '85s': { rank: 72, tier: 'marginal' },
  '53s': { rank: 73, tier: 'marginal' },
  'Q4s': { rank: 74, tier: 'marginal' },
  '22': { rank: 75, tier: 'marginal' },
  'Q3s': { rank: 76, tier: 'marginal' },
  '98o': { rank: 77, tier: 'marginal' },
  'Q2s': { rank: 78, tier: 'marginal' },
  '43s': { rank: 79, tier: 'marginal' },
  '74s': { rank: 80, tier: 'marginal' },
  'J6s': { rank: 81, tier: 'marginal' },
  'A9o': { rank: 82, tier: 'marginal' },
  'Q9o': { rank: 83, tier: 'marginal' },
  '87o': { rank: 84, tier: 'marginal' },
  'J5s': { rank: 85, tier: 'marginal' },
  'K9o': { rank: 86, tier: 'marginal' },
  '76o': { rank: 87, tier: 'marginal' },
  'J4s': { rank: 88, tier: 'marginal' },
  '63s': { rank: 89, tier: 'marginal' },
  'J3s': { rank: 90, tier: 'marginal' },
  'J2s': { rank: 91, tier: 'marginal' },
  'A8o': { rank: 92, tier: 'marginal' },

  // ===== WEAK (Tier 5) =====
  'T6s': { rank: 93, tier: 'weak' },
  '97o': { rank: 94, tier: 'weak' },
  'A7o': { rank: 95, tier: 'weak' },
  'A6o': { rank: 96, tier: 'weak' },
  '65o': { rank: 97, tier: 'weak' },
  'A5o': { rank: 98, tier: 'weak' },
  '52s': { rank: 99, tier: 'weak' },
  'A4o': { rank: 100, tier: 'weak' },
  '86o': { rank: 101, tier: 'weak' },
  'T5s': { rank: 102, tier: 'weak' },
  'A3o': { rank: 103, tier: 'weak' },
  '54o': { rank: 104, tier: 'weak' },
  '42s': { rank: 105, tier: 'weak' },
  'T4s': { rank: 106, tier: 'weak' },
  'A2o': { rank: 107, tier: 'weak' },
  '75o': { rank: 108, tier: 'weak' },
  'T3s': { rank: 109, tier: 'weak' },
  '32s': { rank: 110, tier: 'weak' },
  'T2s': { rank: 111, tier: 'weak' },
  'K8o': { rank: 112, tier: 'weak' },
  '96o': { rank: 113, tier: 'weak' },
  'J8o': { rank: 114, tier: 'weak' },
  'T8o': { rank: 115, tier: 'weak' },
  '64o': { rank: 116, tier: 'weak' },
  '85o': { rank: 117, tier: 'weak' },
  'K7o': { rank: 118, tier: 'weak' },
  '95s': { rank: 119, tier: 'weak' },
  '53o': { rank: 120, tier: 'weak' },
  'K6o': { rank: 121, tier: 'weak' },
  '74o': { rank: 122, tier: 'weak' },
  'Q8o': { rank: 123, tier: 'weak' },
  '43o': { rank: 124, tier: 'weak' },
  '94s': { rank: 125, tier: 'weak' },
  'K5o': { rank: 126, tier: 'weak' },
  'J7o': { rank: 127, tier: 'weak' },
  '93s': { rank: 128, tier: 'weak' },
  '63o': { rank: 129, tier: 'weak' },
  '92s': { rank: 130, tier: 'weak' },
  'K4o': { rank: 131, tier: 'weak' },
  '84s': { rank: 132, tier: 'weak' },
  'T7o': { rank: 133, tier: 'weak' },
  '73s': { rank: 134, tier: 'weak' },
  'Q7o': { rank: 135, tier: 'weak' },
  'K3o': { rank: 136, tier: 'weak' },
  '52o': { rank: 137, tier: 'weak' },
  '83s': { rank: 138, tier: 'weak' },
  'K2o': { rank: 139, tier: 'weak' },
  '62s': { rank: 140, tier: 'weak' },
  '82s': { rank: 141, tier: 'weak' },
  '42o': { rank: 142, tier: 'weak' },
  'Q6o': { rank: 143, tier: 'weak' },
  '92o': { rank: 144, tier: 'weak' },
  '72s': { rank: 145, tier: 'weak' },
  'J6o': { rank: 146, tier: 'weak' },
  'Q5o': { rank: 147, tier: 'weak' },
  '32o': { rank: 148, tier: 'weak' },
  '95o': { rank: 149, tier: 'weak' },
  'J5o': { rank: 150, tier: 'weak' },
  'Q4o': { rank: 151, tier: 'weak' },
  '84o': { rank: 152, tier: 'weak' },
  'Q3o': { rank: 153, tier: 'weak' },
  'T6o': { rank: 154, tier: 'weak' },
  'J4o': { rank: 155, tier: 'weak' },
  'Q2o': { rank: 156, tier: 'weak' },
  '94o': { rank: 157, tier: 'weak' },
  'J3o': { rank: 158, tier: 'weak' },
  '82o': { rank: 159, tier: 'weak' },
  'J2o': { rank: 160, tier: 'weak' },
  'T5o': { rank: 161, tier: 'weak' },
  '93o': { rank: 162, tier: 'weak' },
  'T4o': { rank: 163, tier: 'weak' },
  '83o': { rank: 164, tier: 'weak' },
  'T3o': { rank: 165, tier: 'weak' },
  'T2o': { rank: 166, tier: 'weak' },
  '73o': { rank: 167, tier: 'weak' },
  '62o': { rank: 168, tier: 'weak' },
  '72o': { rank: 169, tier: 'weak' },
}

function getHandName(r1: Rank, r2: Rank, row: number, col: number): HandName {
  if (row === col) {
    return `${r1}${r2}` // pocket pair
  } else if (row < col) {
    return `${r1}${r2}s` // suited (상삼각형) - r1이 높은 랭크
  } else {
    return `${r2}${r1}o` // offsuit (하삼각형) - 높은 랭크(r2)를 앞에
  }
}

function getHandTier(name: HandName): StrengthTier {
  const info = HAND_RANKINGS[name]
  if (info) return info.tier
  return 'weak'
}

function getHandRank(name: HandName): number {
  const info = HAND_RANKINGS[name]
  if (info) return info.rank
  // 등록되지 않은 핸드는 약한 순위
  return 150
}

// 13x13 그리드 생성
const HAND_GRID: Hand[][] = RANKS.map((r1, row) =>
  RANKS.map((r2, col) => {
    const name = getHandName(r1, r2, row, col)
    let suit: Hand['suit']
    if (row === col) suit = 'p'
    else if (row < col) suit = 's'
    else suit = 'o'
    return {
      name,
      rank1: r1,
      rank2: r2,
      suit,
      row,
      col,
    }
  })
)

// 모든 169개 핸드의 강도 정보
const HAND_STRENGTHS: Record<HandName, HandStrength> = {}

HAND_GRID.forEach(row =>
  row.forEach(hand => {
    HAND_STRENGTHS[hand.name] = {
      hand: hand.name,
      tier: getHandTier(hand.name),
      numericRank: getHandRank(hand.name),
    }
  })
)

// 평면 배열 (모든 169개 핸드)
const ALL_HANDS: Hand[] = HAND_GRID.flat()

export { HAND_GRID, HAND_STRENGTHS, ALL_HANDS }
