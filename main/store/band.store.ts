// Dependencies
import { create } from 'zustand'
import { IBand } from '../../domain'

// Auth store type
export interface IBandStore {
  band?: IBand
  getBand: () => IBand | null,
  setBand: (data: IBand) => void,
}

// Auth store
export const useBandStore = create<IBandStore>()(
  (set, get) => ({
    band: null,
    getBand: () => get().band,
    setBand: (data: IBand) => set(
      (_) => ({
        band: data
      })
    )
  })
)