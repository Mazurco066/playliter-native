// Dependencies
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

// Store and navigation service
import { useAuthStore as store } from '../../main/store'
import { navigationService } from '../../main/services'

// Exporting base url
// export const BASE_URL = 'http://10.0.2.2:3001/api'
export const BASE_URL = 'https://grossly-dominant-rhino.ngrok-free.app/api'

// Base HTTP Client
const httpClient = axios.create({ baseURL: BASE_URL })

// Token Injection
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().getToken()
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders
    }
  }
)

// Unauthorized response verification
httpClient.interceptors.response.use(async response => {
  const token = store.getState().getToken()
  if (token && response.status === 401) {
    store.getState().logoff()
    navigationService.replace('Auth')
  }
  return response
})

// Exporting HTTP Client
export default httpClient