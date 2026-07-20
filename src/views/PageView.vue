<script setup lang="ts">
import UserInputForm from '../components/UserInputForm.vue'
import DisplayTable from '../components/DisplayTable.vue'

const addNew: boolean = false
</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    <UserInputForm v-if="addNew"/>
    <DisplayTable v-else />
  </div>
</template>