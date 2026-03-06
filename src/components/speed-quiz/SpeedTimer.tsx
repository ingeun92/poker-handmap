interface SpeedTimerProps {
  timeLeft: number
  duration: number
}

export function SpeedTimer({ timeLeft, duration }: SpeedTimerProps) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const progress = timeLeft / duration
  const offset = circumference * (1 - progress)

  const pct = progress * 100
  let strokeColor = '#22c55e'   // green
  if (pct <= 30) strokeColor = '#eab308' // yellow
  if (pct <= 10) strokeColor = '#ef4444' // red

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{ color: strokeColor, transition: 'color 0.3s ease' }}
        >
          {timeLeft}
        </span>
        <span className="text-gray-400 text-xs">초</span>
      </div>
    </div>
  )
}
