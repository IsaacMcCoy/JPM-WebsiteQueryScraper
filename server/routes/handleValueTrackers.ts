import type { IncomingMessage } from 'node:http'
import { getDatabase, saveDatabase } from '../utils/apiGetDatabase.ts'
import { getBody } from '../utils/getBody.ts'

export async function handleValueTrackers(req: IncomingMessage, res: any, url: URL) {
  if(url.pathname !== "/api/valuetrackers") {
    return false
  }

  //GET
  if (req.method === "GET") {
    const database = await getDatabase()
    
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(
      database.valueTrackers
    ))

    console.log("GET valuetrackers successful")
    return true
  }

  //POST
    if (req.method === "POST") {
  
      let body = await getBody(req)
  
      try {
        const newValueTracker = JSON.parse(body)
        const database = await getDatabase()
  
        database.valueTrackers.push({
          id: Date.now(),
          ...newValueTracker
        })
  
        await saveDatabase(database)
  
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({
          message: "Value tracker added"
        }))
  
      } catch {
        res.writeHead(400)
        res.end(JSON.stringify({
          message: "Invalid JSON"
        }))
        return true
      }
  
      console.log("POST valuetrackers successful")
      return true
    }
}