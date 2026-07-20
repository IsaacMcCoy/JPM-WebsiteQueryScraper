//display curent web data or create new website tracker

import { ref } from 'vue'
import type { WebScraper } from '../types/webScraper.ts'
import { getAllWebScrapers, saveWebScraper } from '../services/webScraperServices.ts'

const webScraperList = ref<WebScraper[]>([])

// expose the loading promise itself
const ready = getAllWebScrapers().then(data => {
  webScraperList.value = data
})

export function useWebScraper() {
  const newWebScraper = ref<WebScraper>({
    url: '',
    credibility: null,
    updateFrequency: '',
    keyword: ''
  })
  
  async function addNewWebScraper(addedWebScraper: WebScraper) {
    await saveWebScraper(addedWebScraper) //save added WebScraper to database
  }

  return {
    webScraperList,
    newWebScraper,
    addNewWebScraper,
    ready
  }
}