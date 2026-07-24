import { ref } from 'vue'
import { useWebScraper } from './useWebScraper'
import { useIgnoreRow } from './useIgnoreRow'

const { webScraperReady, webScraperList, searchWebsiteHTML } = useWebScraper()
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
  reference: string
  refIndex: number
}

const data = ref<SearchResult[]>([])

async function configureDisplayRows() {
  data.value = []
  let x = 0
  await webScraperReady
  await ignoreRowReady
  for(let i = 0; i < webScraperList.value.length; i++) {
    const results = (await searchWebsiteHTML(i, webScraperList.value[i].keyword))
    for (const reference of results) {
      x += 1
      if(!isIgnoreRow(webScraperList.value[i].url, reference)) {
        data.value.push({
          websiteIndex: i,
          reference,
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
      "reference": removeRows[i].reference
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