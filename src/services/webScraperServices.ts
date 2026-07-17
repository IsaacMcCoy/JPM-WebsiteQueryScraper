//UI and Server interaction for webScrapers

import type { WebScraper } from "../types/webScraper.ts"

export async function getAllWebScrapers() {
  const response = await fetch("/api/webscrapers", {
    method: "GET"
  })

  return response.json()
}

//Save the newWebScrapers to the database
export async function saveWebScraper(webScraper: WebScraper) {
  const response = await fetch("api/webscrapers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(webScraper)
  })
  
  return response.json()
}