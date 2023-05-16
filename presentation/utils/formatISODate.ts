// Date without time
export const formatISODate = (date: string): string =>
  date.split('T')[0].split('-').reverse().join('/')