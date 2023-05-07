// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Auth store type
export interface IAuthStore {
  bears: number,
  increase: (by: number) => void
}

// Auth store
export const useAuthStore = create(
  persist<IAuthStore>(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by }))
    }),
    {
      name: 'auth-storage', // unique store name
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)