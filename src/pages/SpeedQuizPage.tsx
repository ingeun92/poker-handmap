import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { SpeedQuiz } from '@/components/speed-quiz/SpeedQuiz'
import { SpeedResults } from '@/components/speed-quiz/SpeedResults'
import type { StrengthTier } from '@/types/hand'

interface QuestionRecord {
  hand: string
  selected: StrengthTier
  correct: StrengthTier
  isCorrect: boolean
  responseTimeMs: number
}

interface PersonalBest {
  score: number
  accuracy: number
  date: string
  duration: number
}

type PageState = 'config' | 'playing' | 'results'

const DURATIONS = [
  { label: '30초', value: 30 },
  { label: '60초', value: 60 },
  { label: '120초', value: 120 },
]

export function SpeedQuizPage() {
  const [pageState, setPageState] = useState<PageState>('config')
  const [selectedDuration, setSelectedDuration] = useState(60)
  const [lastRecords, setLastRecords] = useState<QuestionRecord[]>([])
  const [isNewBest, setIsNewBest] = useState(false)

  const [personalBests, setPersonalBests] = useLocalStorage<Record<number, PersonalBest>>(
    'poker-handmap:speed-best',
    {}
  )

  const currentBest = personalBests[selectedDuration] ?? null

  const handleComplete = (records: QuestionRecord[], score: number) => {
    const total = records.length
    const correct = records.filter(r => r.isCorrect).length
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    setLastRecords(records)

    const existing = personalBests[selectedDuration]
    const newBest = !existing || score > existing.score
    setIsNewBest(newBest)

    if (newBest) {
      setPersonalBests(prev => ({
        ...prev,
        [selectedDuration]: {
          score,
          accuracy,
          date: new Date().toLocaleDateString('ko-KR'),
          duration: selectedDuration,
        },
      }))
    }

    setPageState('results')
  }

  const handleRestart = () => {
    setPageState('config')
  }

  if (pageState === 'playing') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <SpeedQuiz duration={selectedDuration} onComplete={handleComplete} />
      </div>
    )
  }

  if (pageState === 'results') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">스피드 퀴즈 결과</h1>
        <SpeedResults
          records={lastRecords}
          duration={selectedDuration}
          personalBest={personalBests[selectedDuration] ?? null}
          isNewBest={isNewBest}
          onRestart={handleRestart}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">스피드 퀴즈</h1>
      <p className="text-gray-400 mb-8">제한 시간 내에 최대한 많은 핸드를 분류하세요</p>

      {/* Duration selector */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-white font-medium mb-4">시간 선택</h2>
        <div className="grid grid-cols-3 gap-3">
          {DURATIONS.map(d => (
            <button
              key={d.value}
              onClick={() => setSelectedDuration(d.value)}
              className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedDuration === d.value
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal bests */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
        <h2 className="text-white font-medium mb-4">개인 최고 기록</h2>
        {DURATIONS.map(d => {
          const best = personalBests[d.value]
          return (
            <div key={d.value} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
              <span className="text-gray-400 text-sm w-12">{d.label}</span>
              {best ? (
                <>
                  <span className="text-white font-bold">{best.score}점</span>
                  <span className="text-gray-500 text-xs">정확도 {best.accuracy}%</span>
                  <span className="ml-auto text-gray-600 text-xs">{best.date}</span>
                </>
              ) : (
                <span className="text-gray-600 text-sm">기록 없음</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Start button */}
      <button
        onClick={() => setPageState('playing')}
        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-lg transition-colors"
      >
        ⚡ 시작 ({selectedDuration}초)
      </button>

      {currentBest && (
        <p className="text-center text-gray-500 text-sm mt-3">
          현재 최고: {currentBest.score}점 ({currentBest.accuracy}%)
        </p>
      )}
    </div>
  )
}
