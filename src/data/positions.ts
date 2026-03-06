import type { HandName, ActionCategory } from '@/types/hand'

export type Position = 'UTG' | 'MP' | 'CO' | 'BTN' | 'SB' | 'BB'

export interface PositionRange {
  position: Position
  label: string
  actions: Record<HandName, ActionCategory>
  threeBets: Set<HandName>
}

// ===== UTG - 가장 보수적 (레이즈 or 폴드, ~14%) =====
const UTG_RAISES: HandName[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
  'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A5s',
  'KQs', 'KJs', 'KTs', 'K9s',
  'QJs', 'QTs',
  'JTs', 'J9s',
  'T9s',
  '98s',
  '87s',
  '76s',
  '65s',
  'AKo', 'AQo', 'AJo', 'ATo',
]

// ===== MP - UTG + 확장 (레이즈 or 폴드, ~19%) =====
const MP_RAISES: HandName[] = [
  ...UTG_RAISES,
  '44',
  'A7s', 'A6s', 'A4s',
  'K8s',
  'Q9s',
  'J8s',
  'T8s',
  '54s',
  'KQo', 'KJo',
]

// ===== CO - 넓은 오픈 레인지 (레이즈 or 폴드, ~27%) =====
const CO_RAISES: HandName[] = [
  ...MP_RAISES,
  '33',
  'A3s', 'A2s',
  'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
  'Q8s', 'Q7s', 'Q6s', 'Q5s',
  'J7s',
  'T7s',
  '97s',
  '86s',
  '75s',
  '64s',
  'KTo', 'QJo',
]

// ===== BTN - 가장 넓은 레인지 (레이즈 or 폴드) =====
const BTN_RAISES: HandName[] = [
  ...CO_RAISES,
  '22',
  'Q4s', 'Q3s',
  'J6s', 'J5s', 'J4s',
  'T6s', 'T5s',
  '96s', '95s',
  '85s', '84s',
  '74s',
  '63s',
  '53s', '52s',
  '43s',
  'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
  'K9o', 'K8o',
  'QTo', 'Q9o',
  'JTo', 'J9o', 'J8o',
  'T9o', 'T8o',
  '98o',
  '87o',
]

// ===== SB - 레이즈 or 폴드 (OOP이지만 넓은 레인지, 40-47%) =====
const SB_RAISES: HandName[] = [
  ...CO_RAISES,
  '22',
  'Q4s',
  'J6s', 'J5s',
  'T6s', 'T5s',
  '96s', '95s',
  '85s', '84s',
  '74s',
  '63s',
  '53s', '52s',
  '43s',
  'A9o', 'A8o', 'A7o', 'A6o',
  'K9o', 'K8o',
  'QTo', 'Q9o',
  'JTo', 'J9o',
  'T9o', 'T8o',
  '98o',
  '87o', '76o',
]

// ===== BB - 3벳 레인지 (밸류 + 블러프) =====
const BB_RAISES: HandName[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT',
  'AKs', 'AQs', 'AJs',
  'A5s', 'A4s', 'A3s', 'A2s', // 블러프 3벳 (에이스 블로커 + 휠 스트레이트)
  'AKo', 'AQo',
]

const BB_CALLS: HandName[] = [
  '99', '88', '77', '66', '55', '44', '33', '22',
  'ATs', 'A9s', 'A8s', 'A7s', 'A6s',
  'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s',
  'QJs', 'QTs', 'Q9s', 'Q8s',
  'JTs', 'J9s', 'J8s',
  'T9s', 'T8s', 'T7s',
  '98s', '97s', '96s',
  '87s', '86s', '85s',
  '76s', '75s', '74s',
  '65s', '64s',
  '54s', '53s',
  '43s',
  'AJo', 'ATo', 'A9o', 'A8o',
  'KQo', 'KJo', 'KTo', 'K9o',
  'QJo', 'QTo', 'Q9o',
  'JTo', 'J9o', 'J8o',
  'T9o', 'T8o',
  '98o', '97o',
  '87o', '86o',
  '76o',
]

// ===== 3벳 레인지 (포지션별, 실전 TAG 기준) =====

// UTG: 오프너 포지션이므로 3벳 없음
const UTG_3BETS: HandName[] = []

// MP vs UTG 오픈
const MP_3BETS: HandName[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT',
  'AKs', 'AQs',
  'A5s', // 블러프 3벳
  'AKo', 'AQo',
]

// CO vs 앞 포지션 오픈
const CO_3BETS: HandName[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT',
  'AKs', 'AQs', 'AJs',
  'A5s', 'A4s', 'A3s', // 블러프 3벳
  'AKo', 'AQo',
]

// BTN vs 앞 포지션 오픈 (가장 넓은 3벳)
const BTN_3BETS: HandName[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
  'AKs', 'AQs', 'AJs', 'ATs',
  'KQs',
  'A5s', 'A4s', 'A3s', 'A2s', // 블러프 3벳
  '87s', '76s', '65s', '54s', // 수티드 커넥터 블러프
  'AKo', 'AQo',
]

// SB vs 모든 오픈 (OOP이므로 3벳 or 폴드)
const SB_3BETS: HandName[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT',
  'AKs', 'AQs', 'AJs',
  'KQs',
  'A5s', 'A4s', 'A3s', 'A2s', // 블러프 3벳
  '87s', '76s', '65s', // 수티드 커넥터 블러프
  'AKo', 'AQo',
]

// BB vs 모든 오픈 (BB 레이즈 = 3벳)
const BB_3BETS: HandName[] = [...BB_RAISES]

export function buildPositionActions(
  raises: HandName[],
  calls: HandName[]
): Record<HandName, ActionCategory> {
  const actions: Record<HandName, ActionCategory> = {}
  raises.forEach(h => { actions[h] = 'raise' })
  calls.forEach(h => { actions[h] = 'call' })
  return actions
}

export const POSITION_RANGES: Record<Position, PositionRange> = {
  UTG: {
    position: 'UTG',
    label: '언더더건',
    actions: buildPositionActions(UTG_RAISES, []),
    threeBets: new Set(UTG_3BETS),
  },
  MP: {
    position: 'MP',
    label: '미들 포지션',
    actions: buildPositionActions(MP_RAISES, []),
    threeBets: new Set(MP_3BETS),
  },
  CO: {
    position: 'CO',
    label: '컷오프',
    actions: buildPositionActions(CO_RAISES, []),
    threeBets: new Set(CO_3BETS),
  },
  BTN: {
    position: 'BTN',
    label: '버튼',
    actions: buildPositionActions(BTN_RAISES, []),
    threeBets: new Set(BTN_3BETS),
  },
  SB: {
    position: 'SB',
    label: '스몰 블라인드',
    actions: buildPositionActions(SB_RAISES, []),
    threeBets: new Set(SB_3BETS),
  },
  BB: {
    position: 'BB',
    label: '빅 블라인드',
    actions: buildPositionActions(BB_RAISES, BB_CALLS),
    threeBets: new Set(BB_3BETS),
  },
}

export const POSITIONS: Position[] = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB']
