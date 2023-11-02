export type SongPayloadDto = {
  id: string
  title: string
  writter: string
  tone: string
  body: string
  category: string
  isPublic: boolean
}

export type AddSongDto = {
  title: string
  writter: string
  tone: string
  body: string
  category: string
  isPublic: boolean
  embeddedUrl?: string
}

export type UpdateSongDto = {
  title?: string
  writter?: string
  tone?: string
  body?: string
  category?: string
  isPublic?: boolean
  embeddedUrl?: string
}