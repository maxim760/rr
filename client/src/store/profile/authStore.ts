import { IUser } from 'src/api/types/models/User'
import { create } from 'zustand'

type AuthState = {
  user: null | IUser,
  setUser(user: IUser): void
  clearUser(): void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser(user: IUser) {
    set((state) => ({...state, user}))
  },
  clearUser() {
    set((state) => ({...state, user: null}))
  },
}))