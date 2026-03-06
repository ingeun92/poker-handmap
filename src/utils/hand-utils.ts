import type { Hand, HandName, StrengthTier } from '@/types/hand'
import { ALL_HANDS, HAND_STRENGTHS } from '@/data/hands'

export function getHandByName(name: HandName): Hand | undefined {
  return ALL_HANDS.find(h => h.name === name)
}

/**
 * 두 핸드를 비교합니다.
 * @returns 양수: a가 b보다 강함, 음수: b가 a보다 강함, 0: 동일
 */
export function compareHands(a: HandName, b: HandName): number {
  const rankA = HAND_STRENGTHS[a]?.numericRank ?? 999
  const rankB = HAND_STRENGTHS[b]?.numericRank ?? 999
  return rankB - rankA // 낮은 숫자 = 강한 핸드
}

export function getHandsInTier(tier: StrengthTier): Hand[] {
  return ALL_HANDS.filter(h => HAND_STRENGTHS[h.name]?.tier === tier)
}

export function getRandomHand(): Hand {
  const idx = Math.floor(Math.random() * ALL_HANDS.length)
  return ALL_HANDS[idx]!
}

/**
 * 난이도에 따라 두 핸드 쌍을 반환합니다.
 * easy: 다른 tier끼리, medium: 인접 tier, hard: 같은 tier
 */
export function getRandomHandPair(difficulty: 'easy' | 'medium' | 'hard'): [Hand, Hand] {
  if (difficulty === 'easy') {
    // 다른 tier에서 하나씩
    const tiers: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']
    const tierA = tiers[Math.floor(Math.random() * 3)]! // premium ~ playable
    const tierB = tiers[Math.floor(Math.random() * 2) + 3]! // marginal ~ weak
    const handsA = getHandsInTier(tierA)
    const handsB = getHandsInTier(tierB)
    const handA = handsA[Math.floor(Math.random() * handsA.length)]!
    const handB = handsB[Math.floor(Math.random() * handsB.length)]!
    return [handA, handB]
  }

  if (difficulty === 'medium') {
    // 인접 tier에서 하나씩
    const tiers: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']
    const tierIdx = Math.floor(Math.random() * (tiers.length - 1))
    const tierA = tiers[tierIdx]!
    const tierB = tiers[tierIdx + 1]!
    const handsA = getHandsInTier(tierA)
    const handsB = getHandsInTier(tierB)
    const handA = handsA[Math.floor(Math.random() * handsA.length)]!
    const handB = handsB[Math.floor(Math.random() * handsB.length)]!
    return [handA, handB]
  }

  // hard: 같은 tier에서 두 핸드
  const tiers: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']
  const tier = tiers[Math.floor(Math.random() * tiers.length)]!
  const handsInTier = getHandsInTier(tier)
  if (handsInTier.length < 2) {
    // 폴백
    return [getRandomHand(), getRandomHand()]
  }
  const idxA = Math.floor(Math.random() * handsInTier.length)
  let idxB = Math.floor(Math.random() * handsInTier.length)
  while (idxB === idxA) {
    idxB = Math.floor(Math.random() * handsInTier.length)
  }
  return [handsInTier[idxA]!, handsInTier[idxB]!]
}
