export async function getBody(req: any) {
  let body = ""
  
  for await (const chunk of req) {
    body += chunk
  }

  return body
}