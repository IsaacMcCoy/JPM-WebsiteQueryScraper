<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ValueTracker } from '../types/valueTracker'
import { useValueTracker } from '../composables/useValueTracker'

const { valueTrackerList, valueTrackerReady, startTrackerInterval } = useValueTracker()

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
  <div class="w-[90vw] grid grid-cols-[17vw_17vw_17vw_17vw_17vw] rounded-md gap-4 items-stretch">
    
    <div v-for="tracker in trackerRows" :key="tracker.id" class="bg-white border border-black p-4 rounded-md gap-2 w-full">

      <div class="border-b border-black text-center mb-1">
        {{ tracker.name }}
        &nbsp;
        <a
          :href="tracker.url" target="_blank"
          class="underline hover:text-blue-400 hover:cursor-pointer"
          @click.stop
        >
          ({{ tracker.url }})
        </a>
      </div>
        
      <div
        class="border-b border-black text-center pb-1 mb-1"
        v-if="tracker.lastKnownValue"
      >
        {{ tracker.lastKnownValue }}
      </div>
        
      <div v-if="tracker.message">{{ tracker.message }}</div>
  
    </div>
  </div>
</template>