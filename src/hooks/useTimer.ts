import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimerOptions {
  onTimeUp?: () => void
}

interface UseTimerReturn {
  timeLeft: number
  elapsed: number
  isRunning: boolean
  isPaused: boolean
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

export function useTimer(duration: number, options: UseTimerOptions = {}): UseTimerReturn {
  const { onTimeUp } = options
  const [timeLeft, setTimeLeft] = useState(duration)
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const remainingRef = useRef<number>(duration)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clearTimer()
    remainingRef.current = duration
    startTimeRef.current = Date.now()
    setTimeLeft(duration)
    setElapsed(0)
    setIsRunning(true)
    setIsPaused(false)

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000)
      const left = Math.max(0, remainingRef.current - elapsedSecs)

      setTimeLeft(left)
      setElapsed(elapsedSecs)

      if (left <= 0) {
        clearTimer()
        setIsRunning(false)
        onTimeUpRef.current?.()
      }
    }, 100)
  }, [duration, clearTimer])

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return
    clearTimer()
    const now = Date.now()
    const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000)
    remainingRef.current = Math.max(0, remainingRef.current - elapsedSecs)
    setIsPaused(true)
    setIsRunning(false)
  }, [isRunning, isPaused, clearTimer])

  const resume = useCallback(() => {
    if (!isPaused) return
    startTimeRef.current = Date.now()
    setIsPaused(false)
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsedSecs = Math.floor((now - startTimeRef.current) / 1000)
      const left = Math.max(0, remainingRef.current - elapsedSecs)

      setTimeLeft(left)

      if (left <= 0) {
        clearTimer()
        setIsRunning(false)
        onTimeUpRef.current?.()
      }
    }, 100)
  }, [isPaused, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    remainingRef.current = duration
    setTimeLeft(duration)
    setElapsed(0)
    setIsRunning(false)
    setIsPaused(false)
  }, [duration, clearTimer])

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    timeLeft,
    elapsed,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
  }
}
