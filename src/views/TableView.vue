<script setup lang="ts">
import DisplayTable from '../components/DisplayTable.vue'
import { useTableRow } from '../composables/useTableRow.ts'
import { computed } from 'vue'

const { selected, removeRows } = useTableRow()

function removeSelected() {
  selected.value = []
}

const removeMessage = computed(() => {
  if(selected.value.length > 1 ) {
    return "Remove Rows"
  } else {
    return "Remove Row"
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    <div
      v-if="selected.length !== 0"
      class="fixed top-6 left-6 flex flex-col gap-1"
    >
      <button class="bg-black text-white py-2 px-4 rounded-lg" @click="removeSelected">Clear Selection</button>
    </div>

    <DisplayTable />
  
    <div
      v-if="selected.length !== 0"
      class="fixed bottom-6 right-6 flex flex-col gap-1"
    >
      <button class="bg-black text-white py-2 px-4 rounded-lg" @click="removeRows(selected)">{{ removeMessage }}</button>
    </div>

  </div>
</template>