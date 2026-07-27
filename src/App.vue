<script setup lang="ts">
import TableView from './views/TableView.vue'
import { currentView } from './composables/useViews.ts'
import EditScraperView from './views/EditScraperView.vue'
import AlertBox from './components/AlertBox.vue'
import { useAlerts } from './composables/useAlerts.ts'

const { alerts, removeAlert } = useAlerts()

</script>

<template>
  <TableView v-if="currentView==='table'" />
  <EditScraperView v-if="currentView==='edit'" />

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
