<script setup lang="ts">
import type { AlertType } from '../composables/useAlerts'
import CheckMark from './icons/CheckMark.vue'
import ExclamationMark from './icons/ExclamationMark.vue'

const props = defineProps<{
  id: number
  type: AlertType
  message: string
}>()

const emit = defineEmits<{
  close: [id: number]
}>()

const borderColors: Record<AlertType, string> = {
  error: "border-red-500",
  info: "border-blue-500",
  success: "border-green-500"
}

</script>

<template>
  <div
    class="flex items-center gap-2 min-w-90 h-12 p-4 m-2 bg-white rounded-lg border-3 text-base"
    :class="borderColors[type]"
    >

    <ExclamationMark
      v-if="type==='error'"
      width="20px"
      height="20px"
    />

    <CheckMark
      v-else-if="type==='success'"
      width="20px"
      height="20px"
    />

    <span class="flex-1">
      {{message}}
    </span>

    <button
      class="flex items-center justify-center text-black text-xl rounded-full h-8 w-8 hover:bg-gray-200 transition-colors duration-100"
      @click="emit('close', id)"
    >
    &times;
    </button>
  </div>
</template>