import { User } from '@/types/user'
import { create } from 'zustand'

type UserStore = {
  user?: User
  setUser: (user: User) => void
}

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined,
  setUser: (user) =>
    set({
      user,
    }),
}))
