<script setup lang="ts">
import TableView from './views/TableView.vue'
import { currentView } from './composables/useViews.ts'
import EditScraperView from './views/EditScraperView.vue'
import AlertBox from './components/AlertBox.vue'
import { useAlerts } from './composables/useAlerts.ts'
import TrackerView from './views/TrackerView.vue'
import EditTrackerView from './views/EditTrackerView.vue'

const { alerts, removeAlert } = useAlerts()

</script>

<template>
  <TableView v-if="currentView==='table'" />
  <EditScraperView v-if="currentView==='editScrapers'" />
  <EditTrackerView v-if="currentView==='editTrackers'" />
  <TrackerView v-if="currentView==='tracker'" />

  <div class="fixed top-6 right-6 flex flex-col gap-1">
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='table'" @click="currentView = 'table'">Table</button>
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='editScrapers'" @click="currentView = 'editScrapers'">Edit Scrapers</button>
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='tracker'" @click="currentView = 'tracker'">Tracker</button>
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='editTrackers'" @click="currentView = 'editTrackers'">Edit Trackers</button>
  </div>

  <div class="fixed bottom-6 right-6 flex flex-col z-10">
    <AlertBox
      v-for="alert in alerts"
      :key="alert.id"
      :id="alert.id"
      :type="alert.type"
      :message="alert.message"
      @close="removeAlert"
    />
  </div>
</template>
