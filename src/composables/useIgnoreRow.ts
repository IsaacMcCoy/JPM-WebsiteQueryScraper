import { ref } from 'vue'
import type { IgnoreRow } from '../types/IgnoreRow.ts'
import { loadAllIgnoreRows } from '../services/IgnoreRowServices.ts'
import { saveNewIgnoreRow } from '../services/IgnoreRowServices.ts'

const ignoreRowList = ref<IgnoreRow[]>([])

// expose the loading promise itself
const ignoreRowReady = loadAllIgnoreRows().then(data => {
  ignoreRowList.value = data
})

function isIgnoreRow(url: string, reference: string) {
  return ignoreRowList.value.some(
    item => item.url === url && item.reference === reference
  )
}

export function useIgnoreRow() {
  const newIgnoreRow = ref<IgnoreRow>({
    url: '',
    reference: ''
  })
    
  async function addNewIgnoreRow(addedIgnoreRow: IgnoreRow) {
    await saveNewIgnoreRow(addedIgnoreRow) //save added WebScraper to database
  }

  return {
    ignoreRowReady,
    isIgnoreRow,
    ignoreRowList,
    newIgnoreRow,
    addNewIgnoreRow
  }
}