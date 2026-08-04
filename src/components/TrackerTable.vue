<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ValueTracker } from '../types/valueTracker'
import { useValueTrackers } from '../composables/useValueTracker'

const { valueTrackerList, valueTrackerReady, startTrackerInterval } = useValueTrackers()

const trackerRows = ref<ValueTracker[]>([])

onMounted(async() => {
  await valueTrackerReady
  trackerRows.value = [...valueTrackerList.value]

  for(const row of trackerRows.value) {
    startTrackerInterval(row)
  }
})

onUnmounted(async() => {
  for (const row of trackerRows.value) {
    clearInterval(row.interval)
    delete row.interval
  }
})

</script>
<template>
  <div v-for="tracker in trackerRows" :key="tracker.id">
  
    <div class="bg-white border border-black p-4 rounded-md gap-2"><span>{{ tracker.name }}: {{ tracker.lastKnownValue }}</span></div>
  
  </div>
</template>