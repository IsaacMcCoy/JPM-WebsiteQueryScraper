//verify WebScraper data works and activate the scrapers

export async function getWebsiteContent(url: string): Promise<string> {
  const responce = await fetch(
    `/api/extraction?url=${encodeURIComponent(url)}`,
    {
      method: "GET"
    }
  )

  if(!responce.ok) {
    throw new Error('extrcation request failed: ${response.status}')
  }

  return await responce.text()
}