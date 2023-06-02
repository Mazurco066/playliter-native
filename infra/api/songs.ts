// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'

// Endpoints
export const getBandSongs = async (
  bandId: string,
  { limit, offset }: IPaging = { limit: 0, offset: 0 },
  filter: string = ''
) =>
  asyncRequestHandler(httpClient.get(`/songs/list/${bandId}?limit=${limit}&offset=${offset}&filter=${encodeURI(filter)}`))

export const getPublicSongs = async (
    { limit, offset }: IPaging = { limit: 0, offset: 0 },
    filter: string = ''
  ) =>
    asyncRequestHandler(httpClient.get(`/songs/get/public_songs?limit=${limit}&offset=${offset}&filter=${encodeURI(filter)}`))

export const getSong = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/songs/${id}`))