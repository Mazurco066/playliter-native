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
  asyncRequestHandler(httpClient.post('/v1/auth/authenticate', { ...payload }))

export const forgotPassword = async (email: string) =>
  asyncRequestHandler(httpClient.post(`/v1/auth/forgot_password`, { email }))
