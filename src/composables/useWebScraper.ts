//display curent web data or create new website tracker

import { ref } from 'vue'
import type { WebScraper } from '../types/webScraper.ts'

const webScraperList = ref<WebScraper[]>([])

const newWebScraper = ref<WebScraper>({
  url: '',
  credibility: null,
  updateFrequency: '',
  keyword: ''
})

function addNewWebScraper(addedWebScraper: WebScraper) {
  webScraperList.value.push(addedWebScraper)
}

export function useWebSraper() {
  return {
    webScraperList,
    newWebScraper,
    addNewWebScraper
  }
}