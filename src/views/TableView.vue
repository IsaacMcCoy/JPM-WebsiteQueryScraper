<script setup lang="ts">
import DisplayTable from '../components/DisplayTable.vue'
import { currentView } from '../composables/useViews.ts'

</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    <div class="fixed top-6 right-6 flex flex-col gap-1">
      <button class="bg-black text-white py-2 px-4 rounded-lg" @click="currentView = 'edit'">Edit</button>
    </div>

    <DisplayTable />
  
  </div>
</template>