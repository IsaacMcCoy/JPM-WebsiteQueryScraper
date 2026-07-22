<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWebScraper } from '../composables/useWebScraper.ts'
import type { WebScraper } from '../types/webScraper.ts'

const { ready, webScraperList, editWebScraper } = useWebScraper()

const webScraperChanges = ref<WebScraper>({
  url: '',
  credibility: 0,
  updateFrequency: '',
  keyword: ''
})

const changedForm = computed(() =>
  JSON.stringify(webScraperChanges.value) !== JSON.stringify(selected.value)
)

const editStatus = ref<'chooseScraper' | 'enterUpdates'> ('chooseScraper')

//frequency is based off of WebScraper.updateFrequency scr/types/webScraper.ts
const frequency = ['hourly', 'daily', 'weekly', 'monthly', 'yearly']

const selected = ref<WebScraper | null>(null)

function submitChosenScraper() {
  if(selected.value !== null) {
    editStatus.value = 'enterUpdates'
    webScraperChanges.value = { ...selected.value }
  }
}

function submitParameters() {
  if(selected.value !== null && changedForm.value) {
    editWebScraper(selected.value, webScraperChanges.value)
  }
}

const scraperList = ref<WebScraper[]>([])

onMounted(async () => {
  await ready
  scraperList.value = webScraperList.value
  }
)
</script>

<template>
  <!--Form for choosing scraper to edit-->
  <form
    v-if="editStatus==='chooseScraper'"
    @submit.prevent="submitChosenScraper()"
    class="rounded-t-md flex flex-col bg-white p-2"
  >

    <h1>Choose a Scraper to Edit</h1>
    <div class="grid grid-cols-[auto_auto] place-items-center m-2 mt-2 border border-gray-300">
      
      <div class="border-b border-r border-gray-300 w-full px-2 pt-2">Website</div>
      <div class="border-b border-l border-gray-300 w-full px-2 pt-2">Keyword</div>
      
      <div
        v-for="scraper in scraperList"
        :key="scraper.id"
        class="contents"
      >
        <div
          class="border-b border-r border-gray-300 w-full px-2 pt-2"
          @click="selected === scraper ? selected = null : selected = scraper"
          :class="{'bg-blue-200': selected === scraper}"
        >
          <a @click.stop :href="scraper.url" target="_blank" class="underline hover:text-blue-400 hover:cursor-pointer">
            {{ scraper.url }}
          </a>
        </div>
        
        <div
          class="border-b border-l border-gray-300 w-full px-2 pt-2"
          @click="selected === scraper ? selected = null : selected = scraper"
          :class="{'bg-blue-200': selected === scraper}"
        >
          {{ scraper.keyword }}
        </div>
      </div>
    </div>

    <button 
      type="submit"
      :class="[
        'mb-6 mt-2 mx-6 max-w-[330px] p-1 rounded-md border border-2',
        selected !== null
          ? 'bg-green-200 text-green-500 border-green-300'
          : 'bg-red-200 text-red-500 border-red-300'
      ]"
    >
      Edit Web Scraper
    </button>
  </form>

  <!--Form for editing chosen scraper-->
  <form
    v-if="editStatus==='enterUpdates'"
    @submit.prevent="submitParameters()"
    class="rounded-t-md flex flex-col p-6 bg-white gap-2"
  >

    <label class="text-[18px] text-black">Website URL</label>
    <input
      v-model="webScraperChanges.url"
      class="rounded-md"
    />

    <label class="text-[18px] text-black">Website Credibility</label>
    <input
      type="number"
      min="0"
      max="100"
      v-model.number="webScraperChanges.credibility"
      class="rounded-md"
    />

    <label class="text-[18px]">Update Frequency</label>
    <select
      v-model="webScraperChanges.updateFrequency"
      class="rounded-md text-black"
    >
      <option v-for="option in frequency" :key="option" :value="option" class="text-black">{{ option }}</option>
    </select>

    <label class="text-[18px] text-black">KeyWord</label>
    <input
      v-model="webScraperChanges.keyword"
      class="rounded-md"
      :placeholder="selected?.keyword"
    />

    <button 
      type="submit"
      :class="[
        'm-1 mt-2 p-1 rounded-md border border-2',
        changedForm
          ? 'bg-green-200 text-green-500 border-green-300'
          : 'bg-red-200 text-red-500 border-red-300'
      ]"
    >
      Save Changes
    </button>
    
    <button 
      type="button"
      class="m-1 mt-2 p-1 rounded-md border border-2 bg-blue-200 text-blue-500 border-blue-300"
      @click="editStatus='chooseScraper'; selected=null"
    >
      Back to Select
    </button>

  </form>
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