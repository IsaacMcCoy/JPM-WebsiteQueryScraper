import * as cheerio from "cheerio"

export function htmlValueExtractor(html: string, selector: string) {
  const $ = cheerio.load(html)

  return $(selector)
    .text()
    .trim()
}