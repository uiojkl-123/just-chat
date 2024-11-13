import React from 'react'
import { SocketProvider } from '../provider/SocketProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>
}
