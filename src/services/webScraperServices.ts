//UI and Server interaction for webScrapers

import type { WebScraper } from "../types/webScraper.ts"

//Load all webScrapers from the database
export async function loadAllWebScrapers(): Promise<WebScraper[]> {
  const response = await fetch("/api/webscrapers", {
    method: "GET"
  })

  return response.json()
}

//Save newWebScrapers to the database
export async function saveNewWebScraper(webScraper: WebScraper) {
  const response = await fetch("/api/webscrapers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(webScraper)
  })
  
  return response.json()
}

//Load website HTML via the URL
export async function loadWebsiteFullContent(url: string): Promise<string> {
  const response = await fetch(
    `/api/extraction?url=${encodeURIComponent(url)}`,
    {
      method: "GET"
    }
  )
  if(!response.ok) {
    throw new Error(`extrcation request failed: ${response.status}`)
  }

  return await response.text()
}

//Delete web scraper
export async function deleteWebScraper(id: number) {
  const response = await fetch(`/api/webscrapers?id=${id}`, {
    method: "DELETE"
  })

  if(!response.ok) {
    throw new Error(`Failed to delete scraper: ${response.status}`)
  }

  return response.json()
}

//Save WebScrapers edits to the database
export async function saveWebScraperChanges(id: number, updates: Partial<WebScraper>) {
  const response = await fetch(`/api/webscrapers?id=${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error(`Failed to update scraper: ${response.status}`)
  }

  return response.json()
}