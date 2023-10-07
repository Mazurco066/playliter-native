// Data types
import {
  IBand,
  IBandInvitation,
  IConcert,
  IObservationType,
  ISong,
  ISongCategory
} from '../../../domain'

// Defined route params
export type MainStackParamList = {
  [key: string]: any
  Band: { item?: IBand, itemId: string }
  SaveBand: { item?: IBand }
  BandCategories: { item?: IBand, itemId: string }
  BandConcerts: { item?: IBand, itemId: string }
  BandSongs: { item?: IBand, itemId: string }
  Concert: { item?: IConcert, itemId: string }
  SongList: { item?: IConcert, itemId: string }
  Song: { item?: ISong, itemId: string }
  ReorderConcert: { item: IConcert }
  AddConcertSongs: { item: IConcert }
  ConcertNotes: { item: IConcert }
  InviteIntegrants: { item?: IBand, itemId: string }
  RespondInvite: { item: IBandInvitation }
  CloneConcert: { item: IConcert }
  SaveCategory: { bandId: string, item?: ISongCategory }
  SaveConcert: { bandId: string, item?: IConcert }
  SaveNote: { concertId: string, item?: IObservationType }
  SaveSong: { bandId: string, item?: ISong }
}