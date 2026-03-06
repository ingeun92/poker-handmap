export type Suit = 's' | 'o' | 'p'  // suited, offsuit, pair
export type HandName = string  // e.g. "AKs", "72o", "JJ"
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'

export interface Hand {
  name: HandName
  rank1: Rank
  rank2: Rank
  suit: Suit
  row: number    // 0-12 grid position
  col: number    // 0-12 grid position
}

export type StrengthTier = 'premium' | 'strong' | 'playable' | 'marginal' | 'weak'

export interface HandStrength {
  hand: HandName
  tier: StrengthTier
  numericRank: number   // 1-169 (1=strongest)
}

export type ActionCategory = 'raise' | 'call' | 'fold'

export const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
