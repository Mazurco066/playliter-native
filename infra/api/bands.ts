// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'

// Endpoints
export const getBands = async ({ limit, offset }: IPaging = { limit: 0, offset: 0 }) =>
  asyncRequestHandler(httpClient.get(`/bands/get?limit=${limit}&offset=${offset}`))

export const getBand = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/bands/get/${id}`))