import type { HandName } from '@/types/hand'
import type { Position } from '@/data/positions'

export interface VsOpenRange {
  raises: HandName[]  // 3-bet
  calls: HandName[]   // cold call
}

// 매치업 키: "수비포지션_vs_오프너" 형태
export type VsOpenKey = `${Position}_vs_${Position}`

// ===== MP vs UTG 오픈 =====
const MP_vs_UTG: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs',
    'A5s',
    'AKo', 'AQo',
  ],
  calls: [
    '99', '88', '77',
    'AJs', 'ATs',
    'KQs', 'KJs',
    'QJs',
    'JTs',
    'T9s',
    '98s',
    '87s',
    'AJo',
  ],
}

// ===== CO vs UTG 오픈 =====
const CO_vs_UTG: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs',
    'A5s', 'A4s',
    'AKo', 'AQo',
  ],
  calls: [
    '99', '88', '77',
    'ATs', 'A9s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs', 'J9s',
    'T9s',
    '98s',
    '87s',
    '76s',
    'AJo',
    'KQo',
  ],
}

// ===== CO vs MP 오픈 =====
const CO_vs_MP: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs',
    'A5s', 'A4s', 'A3s',
    'AKo', 'AQo',
  ],
  calls: [
    '99', '88', '77', '66',
    'ATs', 'A9s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs', 'J9s',
    'T9s',
    '98s',
    '87s',
    '76s',
    '65s',
    'AJo',
    'KQo',
  ],
}

// ===== BTN vs UTG 오픈 =====
const BTN_vs_UTG: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
    'AKs', 'AQs', 'AJs', 'ATs',
    'KQs',
    'A5s', 'A4s',
    'AKo', 'AQo',
  ],
  calls: [
    '88', '77', '66',
    'A9s', 'A8s',
    'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs', 'J9s',
    'T9s', 'T8s',
    '98s', '97s',
    '87s', '86s',
    '76s', '75s',
    '65s',
    '54s',
    'AJo',
    'KQo',
  ],
}

// ===== BTN vs MP 오픈 =====
const BTN_vs_MP: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
    'AKs', 'AQs', 'AJs', 'ATs',
    'KQs',
    'A5s', 'A4s', 'A3s', 'A2s',
    '87s', '76s',
    'AKo', 'AQo',
  ],
  calls: [
    '88', '77', '66', '55',
    'A9s', 'A8s',
    'KJs', 'KTs', 'K9s',
    'QJs', 'QTs',
    'JTs', 'J9s',
    'T9s', 'T8s',
    '98s', '97s',
    '86s',
    '75s',
    '65s', '64s',
    '54s', '53s',
    'AJo',
    'KQo', 'KJo',
  ],
}

// ===== BTN vs CO 오픈 =====
const BTN_vs_CO: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
    'KQs', 'KJs',
    'A5s', 'A4s', 'A3s', 'A2s',
    '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo',
  ],
  calls: [
    '88', '77', '66', '55', '44',
    'A8s', 'A7s', 'A6s',
    'KTs', 'K9s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s',
    'T9s', 'T8s',
    '98s', '97s',
    '86s', '85s',
    '75s', '74s',
    '64s', '63s',
    '53s',
    '43s',
    'KQo', 'KJo',
    'QJo',
    'JTo',
    'T9o',
  ],
}

// ===== SB vs 오픈 (3-bet or fold, 콜 없음 - OOP) =====
const SB_vs_UTG: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs',
    'A5s', 'A4s',
    'AKo', 'AQo',
  ],
  calls: [],
}

const SB_vs_MP: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs',
    'KQs',
    'A5s', 'A4s', 'A3s',
    'AKo', 'AQo',
  ],
  calls: [],
}

const SB_vs_CO: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
    'AKs', 'AQs', 'AJs', 'ATs',
    'KQs',
    'A5s', 'A4s', 'A3s', 'A2s',
    '87s', '76s', '65s',
    'AKo', 'AQo',
  ],
  calls: [],
}

const SB_vs_BTN: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
    'KQs', 'KJs',
    'QJs',
    'A5s', 'A4s', 'A3s', 'A2s',
    '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo',
  ],
  calls: [],
}

// ===== BB vs 오픈 (3-bet + wide call) =====
const BB_vs_UTG: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ',
    'AKs', 'AQs',
    'A5s', 'A4s',
    'AKo',
  ],
  calls: [
    'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s',
    'KQs', 'KJs', 'KTs', 'K9s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s',
    'T9s', 'T8s',
    '98s', '97s',
    '87s', '86s',
    '76s', '75s',
    '65s', '64s',
    '54s', '53s',
    '43s',
    'AQo', 'AJo', 'ATo',
    'KQo', 'KJo', 'KTo',
    'QJo', 'QTo',
    'JTo',
    'T9o',
    '98o',
  ],
}

