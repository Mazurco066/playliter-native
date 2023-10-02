export interface CreateAccountDTO {
  name: string
  email: string
  username: string
  password: string
}

export interface UpdateAccountDTO {
  name: string
  email: string
  avatar?: string
}