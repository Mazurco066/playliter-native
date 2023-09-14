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
  asyncRequestHandler(httpClient.get(`/v1/songs/list/${bandId}?limit=${limit}&offset=${offset}&filter=${encodeURI(filter)}`))

export const getPublicSongs = async (
  { limit, offset }: IPaging = { limit: 0, offset: 0 },
  filter: string = ''
) =>
  asyncRequestHandler(httpClient.get(`/v1/songs/get/public_songs?limit=${limit}&offset=${offset}&filter=${encodeURI(filter)}`))

export const getSong = async (id: string) =>
  asyncRequestHandler(httpClient.get(`/v1/songs/${id}`))

// Category section 
export const getBandSongCategories = async (
  bandId: string,
  { limit, offset }: IPaging = { limit: 0, offset: 0 },
) =>
  asyncRequestHandler(httpClient.get(`/v2/categories/get/${bandId}?limit=${limit}&offset=${offset}`))

export const addCategory = async (bandId: string, title: string, description: string) =>
  asyncRequestHandler(httpClient.post(`/v1/categories/${bandId}`, { title, description }))

export const updateCategory = async (categoryId: string, title: string, description: string) =>
  asyncRequestHandler(httpClient.put(`/v1/categories/${categoryId}`, { title, description }))

export const removeCategory = async (categoryId: string) =>
  asyncRequestHandler(httpClient.delete(`/v1/categories/${categoryId}`))