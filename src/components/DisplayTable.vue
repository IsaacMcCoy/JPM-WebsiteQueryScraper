<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWebScraper } from '../composables/useWebScraper'

const { webScraperList, searchWebsiteHTML } = useWebScraper()

const data = ref<string[]>([])

const search = 0

onMounted(async () => {
  data.value = await searchWebsiteHTML(search, "cain", 20)
})

</script>

<template>
  <div class="grid grid-cols-[auto_auto_auto_auto_auto] place-items-center"> <!--Order is index, site, cred, update, usage-->
    
    <div class="w-full h-full bg-white border border-black p-2 text-center">Index</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Site</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Credibility</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Update Frequency</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Usage</div>
    
    <div class="contents" v-for="(reference, index) in data" :key="index">
      <div
        class="w-full h-full bg-white border border-black p-2 text-center"
      >{{ index + 1 }}</div>
      <a
        :href="webScraperList[search].url" target="_blank"
        class="w-full h-full bg-white border border-black p-2 text-center underline hover:text-blue-400 hover:cursor-pointer"
      >
        {{ webScraperList[search].url }}
      </a>
      <div
        class="w-full h-full bg-white border border-black p-2 text-center"
        :class="
          webScraperList[search].credibility >= 90
            ? 'text-green-600'
            : webScraperList[search].credibility >= 75
            ? 'text-yellow-600'
            : 'text-red-600'
        ">{{ webScraperList[search].credibility }}%</div>
      <div class="w-full h-full bg-white border border-black p-2 text-center">{{ webScraperList[search].updateFrequency }}</div>
      <div class="w-full h-full bg-white border border-black p-2 text-center">{{ reference }}</div>
    </div>
  
  </div>
</template>