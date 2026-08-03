export interface ValueTracker {
  id?: number
  url: string
  provider: string
  credibility: number
  updateFrequency: '' | 'always' |'minute' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  valueId: string
}