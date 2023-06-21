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

export const linkSong = async (id: string, songId: string) =>
  asyncRequestHandler(httpClient.patch(`/shows/${id}/link_song`, { songId }))

export const unlinkSong = async (id: string, songId: string) =>
  asyncRequestHandler(httpClient.patch(`/shows/${id}/unlink_song`, { songId }))

export const addConcertObservation = async (concertId: string, title: string, data: string) =>
  asyncRequestHandler(httpClient.post(`/shows/${concertId}/add_observation`, { title, data }))

export const updateConcertObservation = async (concertId: string, id: string, title: string, data: string) =>
  asyncRequestHandler(httpClient.put(`/shows/${concertId}/${id}/update_observation`, { title, data }))

export const removeConcertObservation = async (concertId: string, id: string) =>
  asyncRequestHandler(httpClient.post(`/shows/${concertId}/${id}/remove_observation`, {}))