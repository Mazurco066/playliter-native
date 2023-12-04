// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Types
import type{ AxiosResponse } from 'axios'

// Endpoints
export const uploadImage = async (formData: FormData): Promise<AxiosResponse> => 
  asyncRequestHandler(httpClient.post(`/v1/helpers/upload_file`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }))

export const scrapLiturgy = async (date: string): Promise<AxiosResponse> =>
  asyncRequestHandler(httpClient.post(`/v1/helpers/daily_liturgy`, { date }))

export const getLiturgyColor = async (id: string): Promise<AxiosResponse> =>
  asyncRequestHandler(httpClient.get(`/v1/helpers/liturgy_color/${id}`))

export const scrapSongs = async (url: string): Promise<AxiosResponse> =>
  asyncRequestHandler(httpClient.post(`/v1/helpers/scrap_song`, { url }))