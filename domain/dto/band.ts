export type SaveBandDto = {
  title: string
  description: string
  logo?: string
}

export type RespondInviteDto = {
  inviteId: string
  response: 'accepted' | 'denied'
}