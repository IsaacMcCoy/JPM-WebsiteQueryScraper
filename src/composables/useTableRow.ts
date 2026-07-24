import { ref } from 'vue'

const selected = ref<number[]>([])

function isSelected(index: number) {
  return selected.value.includes(index)
}

function toggleSelected(index: number) {
  if(isSelected(index)) {
    selected.value = selected.value.filter(item => item !== index)
  } else {
    selected.value.push(index)
  }
}

export function useTableRow() {
  return {
    selected,
    isSelected,
    toggleSelected
  }
}