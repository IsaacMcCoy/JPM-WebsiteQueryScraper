import type { ValueTracker } from '../types/valueTracker.ts'
import { useAlerts } from '../composables/useAlerts.ts'

const { addAlert } = useAlerts()

//GET webScrapers
export async function loadAllValueTrackers(): Promise<ValueTracker[]> {
  const response = await fetch("/api/valuetrackers", {
    method: "GET"
  })

  return response.json()
}

//Get tracked value
export async function getTrackedValue(url: string, provider: string, valueId: string): Promise<string> {
  const response = await fetch(
    `/api/tracking?provider=${encodeURIComponent(provider)}&url=${encodeURIComponent(url)}&value-id=${encodeURIComponent(valueId)}`,
    {
      method: "GET"
    }
  )

  if(!response.ok) {
    addAlert("error", `Failed to load "${url}"`)
    throw new Error(`Tracking request failed: ${response.status}`)
  }

  return await response.json()
}