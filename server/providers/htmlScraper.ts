
export async function htmlProvider(url: string) {
  
  const response = await fetch(url)
  
  if(!response.ok) {
    throw new Error(`Failed loading page: ${response.status}`)
  }

  const rawHTML = await response.text()

  return rawHTML
}