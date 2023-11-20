export function removeMusicalTabs(input: string): string {
  // Replace all occurrences of musical tablature notation
  const withoutMusicalTabs = input.replace(/^(E\|.*$|B\|.*$|G\|.*$|D\|.*$|A\|.*$|E\|.*$|)\n*/gm, '')
  return withoutMusicalTabs
}
