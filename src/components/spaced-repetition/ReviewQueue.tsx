import type { LeitnerCard } from '@/types/spaced-repetition'

interface ReviewQueueProps {
  dueCards: LeitnerCard[]
  newCards: LeitnerCard[]
}

export function ReviewQueue({ dueCards, newCards }: ReviewQueueProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
        복습 대기열
      </h3>

      <div className="space-y-3">
        {/* Due cards */}
        {dueCards.length > 0 && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-sm font-medium">오늘 복습</span>
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {dueCards.length}개
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {dueCards.slice(0, 8).map(card => (
                <span key={card.hand} className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded">
                  {card.hand}
                </span>
              ))}
              {dueCards.length > 8 && (
                <span className="text-xs text-gray-500">+{dueCards.length - 8}개</span>
              )}
            </div>
          </div>
        )}

        {/* New cards */}
        {newCards.length > 0 && (
          <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 text-sm font-medium">새 카드</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {newCards.length}개
              </span>
            </div>
            <p className="text-gray-400 text-xs">오늘 최대 10개의 새 카드를 학습합니다</p>
          </div>
        )}

        {dueCards.length === 0 && newCards.length === 0 && (
          <div className="text-center py-4">
            <p className="text-green-400 font-medium">오늘 복습 완료!</p>
            <p className="text-gray-500 text-sm mt-1">내일 다시 확인하세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
