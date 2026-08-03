<script setup lang="ts">
import { ref } from 'vue'

const goldPrice = ref<string>()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    <div class="bg-white border border-black p-4 rounded-md">Gold Price: ${{ goldPrice }}</div>
  </div>
</template>