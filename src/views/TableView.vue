<script setup lang="ts">
import DisplayTable from '../components/DisplayTable.vue'
import { currentView } from '../composables/useViews.ts'
import { useTableRow } from '../composables/useTableRow.ts'

const { selected } = useTableRow()

function removeSelected() {
  selected.value = []
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    <div
      v-if="selected.length !== 0"
      class="fixed top-6 left-6 flex flex-col gap-1"
    >
      <button class="bg-black text-white py-2 px-4 rounded-lg" @click="removeSelected">Clear Selection</button>
    </div>


    <div class="fixed top-6 right-6 flex flex-col gap-1">
      <button class="bg-black text-white py-2 px-4 rounded-lg" @click="currentView = 'edit'">Edit</button>
    </div>

    <DisplayTable />
  
  </div>
</template>