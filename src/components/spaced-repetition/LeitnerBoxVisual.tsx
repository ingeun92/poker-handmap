interface LeitnerBoxVisualProps {
  boxCounts: Record<number, number>
  activeBox?: number
}

const BOX_COLORS = [
  'from-red-600 to-red-500',
  'from-orange-600 to-orange-500',
  'from-yellow-600 to-yellow-500',
  'from-lime-600 to-lime-500',
  'from-green-600 to-green-500',
]

const BOX_INTERVALS = ['1일', '2일', '4일', '7일', '14일']
const BOX_LABELS = ['Box 1', 'Box 2', 'Box 3', 'Box 4', 'Box 5']

export function LeitnerBoxVisual({ boxCounts, activeBox }: LeitnerBoxVisualProps) {
  const totalCards = Object.values(boxCounts).reduce((sum, c) => sum + c, 0)

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
        라이트너 박스
      </h3>
      <div className="flex gap-3 items-end">
        {[1, 2, 3, 4, 5].map(box => {
          const count = boxCounts[box] ?? 0
          const isActive = activeBox === box
          const heightPct = totalCards > 0 ? Math.max(8, (count / totalCards) * 100) : 8

          return (
            <div key={box} className="flex-1 flex flex-col items-center gap-2">
              {/* Count badge */}
              <span className="text-white text-sm font-bold">{count}</span>

              {/* Bar */}
              <div
                className={`w-full rounded-t-lg bg-gradient-to-b ${BOX_COLORS[box - 1]} transition-all duration-500 ${
                  isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                }`}
                style={{ height: `${heightPct}px`, minHeight: '8px' }}
              />

              {/* Label */}
              <div className="text-center">
                <p className="text-white text-xs font-medium">{BOX_LABELS[box - 1]}</p>
                <p className="text-gray-500 text-xs">{BOX_INTERVALS[box - 1]}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
