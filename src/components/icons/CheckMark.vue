<script setup lang="ts">
const props = defineProps<{
  width: string,
  height: string
}>()

</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 20 20"
  >
    <!-- white circle with border -->
    <circle
      cx="10"
      cy="10"
      r="9"
      fill="none"
      stroke="green"
      stroke-width="1"
    />

    <!-- check mark line -->
    <polyline
      points="5,10 8.5,13.5 15,6.5"
      fill="none"
      stroke="green"
      stroke-width="1.5"
      stroke-linecap="round"
    />

  </svg>
</template>