import { useState, useMemo } from 'react'
import type { StrengthTier, ActionCategory } from '@/types/hand'
import { HandGrid } from '@/components/handmap/HandGrid'
import { HandLegend } from '@/components/handmap/HandLegend'
import { ScenarioTabBar } from '@/components/handmap/ScenarioTabBar'
import { POSITION_RANGES, POSITIONS, buildPositionActions } from '@/data/positions'
import type { Position } from '@/data/positions'
import { VS_OPEN_RANGES, getScenariosForPosition } from '@/data/vsOpenRanges'
import type { VsOpenKey } from '@/data/vsOpenRanges'
import { ALL_HANDS } from '@/data/hands'

const ALL_TIERS: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']

export function HandMapPage() {
  const [activeTiers, setActiveTiers] = useState<Set<StrengthTier>>(
    new Set(ALL_TIERS)
  )
  const [selectedPosition, setSelectedPosition] = useState<Position>('UTG')
  const [selectedScenario, setSelectedScenario] = useState<'open' | Position>('open')

  const scenarios = useMemo(() => getScenariosForPosition(selectedPosition), [selectedPosition])

  const handlePositionChange = (pos: Position) => {
    setSelectedPosition(pos)
    const nextScenarios = getScenariosForPosition(pos)
    setSelectedScenario(nextScenarios[0])
  }

  const handleTierToggle = (tier: StrengthTier) => {
    setActiveTiers(prev => {
      const next = new Set(prev)
      if (next.has(tier)) {
        if (next.size > 1) {
          next.delete(tier)
        }
      } else {
        next.add(tier)
      }
      return next
    })
  }

  const handleShowAll = () => {
    setActiveTiers(new Set(ALL_TIERS))
  }

  const isAllActive = activeTiers.size === ALL_TIERS.length

  const actionOverlay = useMemo<Record<string, ActionCategory>>(() => {
    if (selectedScenario === 'open') {
      const range = POSITION_RANGES[selectedPosition]
      const overlay: Record<string, ActionCategory> = {}
      ALL_HANDS.forEach(hand => {
        overlay[hand.name] = range.actions[hand.name] ?? 'fold'
      })
      return overlay
    }
    const key: VsOpenKey = `${selectedPosition}_vs_${selectedScenario}`
    const vsRange = VS_OPEN_RANGES[key]
    if (!vsRange) return {}
    const actions = buildPositionActions(vsRange.raises, vsRange.calls)
    const overlay: Record<string, ActionCategory> = {}
    ALL_HANDS.forEach(hand => {
      overlay[hand.name] = actions[hand.name] ?? 'fold'
    })
    return overlay
  }, [selectedPosition, selectedScenario])

  const threeBetSet = useMemo<Set<string>>(() => {
    if (selectedScenario === 'open') {
      return POSITION_RANGES[selectedPosition].threeBets
    }
    const key: VsOpenKey = `${selectedPosition}_vs_${selectedScenario}`
    const vsRange = VS_OPEN_RANGES[key]
    if (!vsRange) return new Set<string>()
    return new Set<string>(vsRange.raises)
  }, [selectedPosition, selectedScenario])

  const stats = useMemo(() => {
    let raise = 0
    let call = 0
    let fold = 0
    let threeBet = 0
    for (const [name, action] of Object.entries(actionOverlay)) {
      if (action === 'raise') raise++
      else if (action === 'call') call++
      else fold++
      if (threeBetSet.has(name)) threeBet++
    }
    return { raise, call, fold, threeBet }
  }, [actionOverlay, threeBetSet])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1">프리플랍 핸드맵</h1>
          <p className="text-gray-400 text-sm">
            169개 핸드의 강도를 한눈에 확인하세요. 셀에 마우스를 올리면 자세한 정보를 볼 수 있습니다.
          </p>
        </div>

        {/* 포지션 선택기 */}
        <div className="mb-4">
          <div className="mb-2">
            <span className="text-sm text-gray-400">
              {selectedScenario === 'open' ? '포지션별 레인지' : '포지션별 방어 레인지'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map(pos => (
              <button
                key={pos}
                onClick={() => handlePositionChange(pos)}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  selectedPosition === pos
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
                ].join(' ')}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* 시나리오 탭 */}
          <ScenarioTabBar
            scenarios={scenarios}
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
          />

          {/* 포지션 통계 */}
          <div className="mt-2 flex gap-4 text-xs">
            {selectedScenario === 'open' ? (
              <>
                <span className="text-green-400">Raise {stats.raise}개</span>
                <span className="text-yellow-400">Call {stats.call}개</span>
                <span className="text-gray-500">Fold {stats.fold}개</span>
                {stats.threeBet > 0 && (
                  <span className="text-orange-400">3-Bet {stats.threeBet}개</span>
                )}
              </>
            ) : (
              <>
                <span className="text-orange-400">3-Bet {stats.threeBet}개</span>
                <span className="text-yellow-400">Call {stats.call}개</span>
                <span className="text-gray-500">Fold {stats.fold}개</span>
              </>
            )}
            <span className="text-gray-400 ml-auto">
              {selectedScenario === 'open'
                ? `${POSITION_RANGES[selectedPosition].label} (${selectedPosition})`
                : `${selectedPosition} vs ${selectedScenario} 오픈`}
            </span>
          </div>
        </div>

        {/* 범례 / 필터 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">등급 필터</span>
            {!isAllActive && (
              <button
                onClick={handleShowAll}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                전체 보기
              </button>
            )}
          </div>
          <HandLegend
            activeTiers={activeTiers}
            onTierToggle={handleTierToggle}
          />
        </div>

        {/* 범례: 액션 태그 설명 */}
        <div className="mb-3 flex gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-extrabold text-white"
                style={{ background: 'linear-gradient(to top, #059669, #34d399)' }}
              >R</span>
              Raise
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-extrabold text-white"
                style={{ background: 'linear-gradient(to top, #7c3aed, #a78bfa)' }}
              >C</span>
              Call
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-extrabold"
                style={{ background: 'linear-gradient(to top, #57534e, #a8a29e)', color: '#e7e5e4' }}
              >F</span>
              Fold
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block px-1.5 py-0.5 rounded-[3px] text-[10px] font-extrabold text-white"
                style={{ background: 'linear-gradient(to top, #c2410c, #fb923c)' }}
              >3B</span>
              3-Bet
            </span>
          </div>

        {/* 그리드 */}
        <div className="bg-gray-900 rounded-xl p-3 overflow-x-auto">
          <HandGrid
            highlightTiers={activeTiers}
            actionOverlay={actionOverlay}
            threeBetSet={threeBetSet}
          />
        </div>

        {/* 범례 설명 */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>상단 우측 삼각형: 동색(Suited) | 하단 좌측 삼각형: 이색(Offsuit) | 대각선: 포켓 페어</p>
        </div>
      </div>
    </div>
  )
}
