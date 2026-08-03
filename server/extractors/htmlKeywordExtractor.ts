import * as cheerio from "cheerio"
import { extractSnippet } from "../utils/extractSnipet.ts"

export function htmlKeywordExtractor(html: string, keyword: string) {

  const $ = cheerio.load(html)
  
  const results: { type: string; text: string}[] = []

  $("body *").each((_, tag) => {
    const $tag = $(tag)

    if (["script", "style", "noscript", "template"].includes(tag.tagName)) {
      return
    }

    const text = $tag
      .text()
      .replace(/\s+/g, " ")
      .trim()

    if(!text.toLowerCase().includes(keyword.toLowerCase())) {
      return
    }

    const childMatches = $tag
      .children()
      .toArray()
      .some(child =>
        $(child)
          .text()
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )

    if (childMatches) {
      return
    }
  
    let index = text.toLowerCase().indexOf(keyword.toLowerCase())

    while (index !== -1) {
      results.push({
        type: tag.tagName,
        text:
          text.length <= 100
            ? text
            : extractSnippet(text, index, keyword.length, 50)
      })
      
      index = text.toLowerCase().indexOf(keyword.toLowerCase(), index + keyword.length)
    }
  })

  return results
}