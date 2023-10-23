// App Http client
import httpClient from './_httpClient'
import { asyncRequestHandler } from '../../presentation/utils'

// Request types and interfaces
import { IPaging } from './_types'
import { CreateAccountDTO, UpdateAccountDTO } from '../../domain/dto'

// Endpoints
export const getRegisteredAccounts = async ({ limit, offset }: IPaging = { limit: 0, offset: 0 }) =>
  asyncRequestHandler(httpClient.get(`/v1/accounts/get?limit=${limit}&offset=${offset}`))

export const getCurrentAccount = async () =>
  asyncRequestHandler(httpClient.get('/v1/accounts/me'))

export const createAccount = async (data: CreateAccountDTO) =>
  asyncRequestHandler(httpClient.post(`/v1/accounts`, data))

export const updateAccount = async (id: string, data: UpdateAccountDTO) =>
  asyncRequestHandler(httpClient.put(`/v1/accounts/${id}`, data))

export const resendValidationEmail = async () =>
  asyncRequestHandler(httpClient.post('/v1/accounts/resend_verification_email'))

export const verifyAccount = async (code: string) =>
  asyncRequestHandler(httpClient.post('/v1/accounts/verify_account', { code }))

export const deleteAccountData = async () =>
  asyncRequestHandler(httpClient.delete('/v2/songs/wipe_account_data'))