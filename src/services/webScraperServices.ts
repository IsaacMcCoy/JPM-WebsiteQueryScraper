import type { WebScraper } from '../types/WebScraper.ts'
import { useAlerts } from '../composables/useAlerts.ts'

const { addAlert } = useAlerts()

//GET webScrapers
export async function loadAllWebScrapers(): Promise<WebScraper[]> {
  const response = await fetch("/api/webscrapers", {
    method: "GET"
  })

  return response.json()
}

//POST webScrapers
export async function saveNewWebScraper(webScraper: WebScraper) {
  const response = await fetch("/api/webscrapers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(webScraper)
  })
  addAlert("success", "New Web Scraper Saved")
  return response.json()
}

//PATCH webScrapers
export async function saveWebScraperChanges(id: number, updates: Partial<WebScraper>) {
  const response = await fetch(`/api/webscrapers?id=${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    addAlert("error", "Error Saving Web Scraper Edits")
    throw new Error(`Failed to update scraper: ${response.status}`)
  }
  addAlert("success", "Web Scraper Edits Saved")
  return response.json()
}

//DELETE webScraper
export async function deleteWebScraper(id: number) {
  const response = await fetch(`/api/webscrapers?id=${id}`, {
    method: "DELETE"
  })

  if(!response.ok) {
    addAlert("error", "Error Deleting Web Scraper")
    throw new Error(`Failed to delete scraper: ${response.status}`)
  }
  addAlert("success", "Web Scraper Deleted")
  return response.json()
}

//GET keyword examples from site
export async function searchWebsiteForKeyword(provider: string, url: string, keyword: string): Promise<{ type: string; text: string }[]> {
  const response = await fetch(
    `/api/extraction?provider=${encodeURIComponent(provider)}&url=${encodeURIComponent(url)}&keyword=${encodeURIComponent(keyword)}`,
    {
      method: "GET"
    }
  )

  if(!response.ok) {
    addAlert("error", `Failed to load"${url}"`)
    throw new Error(`extrcation request failed: ${response.status}`)
  }

  return await response.json()
}