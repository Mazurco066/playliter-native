import { UserAccount } from './account'

export interface IBand {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  logo: string
  admins: UserAccount[]
  members: UserAccount[]
  owner: UserAccount
}