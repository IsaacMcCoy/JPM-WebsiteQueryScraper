import { ref } from 'vue'

type Views = 'table' | 'editScrapers' | 'tracker' | 'editTrackers'

export const currentView = ref<Views>('table')