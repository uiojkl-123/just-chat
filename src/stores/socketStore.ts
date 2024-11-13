import { ClientSocketType } from '@/types/socket'
import { create } from 'zustand'

type SocketStore = {
  socket: ClientSocketType | null
  setSocket: (socket: ClientSocketType) => void
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
}

export const useSocketStore = create<SocketStore>()((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  isConnected: false,
  setIsConnected: (isConnected) => set({ isConnected }),
}))
