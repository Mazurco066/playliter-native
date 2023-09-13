// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'

// Endpoints
export const getPendingConcerts = async () =>
  asyncRequestHandler(httpClient.get('/v1/shows/get/pending_shows'))

export const getConcert = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/v1/shows/${id}`))

export const getConcerts = async (
  id: string,
  { limit, offset }: IPaging = { limit: 0, offset: 0 },
  filter: string = ''
) =>
  asyncRequestHandler(httpClient.get(`/v2/shows/list/${id}?limit=${limit}&offset=${offset}&filter=${encodeURI(filter)}`))

export const reorderConcert = async (id: string, songs: string[]) =>
  asyncRequestHandler(httpClient.put(`/v1/shows/${id}/reorder`, { songs }))

export const deleteConcert = async (id: string) =>
  asyncRequestHandler(httpClient.delete(`/v1/shows/${id}`))

export const linkSong = async (id: string, songId: string) =>
  asyncRequestHandler(httpClient.patch(`/v1/shows/${id}/link_song`, { songId }))

export const unlinkSong = async (id: string, songId: string) =>
  asyncRequestHandler(httpClient.patch(`/v1/shows/${id}/unlink_song`, { songId }))

export const addConcertObservation = async (concertId: string, title: string, data: string) =>
  asyncRequestHandler(httpClient.post(`/v1/shows/${concertId}/add_observation`, { title, data }))

export const updateConcertObservation = async (concertId: string, id: string, title: string, data: string) =>
  asyncRequestHandler(httpClient.put(`/v1/shows/${concertId}/${id}/update_observation`, { title, data }))

export const removeConcertObservation = async (concertId: string, id: string) =>
  asyncRequestHandler(httpClient.post(`/v1/shows/${concertId}/${id}/remove_observation`, {}))