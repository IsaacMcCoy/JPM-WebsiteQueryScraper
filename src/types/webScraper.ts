export interface WebScraper {
  id?: number
  url: string
  credibility: number
  updateFrequency: '' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  keyword: string
}