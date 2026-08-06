export interface ValueTracker {
  id?: number
  url: string
  provider: string
  credibility: number
  updateFrequency: '' | 'every second' | 'every minute' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  valueId: string
  name: string
  message?: string
  timeout?: ReturnType<typeof setTimeout>
  lastKnownValue?: string
}