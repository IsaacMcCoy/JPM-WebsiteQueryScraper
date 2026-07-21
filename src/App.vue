<script setup lang="ts">
import TableView from './views/TableView.vue'
import { currentView } from './composables/useViews.ts'
import EditScraperView from './views/EditScraperView.vue';

</script>

<template>
  <TableView v-if="currentView==='table'" />
  <EditScraperView v-if="currentView==='edit'" />
</template>
