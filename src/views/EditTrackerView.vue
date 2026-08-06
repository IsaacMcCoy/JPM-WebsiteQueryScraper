<script setup lang="ts">
import AddTrackerForm from '../components/AddTrackerForm.vue'
import { currentView } from '../composables/useViews'
import { ref, onMounted, onUnmounted } from 'vue'
import { loadSelectorWebpage } from '../composables/useSelector.ts'

type EditOptions = 'add' | 'edit' | 'delete' | null
const editChoice = ref<EditOptions>(null)

// Variables and code for the "Add Tracker" form, primarilly for the selector
const showSelector = ref(false)
const selectorPage = ref<string | null>(null)
const selected = ref<string>("")
const opened = ref<boolean>(false)

async function openSelector(url: string) {
  opened.value = true
  selectorPage.value = await loadSelectorWebpage(url)
  showSelector.value = true
  selected.value = ""
}

function closeSelector() {
  opened.value = false
  selectorPage.value = null
  showSelector.value = false
  selected.value = ""
}

function applySelector() {
  opened.value = false
  selectorPage.value = null
  showSelector.value = false
}

function handleSelectorMessage(event: MessageEvent) {
  if (event.data?.type === "unselected") {
    selected.value = ""
  }
  if (event.data?.type === "selected") {
    selected.value = event.data.locator

    if (!selected.value.trim()) {
      alert("Could not clearly identify element to track.")
    }

  }
}

onMounted(() => {
  window.addEventListener(
    "message",
    handleSelectorMessage
  )
})

onUnmounted(() => {
  window.removeEventListener(
    "message",
    handleSelectorMessage
  )
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center relative">
    
    <!--Options-->
    <div v-if="editChoice===null" class="min-w-[300px] rounded-lg border border-gray-200">
      <div class="p-4  flex flex-col gap-3 bg-white rounded-t-lg">
        <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='add'">Add Value Tracker</button>
        <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='edit'">Edit Value Tracker</button>
        <button class="bg-gray-200 text-black border border-gray-300 rounded-lg px-3 py-2" @click="editChoice='delete'">Delete Value Tracker</button>
      </div>

      <div class="flex-1 bg-gray-100 text-gray-500 p-4 text-center rounded-b-lg">
        <a class="hover:underline cursor-pointer" @click="currentView='table'">Return</a>
      </div>
    
    </div>

    <!--Actual forms-->
    <div v-else class="min-w-[375px] min-h-[100px] rounded-lg border border-gray-200 p-0 fixed">

      <AddTrackerForm
        v-if="editChoice==='add'"
        @revealSelector="openSelector($event)"
        :selected="selected"
        :opened="opened"
      />

      <div class="flex-1 bg-gray-100 text-gray-500 p-4 text-center rounded-b-lg">
        <a class="hover:underline cursor-pointer" @click="editChoice=null">Return</a>
      </div>
    
    </div>

    
    <div
      class="relative w-[65vw] h-[65vh] bg-white rounded-lg shadow-xl z-20"
      v-if="showSelector && selectorPage"
    >

      <iframe
        class="w-full h-full"
        :srcdoc="selectorPage"
      />

      <div class="absolute right-2 bottom-2 z-30 flex flex-col gap-2 text-[18px]">
        <button
          v-if="selected.trim()"
          type="button"
          @click="applySelector"
          class="rounded bg-green-200 text-green-500 border-2 border-green-300 px-4 py-1"
        >
          Track
        </button>
        <button
          type="button"
          @click="closeSelector"
          class="rounded bg-red-200 text-red-500 border-2 border-red-300 px-4 py-1"
        >
          Close
        </button>
      </div>

    </div>


  </div>
</template>