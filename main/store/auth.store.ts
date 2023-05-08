// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { UserAccount } from '../../domain'

// Auth store type
export interface IAuthStore {
  userData?: {
    token?: string,
    account: UserAccount
  },
  hydrateAuthData: (data: UserAccount, token?: string) => void,
  getUserData: () => UserAccount | null,
  getToken: () => string | null,
  logoff: () => void
}

// Auth store
export const useAuthStore = create(
  persist<IAuthStore>(
    (set, get) => ({
      bears: null,
      hydrateAuthData: (data: UserAccount, token?: string) => set(
        (state) => ({
          userData: {
            account: data,
            token: token
              ? token
              : state.userData && state.userData.token
                ? state.userData.token
                : null
          }
        })
      ),
      getUserData: () => get().userData ? get().userData.account : null,
      getToken: () => get().userData ?  get().userData.token : null,
      logoff: () => set(() => ({ userData: null }))
    }),
    {
      name: 'auth-storage', // unique store name
      storage: createJSONStorage(() => AsyncStorage)  // react-native async storage persistor
    }
  )
)