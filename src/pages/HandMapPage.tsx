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
import type { ColorMode } from '@/components/handmap/HandCell'

const ALL_TIERS: StrengthTier[] = ['premium', 'strong', 'playable', 'marginal', 'weak']

const POSITION_META: Record<Position, { short: string; label: string; desc: string }> = {
  UTG: { short: 'UTG', label: '언더더건', desc: '가장 타이트' },
  MP: { short: 'MP', label: '미들', desc: '약간 확장' },
  CO: { short: 'CO', label: '컷오프', desc: '넓은 레인지' },
  BTN: { short: 'BTN', label: '버튼', desc: '가장 넓음' },
  SB: { short: 'SB', label: '스몰블', desc: 'R or F' },
  BB: { short: 'BB', label: '빅블', desc: '3벳 + 콜' },
}

export function HandMapPage() {
  const [activeTiers, setActiveTiers] = useState<Set<StrengthTier>>(new Set(ALL_TIERS))
  const [selectedPosition, setSelectedPosition] = useState<Position>('UTG')
  const [selectedScenario, setSelectedScenario] = useState<'open' | Position>('open')
  const [colorMode, setColorMode] = useState<ColorMode>('action')

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
        if (next.size > 1) next.delete(tier)
      } else {
        next.add(tier)
      }
      return next
    })
  }

  const handleShowAll = () => setActiveTiers(new Set(ALL_TIERS))

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
    let raise = 0, call = 0, fold = 0, threeBet = 0
    for (const [name, action] of Object.entries(actionOverlay)) {
      if (action === 'raise') raise++
      else if (action === 'call') call++
      else fold++
      if (threeBetSet.has(name)) threeBet++
    }
    const total = raise + call + fold
    return {
      raise, call, fold, threeBet, total,
      raisePercent: total ? Math.round((raise / total) * 100) : 0,
      callPercent: total ? Math.round((call / total) * 100) : 0,
      foldPercent: total ? Math.round((fold / total) * 100) : 0,
    }
  }, [actionOverlay, threeBetSet])

  const positionMeta = POSITION_META[selectedPosition]

  return (
    <div className="min-h-screen text-white p-3 sm:p-4" style={{ background: '#0a0a14', fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header - compact */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              프리플랍 핸드맵
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              {selectedScenario === 'open'
                ? `${positionMeta.label} (${selectedPosition}) 오픈 레인지`
                : `${selectedPosition} vs ${selectedScenario} 방어 레인지`}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="view-toggle flex items-center gap-0.5 text-[10px] sm:text-xs font-medium">
            <button
              onClick={() => setColorMode('action')}
              className={[
                'px-2.5 py-1 rounded-full transition-all',
                colorMode === 'action'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              액션 뷰
            </button>
            <button
              onClick={() => setColorMode('tier')}
              className={[
                'px-2.5 py-1 rounded-full transition-all',
                colorMode === 'tier'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              등급 뷰
            </button>
          </div>
        </div>

        {/* Position selector - horizontal pills */}
        <div className="mb-3">
          <div className="flex gap-1.5 sm:gap-2">
            {POSITIONS.map(pos => {
              const meta = POSITION_META[pos]
              const isActive = selectedPosition === pos
              return (
                <button
                  key={pos}
                  onClick={() => handlePositionChange(pos)}
                  className={[
                    'pos-ring flex-1 flex flex-col items-center py-1.5 sm:py-2 rounded-lg text-center transition-all border',
                    isActive
                      ? 'active bg-emerald-600/15 border-emerald-500/40 text-white'
                      : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  <span className={[
                    'text-xs sm:text-sm font-bold font-mono',
                    isActive ? 'text-emerald-400' : '',
                  ].join(' ')}>
                    {meta.short}
                  </span>
                  <span className="text-[8px] sm:text-[9px] mt-0.5 opacity-60 hidden sm:block">
                    {meta.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Scenario tabs */}
        <ScenarioTabBar
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          onScenarioChange={setSelectedScenario}
        />

        {/* Action legend bar */}
        <div className="mt-3 mb-2 flex items-center justify-between">
          <div className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] cell-raise inline-block" />
              <span className="text-emerald-400">Raise</span>
              <span className="text-gray-600">{stats.raise}</span>
            </span>
            {stats.threeBet > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] cell-3bet inline-block" />
                <span className="text-red-400">3-Bet</span>
                <span className="text-gray-600">{stats.threeBet}</span>
              </span>
            )}
            {stats.call > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] cell-call inline-block" />
                <span className="text-blue-400">Call</span>
                <span className="text-gray-600">{stats.call}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] cell-fold inline-block border border-white/10" />
              <span className="text-gray-600">Fold</span>
              <span className="text-gray-700">{stats.fold}</span>
            </span>
          </div>

          {/* Range percentage */}
          <span className="text-[10px] sm:text-xs font-mono text-gray-500">
            {stats.raisePercent + stats.callPercent}% play
          </span>
        </div>

        {/* Range bar - visual summary */}
        <div className="flex h-1.5 rounded-full overflow-hidden mb-3 bg-white/5">
          {stats.raisePercent > 0 && (
            <div className="cell-raise" style={{ width: `${stats.raisePercent}%` }} />
          )}
          {stats.callPercent > 0 && (
            <div className="cell-call" style={{ width: `${stats.callPercent}%` }} />
          )}
        </div>

        {/* Tier filter (only in tier mode) */}
        {colorMode === 'tier' && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">등급 필터</span>
              {!isAllActive && (
                <button onClick={handleShowAll} className="text-[10px] text-blue-400 hover:text-blue-300">
                  전체 보기
                </button>
              )}
            </div>
            <HandLegend
              activeTiers={activeTiers}
              onTierToggle={handleTierToggle}
              colorMode={colorMode}
            />
          </div>
        )}

        {/* THE GRID */}
        <div className="rounded-xl overflow-hidden p-2 sm:p-3" style={{ background: '#0d0d1a' }}>
          <HandGrid
            highlightTiers={colorMode === 'tier' ? activeTiers : undefined}
            actionOverlay={actionOverlay}
            threeBetSet={threeBetSet}
            colorMode={colorMode}
          />
        </div>

      </div>
    </div>
  )
}
