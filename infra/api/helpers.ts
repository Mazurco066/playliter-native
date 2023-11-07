// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Endpoints
export const uploadImage = async (formData: FormData) => 
  asyncRequestHandler(httpClient.post(`/v1/helpers/upload_file`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }))

export const scrapLiturgy = async (date: string) =>
  asyncRequestHandler(httpClient.post(`/v1/helpers/daily_liturgy`, { date }))