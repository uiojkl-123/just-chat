'use client'

import { useSocketStore } from '@/stores/socketStore'
import { ClientSocketType } from '@/types/socket'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSocket, setIsConnected } = useSocketStore()

  useEffect(() => {
    const socket: ClientSocketType = io(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('connect_error', (error: Error) => {
      console.error(error)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socket)

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [setIsConnected, setSocket])

  return <>{children}</>
}
