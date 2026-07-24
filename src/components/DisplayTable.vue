<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWebScraper } from '../composables/useWebScraper'
import { useTableRow } from '../composables/useTableRow'

const { ready, webScraperList, searchWebsiteHTML } = useWebScraper()
const { isSelected, toggleSelected } = useTableRow()

interface SearchResult {
  websiteIndex: number
  reference: string
}

const data = ref<SearchResult[]>([])

onMounted(async () => {
  await ready
  for(let i = 0; i < webScraperList.value.length; i++) {
    const results = (await searchWebsiteHTML(i, webScraperList.value[i].keyword))
    for (const reference of results) {
      data.value.push({
        websiteIndex: i,
        reference
      })
    }
  }
})

function colorKeyword(text: string, keyword: string) {
  if (!keyword) return [{ text, match: false }]
  const parts = []
  const lower = text.toLowerCase()
  const kwLower = keyword.toLowerCase()
  let i = 0
  let idx = lower.indexOf(kwLower)
  while (idx !== -1) {
    if (idx > i) parts.push({ text: text.slice(i, idx), match: false })
    parts.push({ text: text.slice(idx, idx + keyword.length), match: true })
    i = idx + keyword.length
    idx = lower.indexOf(kwLower, i)
  }
  if (i < text.length) parts.push({ text: text.slice(i), match: false })
  return parts
}
</script>

<template>
  <div class="p-1 bg-white rounded-md m-10"> <!--temporary DIV just for seperating blue highlight from blue background-->
  <div class="grid grid-cols-[auto_auto_auto_auto_auto] place-items-center"> <!--Order is index, site, cred, update, usage-->
    
    <div class="w-full h-full bg-white border border-black p-2 text-center">Index</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Site</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Credibility</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Update Frequency</div>
    <div class="w-full h-full bg-white border border-black p-2 text-center">Usage</div>
    
    <div class="contents" v-for="(result, index) in data" :key="index">
      
      <div
        class="w-full h-full border border-black p-2 text-center"
        :class="isSelected(index)
          ? 'bg-blue-100'
          : 'bg-white'"
          @click="toggleSelected(index)"
      >
        {{ index + 1 }}
      </div>
      
      <a
        :href="webScraperList[result.websiteIndex].url" target="_blank"
        class="w-full h-full border border-black p-2 text-center underline hover:text-blue-400 hover:cursor-pointer"
        :class="isSelected(index)
          ? 'bg-blue-100'
          : 'bg-white'"
        @click="toggleSelected(index)"
      >
        {{ webScraperList[result.websiteIndex].url }}
      </a>

      <div
        class="w-full h-full border border-black p-2 text-center"
        :class="[
          webScraperList[result.websiteIndex].credibility >= 90
            ? 'text-green-600'
            : webScraperList[result.websiteIndex].credibility >= 75
              ? 'text-yellow-600'
              : 'text-red-600',
          isSelected(index)
            ? 'bg-blue-100'
            : 'bg-white'
        ]"
        @click="toggleSelected(index)"
      >
        {{ webScraperList[result.websiteIndex].credibility }}%
      </div>
      
      <div
        class="w-full h-full border border-black p-2 text-center"
        :class="isSelected(index)
          ? 'bg-blue-100'
          : 'bg-white'"
        @click="toggleSelected(index)"
        >
          {{ webScraperList[result.websiteIndex].updateFrequency }}</div>
      
      <div
        class="w-full h-full border border-black p-2 text-center"
        :class="isSelected(index)
          ? 'bg-blue-100'
          : 'bg-white'"
        @click="toggleSelected(index)"
        >
        <span
          v-for="(part, i) in colorKeyword(result.reference, webScraperList[result.websiteIndex].keyword)"
          :key="i"
          :class="part.match
            ? 'text-green-600 font-semibold'
            : ''
          "
        >
          {{ part.text }}
        </span>
      </div>
    
    </div>
  
  </div>
  </div>
</template>