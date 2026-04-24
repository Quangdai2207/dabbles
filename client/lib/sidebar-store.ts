import { create } from 'zustand'

interface SidebarState {
  totalUnreadConversations: number
  totalUnreadNotifications: number

  setTotalUnreadConversations: (val: number | ((prev: number) => number)) => void
  setTotalUnreadNotifications: (val: number | ((prev: number) => number)) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  totalUnreadConversations: 0,
  totalUnreadNotifications: 0,

  setTotalUnreadConversations: (val) =>
    set((state) => ({
      totalUnreadConversations: typeof val === 'function' ? val(state.totalUnreadConversations) : val
    })),
  setTotalUnreadNotifications: (val) =>
    set((state) => ({
      totalUnreadNotifications: typeof val === 'function' ? val(state.totalUnreadNotifications) : val
    }))
}))
