import { IBand } from '../../domain'

export const getBandRole = (
  accountId: string,
  band: IBand,
  translations: string[] = [
    'Fundador',
    'Administrador',
    'Membro',
    'Sem afiliação'
  ]
): string => {
  const isOwner = band.owner.id === accountId
  const isAdmin = band.admins.find((acc) => acc.id === accountId) !== undefined
  const isMember = band.members.find((acc) => acc.id === accountId) !== undefined
  const role = isOwner
    ? translations[0]
    :  isAdmin
      ? translations[1]
      : isMember
        ? translations[2]
        : translations[3]
  return role
}