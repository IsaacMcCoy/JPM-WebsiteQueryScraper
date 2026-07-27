import type { IncomingMessage } from 'node:http'
import { getDatabase, saveDatabase } from '../utils/apiGetDatabase.ts'
import { getBody } from '../utils/getBody.ts'

export async function handleWebScrapers(req: IncomingMessage, res: any, url: URL) {
  if(url.pathname !== "/api/webscrapers") {
    return false
  }

  //GET
  if (req.method === "GET") {
    const database = await getDatabase()
    
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(
      database.webScrapers
    ))

    console.log("GET webscrapers successful")
    return true
  }

  //POST
  if (req.method === "POST") {

    let body = await getBody(req)

    try {
      const newWebScraper = JSON.parse(body)
      const database = await getDatabase()

      database.webScrapers.push({
        id: Date.now(),
        ...newWebScraper
      })

      await saveDatabase(database)

      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({
        message: "Web scraper added"
      }))

    } catch {
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Invalid JSON"
      }))
      return true
    }

    console.log("POST webscrapers successful")
    return true
  }

  //PATCH
  if (req.method === "PATCH") {

    const target = url.searchParams.get("id")

    if(!target) {
      console.log("PATCH webScrapers: target undefined or null")
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Missing parameter: target"
      }))
      return true
    }

    const id = Number(target)

    if(Number.isNaN(id)) {
      console.log("PATCH webScrapers: target is not a number")
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Invalid parameter: target"
      }))
      return true
    }

    let body = await getBody(req)

    const database = await getDatabase()
    const scraper = database.webScrapers.find(s => s.id === id)

    if (!scraper) {
      res.writeHead(404)
      res.end(JSON.stringify({
        message: "Scraper not found"
      }))
      return true
    }

    try {
      const updates = JSON.parse(body)
      delete updates.id

      Object.assign(scraper, updates);
    
      await saveDatabase(database)

      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({
        message: "Web scraper edits saved"
      }))

    } catch {
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Invalid JSON"
      }))
      return true
    }

    console.log("PATCH webscrapers successful")
    return true
  }

  //DELETE
  if(req.method === "DELETE") {
    
    const target = url.searchParams.get("id")

    if(!target) {
      console.log("DELETE webScrapers: target undefined or null")
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Missing parameter: target"
      }))
      return true
    }

    const id = Number(target)

    if(Number.isNaN(id)) {
      console.log("DELETE webScrapers: target is not a number")
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Invalid parameter: target"
      }))
      return true
    }

    const database = await getDatabase()
    console.log("Deleting id:", id)

    const originalLength = database.webScrapers.length
    const updatedScrapers = database.webScrapers.filter(
      scraper => scraper.id !== id
    )

    if (updatedScrapers.length === originalLength) {
      console.log(`DELETE webScrapers: no scraper found with id: ${id}`)
      res.writeHead(404)
      res.end(JSON.stringify({
        message: "Scraper not found"
      }))
      return true
    }

    database.webScrapers = updatedScrapers
    await saveDatabase(database)

    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({
      message: "WebScraper deleted"
    }))

    console.log("DELETE webScrapers successful")
    return true
  }
}