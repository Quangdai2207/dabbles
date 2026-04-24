import { create } from 'zustand'

interface ConversationState {
  conversations: TConversationResponseForChatBoxDto[]
  selectedConversationId: string | null
  participantTemp: TParticipant | null

  setSelectedConversationId: (conversationId: string | null) => void
  setConversation: (conversation: TConversationResponseForChatBoxDto | TConversationResponseForChatBoxDto[]) => void
  getConversationById: (id: string) => TConversationResponseForChatBoxDto | null
  setParticipantTemp: (participant: TParticipant | null) => void
  removeConversationTemp: () => void
  removeConversation: (id: string) => void
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  selectedConversationId: null,
  participantTemp: null,

  setSelectedConversationId: (conversationId) => set({ selectedConversationId: conversationId }),
  getConversationById: (id) => get().conversations.find((c) => c.id === id) || null,
  setConversation: (payload) =>
    set((state) => {
      const incoming = Array.isArray(payload) ? payload : [payload]
      if (incoming.length === 0) return state

      const conversationMap = new Map(state.conversations.map((c) => [c.id, c]))
      let changed = false

      for (const conv of incoming) {
        // If we want to be strict about changes, we could compare content,
        // but typically receiving an update means it's changed.
        // We just check if it's already there and identical (ref check might fail but that's ok)
        // Optimization: checking specific fields if needed, but here simply updating is safer.
        conversationMap.set(conv.id, conv)
        changed = true
      }

      if (!changed) return state

      return {
        conversations: Array.from(conversationMap.values()).sort(
          (a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime()
        )
      }
    }),
  setParticipantTemp: (participant) => set({ participantTemp: participant }),

  removeConversationTemp: () =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== '')
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      selectedConversationId: state.selectedConversationId === id ? null : state.selectedConversationId
    }))
}))
