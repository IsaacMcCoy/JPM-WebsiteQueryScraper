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

// Search a website for a key word. The website must already be in the database with an index number
async function searchWebsiteHTML(websiteId: number, keyword: string, precision: number) {
  
  await ready
  console.log(`Loading WebScraperList[${websiteId}]`)
  if (webScraperList.value.length === 0) {
    throw new Error('No scrapers in DataBase')
  }
  console.log("Load successful")

  let searchData = await loadWebsiteFullContent(webScraperList.value[websiteId].url)

  //remove tags
  const parser = new DOMParser()
  const doc = parser.parseFromString(searchData, "text/html")
  //remove script and styles
  doc.querySelectorAll("script, style").forEach(el => el.remove())
  //remove floating white space
  searchData = doc.body.textContent || ""
  searchData = searchData
  .replace(/\s+/g, " ")
  .trim()

  console.log(searchData)
  console.log(keyword)

  const results = ref<string[]>([])

  let index = searchData.indexOf(keyword)

  while (index !== -1) {
    results.value.push(
      searchData.substring(
        Math.max(0, index - precision),
        index + keyword.length + precision
      )
    )

    index = searchData.indexOf(keyword, index + keyword.length)
  }

  console.log(results.value)

  if(results.value.length === 0) {
    throw new Error ("Keyword not found")
  }
  return results.value
}

export function useWebScraper() {
  const newWebScraper = ref<WebScraper>({
    url: '',
    credibility: 0,
    updateFrequency: '',
    keyword: ''
  })
  
  async function addNewWebScraper(addedWebScraper: WebScraper) {
    await saveNewWebScraper(addedWebScraper) //save added WebScraper to database
  }

  return {
    webScraperList,
    newWebScraper,
    searchWebsiteHTML,
    addNewWebScraper,
    loadWebsiteHTML
  }
}
