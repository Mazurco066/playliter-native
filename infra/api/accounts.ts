// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'
import { CreateAccountDTO } from '../../domain/dto'

// Endpoints
export const getRegisteredAccounts = async ({ limit, offset }: IPaging = { limit: 0, offset: 0 }) =>
  asyncRequestHandler(httpClient.get(`/v1/accounts/get?limit=${limit}&offset=${offset}`))

export const createAccount = async (data: CreateAccountDTO) =>
  asyncRequestHandler(httpClient.post(`/v1/accounts`, data))