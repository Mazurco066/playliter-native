// Data types
import { IBand, IConcert, IObservationType, ISong, ISongCategory } from '../../../domain'

// Defined route params
export type MainStackParamList = {
  [key: string]: any
  Band: { item?: IBand, itemId: string }
  BandCategories: { item?: IBand, itemId: string }
  BandConcerts: { item?: IBand, itemId: string }
  BandSongs: { item?: IBand, itemId: string }
  Concert: { item?: IConcert, itemId: string }
  Song: { item?: ISong, itemId: string }
  ReorderConcert: { item: IConcert }
  AddConcertSongs: { item: IConcert }
  ConcertNotes: { item: IConcert }
  SaveCategory: { bandId: string, item?: ISongCategory }
  SaveConcert: { item: IConcert }
  SaveNote: { concertId: string, item?: IObservationType }
}