// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'

// Endpoints
export const getBands = async ({ limit, offset }: IPaging = { limit: 0, offset: 0 }) =>
  asyncRequestHandler(httpClient.get(`/v1/bands/get?limit=${limit}&offset=${offset}`))

export const getBand = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/v1/bands/get/${id}`))

export const inviteIntegrant = async (bandId: string, id: string) =>
  asyncRequestHandler(httpClient.post(`/v1/bands/add_member/${bandId}`, { accountId: id }))