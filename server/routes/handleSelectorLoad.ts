import type { IncomingMessage } from 'node:http'
import { getBrowser } from "../utils/getBrowser.ts"
import type { Page } from 'playwright'
import { readFileSync } from "node:fs"

const pickerScript = readFileSync(
  "server/utils/selectorPickerInjection.js",
  "utf8"
)

async function waitForStableDOM(page: Page) {
  await Promise.race([
    page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let timer: number

        const observer = new MutationObserver(() => {
          clearTimeout(timer)

          timer = window.setTimeout(() => {
            observer.disconnect()
            resolve()
          }, 2000)
        })

        observer.observe(document.body, {
          subtree: true,
          childList: true,
          attributes: true
        })

        timer = window.setTimeout(() => {
          observer.disconnect()
          resolve()
        }, 2000)
      })
    }),

    new Promise(resolve => setTimeout(resolve, 10000))
  ])
}

export async function handleSelectorLoad(req: IncomingMessage, res: any, url: URL) {
  if(url.pathname !== "/api/selector/load" || req.method !== "GET") {
    return false
  }
  
  const target = url.searchParams.get("url")
  
  if (!target) {
    res.writeHead(400)
    res.end(JSON.stringify({
      message: "Missing url or provider"
    }))
    console.log("GET loadselector: No URL")
    return true
  }

  const browser = await getBrowser()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.goto(target, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    })
  
  } catch (err) {
    
    res.writeHead(404)
    res.end(JSON.stringify({
      message: "Could not load site"
    }))
    
    console.log(`GET loadselector: failed to load ${target}`)
    return true
  }

  await waitForStableDOM(page)

  const html = await page.content()

  const finalHTML = html
    .replace("<head>", `<head><base href="${target}">`)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace("</body>", 
      `
        <script>
          ${pickerScript}
        </script>
      </body>`
    )

  await page.close()
  await context.close()

  res.setHeader(
    "Content-Type",
    "text/html; charset=utf-8"
  )

  res.end(finalHTML)

  console.log("GET selector/load successful")
  return true
}