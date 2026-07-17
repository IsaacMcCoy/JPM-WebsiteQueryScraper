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

  //GET: collect all webScraperdata
  if (url.pathname === "/api/webscrapers" && req.method === "GET") {
    const database = await getDatabase()

    res.end(JSON.stringify(
      database.webScrapers
    ))
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

    res.end(JSON.stringify({
      message: "Web scraper added"
    }))
    return
  }

  //anything that did not match route
  res.statusCode = 404
  res.end(JSON.stringify({
    message: "Not Found"
  }))
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})