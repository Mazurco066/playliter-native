// Data types
import { IBand, IConcert, ISong } from '../../../domain'

// Defined route params
export type MainStackParamList = {
  [key: string]: {} | undefined,
  Band: { item: IBand },
  Concert: { item: IConcert },
  Song: { item: ISong }
}