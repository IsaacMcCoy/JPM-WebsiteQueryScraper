<script setup lang="ts">
import AddNewForm from '../components/AddNewForm.vue'
import EditForm from '../components/EditForm.vue'
import DeleteForm from '../components/DeleteForm.vue'
import { currentView } from '../composables/useViews'
import { ref } from 'vue'

type EditOptions = 'add' | 'edit' | 'delete' | null
const editChoice = ref<EditOptions>(null)

</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    
    <!--Options-->
    <div v-if="editChoice===null" class="min-w-[300px] rounded-lg border border-gray-200">
      <div class="p-4  flex flex-col gap-3 bg-white rounded-t-lg">
        <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='add'">Add Web Scraper</button>
        <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='edit'">Edit Web Scraper</button>
        <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='delete'">Delete Web Scraper</button>
      </div>

      <div class="flex-1 bg-gray-100 text-gray-500 p-4 text-center rounded-b-lg">
        <a class="hover:underline cursor-pointer" @click="currentView='table'">Return</a>
      </div>
    
    </div>

    <!--Actual forms-->
    <div v-else class="min-w-[375px] min-h-[100px] rounded-lg border border-gray-200 p-0">
      
      <AddNewForm v-if="editChoice==='add'" />
      <EditForm v-if="editChoice==='edit'" />
      <DeleteForm v-if="editChoice==='delete'" />

      <div class="flex-1 bg-gray-100 text-gray-500 p-4 text-center rounded-b-lg">
        <a class="hover:underline cursor-pointer" @click="editChoice=null">Return</a>
      </div>
    
    </div>

  </div>
</template>