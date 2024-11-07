// Dependencies
import axios, { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

// Store and navigation service
import { useAuthStore as store } from '../../main/store'
import { navigationService } from '../../main/services'

// Exporting base url
// export const BASE_URL = 'http://10.0.2.2:3001/api'
export const BASE_URL = 'https://grossly-dominant-rhino.ngrok-free.app/api'

// Base HTTP Client
const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000 // 30s
})

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
httpClient.interceptors.response.use(
  response => {
    const token = store.getState().getToken()
    if (token && [401].includes(response.status)) {
      store.getState().logoff()
      navigationService.replace('Auth')
    }
    return response
  },
  (error: AxiosError) => {
    const token = store.getState().getToken()

    if (error.code === 'ECONNABORTED') {
      // Timeout error
      store.getState().logoff()
      navigationService.replace('Auth')
    }
    else if (token && [401].includes(error.response.status)) {
      store.getState().logoff()
      navigationService.replace('Auth')
    }
    return Promise.reject(error)
  }
)

// Exporting HTTP Client
export default httpClient