import { createServer } from 'node:http'
import { getDatabase, saveDatabase } from './utils/apiGetDatabase.ts'

const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if(req.method === "OPTIONS") {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url ?? "", `http://${req.headers.host}`)

  //GET: extract html from website
  if(url.pathname === "/api/extraction" && req.method === "GET") {
    
    const target = url.searchParams.get("url")

    //verify URL exists
    if(!target || target === "undefined") {
      console.log("GET extraction: target undefined or null")
      res.writeHead(400)
      res.end("Missing urlParameter")
      return
    }

    try {
      const response = await fetch(target)
      if(!response.ok) {
        console.log("GET extraction: !response.ok")
        res.writeHead(response.status)
        res.end(`Failed to fetch: ${response.statusText}`)
        return
      }

      const htmlContent = await response.text()

      res.setHeader("Content-Type", "text/html")
      res.statusCode = 200
      res.end(htmlContent)
      
      console.log("GET extraction successful")

    } catch (err) {
      console.log("GET extraction: failed to load HTML")
      res.writeHead(404)
      res.end(String(err))
    }
    return
  }

  //Delete full webScraper from Database
  if(url.pathname === "/api/webscrapers" && req.method === "DELETE") {
    
    const target = url.searchParams.get("id")

    if(!target) {
      console.log("DELETE webScrapers: target undefined or null")
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Missing parameter: target"
      }))
      return
    }

    const id = Number(target)

    if(Number.isNaN(id)) {
      console.log("DELETE webScrapers: target is not a number")
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Invalid parameter: target"
      }))
      return
    }

    const database = await getDatabase()
    console.log(database.webScrapers)
    console.log("Deleting id:", id, typeof id)

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
      return
    }

    database.webScrapers = updatedScrapers
    await saveDatabase(database)

    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({
      message: "WebScraper deleted"
    }))

    console.log("DELETE webScrapers successful")
    return
  }

  //GET: collect all webScraperdata
  if (url.pathname === "/api/webscrapers" && req.method === "GET") {
    const database = await getDatabase()
    
    res.setHeader("Content-Type", "application/json")
    
    res.end(JSON.stringify(
      database.webScrapers
    ))

    console.log("GET webscrapers successful")
    return
  }

  //POST: save a new webScraper
  if (url.pathname === "/api/webscrapers" && req.method === "POST") {

    let body = ""

    for await (const chunk of req) {
      body += chunk
    }

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
      res.end("Invalid JSON")
      return
    }

    console.log("POST webscrapers successful")
    return
  }

  //anything that did not match route
  res.statusCode = 404
  res.end(JSON.stringify({
    message: "Not Found"
  }))
  
  console.log("API failed 404")
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})