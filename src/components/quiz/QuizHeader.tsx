interface QuizHeaderProps {
  currentQuestion: number
  totalQuestions: number
  correctCount: number
  modeName: string
}

export function QuizHeader({ currentQuestion, totalQuestions, correctCount, modeName }: QuizHeaderProps) {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0
  const accuracy = currentQuestion > 0 ? Math.round((correctCount / currentQuestion) * 100) : 0

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{modeName}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentQuestion} / {totalQuestions}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-green-600 font-semibold">정답: {correctCount}</span>
        <span className="text-gray-500">정확도: {accuracy}%</span>
        <span className="text-red-500 font-semibold">오답: {currentQuestion - correctCount}</span>
      </div>
    </div>
  )
}
