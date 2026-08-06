export async function getSelectorWebpage(url: string): Promise<string> {

  const response = await fetch(
    `/api/selector/load?url=${encodeURIComponent(url)}`,
    {
      method: "GET"
    }
  )

  return await response.text()
}