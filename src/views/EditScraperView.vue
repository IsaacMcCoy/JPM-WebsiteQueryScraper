<script setup lang="ts">
import UserInputForm from '../components/AddNewForm.vue'
import { currentView } from '../composables/useViews'
import { ref } from 'vue'

type EditOptions = 'add' | 'edit' | 'delete' | null
const editChoice = ref<EditOptions>(null)

</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    
    <div v-if="editChoice===null" class="min-w-[300px] rounded-lg border border-gray-200 p-4 bg-white flex flex-col gap-3" @keyup.esc="currentView='table'">
      <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='add'">Add Web Scraper</button>
      <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2">Edit Web Scrapers</button>
      <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2">Delete Web Scrapers</button>
      <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="currentView='table'">Return</button>
    </div>

    <UserInputForm v-if="editChoice==='add'" @keydown.esc="editChoice=null">
      <div class="flex-1 bg-gray-100 text-gray-500 p-4 text-center rounded-b-lg">
        <a class="hover:underline cursor-pointer" @click="editChoice=null">Return</a>
      </div>
    </UserInputForm>

  </div>
</template>