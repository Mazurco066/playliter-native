// Dependencies
import { create } from 'zustand'
import { IConcert } from '../../domain'

// Auth store type
export interface IConcertStore {
  concert?: IConcert
  getConcert: () => IConcert | null,
  removeObservation: (id: string) => void
  setConcert: (data: IConcert) => void,
}

// Auth store
export const useConcertStore = create<IConcertStore>()(
  (set, get) => ({
    concert: null,
    getConcert: () => get().concert,
    removeObservation: (id: string) => set(
      (state) => ({
        concert: {
          ...state.concert,
          observations: state.concert.observations.filter(o => o.id !== id)
        }
      })
    ),
    setConcert: (data: IConcert) => set(
      (_) => ({
        concert: data
      })
    )
  })
)