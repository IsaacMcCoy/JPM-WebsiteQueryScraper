import { chromium } from "playwright"
import type { Browser } from "playwright"

let browser: Browser | null = null

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true
    })
  }
  return browser
}