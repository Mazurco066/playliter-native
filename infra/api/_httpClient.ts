// Dependencies
import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'

// Store and navigation service
import { useAuthStore as store } from '../../main/store'
import { navigationService } from '../../main/services'

// Base HTTP Client
const httpClient = axios.create({
  baseURL: 'https://web-production-9095.up.railway.app/api/v1'
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