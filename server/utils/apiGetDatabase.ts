//API helper functions which get and save the database

import { readFile, writeFile } from "node:fs/promises"
import type { WebScraper } from '../../src/types/WebScraper.ts'
import type { IgnoreRow } from "../../src/types/IgnoreRow.ts"
import type { ValueTracker } from "../../src/types/valueTracker.ts"

interface Database {
  webScrapers: WebScraper[]
  ignoreRows: IgnoreRow[]
  valueTrackers: ValueTracker[]
}

const databasePath = "./server/database.json"

export async function getDatabase(): Promise<Database> {
  const file = await readFile(databasePath, "utf8")
  return JSON.parse(file)
}

export async function saveDatabase(database: Database) {
  await writeFile(
    databasePath,
    JSON.stringify(database, null, 2)
  )
}
