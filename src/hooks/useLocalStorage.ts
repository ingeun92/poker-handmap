import { useState, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue(prev => {
          const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
          window.localStorage.setItem(key, JSON.stringify(next))
          return next
        })
      } catch {
        // 로컬스토리지 접근 실패 시 상태만 업데이트
      }
    },
    [key]
  )

  return [storedValue, setValue]
}
