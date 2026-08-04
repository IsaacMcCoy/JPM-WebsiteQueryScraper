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

  try {
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
  } catch (err) {
    
    res.writeHead(500)
    res.end(JSON.stringify({
      message: "Provider failed"
    }))

    console.log("GET extractions: Provider Failed")
    return true
  }
  
  if (!html) {
    res.writeHead(502)
    res.end(JSON.stringify({
      message: "Failed to load page"
    }))

    console.log(`Failed loading ${target}`)
    return true
  }
  
  const result = htmlKeywordExtractor(html, keyword)

  res.setHeader(
    "Content-Type",
    "application/json"
  )

  res.end(JSON.stringify(result))

  if (result[0]) {
    console.log("GET exctraction successful")
  } else{
    console.log("GET exctraction successful, No Results Found")
  }
    return true
}