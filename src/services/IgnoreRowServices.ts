import type { IgnoreRow } from '../types/IgnoreRow.ts'

//GET ignoreRows
export async function loadAllIgnoreRows(): Promise<IgnoreRow[]> {
  const response = await fetch("/api/ignorerows", {
    method: "GET"
  })

  return response.json()
}

//POST ignoreRows
export async function saveNewIgnoreRow(ignoreRow: IgnoreRow) {
  const response = await fetch("/api/ignorerows", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ignoreRow)
  })
  
  return response.json()
}