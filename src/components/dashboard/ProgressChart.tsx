interface DailyData {
  date: string
  count: number
  accuracy: number
}

interface ProgressChartProps {
  dailyPractice: DailyData[]
}

const CHART_W = 600
const CHART_H = 200
const PADDING = { top: 20, right: 20, bottom: 40, left: 40 }

export function ProgressChart({ dailyPractice }: ProgressChartProps) {
  const last30 = dailyPractice.slice(-30)

  if (last30.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-white font-medium mb-4">정확도 추이 (최근 30일)</h3>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500">아직 학습 데이터가 없습니다</p>
        </div>
      </div>
    )
  }

  const innerW = CHART_W - PADDING.left - PADDING.right
  const innerH = CHART_H - PADDING.top - PADDING.bottom

  const xStep = innerW / Math.max(last30.length - 1, 1)
  const yMin = 0
  const yMax = 100

  const toX = (i: number) => PADDING.left + i * xStep
  const toY = (v: number) => PADDING.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH

  const points = last30.map((d, i) => ({ x: toX(i), y: toY(d.accuracy), ...d }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  const areaPath =
    `M${points[0]!.x.toFixed(1)},${toY(0).toFixed(1)} ` +
    points.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L${points[points.length - 1]!.x.toFixed(1)},${toY(0).toFixed(1)} Z`

  // Y axis gridlines
  const yTicks = [0, 25, 50, 75, 100]

  // X axis labels (show every ~5 entries)
  const xLabelIndices = last30.length <= 7
    ? last30.map((_, i) => i)
    : [0, Math.floor(last30.length / 2), last30.length - 1]

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-medium mb-4">정확도 추이 (최근 30일)</h3>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full max-w-full" style={{ minWidth: 280 }}>
          {/* Grid lines */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={toY(tick)}
                x2={CHART_W - PADDING.right}
                y2={toY(tick)}
                stroke="#374151"
                strokeDasharray="4 4"
              />
              <text
                x={PADDING.left - 8}
                y={toY(tick) + 4}
                textAnchor="end"
                fill="#6b7280"
                fontSize={11}
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* Area fill */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill="#3b82f6" />
          ))}

          {/* X axis labels */}
          {xLabelIndices.map(i => (
            <text
              key={i}
              x={toX(i)}
              y={CHART_H - 8}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={10}
            >
              {last30[i]?.date.slice(5) ?? ''}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
