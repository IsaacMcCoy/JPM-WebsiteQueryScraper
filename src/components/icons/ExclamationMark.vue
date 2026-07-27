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
      stroke="red"
      stroke-width="1"
    />

    <!-- exclamation line -->
    <line
      x1="10"
      y1="6"
      x2="10"
      y2="10"
      stroke="red"
      stroke-width="2"
      stroke-linecap="round"
    />

    <!-- exclamation dot -->
    <circle
      cx="10"
      cy="14"
      r="1"
      fill="red"
    />
  </svg>
</template>