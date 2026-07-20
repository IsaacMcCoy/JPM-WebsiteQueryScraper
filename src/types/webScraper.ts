export interface WebScraper {
  id?: string | number //number if Date.new(), string if the user updates it
  url: string
  credibility: number
  updateFrequency: '' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  keyword: string
}