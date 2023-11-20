export function removeLeadingTrailingNewlines(input: string): string {
  // Remove leading newlines until a blank line
  const leadingRegex = /^\n*/
  const withoutLeadingNewlines = input.replace(leadingRegex, '')

  // Remove trailing newlines
  const trailingRegex = /\n*$/
  const withoutTrailingNewlines = withoutLeadingNewlines.replace(trailingRegex, '')

  return withoutTrailingNewlines
}
