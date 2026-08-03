import type { IncomingMessage } from 'node:http'
import { getDatabase } from '../utils/apiGetDatabase.ts'

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
}