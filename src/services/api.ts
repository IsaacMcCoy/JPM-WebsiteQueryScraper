export async function testAPI() {
  const response = await fetch(
    "/api/test"
  )


  return response.json()
}