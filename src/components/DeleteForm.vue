<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWebScraper } from '../composables/useWebScraper'
import type { WebScraper } from '../types/webScraper'
import { deleteWebScraper } from '../services/webScraperServices'

const { webScraperList, ready } = useWebScraper()

const scraperList = ref<WebScraper[]>([])

const selected = ref<WebScraper | null>(null)

async function submitParameters() {
  if(selected.value !== null) {
    const confirmed = confirm(
      `Delete scraper tracking "${selected.value.keyword}" on ${selected.value.url}?`
    )
    if (!confirmed) { return }
    await deleteWebScraper(selected.value.id)
    selected.value = null
  }
}

onMounted(async () => {
  await ready
  scraperList.value = webScraperList.value
  }
)

</script>

<template>
  <form @submit.prevent="submitParameters()" class="rounded-t-md flex flex-col bg-white p-2">
    
    <div class="grid grid-cols-[auto_auto] place-items-center m-2 mt-5 border border-gray-300">
      
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
      class="mb-6 mt-2 mx-6 max-w-[330px] p-1 rounded-md border border-2 bg-red-200 text-red-500 border-red-300"
    >
      Delete Web Scraper
    </button>
  
  </form>
</template>