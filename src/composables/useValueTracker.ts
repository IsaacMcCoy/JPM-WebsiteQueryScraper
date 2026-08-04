import { ref } from 'vue'
import type { ValueTracker } from '../types/valueTracker.ts'
import { loadAllValueTrackers, getTrackedValue } from '../services/valueTrackerServices.ts'

const valueTrackerList = ref<ValueTracker[]>([])

// expose the loading promise itself
const valueTrackerReady = loadAllValueTrackers().then(data => {
  valueTrackerList.value = data
})

async function configureTrackedRow(tracker: ValueTracker) {
  const foundValue = await getTrackedValue(tracker.url, tracker.provider, tracker.valueId)
  tracker.lastKnownValue = foundValue
}

function startTrackerInterval(tracker: ValueTracker) {
  if (tracker.interval) {
    return
  }

  const interval = setInterval(async () => {
    try {
      await configureTrackedRow(tracker)
    } catch (err) {
      console.log(`Failed updating ${tracker.url}`, err)
      return
    }
  }, 2500)

  tracker.interval = interval
}

//export function for other file's use
export function useValueTrackers() {
  return {
    valueTrackerList,
    valueTrackerReady,
    startTrackerInterval
  }
}
