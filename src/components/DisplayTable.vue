<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWebScraper } from '../composables/useWebScraper'

const { ready, webScraperList, searchWebsiteHTML } = useWebScraper()

interface SearchResult {
  websiteIndex: number
  reference: string
}

const data = ref<SearchResult[]>([])

onMounted(async () => {
  await ready
  for(let i = 0; i < webScraperList.value.length; i++) {
    const results = (await searchWebsiteHTML(i, webScraperList.value[i].keyword, 20))
    for (const reference of results) {
      data.value.push({
        websiteIndex: i,
        reference
      })
    }
  }
})

</script>

<template>
  <div class="grid grid-cols-[auto_auto_auto_auto_auto] place-items-center m-10"> <!--Order is index, site, cred, update, usage-->
    
    <div class="w-full h-full bg-white border border-black p-2 text-center">Index</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Site</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Credibility</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Update Frequency</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Usage</div>
    
    <div class="contents" v-for="(result, index) in data" :key="index">
      
      <div
        class="w-full h-full bg-white border border-black p-2 text-center"
      >
        {{ index + 1 }}
      </div>
      
      <a
        :href="webScraperList[result.websiteIndex].url" target="_blank"
        class="w-full h-full bg-white border border-black p-2 text-center underline hover:text-blue-400 hover:cursor-pointer"
      >
        {{ webScraperList[result.websiteIndex].url }}
      </a>

      <div
        class="w-full h-full bg-white border border-black p-2 text-center"
        :class="
          webScraperList[result.websiteIndex].credibility >= 90
            ? 'text-green-600'
            : webScraperList[result.websiteIndex].credibility >= 75
            ? 'text-yellow-600'
            : 'text-red-600'
        "
      >
        {{ webScraperList[result.websiteIndex].credibility }}%
      </div>
      
      <div class="w-full h-full bg-white border border-black p-2 text-center">{{ webScraperList[result.websiteIndex].updateFrequency }}</div>
      
      <div class="w-full h-full bg-white border border-black p-2 text-center">{{ result.reference }}</div>
    
    </div>
  
  </div>
</template>