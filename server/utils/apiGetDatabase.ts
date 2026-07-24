//API helper functions which get and save the database

import { readFile, writeFile } from "node:fs/promises"
import type { WebScraper } from '../../src/types/webScraper.ts'
import type { IgnoreRow } from "../../src/types/ignoreRow.ts"

interface Database {
  webScrapers: WebScraper[]
  ignoreRows: IgnoreRow[]
}

const databasePath = "./server/database.json"

export async function getDatabase(): Promise<Database> {
  const file = await readFile(databasePath, "utf8")
  return JSON.parse(file)
}

export async function saveDatabase(database: any) {
  await writeFile(
    databasePath,
    JSON.stringify(database, null, 2)
  )
}
