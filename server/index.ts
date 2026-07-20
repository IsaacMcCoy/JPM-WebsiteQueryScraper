import { createServer } from 'node:http'
import { getDatabase, saveDatabase } from './utils/apiGetDatabase.ts'

const server = createServer(async (req, res) => {
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
      console.log("Get extraction: error triggered")
      res.writeHead(500)
      res.end(String(err))
    }
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