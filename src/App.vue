<script setup lang="ts">
import TableView from './views/TableView.vue'
import { currentView } from './composables/useViews.ts'
import EditScraperView from './views/EditScraperView.vue'
import AlertBox from './components/AlertBox.vue'
import { useAlerts } from './composables/useAlerts.ts'
import TrackerView from './views/TrackerView.vue'

const { alerts, removeAlert } = useAlerts()

</script>

<template>
  <TableView v-if="currentView==='table'" />
  <EditScraperView v-if="currentView==='edit'" />
  <TrackerView v-if="currentView==='tracker'" />

  <div class="fixed top-6 right-6 flex flex-col gap-1">
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='table'" @click="currentView = 'table'">Table</button>
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='edit'" @click="currentView = 'edit'">Edit</button>
    <button class="bg-black text-white py-2 px-4 rounded-lg" v-if="currentView!=='tracker'" @click="currentView = 'tracker'">Tracker</button>
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
