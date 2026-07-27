export function extractSnippet(text: string, index: number, keywordLength: number, radius: number): string {
  let start = Math.max(0, index - radius)
  let end = Math.min(text.length, index + keywordLength + radius)

  // back start up to the nearest preceding space (don't cut a word)
  while (start > 0 && text[start] !== ' ') start--
  // push end forward to the nearest following space
  while (end < text.length && text[end] !== ' ') end++

  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''

  return prefix + text.substring(start, end).trim() + suffix
}
