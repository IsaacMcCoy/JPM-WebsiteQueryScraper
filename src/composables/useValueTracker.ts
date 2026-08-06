import { ref } from 'vue'
import type { ValueTracker } from '../types/valueTracker.ts'
import { loadAllValueTrackers, getTrackedValue, saveNewValueTracker } from '../services/valueTrackerServices.ts'

// TimeoutDelay is based off of valueTracker updateFrequency
const timeoutDelay: Record<string, number> = {
  'every second': 1000,
  'every minute': 60 * 1000,
  'hourly': 60 * 60 * 1000,
  'daily': 24 * 60 * 60 * 1000,
  'weekly': 7 * 24 * 60 * 60 * 1000,
  'monthly': 30 * 7 * 24 * 60 * 60 * 1000,
  'yearly': 365 * 7 * 24 * 60 * 60 * 1000
}

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
  if (tracker.timeout) {
    return
  }

  const delay = timeoutDelay[tracker.updateFrequency]

  async function run() {
    try {
      await configureTrackedRow(tracker)
    } catch (err) {
      console.log(`Failed to update ${tracker.url}`, err)
    }

    tracker.timeout = setTimeout(run, delay)
  }

  run()
}

//export function for other file's use
export function useValueTracker() {
  const newValueTracker = ref<ValueTracker>({
    url: '',
    provider: "playwright",
    credibility: 0,
    updateFrequency: '',
    valueId: '',
    name: '',
    message: ''
  })
  
  async function addNewValueTracker(addedValueTracker: ValueTracker) {
    
    // If message exists and contains a blank string, delete it
    if (addedValueTracker.message && addedValueTracker.message.replace(/\s+/g, "") === '') {
      delete addedValueTracker.message
    }

    await saveNewValueTracker(addedValueTracker) //save added WebScraper to database
  }

  return {
    valueTrackerList,
    valueTrackerReady,
    newValueTracker,
    startTrackerInterval,
    addNewValueTracker
  }
}
