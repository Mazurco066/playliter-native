export interface SaveBandDto {
  title: string
  description: string
  logo?: string
}

export interface RespondInviteDto {
  inviteId: string
  response: 'accepted' | 'denied'
}