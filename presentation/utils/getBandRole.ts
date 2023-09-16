import { IBand } from '../../domain'

export const getBandRole = (accountId: string, band: IBand): string => {
  const isOwner = band.owner.id === accountId
  const isAdmin = band.admins.find((acc) => acc.id === accountId) !== undefined
  const isMember = band.members.find((acc) => acc.id === accountId) !== undefined
  const role = isOwner
    ? 'Fundador'
    :  isAdmin
      ? 'Administrador'
      : isMember
        ? 'Membro'
        : 'Sem afiliação'
  return role
}