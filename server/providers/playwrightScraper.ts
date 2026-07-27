import { chromium } from "playwright"
import type { Browser } from "playwright"

let browser: Browser | null = null


async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: false
    })
  }
  return browser
}

export async function playwrightProvider(url: string) {

  const browser = await getBrowser()
  const page = await browser.newPage()

  await page.route("**/*", route => {
    const type = route.request().resourceType()

    if (["image", "font", "media", "stylesheet"].includes(type)) {
      route.abort()
    } else {
      route.continue()
    }
  })

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000
  })

  const html = await page.content()

  await page.close()

  return html
}