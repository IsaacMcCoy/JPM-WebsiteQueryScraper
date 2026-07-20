<script setup lang="ts">
import { computed } from 'vue'
import { useWebScraper } from '../composables/useWebScraper.ts'

const { newWebScraper, addNewWebScraper } = useWebScraper()

//frequency is based off of WebScraper.updateFrequency scr/types/webScraper.ts
const frequency = ['hourly', 'daily', 'weekly', 'monthly', 'yearly']

const completeForm = computed(() => 
  newWebScraper.value.url !== '' &&
  typeof newWebScraper.value.credibility === 'number' &&
  newWebScraper.value.credibility <= 100 &&
  newWebScraper.value.credibility >= 1 &&
  newWebScraper.value.updateFrequency !== '' &&
  newWebScraper.value.keyword !== ''
)

function submitParameters() {
  if(completeForm.value) {
    addNewWebScraper(newWebScraper.value)
  }
}
</script>

<template>
  <div class="min-w-[375px] min-h-[100px] rounded-lg border border-gray-200 p-0">
    <form @submit.prevent="submitParameters()" class="rounded-t-md flex flex-col p-6 bg-white gap-2">

      <label class="text-[18px] text-black">Website URL</label>
        <input
          v-model="newWebScraper.url"
          class="rounded-md placeholder:text-gray-400"
          placeholder="https://bogus-data.com"
        />

        <label class="text-[18px] text-black">Website Credibility</label>
        <input
          type="number"
          min="1"
          max="100"
          v-model="newWebScraper.credibility"
          class="rounded-md placeholder:text-gray-400"
          placeholder="100"
        />

        <label class="text-[18px]">Update Frequency</label>
        <select
          v-model="newWebScraper.updateFrequency"
          :class="[
            'rounded-md',
            newWebScraper.updateFrequency === '' 
              ? 'text-gray-400'
              : 'text-black'
          ]"
        >
          <option disabled value="">Select</option>
          <option v-for="option in frequency" :key="option" :value="option" class="text-black">{{ option }}</option>
        </select>

        <label class="text-[18px] text-black">KeyWord</label>
        <input
          v-model="newWebScraper.keyword"
          class="rounded-md placeholder:text-gray-400"
          placeholder=""
        />

        <button 
        type="submit"
        :class="[
          'm-1 mt-2 p-1 rounded-md border border-2',
          completeForm
            ? 'bg-green-200 text-green-500 border-green-300'
            : 'bg-red-200 text-red-500 border-red-300'
        ]"
        >Run Query
      </button>

    </form>
    <div class="flex-1 bg-gray-100 text-gray-500 p-4 text-center">
      <a class="hover:underline cursor-pointer">Previous Searches</a>
    </div>
  </div>
</template>

<style>
input,
select {
  background-color: #f7f8fa;
  border: 1px solid #e5e7eb;
  margin: 4px;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 18px;
  height: 40px;
}
</style>