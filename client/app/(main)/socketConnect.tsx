'use client'

import { useEffect } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

type Props = {
  token: string
}

const NotificationSocket = ({ token }: Props) => {
  useEffect(() => {
    const socket = new SockJS('http://localhost:8668/ws')
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      // debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000 // Delay reconnect with 5s
    })

    client.onConnect = () => {
      client.subscribe('/topic/SUPERADMIN/notification', alerts, { Authorization: `Bearer ${token}` })
    }
    const alerts = () => console.log('')

    // Alert message if can't connect WS or WS BFF address not found
    client.onStompError = (frame) => {
      console.error('STOMP error', frame)
    }

    // Active connection
    client.activate()

    // ReConnect WS
    return () => {
      client.deactivate()
    }
  }, [token]) // Define token here

  return null
}

export default NotificationSocket
