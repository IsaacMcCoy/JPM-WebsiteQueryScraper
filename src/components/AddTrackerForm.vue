<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useValueTracker } from '../composables/useValueTracker.ts'

const { newValueTracker, addNewValueTracker } = useValueTracker()

const props = defineProps<{
  "selected": string
  "opened": boolean
}>()

const emit = defineEmits<{
  "revealSelector": [value: string]
}>()

const loading = ref<boolean>(false)

//frequency is based off of WebScraper.updateFrequency scr/types/valueTracker.ts
const frequency = ['every second', 'every minute', 'hourly', 'daily', 'weekly', 'monthly', 'yearly']

const completeForm = computed(() => 
  newValueTracker.value.url.trim() !== '' &&
  typeof newValueTracker.value.credibility === 'number' &&
  newValueTracker.value.credibility <= 100 &&
  newValueTracker.value.credibility >= 0 &&
  newValueTracker.value.updateFrequency !== '' &&
  newValueTracker.value.valueId.trim() !== '' &&
  newValueTracker.value.name.trim() !== ''
)

function openSelector() {
  emit('revealSelector', newValueTracker.value.url)
}

function submitParameters() {
  if(completeForm.value) {
    addNewValueTracker(newValueTracker.value)
  }
}

watch(
  () => props.selected,
  (newValue) => {
    newValueTracker.value.valueId = newValue
  }
)

watch(
  () => props.opened,
  (newValue) => {
    loading.value = newValue
  }
)
</script>

<template>
  <form @submit.prevent="submitParameters()" class="rounded-t-md flex flex-col p-6 bg-white gap-2">

    <label class="text-[18px] text-black">Website URL</label>
    <input
      v-model="newValueTracker.url"
      class="rounded-md placeholder:text-gray-400"
      placeholder="https://bogus-data.com"
    />

    <button
      v-if="newValueTracker.url.replace(/\s+/g, '') !== ''"
      type="button"
      @click="openSelector"
      :disabled="loading"
      class="my-2 text-center text-[18px] underline"
      :class="[loading ? 'text-blue-400 cursor-progress' : 'text-black hover:text-blue-400 hover:cursor-pointer']"
    >
      Select Value To Track
    </button>

    <label class="text-[18px] text-black">Website Credibility</label>
    <input
      type="number"
      min="0"
      max="100"
      v-model="newValueTracker.credibility"
      class="rounded-md placeholder:text-gray-400"
      placeholder="100"
    />

    <label class="text-[18px]">Update Frequency</label>
    <select
      v-model="newValueTracker.updateFrequency"
      :class="[
        'rounded-md',
        newValueTracker.updateFrequency === '' 
          ? 'text-gray-400'
          : 'text-black'
      ]"
    >
      <option disabled value="">Select</option>
      <option v-for="option in frequency" :key="option" :value="option" class="text-black">{{ option }}</option>
    </select>

    <label class="text-[18px] text-black">Tracker Name</label>
    <input
      v-model="newValueTracker.name"
      class="rounded-md placeholder:text-gray-400"
      placeholder="Bogus Data"
    />

    <label class="text-[18px] text-black">Optional: Notes</label>
    <input
      v-model="newValueTracker.message"
      class="rounded-md placeholder:text-gray-400"
      placeholder="Bogus Notes"
    />

    <button 
      type="submit"
      :class="[
        'm-1 mt-2 p-1 rounded-md border border-2',
        completeForm
          ? 'bg-green-200 text-green-500 border-green-300'
          : 'bg-red-200 text-red-500 border-red-300'
      ]"
    >
      Add Value Tracker
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