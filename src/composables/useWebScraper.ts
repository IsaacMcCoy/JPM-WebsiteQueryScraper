import { ref } from 'vue'
import type { WebScraper } from '../types/webScraper.ts'
import { loadAllWebScrapers, saveNewWebScraper, deleteWebScraper, saveWebScraperChanges } from '../services/webScraperServices'

const webScraperList = ref<WebScraper[]>([])

// expose the loading promise itself
const webScraperReady = loadAllWebScrapers().then(data => {
  webScraperList.value = data
})

//export function for other file's use
export function useWebScraper() {
  const newWebScraper = ref<WebScraper>({
    url: '',
    credibility: 0,
    updateFrequency: '',
    keyword: '',
    provider: 'html'
  })
  
  async function addNewWebScraper(addedWebScraper: WebScraper) {
    await saveNewWebScraper(addedWebScraper) //save added WebScraper to database
  }

  async function editWebScraper(changedWebScraper: WebScraper, updates: Partial<WebScraper>) {
    if (typeof changedWebScraper.id === "number") {
      await saveWebScraperChanges(changedWebScraper.id, updates)
    } else {
      alert("error in editing webscraper")
    }
  }

  async function removeWebScraper(removedWebScraper: WebScraper) {
    if (typeof removedWebScraper.id === "number") {
      await deleteWebScraper(removedWebScraper.id)
    } else {
      alert("error in removing scraper")
    }
  }

  return {
    webScraperReady,
    webScraperList,
    newWebScraper,
    addNewWebScraper,
    editWebScraper,
    removeWebScraper
  }
}
