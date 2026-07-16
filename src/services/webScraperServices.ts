//Save the newWebScrapers to the database

import { ref } from 'vue'
import type { WebScraper } from "../types/webScraper.ts"

export const webScraperList = ref<WebScraper[]>([])

export async function saveWebScraper(webScraper: WebScraper) {
  const responce = await fetch("api/webscrapers", {
    method: "POST",
    headers: {
      "Content-Type": "appliction/json"
    },
    body: JSON.stringify(webScraper)
  })
  
  return responce.json()
}