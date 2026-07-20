//verify WebScraper data works and activate the scrapers

//get content via the URL
export async function getWebsiteContent(url: string): Promise<string> {
  const responce = await fetch(
    `/api/extraction?url=${encodeURIComponent(url)}`,
    {
      method: "GET"
    }
  )

  if(!responce.ok) {
    throw new Error('extrcation request failed: ${response.status}')
  }

  return await responce.text()
}

// Schema function for loading a URL (how to use)
//
// async function loadSchema() {
//   await ready
//   console.log("go running")
//   if (webScraperList.value.length === 0) {
//     console.log("no scrapers in database yet") //this is a very worthwhile check
//     return
//   }
//   const testing = await getWebsiteContent(webScraperList.value[0].url)
//   console.log(testing)
// }
// go()