const BB_vs_MP: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs',
    'A5s', 'A4s', 'A3s',
    'AKo', 'AQo',
  ],
  calls: [
    '99', '88', '77', '66', '55', '44', '33', '22',
    'ATs', 'A9s', 'A8s', 'A7s', 'A6s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
    'QJs', 'QTs', 'Q9s', 'Q8s',
    'JTs', 'J9s', 'J8s',
    'T9s', 'T8s', 'T7s',
    '98s', '97s', '96s',
    '87s', '86s', '85s',
    '76s', '75s', '74s',
    '65s', '64s',
    '54s', '53s',
    '43s',
    'AJo', 'ATo', 'A9o',
    'KQo', 'KJo', 'KTo',
    'QJo', 'QTo',
    'JTo', 'J9o',
    'T9o',
    '98o',
    '87o',
  ],
}

const BB_vs_CO: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs', 'ATs',
    'KQs',
    'A5s', 'A4s', 'A3s', 'A2s',
    '87s', '76s',
    'AKo', 'AQo',
  ],
  calls: [
    '99', '88', '77', '66', '55', '44', '33', '22',
    'A9s', 'A8s', 'A7s', 'A6s',
    'KJs', 'KTs', 'K9s', 'K8s', 'K7s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
    'JTs', 'J9s', 'J8s', 'J7s',
    'T9s', 'T8s', 'T7s',
    '98s', '97s', '96s',
    '86s', '85s',
    '75s', '74s',
    '65s', '64s',
    '54s', '53s',
    '43s',
    'AJo', 'ATo', 'A9o', 'A8o',
    'KQo', 'KJo', 'KTo', 'K9o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o',
    'T9o', 'T8o',
    '98o', '97o',
    '87o', '86o',
    '76o',
  ],
}

const BB_vs_BTN: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
    'KQs', 'KJs',
    'A5s', 'A4s', 'A3s', 'A2s',
    'K9s',
    '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo',
  ],
  calls: [
    '88', '77', '66', '55', '44', '33', '22',
    'A8s', 'A7s', 'A6s',
    'KTs', 'K8s', 'K7s', 'K6s', 'K5s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s',
    'JTs', 'J9s', 'J8s', 'J7s',
    'T9s', 'T8s', 'T7s', 'T6s',
    '98s', '97s', '96s', '95s',
    '86s', '85s', '84s',
    '75s', '74s',
    '64s', '63s',
    '53s', '52s',
    '43s',
    'ATo', 'A9o', 'A8o', 'A7o', 'A6o',
    'KQo', 'KJo', 'KTo', 'K9o', 'K8o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o', 'J8o',
    'T9o', 'T8o',
    '98o', '97o',
    '87o', '86o',
    '76o', '75o',
    '65o',
  ],
}

const BB_vs_SB: VsOpenRange = {
  raises: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs', 'JTs',
    'A5s', 'A4s', 'A3s', 'A2s',
    'K9s',
    '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo', 'ATo',
    'KQo',
  ],
  calls: [
    '77', '66', '55', '44', '33', '22',
    'A7s', 'A6s',
    'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
    'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
    'J9s', 'J8s', 'J7s', 'J6s',
    'T9s', 'T8s', 'T7s', 'T6s',
    '98s', '97s', '96s', '95s',
    '86s', '85s', '84s',
    '75s', '74s', '73s',
    '64s', '63s', '62s',
    '53s', '52s',
    '43s',
    'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o',
    'KJo', 'KTo', 'K9o', 'K8o', 'K7o',
    'QJo', 'QTo', 'Q9o', 'Q8o',
    'JTo', 'J9o', 'J8o',
    'T9o', 'T8o', 'T7o',
    '98o', '97o', '96o',
    '87o', '86o', '85o',
    '76o', '75o',
    '65o', '64o',
  ],
}

export const VS_OPEN_RANGES: Partial<Record<VsOpenKey, VsOpenRange>> = {
  MP_vs_UTG: MP_vs_UTG,
  CO_vs_UTG: CO_vs_UTG,
  CO_vs_MP: CO_vs_MP,
  BTN_vs_UTG: BTN_vs_UTG,
  BTN_vs_MP: BTN_vs_MP,
  BTN_vs_CO: BTN_vs_CO,
  SB_vs_UTG: SB_vs_UTG,
  SB_vs_MP: SB_vs_MP,
  SB_vs_CO: SB_vs_CO,
  SB_vs_BTN: SB_vs_BTN,
  BB_vs_UTG: BB_vs_UTG,
  BB_vs_MP: BB_vs_MP,
  BB_vs_CO: BB_vs_CO,
  BB_vs_BTN: BB_vs_BTN,
  BB_vs_SB: BB_vs_SB,
}

// 포지션별 가용 시나리오 목록
const SCENARIOS_BY_POSITION: Record<Position, ('open' | Position)[]> = {
  UTG: ['open'],
  MP: ['open', 'UTG'],
  CO: ['open', 'UTG', 'MP'],
  BTN: ['open', 'UTG', 'MP', 'CO'],
  SB: ['open', 'UTG', 'MP', 'CO', 'BTN'],
  BB: ['UTG', 'MP', 'CO', 'BTN', 'SB'],  // BB는 오픈 없음
}

export function getScenariosForPosition(position: Position): ('open' | Position)[] {
  return SCENARIOS_BY_POSITION[position]
}
