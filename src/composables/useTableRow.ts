import { ref } from 'vue'
import { useWebScraper } from './useWebScraper'
import { useIgnoreRow } from './useIgnoreRow'
import { searchWebsiteForKeyword } from '../services/webScraperServices'

const { webScraperReady, webScraperList } = useWebScraper()
const { isIgnoreRow, ignoreRowReady, newIgnoreRow, addNewIgnoreRow } = useIgnoreRow()

const selected = ref<number[]>([])

function isSelected(index: number) {
  return selected.value.includes(index)
}

function toggleSelected(index: number) {
  if(isSelected(index)) {
    selected.value = selected.value.filter(item => item !== index)
  } else {
    selected.value.push(index)
  }
}

interface SearchResult {
  websiteIndex: number
  referense: string
  refIndex: number
}

const data = ref<SearchResult[]>([])

async function configureDisplayRows() {
  data.value = []
  let x = 0
  await webScraperReady
  await ignoreRowReady
  for(let i = 0; i < webScraperList.value.length; i++) {
    if(!webScraperList.value[i].provider) { return }
    const results = await searchWebsiteForKeyword(webScraperList.value[i].provider, webScraperList.value[i].url, webScraperList.value[i].keyword)
    for (const referense of results) {
      x += 1
      if(!isIgnoreRow(webScraperList.value[i].url, referense.text)) {
        data.value.push({
          websiteIndex: i,
          referense: referense.text,
          refIndex: x
        })
      }
    }
  }
}

async function removeRows(rows: number[]) {
  let removeRows = data.value.filter(
    item => rows.includes(item.refIndex)
  )
  console.log(removeRows)
  for(let i = 0; i < removeRows.length; i++) {
    newIgnoreRow.value = {
      "url": webScraperList.value[removeRows[i].websiteIndex].url,
      "reference": removeRows[i].referense
    }
    console.log("working")
    addNewIgnoreRow(newIgnoreRow.value)
  }
  
  data.value = data.value.filter(
    item => !rows.includes(item.refIndex)
  )
  selected.value = []
}

export function useTableRow() {
  return {
    data,
    configureDisplayRows,
    selected,
    isSelected,
    toggleSelected,
    removeRows
  }
}