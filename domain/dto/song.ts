export interface SongPayloadDto {
  id: string
  title: string
  writter: string
  tone: string
  body: string
  category: string
  isPublic: boolean
}

export interface AddSongDto {
  title: string
  writter: string
  tone: string
  body: string
  category: string
  isPublic: boolean
  embeddedUrl?: string
}

export interface UpdateSongDto {
  title?: string
  writter?: string
  tone?: string
  body?: string
  category?: string
  isPublic?: boolean
  embeddedUrl?: string
}