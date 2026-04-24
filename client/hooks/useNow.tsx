'use client'
import { timeAgo } from '@/lib/time-convert'
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

// Single NowContext to avoid multiple intervals across conversation items
const NowContext = createContext<number>(Date.now())

export const NowProvider = ({ children, interval = 60_000 }: { children: ReactNode; interval?: number }) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(i)
  }, [interval])

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>
}

// Use context for shared now value - much more efficient than per-component intervals
export function useNow() {
  return useContext(NowContext)
}

// Fallback hook with its own interval for components outside NowProvider
export function useNowWithInterval(interval = 60_000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(i)
  }, [interval])

  return now
}

export function useTimeAgo(dateString: string | null | undefined, _now: number) {
  return useMemo(() => {
    if (!dateString) return ''
    return timeAgo(dateString)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateString, _now])
}
