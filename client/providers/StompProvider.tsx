'use client'

import { useAuthStore } from '@/lib/auth-store'
import { useStompStore } from '@/lib/stomp-store'
import { useEffect } from 'react'

export const useStomp = () => {
  const connected = useStompStore((s) => s.connected)
  const subscribe = useStompStore((s) => s.subscribe)
  const send = useStompStore((s) => s.send)

  return { connected, subscribe, send }
}

const useInitializeStomp = () => {
  const token = useAuthStore((s) => s.token)
  const initializeStomp = useStompStore((s) => s.initializeStomp)

  useEffect(() => {
    initializeStomp(token)
  }, [token, initializeStomp])
}

export default function StompProvider({ children }: { children: React.ReactNode }) {
  useInitializeStomp()

  return <>{children}</>
}
