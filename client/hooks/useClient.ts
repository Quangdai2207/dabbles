'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

export function useClient() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client
    () => false // server
  )
}
