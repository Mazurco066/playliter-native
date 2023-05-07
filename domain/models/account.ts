export interface UserAccount {
  id: string
  role: string,
  isEmailconfirmed: boolean
  avatar?: string
  username: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}