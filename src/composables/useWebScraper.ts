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

// helper: snap a window to the nearest whole word on both sides
function extractSnippet(text: string, index: number, keywordLength: number, radius: number): string {
  let start = Math.max(0, index - radius)
  let end = Math.min(text.length, index + keywordLength + radius)

  // back start up to the nearest preceding space (don't cut a word)
  while (start > 0 && text[start] !== ' ') start--
  // push end forward to the nearest following space
  while (end < text.length && text[end] !== ' ') end++

  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''

  return prefix + text.substring(start, end).trim() + suffix
}

// Search a website for a key word. The website must already be in the database with an index number
async function searchWebsiteHTML(websiteId: number, keyword: string) {
  
  await ready
  console.log(`Loading WebScraperList[${websiteId}]...`)
  if (webScraperList.value.length === 0) {
    throw new Error('No scrapers in DataBase')
  }

  const rawHTML = await loadWebsiteFullContent(webScraperList.value[websiteId].url)
  console.log("Load successful")
  
  //remove tags
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawHTML, "text/html")
  //remove script and styles
  doc.querySelectorAll("script, style").forEach(el => el.remove())


  const results = ref<string[]>([])
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = (node.textContent || "").replace(/\s+/g, " ").trim()
    if (!text) continue
     const kwLower = keyword.toLowerCase()

    const lower = text.toLowerCase()
    if (!lower.includes(kwLower)) continue

    // short enough already -> keep as-is
    if (text.length <= 100) {
      results.value.push(text)
      continue
    }

    // too long -> pull a ~50-char window around each occurrence
    let idx = lower.indexOf(kwLower)
    while (idx !== -1) {
      results.value.push(extractSnippet(text, idx, keyword.length, 50))
      idx = lower.indexOf(kwLower, idx + keyword.length)
    }
  }
  
  if(results.value.length === 0) {
    throw new Error ("Keyword not found")
  }
  return results.value
}

//export function for other file's use
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
    ready,
    webScraperList,
    newWebScraper,
    searchWebsiteHTML,
    addNewWebScraper,
    loadWebsiteHTML
  }
}
