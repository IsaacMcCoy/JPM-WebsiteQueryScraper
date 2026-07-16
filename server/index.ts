import { createServer } from 'node:http'

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

  if (url.pathname === "/api/test" && req.method === "GET") {
    res.write(
      JSON.stringify({
        message: "API running and working"
      })
    )

    res.end()
    return
  }

  res.statusCode = 404
  res.write(
    JSON.stringify({
      message: "Not Found"
    })
  )

  res.end()
})

server.listen(3000, () => {
  console.log("API running on port 3000")
})