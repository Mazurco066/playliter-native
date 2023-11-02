export type IConcert = {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  date: string
  band: {
    id: string
    createdAt: string
    updatedAt: string
    title: string,
    description: string
    logo: string
  }
  songs: {
    id: string
    createdAt: string
    updatedAt: string
    title: string
    embeddedUrl?: string
    writter: string
    tone: string
    body: string
    isPublic: boolean
  }[],
  observations: IObservationType[]
}

export type IObservationType = {
  id: string
  title: string
  data: string
}
