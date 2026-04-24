'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useShallow } from 'zustand/shallow'

export const useAuth = () => {
  return useAuthStore(
    useShallow((state) => ({
      token: state.token,
      authData: state.authData,
      isLoading: state.isLoading,
      error: state.error,
      updateProfile: state.updateProfile,
      setPrivateAccount: state.setPrivateAccount
    }))
  )
}

export default function AuthProvider({ children, token }: { children: React.ReactNode; token: string | null }) {
  const setToken = useAuthStore((state) => state.setToken)
  const fetchProfile = useAuthStore((state) => state.fetchProfile)

  useEffect(() => {
    setToken(token)
    if (token) fetchProfile(token)
  }, [token, setToken, fetchProfile])

  return <>{children}</>
}
