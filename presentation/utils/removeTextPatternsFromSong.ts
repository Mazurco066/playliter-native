export function removeTextPatternsFromSong(input: string): string {
  const patternsToRemove = [
    /\[Intro\]/gi,
    /\[Refrão\]/gi,
    /\[Final\]/gi,
    /\[Solo\]/gi,
    /\[Primeira Parte\]/gi,
    /\[Segunda Parte\]/gi,
    /\[Terceira Parte\]/gi,
  ]

  let result = input
  patternsToRemove.forEach(pattern => {
    result = result.replace(pattern, '')
  })

  return result
}
