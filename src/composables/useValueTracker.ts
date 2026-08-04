import { ref } from 'vue'
import type { ValueTracker } from '../types/valueTracker.ts'
import { loadAllValueTrackers, getTrackedValue, saveNewValueTracker } from '../services/valueTrackerServices.ts'

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
