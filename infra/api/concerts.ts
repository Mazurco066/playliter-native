// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces

// Endpoints
export const getPendingConcerts = async () =>
  asyncRequestHandler(httpClient.get('/shows/get/pending_shows'))

export const getConcert = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/shows/${id}`))

export const reorderConcert = async (id: string, songs: string[]) =>
  asyncRequestHandler(httpClient.put(`/shows/${id}/reorder`, { songs }))

export const deleteConcert = async (id: string) =>
  asyncRequestHandler(httpClient.delete(`/shows/${id}`))

export const unlinkSong = async (id: string, songId: string) =>
  asyncRequestHandler(httpClient.patch(`/shows/${id}/unlink_song`, { songId }))