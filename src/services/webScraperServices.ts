//UI and Server interaction for webScrapers

import type { WebScraper } from '../types/WebScraper.ts'
import type { IgnoreRow } from '../types/IgnoreRow.ts'
import { useAlerts } from '../composables/useAlerts.ts'

const { addAlert } = useAlerts()

//Load all webScrapers from the database
export async function loadAllWebScrapers(): Promise<WebScraper[]> {
  const response = await fetch("/api/webscrapers", {
    method: "GET"
  })

  return response.json()
}

//Load all ignoreRows from the database
export async function loadAllIgnoreRows(): Promise<IgnoreRow[]> {
  const response = await fetch("/api/ignorerows", {
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
  addAlert("success", "New Web Scraper Saved")
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
    addAlert("error", url)
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
    addAlert("error", "Error Deleting Web Scraper")
    throw new Error(`Failed to delete scraper: ${response.status}`)
  }
  addAlert("success", "Web Scraper Deleted")
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
    addAlert("error", "Error Saving Web Scraper Edits")
    throw new Error(`Failed to update scraper: ${response.status}`)
  }
  addAlert("success", "Web Scraper Edits Saved")
  return response.json()
}

//Save newIgnoreRow to the database
export async function saveNewIgnoreRow(ignoreRow: IgnoreRow) {
  const response = await fetch("/api/ignorerows", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ignoreRow)
  })
  
  return response.json()
}