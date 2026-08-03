import { ref } from 'vue'

type Views = 'table' | 'edit' | 'tracker'

export const currentView = ref<Views>('table')