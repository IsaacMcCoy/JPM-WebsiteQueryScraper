//API helper functions which get and save the database

import { readFile, writeFile } from "node:fs/promises"

const databasePath = "./server/database.json"

export async function getDatabase() {
  const file = await readFile(databasePath, "utf8")
  return JSON.parse(file)
}

export async function saveDatabase(database: any) {
  await writeFile(
    databasePath,
    JSON.stringify(database, null, 2)
  )
}
