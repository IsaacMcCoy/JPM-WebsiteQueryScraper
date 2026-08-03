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

export async function playwrightProvider(url: string): Promise<string> {

  const browser = await getBrowser()
  const page = await browser.newPage()

  await page.route("**/*", route => {
    const type = route.request().resourceType()

    if (["image", "font", "media"].includes(type)) {
      route.abort()
    } else {
      route.continue()
    }
  })

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    })
  } catch (err) {
    console.error(err)
    await page.close()
    return ""
  }

  try {
    
    // Required code for awaiting the page to load the gold prices 
    // await page
    //   .locator("#goldchange .tick-value.price-value .gpoticker-price")
    //   .filter({ hasText: /\d/ })
    //   .waitFor()

    // Optional code for displaying the number of things found
    // const count = await page
    //   .locator("#goldchange .tick-value.price-value .gpoticker-price")
    //   .count()
    // console.log("Found:", count)

    // Optional code for displaying price in the console for verification
    // let price = await page
    //   .locator("#goldchange tick-value.price-value .gpoticker-price")
    //   .first()
    //   .textContent()
    // console.log(price)

    const html = await page.content()

    await page.close()
    if (html) {
      return html
    } else {
      console.log("Playwright Extraction: No HTML")
      return ""
    }

  } catch (err) {
    console.log(err)
    await page.close()
    return ""
  }
}