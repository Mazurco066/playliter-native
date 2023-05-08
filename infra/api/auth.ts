// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request interfaces
interface LoginPayload {
  username: string
  password: string
}

// Endpoints
export const login = async (payload: LoginPayload) =>
  asyncRequestHandler(httpClient.post('/auth/authenticate', { ...payload }))