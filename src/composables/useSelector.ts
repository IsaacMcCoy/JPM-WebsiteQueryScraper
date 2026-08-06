import { getSelectorWebpage } from "../services/SelectorServices"

export async function loadSelectorWebpage(url: string) {
  const data = await getSelectorWebpage(url)

  return data
}