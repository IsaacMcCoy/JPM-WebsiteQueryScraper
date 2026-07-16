export interface WebScraper {
  url: string
  credibility: number | null
  updateFrequency: '' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  keyword: string
}