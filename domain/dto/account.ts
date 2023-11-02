export type CreateAccountDTO = {
  name: string
  email: string
  username: string
  password: string
}

export type UpdateAccountDTO = {
  name: string
  email: string
  avatar?: string
}