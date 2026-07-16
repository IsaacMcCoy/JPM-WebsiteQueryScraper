import { createServer } from 'node:http'
import { getDatabase, saveDatabase } from './utils/apiGetDatabase.ts'

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if(req.method === "OPTIONS") {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url ?? "", `http://${req.headers.host}`)

  if (url.pathname === "/api/webscrapers" && req.method === "POST") {

    let body = ""

    req.on("data", chunk => {
      body += chunk
    })

    req.on("end", async () => {

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
    })
  
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