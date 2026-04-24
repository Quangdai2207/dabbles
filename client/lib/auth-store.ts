import { create } from 'zustand'
import { profileService } from '@/services/auth/profile'
import updateProfileService from '@/services/auth/update-profile'
import { toast } from 'sonner'
import toggleAccountPrivacyService from '@/services/user/toggle-account-privacy'

// Define the authentication state interface
interface AuthState {
  token: string | null
  authData: TProfile | null
  isLoading: boolean
  error: string | null
  setToken: (token: string | null) => void
  fetchProfile: (token: string) => Promise<void>
  updateProfile: (token: string, formData: FormData) => Promise<void>
  resetAuth: () => void
  setPrivateAccount: (token: string) => Promise<void>
}

// Create the auth store
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  authData: null,
  isLoading: false,
  error: null,

  setToken: (token) => {
    set({ token, error: null })

    // If token is null, reset auth data
    if (!token) {
      set({ authData: null })
    }
  },

  fetchProfile: async (token) => {
    if (!token) return

    set({ isLoading: true, error: null })

    try {
      const response = await profileService(token)
      if (response.isSuccess && response.data && !Array.isArray(response.data)) {
        set({ authData: response.data, isLoading: false })
      } else {
        set({
          error: response.errorMessage || 'Failed to fetch profile',
          isLoading: false
        })
      }
    } catch {
      set({
        error: 'An error occurred while fetching profile',
        isLoading: false
      })
    }
  },

  updateProfile: async (token, formData) => {
    if (!token) return

    set({ isLoading: true, error: null })

    try {
      const response = await updateProfileService(formData, token)
      if (response.isSuccess && response.data && !Array.isArray(response.data)) {
        set({ authData: response.data, isLoading: false })
        toast.success('Profile updated successfully')
      } else {
        set({
          error: response.errorMessage || 'Failed to update profile',
          isLoading: false
        })
        toast.error(response.errorMessage || 'Failed to update profile')
      }
    } catch {
      set({
        error: 'An error occurred while fetching profile',
        isLoading: false
      })
    }
  },

  setPrivateAccount: async (token) => {
    if (!token) return

    try {
      const res = await toggleAccountPrivacyService(token)
      if (res.isSuccess) {
        toast.success(res.message || 'Account privacy toggled successfully')
        set((state) => ({
          authData: state.authData ? { ...state.authData, public: !state.authData.public } : null
        }))
      } else {
        toast.error(res.errorMessage || 'Failed to toggle account privacy')
      }
    } catch {
      toast.error('An unexpected error occurred')
    }
  },

  resetAuth: () => {
    set({
      token: null,
      authData: null,
      error: null
    })
  }
}))
