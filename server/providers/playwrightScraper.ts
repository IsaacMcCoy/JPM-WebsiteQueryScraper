import { getBrowser } from "../utils/getBrowser.ts"

export async function playwrightProvider(url: string, locator?: string): Promise<string> {

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
    
    if(locator) {
      await page
        .locator(locator)
        .waitFor({
          state: "attached",
          timeout: 10000
        })
    }

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