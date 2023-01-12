import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = () => {
  const robotText = `
    User-agent: Googlebot
    Disallow: /nogooglebot/

    User-agent: *
    Allow: /

    # Block PetalBot
    User-agent: PetalBot
    Disallow: /
    `
  // return the text content, a status 200 success response, and set the content type to text/plain
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
