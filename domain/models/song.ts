export interface ISong {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  tone: string
  writter: string
  embeddedUrl?: string
  body: string
  isPublic: boolean
  category: ISongCategory,
  band: {
    id: string
    createdAt: string
    updatedAt: string
    logo: string
    owner: string
    description: string
    title: string
  }
}

export interface ISongCategory {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
}