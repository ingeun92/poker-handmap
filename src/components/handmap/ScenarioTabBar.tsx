import type { Position } from '@/data/positions'

type Scenario = 'open' | Position

interface ScenarioTabBarProps {
  scenarios: Scenario[]
  selectedScenario: Scenario
  onScenarioChange: (scenario: Scenario) => void
}

function getLabel(scenario: Scenario): string {
  return scenario === 'open' ? '오픈' : `vs ${scenario}`
}

export function ScenarioTabBar({ scenarios, selectedScenario, onScenarioChange }: ScenarioTabBarProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {scenarios.map(scenario => {
        const isActive = scenario === selectedScenario
        const isOpen = scenario === 'open'

        return (
          <button
            key={scenario}
            onClick={() => onScenarioChange(scenario)}
            className={[
              'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
              isActive
                ? isOpen
                  ? 'bg-blue-600 text-white ring-1 ring-blue-400'
                  : 'bg-amber-600 text-white ring-1 ring-amber-400'
                : isOpen
                  ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/50'
                  : 'bg-amber-900/30 text-amber-300 hover:bg-amber-800/40',
            ].join(' ')}
          >
            {getLabel(scenario)}
          </button>
        )
      })}
    </div>
  )
}
