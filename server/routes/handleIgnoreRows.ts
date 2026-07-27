import type { IncomingMessage } from 'node:http'
import { getDatabase, saveDatabase } from '../utils/apiGetDatabase.ts'
import { getBody } from '../utils/getBody.ts'

export async function handleIgnoreRows(req: IncomingMessage, res: any, url: URL) {
  if(url.pathname !== "/api/ignorerows") {
    return false
  }

  //GET
  if (req.method === "GET") {
    const database = await getDatabase()
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(
      database.ignoreRows
    ))
    console.log("GET ignoreRows successful")
    return true
  }

  //POST
  if (req.method === "POST") {
    const body = await getBody(req)

    try {
      const newIgnoreRow = JSON.parse(body)
      const database = await getDatabase()

      database.ignoreRows.push({
        id: Date.now(),
        ...newIgnoreRow
      })

      await saveDatabase(database)

      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({
        message: "Ignore row added"
      }))
    
    } catch {
      res.writeHead(400)
      res.end(JSON.stringify({
        message: "Invalid JSON"
      }))
      return true
    }
    console.log("POST ignorerRow successful")
    return true
  }
}