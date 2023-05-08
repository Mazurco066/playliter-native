// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { UserAccount } from '../../domain'

// Auth store type
export interface IAuthStore {
  account?: UserAccount
  token?: string
  hydrateAuthData: (data: UserAccount, token?: string) => void
  getUserData: () => UserAccount | null
  getToken: () => string | null
  logoff: () => void
}

// Auth store
export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      account: null,
      token: null,
      hydrateAuthData: (data: UserAccount, token?: string) => set(
        (state) => ({
          account: data,
          token: token
            ? token
            : state.token
                ? state.token
                : null  
          })
      ),
      getUserData: () => get().account,
      getToken: () => get().token,
      logoff: () => set(() => ({
        account: null,
        token: null
      }))
    }),
    {
      name: 'auth-storage', // unique store name
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)