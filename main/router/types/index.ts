// Data types
import { IBand, IConcert, IObservationType, ISong } from '../../../domain'

// Defined route params
export type MainStackParamList = {
  [key: string]: any
  Band: { item?: IBand, itemId: string }
  Concert: { item?: IConcert, itemId: string }
  Song: { item?: ISong, itemId: string }
  ReorderConcert: { item: IConcert }
  AddConcertSongs: { item: IConcert }
  ConcertNotes: { item: IConcert }
  SaveConcert: { item: IConcert }
  SaveNote: { concertId: string, item?: IObservationType }
}