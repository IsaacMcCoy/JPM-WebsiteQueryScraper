import { ref } from 'vue'

export type AlertType = "error" | "info" | "success"

interface Alert {
  id: number
  type: AlertType
  message: string
  timeout?: ReturnType<typeof setTimeout>
}

const alerts = ref<Alert[]>([])

function addAlert(type: AlertType, message: string) {
  const id = Date.now()

  const timeout = setTimeout(() => {
    removeAlert(id)
  }, 4000)

  alerts.value.push({
    id, type, message, timeout
  })
}

function removeAlert(id: number) {
  const alert = alerts.value.find(
    alert => alert.id === id
  )

  if (alert?.timeout) {
    clearTimeout(alert.timeout)
  }

  alerts.value = alerts.value.filter(
    alert => alert.id !== id
  )
}

export function useAlerts() {
  return {
    alerts,
    addAlert,
    removeAlert
  }
}