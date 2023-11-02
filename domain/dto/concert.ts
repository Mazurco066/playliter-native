export type IConcertSongDto = {
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

export type SaveConcertDto = {
  band?: string
  title: string
  description: string
  date: string
}