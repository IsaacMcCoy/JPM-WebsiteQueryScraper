import type { IncomingMessage } from 'node:http'
import { htmlProvider } from '../providers/htmlScraper.ts'
import { playwrightProvider } from '../providers/playwrightScraper.ts'
import * as cheerio from "cheerio"

export async function handleTracking(req: IncomingMessage, res: any, url: URL) {
  if(url.pathname !== "/api/tracking" || req.method !== "GET") {
    return false
  }
  
  const target = url.searchParams.get("url")
  const provider = url.searchParams.get("provider")
  const valueId = url.searchParams.get("value-id")
  
  if (!target || !provider|| !valueId) {
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
    html = await playwrightProvider(target, valueId)

  } else {

    res.writeHead(400)
    res.end(JSON.stringify({
      message: "Unknown provider"
    }))

    return true
  }

  const $ = cheerio.load(html)

  const result = $(valueId)
    .first()
    .text()

  res.setHeader(
    "Content-Type",
    "application/json"
  )

  res.end(JSON.stringify(result))

  if (result) {
    console.log("GET tracking successful")
  } else{
    console.log("GET tracking successful, No Results Found")
  }
    return true
}