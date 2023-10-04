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

export interface IBandInvitation {
  id: string
  createdAt: string
  updatedAt: string
  response: 'pending' | 'accepted' | 'denied'
  band: {
    id: string
    createdAt: string
    updatedAt: string
    owner: string
    logo: string
    title: string
    description: string
  }
  account: UserAccount
}