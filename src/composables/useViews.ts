import { ref } from 'vue'

type Views = 'table' | 'edit'

export const currentView = ref<Views>('table')