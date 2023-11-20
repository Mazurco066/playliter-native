export function removeToneText(input: string): string {
  const variableLineRegex = new RegExp(`tom:.*$`, 'gm')
  const result = input.replace(variableLineRegex, '')
  return result
}