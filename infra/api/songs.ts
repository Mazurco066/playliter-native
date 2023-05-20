// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'

// Endpoints
export const getPublicSongs = async (
  { limit, offset }: IPaging = { limit: 0, offset: 0 },
  filter: string = ''
) =>
  asyncRequestHandler(httpClient.get(`/songs/get/public_songs?limit=${limit}&offset=${offset}&filter=${encodeURI(filter)}`))