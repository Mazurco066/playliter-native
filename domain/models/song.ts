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
  category: {
    id: string
    createdAt: string
    updatedAt: string
    title: string
    description: string
  },
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
