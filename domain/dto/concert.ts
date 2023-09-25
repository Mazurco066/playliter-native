export interface IConcertSongDto {
  isPublic: boolean
  embeddedUrl: string
  title: string
  writter: string
  tone: string
  body: string
  id: string
  createdAt: string
  updatedAt: string
}

export interface SaveConcertDto {
  band?: string
  title: string
  description: string
  date: string
}