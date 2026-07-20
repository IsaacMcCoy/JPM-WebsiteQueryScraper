//display curent web data or create new website tracker

import { ref } from 'vue'
import type { WebScraper } from '../types/webScraper.ts'
import { loadAllWebScrapers, saveNewWebScraper, loadWebsiteFullContent } from '../services/webScraperServices.ts'

const webScraperList = ref<WebScraper[]>([])

// expose the loading promise itself
const ready = loadAllWebScrapers().then(data => {
  webScraperList.value = data
})

//Function for loading a URL
async function loadWebsiteHTML(scraperId: number): Promise<string> {
  await ready
  console.log(`Loading WebScraperList[${scraperId}]`)
  if (webScraperList.value.length === 0) {
    throw new Error('No scrapers in DataBase')
  }
  return await loadWebsiteFullContent(webScraperList.value[scraperId].url)
}

export function useWebScraper() {
  const newWebScraper = ref<WebScraper>({
    url: '',
    credibility: null,
    updateFrequency: '',
    keyword: ''
  })
  
  async function addNewWebScraper(addedWebScraper: WebScraper) {
    await saveNewWebScraper(addedWebScraper) //save added WebScraper to database
  }

  return {
    webScraperList,
    newWebScraper,
    addNewWebScraper,
    loadWebsiteHTML
  }
}

//test code
const test = loadWebsiteHTML(0)
console.log(test)