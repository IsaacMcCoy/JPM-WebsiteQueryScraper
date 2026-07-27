import type { IncomingMessage } from 'node:http'
import { htmlProvider } from '../providers/htmlScraper.ts'
import { playwrightProvider } from '../providers/playwrightScraper.ts'
import { htmlKeywordExtractor } from '../extractors/htmlKeywordExtractor.ts'

export async function handleExtractions(req: IncomingMessage, res: any, url: URL) {
  if(url.pathname !== "/api/extraction" || req.method !== "GET") {
    return false
  }
  
  const target = url.searchParams.get("url")
  const provider = url.searchParams.get("provider")
  const keyword = url.searchParams.get("keyword")
  
  if (!target || !provider|| !keyword) {
    res.writeHead(400)
    res.end(JSON.stringify({
      message: "Missing url or provider"
    }))
    return true
  }

  let html: string

  if (provider === "html") {
    html = await htmlProvider(target)

  } else if (provider === "playwright") {
    html = await playwrightProvider(target)

  } else {

    res.writeHead(400)
    res.end(JSON.stringify({
      message: "Unknown provider"
    }))

    return true
  }
  
  const result = htmlKeywordExtractor(html, keyword) //remember that this should only extract for HTML later (I think)

  res.setHeader(
    "Content-Type",
    "application/json"
  )

  res.end(JSON.stringify(result))

  console.log("GET exctraction successful")
  return true
}