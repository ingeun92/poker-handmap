interface QuizFeedbackProps {
  isCorrect: boolean
  correctAnswer: string
  onNext: () => void
}

export function QuizFeedback({ isCorrect, correctAnswer, onNext }: QuizFeedbackProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className={`text-6xl mb-4 ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
          {isCorrect ? '✓' : '✗'}
        </div>
        <div className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? '정답!' : '오답!'}
        </div>
        {!isCorrect && (
          <div className="mt-3 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">정답</p>
            <p className="text-lg font-semibold text-gray-800">{correctAnswer}</p>
          </div>
        )}
        <button
          onClick={onNext}
          className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  )
}
