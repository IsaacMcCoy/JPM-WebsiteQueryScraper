import { ref } from 'vue'
import type { IgnoreRow } from '../types/ignoreRow.ts'
import { loadAllIgnoreRows } from '../services/webScraperServices'

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
  return {
    ignoreRowReady,
    isIgnoreRow,
    ignoreRowList
  }
}