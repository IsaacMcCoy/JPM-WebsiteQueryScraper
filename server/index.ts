import { createServer } from 'node:http'

import { handleWebScrapers } from './routes/handleWebScrapers.ts'
import { handleIgnoreRows } from './routes/handleIgnoreRows.ts'
import { handleExtractions } from './routes/handleExtraction.ts'

const server = createServer(async (req, res) => {

  //headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if(req.method === "OPTIONS") {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(
    req.url ?? "",
    `http://${req.headers.host}`
  )

  if(await handleWebScrapers(req, res, url)) {
    return
  }

  if(await handleIgnoreRows(req, res, url)) {
    return
  }

  if(await handleExtractions(req, res, url)) {
    return
  }

  //anything that did not match route
  res.statusCode = 404
  res.end(JSON.stringify({
    message: "Service Not Found"
  }))
  
  console.log(`API Failed 404: ${url} Not Found`)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})