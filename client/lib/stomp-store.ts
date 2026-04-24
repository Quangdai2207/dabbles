import { useAuthStore } from '@/lib/auth-store'
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { create } from 'zustand'

const SOCKET_URL = process.env.NEXT_PUBLIC_BE_SERVER_WS!

// Define the STOMP state interface
interface StompState {
  client: Client | null
  connected: boolean
  subscriptions: { destination: string; callback: (msg: IMessage) => void }[]
  token: string | null
  initializeStomp: (token: string | null, socketUrl?: string) => void
  subscribe: (destination: string, callback: (msg: IMessage) => void) => () => void
  send: (destination: string, body?: unknown) => void
  disconnect: () => void
}

// Create the STOMP store
export const useStompStore = create<StompState>((set, get) => ({
  client: null,
  connected: false,
  subscriptions: [],
  token: null,

  initializeStomp: (token, socketUrl?: string) => {
    if (!socketUrl) {
      socketUrl = SOCKET_URL
    }
    const currentState = get()

    // If token hasn't changed, do nothing
    const currentToken = useAuthStore.getState().token
    if (currentState.token === currentToken && !!currentState.client === !!token) {
      return
    }

    // Disconnect previous client if exists
    if (currentState.client) {
      currentState.client.deactivate()
    }

    if (!token) {
      set({
        client: null,
        connected: false,
        subscriptions: [],
        token: null
      })
      return
    }

    const newClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 3000,
      debug: () => {},
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      onConnect: () => {
        set({ connected: true })

        // Re-subscribe after reconnect
        const { subscriptions } = get()
        subscriptions.forEach((sub) => {
          if (newClient.active) {
            newClient.subscribe(sub.destination, sub.callback)
          }
        })
      },

      onDisconnect: () => {
        set({ connected: false })
      }
    })

    set({
      client: newClient,
      connected: false,
      subscriptions: [],
      token: token
    })

    // Activate the client
    newClient.activate()
  },

  subscribe: (destination, callback) => {
    const { client, connected, subscriptions } = get()

    // Check for existing subscription to the same destination (dedupe)
    const existingIndex = subscriptions.findIndex((s) => s.destination === destination)

    if (existingIndex !== -1) {
      // Update callback for existing subscription
      const updatedSubscriptions = [...subscriptions]
      updatedSubscriptions[existingIndex] = { destination, callback }
      set({ subscriptions: updatedSubscriptions })

      // Return cleanup function
      return () => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.destination !== destination)
        }))
      }
    }

    if (!client || !connected) {
      // Store subscription for later activation after connection
      const newSub = { destination, callback }
      set({ subscriptions: [...subscriptions, newSub] })

      // Return cleanup function that removes from pending subscriptions
      return () => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s !== newSub)
        }))
      }
    }

    // Subscribe immediately
    const sub = client.subscribe(destination, callback)
    // Save the subscription
    set({ subscriptions: [...subscriptions, { destination, callback }] })

    return () => {
      sub.unsubscribe()
      set((state) => ({
        subscriptions: state.subscriptions.filter((s) => s.destination !== destination)
      }))
    }
  },

  send: (destination, body) => {
    const { client, connected } = get()
    if (!client || !connected) return

    client.publish({
      destination,
      body: body ? JSON.stringify(body) : ''
    })
  },

  disconnect: () => {
    const { client } = get()
    if (client) {
      client.deactivate()
    }
    set({ client: null, connected: false, subscriptions: [] })
  }
}))
