// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces

// Endpoints
export const getPendingConcerts = async () =>
  asyncRequestHandler(httpClient.get('/shows/get/pending_shows'))

export const getConcert = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/shows/${id}`))